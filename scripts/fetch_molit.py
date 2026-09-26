"""Fetch and archive an approved MOLIT Statistics table response.

This is the extract stage only. A table-specific transform must be reviewed
before its values enter market_observations. Required environment variables:
MOLIT_API_KEY, MOLIT_FORM_ID, MOLIT_STYLE_NUM.

Usage: python3 scripts/fetch_molit.py START_DT END_DT OUTPUT_JSON
Date format depends on the selected table; consult its official API details.
"""

import json
import os
import sys
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ENDPOINT = "https://stat.molit.go.kr/portal/openapi/service/rest/getList.do"


def main() -> None:
    if len(sys.argv) != 4:
        raise SystemExit("Usage: fetch_molit.py START_DT END_DT OUTPUT_JSON")
    key = os.environ.get("MOLIT_API_KEY", "").strip()
    form_id = os.environ.get("MOLIT_FORM_ID", "").strip()
    style_num = os.environ.get("MOLIT_STYLE_NUM", "").strip()
    if not key or not form_id.isdigit() or not style_num.isdigit():
        raise SystemExit("Set MOLIT_API_KEY, numeric MOLIT_FORM_ID, and numeric MOLIT_STYLE_NUM")
    start_dt, end_dt, destination = sys.argv[1:]
    if not start_dt.isdigit() or not end_dt.isdigit() or int(start_dt) > int(end_dt):
        raise SystemExit("START_DT and END_DT must be increasing numeric dates")
    params = urlencode({"key": key, "form_id": form_id, "style_num": style_num, "start_dt": start_dt, "end_dt": end_dt})
    request = Request(f"{ENDPOINT}?{params}", headers={"Accept": "application/json", "User-Agent": "allaboutecu-ingest/0.1"})
    try:
        with urlopen(request, timeout=25) as response:
            body = response.read(10_000_001)
    except Exception as exc:
        # Avoid printing a URL that may include the API key.
        raise SystemExit(f"MOLIT request failed: {type(exc).__name__}") from None
    if len(body) > 10_000_000:
        raise SystemExit("MOLIT response exceeds 10 MB limit")
    try:
        data = json.loads(body)
    except json.JSONDecodeError:
        raise SystemExit("MOLIT did not return JSON; inspect the selected table and API format") from None
    if isinstance(data, dict) and data.get("status_code") not in (None, "INFO-000"):
        raise SystemExit(f"MOLIT returned status {data.get('status_code')}")
    target = Path(destination)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Archived response to {target}")


if __name__ == "__main__":
    main()
