from __future__ import annotations
import json
from datetime import datetime, timezone
from pathlib import Path
import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
sources = json.loads((ROOT / "data" / "sources.json").read_text(encoding="utf-8"))

results = []
headers = {"User-Agent": "CommercialECUIntelligence/1.0"}

for s in sources:
    row = {
        "name": s["name"],
        "url": s["url"],
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "status": "unknown",
        "title": "",
        "content_length": 0
    }
    try:
        r = requests.get(s["url"], headers=headers, timeout=20)
        row["status"] = r.status_code
        row["content_length"] = len(r.content)
        soup = BeautifulSoup(r.text, "html.parser")
        row["title"] = (soup.title.get_text(" ", strip=True) if soup.title else "")[:200]
    except Exception as exc:
        row["status"] = "error"
        row["error"] = str(exc)

    results.append(row)

(ROOT / "data" / "source_status.json").write_text(
    json.dumps(results, ensure_ascii=False, indent=2),
    encoding="utf-8"
)
print(f"checked {len(results)} sources")
