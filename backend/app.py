from __future__ import annotations

from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS

from utils.document_parser import DocumentParsingError, clean_text, extract_text
from utils.risk_analyzer import find_reason, load_reference_patterns, summarize
from utils.text_chunker import segment_clauses


ROOT_DIR = Path(__file__).resolve().parent
MODEL_DIR = ROOT_DIR / "model"
MAX_ANALYSIS_UNITS = 500

app = Flask(__name__)
CORS(app)

_model_bundle = None
_reference_patterns = None


def get_model_bundle() -> dict:
    global _model_bundle
    if _model_bundle is None:
        from utils.predictor import load_model_bundle

        _model_bundle = load_model_bundle(MODEL_DIR)
    return _model_bundle


def get_reference_patterns() -> list[dict]:
    global _reference_patterns
    if _reference_patterns is None:
        _reference_patterns = load_reference_patterns(ROOT_DIR)
    return _reference_patterns


@app.get("/health")
def health():
    model_files = ["config.json", "model.safetensors", "tokenizer_config.json"]
    return jsonify(
        {
            "app": "Saral Docs API",
            "status": "ok",
            "model_ready": all((MODEL_DIR / name).exists() for name in model_files),
        }
    )


@app.post("/process")
def process_document():
    uploaded_file = request.files.get("file")
    if uploaded_file is None or uploaded_file.filename == "":
        return jsonify({"error": "Please upload a PDF, DOCX, or TXT file."}), 400

    try:
        bundle = get_model_bundle()
        raw_text = extract_text(uploaded_file)
        text = clean_text(raw_text)
        if not text:
            return jsonify({"error": "The uploaded document does not contain readable text."}), 422

        clauses = segment_clauses(text)
        if not clauses:
            return jsonify({"error": "No meaningful clauses were found in this document."}), 422

        from utils.predictor import predict_batch
        from utils.text_chunker import chunk_clauses

        units = chunk_clauses(
            clauses,
            tokenizer=bundle["tokenizer"],
            max_length=bundle["max_length"],
            stride=bundle["stride"],
        )
        units = units[:MAX_ANALYSIS_UNITS]
        predictions = predict_batch([unit.text for unit in units], bundle)
        references = get_reference_patterns()

        results = []
        for unit, prediction in zip(units, predictions):
            reason = find_reason(unit.text, prediction["predicted_risk"], references)
            results.append(
                {
                    "clause_id": unit.clause_id,
                    "chunk_id": unit.chunk_id,
                    "was_chunked": unit.was_chunked,
                    "clause_text": unit.text,
                    **prediction,
                    **reason,
                }
            )

        summary = summarize(results)
        return jsonify(_to_frontend_response(uploaded_file.filename, summary, results))

    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 500
    except DocumentParsingError as exc:
        return jsonify({"error": str(exc)}), 422
    except Exception as exc:
        return jsonify({"error": f"Analysis failed: {exc}"}), 500


def _to_frontend_response(file_name: str, summary: dict, results: list[dict]) -> dict:
    return {
        "file_name": file_name,
        "document_type": _guess_document_type(file_name, results),
        "document_risk": summary["overall_risk"],
        "risk_score": summary["risk_score"],
        "counts": summary["counts"],
        "clauses_analyzed": summary["clauses_analyzed"],
        "legal_context": [
            {
                "id": item["clause_id"],
                "original_clause": item["clause_text"],
                "explanation": _plain_english(item),
                "risk": item["predicted_risk"],
                "risk_confidence": item["confidence"],
                "type": item.get("clause_type") or _guess_clause_type(item["clause_text"]),
                "probabilities": {
                    "low": item["low_probability"],
                    "medium": item["medium_probability"],
                    "high": item["high_probability"],
                },
            }
            for item in results
        ],
        "disclaimer": (
            "Saral Docs is an AI/ML research prototype. It simplifies and flags risk, "
            "but it is not legal advice."
        ),
    }


def _plain_english(item: dict) -> str:
    risk = item["predicted_risk"].lower()
    reason = item.get("reason", "")
    if risk == "high":
        return reason or "This clause may create a serious obligation or legal exposure."
    if risk == "medium":
        return "This clause looks important and should be read carefully before signing."
    return "This clause appears routine, but it should still be checked in context."


def _guess_document_type(file_name: str, results: list[dict]) -> str:
    text = f"{file_name} " + " ".join(item["clause_text"][:300] for item in results[:5])
    text = text.lower()
    if "rent" in text or "lease" in text or "license" in text:
        return "Rent / License Agreement"
    if "sale deed" in text or "deed" in text:
        return "Sale Deed"
    if "affidavit" in text:
        return "Affidavit"
    if "notice" in text:
        return "Legal Notice"
    if "memorandum" in text or "mou" in text:
        return "MoU"
    return "Legal Document"


def _guess_clause_type(text: str) -> str:
    value = text.lower()
    keywords = [
        ("Payment", ["rent", "fee", "payment", "deposit", "amount"]),
        ("Termination", ["terminate", "termination", "cancel", "expiry"]),
        ("Liability", ["liability", "indemnity", "damages", "penalty"]),
        ("Confidentiality", ["confidential", "privacy", "disclose"]),
        ("Dispute", ["court", "jurisdiction", "arbitration", "dispute"]),
    ]
    for label, words in keywords:
        if any(word in value for word in words):
            return label
    return "General"


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=False)
