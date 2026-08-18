from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass(frozen=True)
class TextUnit:
    clause_id: int
    chunk_id: int
    text: str
    source_clause: str
    was_chunked: bool


CLAUSE_HEADING_PATTERN = re.compile(
    r"(?im)(?=^\s*(?:\d+(?:\.\d+)*\.?|[A-Z]\.|[IVXLC]+\.)\s+[A-Z][^\n]{2,})"
)


def segment_clauses(text: str, min_chars: int = 40) -> list[str]:
    """Split document text into legal clauses or meaningful paragraphs."""
    paragraphs = [part.strip() for part in re.split(r"\n\s*\n+", text) if part.strip()]
    clauses: list[str] = []

    for paragraph in paragraphs:
        heading_parts = [
            part.strip() for part in CLAUSE_HEADING_PATTERN.split(paragraph) if part.strip()
        ]
        candidates = heading_parts if len(heading_parts) > 1 else [paragraph]

        for candidate in candidates:
            candidate = re.sub(r"\s+", " ", candidate).strip()
            if not candidate:
                continue
            if len(candidate) < min_chars and clauses:
                clauses[-1] = f"{clauses[-1]} {candidate}".strip()
            else:
                clauses.append(candidate)

    return clauses


def chunk_clauses(
    clauses: list[str],
    tokenizer,
    max_length: int,
    stride: int,
) -> list[TextUnit]:
    """Split long clauses into overlapping tokenizer-aware chunks."""
    usable_length = max(32, max_length - tokenizer.num_special_tokens_to_add(pair=False))
    safe_stride = min(max(0, stride), usable_length - 1)
    units: list[TextUnit] = []

    for clause_index, clause in enumerate(clauses, start=1):
        token_ids = tokenizer.encode(clause, add_special_tokens=False)

        if len(token_ids) <= usable_length:
            units.append(
                TextUnit(
                    clause_id=clause_index,
                    chunk_id=1,
                    text=clause,
                    source_clause=clause,
                    was_chunked=False,
                )
            )
            continue

        step = usable_length - safe_stride
        chunk_number = 1
        for start in range(0, len(token_ids), step):
            chunk_ids = token_ids[start : start + usable_length]
            if not chunk_ids:
                continue
            chunk_text = tokenizer.decode(
                chunk_ids,
                skip_special_tokens=True,
                clean_up_tokenization_spaces=True,
            ).strip()
            if chunk_text:
                units.append(
                    TextUnit(
                        clause_id=clause_index,
                        chunk_id=chunk_number,
                        text=chunk_text,
                        source_clause=clause,
                        was_chunked=True,
                    )
                )
                chunk_number += 1
            if start + usable_length >= len(token_ids):
                break

    return units
