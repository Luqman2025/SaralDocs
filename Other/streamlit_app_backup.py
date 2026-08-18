from __future__ import annotations

from pathlib import Path

import pandas as pd
import streamlit as st

from utils.document_parser import DocumentParsingError, clean_text, extract_text
from utils.predictor import ModelValidationError, load_model_bundle, predict_batch
from utils.risk_analyzer import (
    find_reason,
    load_reference_patterns,
    summarize,
    to_csv_report,
    to_json_report,
)
from utils.text_chunker import chunk_clauses, segment_clauses


ROOT_DIR = Path(__file__).resolve().parent
MODEL_DIR = ROOT_DIR / "model"
MAX_ANALYSIS_UNITS = 500


st.set_page_config(
    page_title="SaralDocs",
    page_icon="SD",
    layout="wide",
)


@st.cache_resource(show_spinner="Loading local Legal-BERT model...")
def get_model_bundle():
    return load_model_bundle(MODEL_DIR)


@st.cache_data(show_spinner=False)
def get_reference_patterns():
    return load_reference_patterns(ROOT_DIR)


def main() -> None:
    st.title("SaralDocs")
    st.subheader("Legal Document Risk Analyzer")
    st.caption(
        "This is an AI/ML research prototype and does not provide legal advice. "
        "Predictions and confidence scores should not be treated as legal conclusions."
    )

    uploaded_file = st.file_uploader(
        "Upload Document",
        type=["pdf", "docx", "txt"],
        accept_multiple_files=False,
    )

    analyze = st.button("Analyze Document", type="primary", disabled=uploaded_file is None)

    if not analyze:
        _show_model_status()
        return

    if uploaded_file is None:
        st.error("Please upload a PDF, DOCX, or TXT document.")
        return

    try:
        bundle = get_model_bundle()
        raw_text = extract_text(uploaded_file)
        text = clean_text(raw_text)
        if not text:
            st.error("The uploaded document is empty after text extraction and cleaning.")
            return

        clauses = segment_clauses(text)
        if not clauses:
            st.error("No meaningful legal clauses or paragraphs could be detected.")
            return

        units = chunk_clauses(
            clauses,
            tokenizer=bundle["tokenizer"],
            max_length=bundle["max_length"],
            stride=bundle["stride"],
        )
        if not units:
            st.error("No analyzable text chunks were produced from the document.")
            return

        if len(units) > MAX_ANALYSIS_UNITS:
            st.warning(
                f"This is a long document. The first {MAX_ANALYSIS_UNITS} clauses/chunks "
                "will be analyzed to keep the research prototype responsive."
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
        _render_report(uploaded_file.name, summary, results)

    except ModelValidationError as exc:
        st.error(str(exc))
        st.info(
            "Use prepare_model.py to package your existing trained model and tokenizer into the local model/ folder."
        )
    except DocumentParsingError as exc:
        st.error(str(exc))
    except RuntimeError as exc:
        message = str(exc)
        if "CUDA" in message.upper():
            st.error(
                "A CUDA error occurred while running inference. Restart the app or run on CPU if GPU memory is unavailable."
            )
        else:
            st.error(f"Analysis failed: {message}")
    except Exception as exc:
        st.error(f"Unexpected error: {exc}")


def _show_model_status() -> None:
    with st.expander("Local model status", expanded=False):
        required = ["config.json", "model.safetensors", "tokenizer_config.json"]
        optional = ["tokenizer.json", "vocab.txt", "special_tokens_map.json", "training_config.json"]
        for name in required + optional:
            path = MODEL_DIR / name
            st.write(f"{name}: {'found' if path.exists() else 'missing'}")


def _render_report(file_name: str, summary: dict, results: list[dict]) -> None:
    st.header("Document Summary")
    metric_cols = st.columns(4)
    metric_cols[0].metric("File name", file_name)
    metric_cols[1].metric("Clauses/chunks", summary["clauses_analyzed"])
    metric_cols[2].metric("Overall risk", summary["overall_risk"])
    metric_cols[3].metric("Risk score", f"{summary['risk_score']:.2f}")

    st.header("Risk Distribution")
    dist_cols = st.columns(3)
    dist_cols[0].metric("LOW", summary["counts"]["LOW"])
    dist_cols[1].metric("MEDIUM", summary["counts"]["MEDIUM"])
    dist_cols[2].metric("HIGH", summary["counts"]["HIGH"])

    chart_df = pd.DataFrame(
        [{"risk": label, "count": summary["counts"][label]} for label in ["LOW", "MEDIUM", "HIGH"]]
    )
    st.bar_chart(chart_df, x="risk", y="count", color="#3b82f6")

    high = [item for item in results if item["predicted_risk"] == "HIGH"]
    medium = [item for item in results if item["predicted_risk"] == "MEDIUM"]
    low = [item for item in results if item["predicted_risk"] == "LOW"]

    _render_clause_group("High-Risk Clauses", high, "high")
    _render_clause_group("Medium-Risk Clauses", medium, "medium")
    _render_clause_group("Low-Risk Clauses", low, "low")

    json_report = to_json_report(file_name, summary, results)
    csv_report = to_csv_report(results)
    download_cols = st.columns(2)
    download_cols[0].download_button(
        "Download JSON",
        data=json_report,
        file_name="saraldocs_analysis.json",
        mime="application/json",
    )
    download_cols[1].download_button(
        "Download CSV",
        data=csv_report,
        file_name="saraldocs_analysis.csv",
        mime="text/csv",
    )


def _render_clause_group(title: str, rows: list[dict], risk_level: str) -> None:
    st.header(title)
    if not rows:
        st.write("No clauses in this category.")
        return

    for row in rows:
        label = (
            f"Clause {row['clause_id']}"
            f"{'.' + str(row['chunk_id']) if row['was_chunked'] else ''} "
            f"- confidence {row['confidence']:.2f}"
        )
        with st.expander(label, expanded=(risk_level == "high")):
            if risk_level == "high":
                st.error(row["clause_text"])
            elif risk_level == "medium":
                st.warning(row["clause_text"])
            else:
                st.success(row["clause_text"])

            prob_cols = st.columns(4)
            prob_cols[0].metric("LOW probability", f"{row['low_probability']:.2%}")
            prob_cols[1].metric("MEDIUM probability", f"{row['medium_probability']:.2%}")
            prob_cols[2].metric("HIGH probability", f"{row['high_probability']:.2%}")
            prob_cols[3].metric("Model confidence", f"{row['confidence']:.2%}")

            st.write(f"Reason: {row['reason']}")
            if row.get("clause_type"):
                st.write(f"Clause type: {row['clause_type']}")
            if row.get("pattern_reference"):
                st.write(f"Pattern reference: {row['pattern_reference']}")


if __name__ == "__main__":
    main()
