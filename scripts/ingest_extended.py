"""Validate reviewed, licensed related-indicator CSV exports.

Input columns: metric, period, region_code, value, unit, source_name,
source_url, recorded_at. Optional: vehicle_type, fuel_type, denominator,
applicability_note, published_at. Output is JSON for D1 staging/import.
"""

import csv
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

METRICS = {
    "ev_charger_count", "hydrogen_station_count", "scrappage_count",
    "subsidy_amount", "semiconductor_index", "rare_earth_index",
    "bus_replacement_cycle",
}
REQUIRED = {"metric", "period", "region_code", "value", "unit", "source_name", "source_url", "recorded_at"}


def normalize(row: dict[str, str], line: int) -> dict[str, object]:
    missing = [key for key in REQUIRED if not row.get(key, "").strip()]
    if missing:
        raise ValueError(f"line {line}: missing {', '.join(sorted(missing))}")
    metric = row["metric"].strip()
    if metric not in METRICS:
        raise ValueError(f"line {line}: unknown metric {metric}")
    period = row["period"].strip()
    if not re.fullmatch(r"\d{4}-(0[1-9]|1[0-2])", period):
        raise ValueError(f"line {line}: period must be YYYY-MM")
    url = row["source_url"].strip()
    if urlparse(url).scheme != "https":
        raise ValueError(f"line {line}: source_url must be HTTPS")
    try:
        value = float(row["value"].strip())
    except ValueError as exc:
        raise ValueError(f"line {line}: value must be numeric") from exc
    if not (-1e15 < value < 1e15):
        raise ValueError(f"line {line}: value is not finite or exceeds bounds")
    if metric.endswith("_count") and (value < 0 or not value.is_integer()):
        raise ValueError(f"line {line}: count must be a nonnegative integer")
    if metric == "bus_replacement_cycle" and value <= 0:
        raise ValueError(f"line {line}: replacement cycle must be positive")
    return {
        "metric": metric,
        "period": period,
        "region_code": row["region_code"].strip(),
        "vehicle_type": row.get("vehicle_type", "").strip() or None,
        "fuel_type": row.get("fuel_type", "").strip() or None,
        "value": int(value) if metric.endswith("_count") else value,
        "unit": row["unit"].strip(),
        "denominator": row.get("denominator", "").strip() or None,
        "applicability_note": row.get("applicability_note", "").strip() or None,
        "source_name": row["source_name"].strip(),
        "source_url": url,
        "published_at": row.get("published_at", "").strip() or None,
        "recorded_at": row["recorded_at"].strip(),
        "quality_status": "raw",
    }


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: ingest_extended.py input.csv output.json")
    source, target = map(Path, sys.argv[1:])
    with source.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        if not REQUIRED.issubset(reader.fieldnames or []):
            raise SystemExit(f"CSV columns required: {', '.join(sorted(REQUIRED))}")
        rows = [normalize(row, line) for line, row in enumerate(reader, start=2)]
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Validated {len(rows)} raw related observations -> {target}")


if __name__ == "__main__":
    main()
