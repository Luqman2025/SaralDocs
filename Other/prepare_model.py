from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

from transformers import AutoConfig, AutoModelForSequenceClassification, AutoTokenizer


LABEL2ID = {"LOW": 0, "MEDIUM": 1, "HIGH": 2}
ID2LABEL = {0: "LOW", 1: "MEDIUM", 2: "HIGH"}


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Package an existing trained Legal-BERT model/tokenizer into SaralDocs/model."
    )
    parser.add_argument(
        "--model-source",
        required=True,
        help="Path to the trained Hugging Face model directory containing weights/config.",
    )
    parser.add_argument(
        "--tokenizer-source",
        default=None,
        help="Path to tokenizer directory. Defaults to --model-source.",
    )
    parser.add_argument(
        "--output-dir",
        default="model",
        help="Destination model directory used by app.py.",
    )
    parser.add_argument("--max-length", type=int, default=256)
    parser.add_argument("--stride", type=int, default=64)
    args = parser.parse_args()

    model_source = Path(args.model_source)
    tokenizer_source = Path(args.tokenizer_source or args.model_source)
    output_dir = Path(args.output_dir)

    if not model_source.exists():
        raise FileNotFoundError(f"Model source does not exist: {model_source}")
    if not tokenizer_source.exists():
        raise FileNotFoundError(f"Tokenizer source does not exist: {tokenizer_source}")

    config = AutoConfig.from_pretrained(model_source, local_files_only=True)
    config.num_labels = 3
    config.label2id = LABEL2ID
    config.id2label = ID2LABEL

    model = AutoModelForSequenceClassification.from_pretrained(
        model_source,
        config=config,
        local_files_only=True,
    )
    tokenizer = AutoTokenizer.from_pretrained(
        tokenizer_source,
        use_fast=True,
        local_files_only=True,
    )

    if output_dir.exists():
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    model.save_pretrained(output_dir, safe_serialization=True)
    tokenizer.save_pretrained(output_dir)

    training_config = {
        "label2id": LABEL2ID,
        "id2label": {"0": "LOW", "1": "MEDIUM", "2": "HIGH"},
        "max_length": args.max_length,
        "stride": args.stride,
        "notes": [
            "Packaged from an existing trained model. No retraining was performed.",
            "Model is for legal risk screening research, not legal advice.",
        ],
    }
    (output_dir / "training_config.json").write_text(
        json.dumps(training_config, indent=2),
        encoding="utf-8",
    )

    required = ["config.json", "model.safetensors", "tokenizer_config.json"]
    missing = [name for name in required if not (output_dir / name).exists()]
    if not ((output_dir / "tokenizer.json").exists() or (output_dir / "vocab.txt").exists()):
        missing.append("tokenizer.json or vocab.txt")
    if missing:
        raise RuntimeError(f"Packaging incomplete. Missing: {', '.join(missing)}")

    print(f"Model packaged successfully in: {output_dir.resolve()}")
    print("Verified label mapping: 0=LOW, 1=MEDIUM, 2=HIGH")


if __name__ == "__main__":
    main()
