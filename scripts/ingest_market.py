"""Validate an approved CSV export and emit normalized market records.

Usage: python3 scripts/ingest_market.py input.csv output.json
The CSV must contain source_id, source_name, period (YYYY-MM), region_code,
segment, metric, value, source_url, and optionally published_at. This script does not
download source material or infer missing fields.
"""

import csv
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

SEGMENTS = {"dump", "mixer", "bus_large", "bus_medium", "truck_cargo", "truck_tractor", "truck_special"}
METRICS = {"registration", "sales", "inventory"}
REQUIRED = {"source_id", "source_name", "period", "region_code", "segment", "metric", "value", "source_url"}


def normalize(row: dict[str, str], line: int) -> dict[str, object]:
    missing = [key for key in REQUIRED if not row.get(key, "").strip()]
    if missing:
        raise ValueError(f"line {line}: missing {', '.join(sorted(missing))}")
    period = row["period"].strip()
    if not re.fullmatch(r"\d{4}-(0[1-9]|1[0-2])", period):
        raise ValueError(f"line {line}: invalid period")
    segment = row["segment"].strip()
    metric = row["metric"].strip()
    if segment not in SEGMENTS or metric not in METRICS:
        raise ValueError(f"line {line}: invalid segment or metric")
    try:
        value = int(row["value"].strip())
    except ValueError as exc:
        raise ValueError(f"line {line}: value must be an integer") from exc
    if value < 0:
        raise ValueError(f"line {line}: value must be nonnegative")
    source_url = row["source_url"].strip()
    if urlparse(source_url).scheme != "https":
        raise ValueError(f"line {line}: source_url must be HTTPS")
    return {
        "source_id": row["source_id"].strip(),
        "source_name": row["source_name"].strip(),
        "period": period,
        "region_code": row["region_code"].strip(),
        "segment": segment,
        "metric": metric,
        "value": value,
        "source_url": source_url,
        "published_at": row.get("published_at", "").strip() or None,
    }


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: ingest_market.py input.csv output.json")
    input_path, output_path = map(Path, sys.argv[1:])
    with input_path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        if not REQUIRED.issubset(reader.fieldnames or []):
            raise SystemExit(f"CSV columns required: {', '.join(sorted(REQUIRED))}")
        records = [normalize(row, line) for line, row in enumerate(reader, start=2)]
    keys = [(r["source_id"], r["period"], r["region_code"], r["segment"], r["metric"]) for r in records]
    if len(keys) != len(set(keys)):
        raise SystemExit("Duplicate observation key in input")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Validated {len(records)} observations -> {output_path}")


if __name__ == "__main__":
    main()
