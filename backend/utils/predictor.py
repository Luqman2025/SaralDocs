from __future__ import annotations

import json
from pathlib import Path

import torch
from safetensors.torch import load_file as load_safetensors
from transformers import AutoConfig, AutoModelForSequenceClassification, AutoTokenizer


LABELS = ["LOW", "MEDIUM", "HIGH"]
REQUIRED_MODEL_FILES = ["config.json", "model.safetensors", "tokenizer_config.json"]


class ModelValidationError(RuntimeError):
    """Raised when the local model folder is incomplete or incompatible."""


def validate_model_dir(model_dir: Path) -> None:
    missing = [file_name for file_name in REQUIRED_MODEL_FILES if not (model_dir / file_name).exists()]

    if not ((model_dir / "tokenizer.json").exists() or (model_dir / "vocab.txt").exists()):
        missing.append("tokenizer.json or vocab.txt")

    if missing:
        raise ModelValidationError(
            "Missing required model file(s): "
            + ", ".join(missing)
            + ". Run prepare_model.py with your trained model/tokenizer output, or place the trained files in SaralDocs/model/."
        )


def load_model_bundle(model_dir: Path) -> dict:
    validate_model_dir(model_dir)

    config = AutoConfig.from_pretrained(model_dir, local_files_only=True)
    _validate_config(config)

    tokenizer = AutoTokenizer.from_pretrained(
        model_dir,
        use_fast=True,
        local_files_only=True,
    )
    model = AutoModelForSequenceClassification.from_pretrained(
        model_dir,
        config=config,
        local_files_only=True,
    )

    _validate_tokenizer_model_compatibility(model_dir, tokenizer, model)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval()

    inference_config = _load_inference_config(model_dir, tokenizer)

    return {
        "model": model,
        "tokenizer": tokenizer,
        "device": device,
        "max_length": inference_config["max_length"],
        "stride": inference_config["stride"],
    }


@torch.inference_mode()
def predict_batch(texts: list[str], bundle: dict, batch_size: int = 8) -> list[dict]:
    model = bundle["model"]
    tokenizer = bundle["tokenizer"]
    device = bundle["device"]
    max_length = bundle["max_length"]
    predictions: list[dict] = []

    for start in range(0, len(texts), batch_size):
        batch_texts = texts[start : start + batch_size]
        encoded = tokenizer(
            batch_texts,
            padding=True,
            truncation=True,
            max_length=max_length,
            return_tensors="pt",
        )
        encoded = {key: value.to(device) for key, value in encoded.items()}
        outputs = model(**encoded)
        probabilities = torch.softmax(outputs.logits, dim=-1).detach().cpu()

        for row in probabilities:
            values = row.tolist()
            label_id = int(row.argmax().item())
            predictions.append(
                {
                    "predicted_risk": LABELS[label_id],
                    "low_probability": round(float(values[0]), 6),
                    "medium_probability": round(float(values[1]), 6),
                    "high_probability": round(float(values[2]), 6),
                    "confidence": round(float(max(values)), 6),
                }
            )

    return predictions


def _validate_config(config) -> None:
    if getattr(config, "num_labels", None) != 3:
        raise ModelValidationError(
            f"Model config must define num_labels == 3; found {getattr(config, 'num_labels', None)}."
        )

    id2label = {int(key): value.upper() for key, value in dict(config.id2label).items()}
    label2id = {key.upper(): int(value) for key, value in dict(config.label2id).items()}

    expected_id2label = {0: "LOW", 1: "MEDIUM", 2: "HIGH"}
    expected_label2id = {"LOW": 0, "MEDIUM": 1, "HIGH": 2}

    if id2label != expected_id2label or label2id != expected_label2id:
        raise ModelValidationError(
            "Label mapping must be exactly 0=LOW, 1=MEDIUM, 2=HIGH."
        )


def _validate_tokenizer_model_compatibility(model_dir: Path, tokenizer, model) -> None:
    weight_path = model_dir / "model.safetensors"
    tensors = load_safetensors(str(weight_path), device="cpu")
    embedding_key = next(
        (
            key
            for key in tensors
            if key.endswith("embeddings.word_embeddings.weight")
        ),
        None,
    )
    if not embedding_key:
        raise ModelValidationError(
            "Could not find BERT word embedding weights in model.safetensors."
        )

    weight_vocab_size = tensors[embedding_key].shape[0]
    tokenizer_vocab_size = len(tokenizer)
    model_vocab_size = model.get_input_embeddings().weight.shape[0]

    if tokenizer_vocab_size > model_vocab_size or model_vocab_size != weight_vocab_size:
        raise ModelValidationError(
            "Tokenizer/model vocabulary mismatch: "
            f"tokenizer={tokenizer_vocab_size}, model={model_vocab_size}, weights={weight_vocab_size}."
        )


def _load_inference_config(model_dir: Path, tokenizer) -> dict:
    training_config_path = model_dir / "training_config.json"
    max_length = min(512, int(getattr(tokenizer, "model_max_length", 512) or 512))
    stride = 64

    if training_config_path.exists():
        with training_config_path.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
        max_length = int(data.get("max_length", max_length))
        stride = int(data.get("stride", stride))

    if max_length <= 0 or max_length > 512:
        max_length = 512
    if stride < 0:
        stride = 0
    if stride >= max_length:
        stride = max(0, max_length // 4)

    return {"max_length": max_length, "stride": stride}
