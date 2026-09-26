#!/usr/bin/env python3
"""Refresh DOI-verified research metadata from OpenAlex.

The published link is always the DOI resolver. Keep OpenAlex's inverted-index
form for abstracts; reconstruct only inside the Worker when summarizing.
"""
from __future__ import annotations

import hashlib
import json
import re
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "research-official.json"
API = "https://api.openalex.org/works"
SEEDS = [
    "10.1109/tii.2020.3014599",  # electric bus battery control
    "10.1109/tte.2022.3185215",   # fuel-cell bus energy management
    "10.14722/autosec.2021.23031", # J1939 network security
    "10.4271/2024-01-5041",       # SAE vehicle diagnostics
    "10.3390/en16196884",         # zonal architecture
]
QUERIES = [
    "J1939 vehicle diagnostics",
    "electric bus battery management",
    "fuel cell bus energy management",
    "heavy duty diesel aftertreatment diagnostics",
    "vehicle zonal electrical architecture",
]
TITLE_RULES = [
    re.compile(r"J1939|ECU", re.I),
    re.compile(r"(?:electric|hybrid).*bus.*(?:batter|energy|thermal)|(?:batter|energy|thermal).*bus", re.I),
    re.compile(r"fuel.cell.*bus|bus.*fuel.cell", re.I),
    re.compile(r"(?:heavy.duty|diesel).*?(?:emission|aftertreatment|diagnos|NOx)|(?:emission|aftertreatment|diagnos).*?(?:heavy.duty|diesel)", re.I),
    re.compile(r"(?:zonal|domain).*?(?:vehicle|architect)|(?:vehicle|architect).*?(?:zonal|domain)", re.I),
    re.compile(r"diagnostic", re.I),
]
SELECT = "id,doi,title,publication_year,publication_date,authorships,primary_location,abstract_inverted_index,type"


def get_json(url: str, payload: dict | None = None, token: str | None = None) -> dict:
    data = json.dumps(payload).encode() if payload is not None else None
    headers = {"User-Agent": "allaboutecu-research/1.0 (https://allaboutecu.com)", "Accept": "application/json"}
    if data is not None:
        headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {token}"})
    request = urllib.request.Request(url, data=data, headers=headers)
    with urllib.request.urlopen(request, timeout=35) as response:
        return json.load(response)


def search(params: dict) -> list[dict]:
    url = API + "?" + urllib.parse.urlencode(params)
    return get_json(url).get("results", [])


def abstract_text(index: dict) -> str:
    positions = [(position, word) for word, indices in index.items() for position in indices]
    if not positions:
        return ""
    return " ".join(word for _, word in sorted(positions))


def normalize(work: dict) -> tuple[dict, str] | None:
    doi_url = work.get("doi") or ""
    if not doi_url.lower().startswith("https://doi.org/10.") or not work.get("title"):
        return None
    abstract = abstract_text(work.get("abstract_inverted_index") or {})
    if len(abstract) < 180 or work.get("publication_year", 0) < 2020:
        return None
    source = (work.get("primary_location") or {}).get("source") or {}
    authorships = work.get("authorships") or []
    authors = [a.get("author", {}).get("display_name") for a in authorships[:3] if a.get("author", {}).get("display_name")]
    institution = next((inst.get("display_name") for a in authorships for inst in a.get("institutions", []) if inst.get("display_name")), None)
    doi = doi_url.removeprefix("https://doi.org/")
    record = {
        "doi": doi, "title": work["title"].strip(), "publisher": source.get("display_name") or "게재지 확인 필요",
        "authors": authors, "institution": institution, "year": work["publication_year"],
        "publishedDate": work.get("publication_date"), "originalUrl": doi_url,
        "metadataUrl": work["id"].replace("https://openalex.org/", "https://api.openalex.org/works/"),
        "abstractInvertedIndex": work.get("abstract_inverted_index") or {},
        "abstractSha256": hashlib.sha256(abstract.encode()).hexdigest(), "retrievedAt": date.today().isoformat(),
    }
    return record, abstract


def main() -> None:
    previous = {}
    if OUTPUT.exists():
        previous = {row["doi"].lower(): row for row in json.loads(OUTPUT.read_text())}
    works = {}
    for doi in SEEDS:
        for work in search({"filter": "doi:https://doi.org/" + doi, "per-page": 1, "select": SELECT}):
            works[work["doi"].lower()] = work
    for query in QUERIES:
        candidates = search({"search": query, "filter": "from_publication_date:2020-01-01,has_abstract:true", "per-page": 20, "select": SELECT})
        accepted = 0
        for work in candidates:
            title = work.get("title") or ""
            if accepted >= 2:
                break
            if any(rule.search(title) for rule in TITLE_RULES) and work.get("doi"):
                works[work["doi"].lower()] = work
                accepted += 1
    rows = []
    for work in works.values():
        normalized = normalize(work)
        if not normalized:
            continue
        record, abstract = normalized
        old = previous.get(record["doi"].lower())
        if old and old.get("abstractSha256") == record["abstractSha256"] and old.get("title") == record["title"]:
            record["retrievedAt"] = old["retrievedAt"]
        rows.append(record)
    if len(rows) < 5:
        raise SystemExit(f"Only {len(rows)} verified works; refusing to replace data")
    rows.sort(key=lambda row: (row["year"], row["doi"]), reverse=True)
    temp = OUTPUT.with_suffix(".tmp")
    temp.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temp.replace(OUTPUT)
    print(f"Wrote {len(rows)} DOI records from OpenAlex")


if __name__ == "__main__":
    main()
