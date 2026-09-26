# allaboutecu.com

Next.js dashboard deployed by the GitHub-connected Cloudflare `automobilecu` Worker. Published market numbers and research cards are linked to official source files or DOI records. No demo registration series or arbitrary ECU health score is served.

## Official registration snapshot

- Source: [MOLIT 자동차등록현황보고](https://stat.molit.go.kr/portal/cate/statMetaView.do?hFormId=1244&hRsId=58), monthly files for January–August 2026, checked on 2026-09-26.
- Monthly chart: sheet `20.신규 등록현황(당월)`, national `총계` row, columns J/N/R for `승합`/`화물`/`특수`. `전체` is the sum of these three classes and excludes `승용`.
- August stock: sheet `09.차종별_유형별 현황`, national `화물 덤프` row, 51,632 vehicles. Stock is separate from new registrations.
- Source XLSX URLs and SHA-256 hashes are in [`data/official-molit-2026.json`](data/official-molit-2026.json). Monthly vehicle-class figures were reconciled to the national total in each file.
- Granbird model sales, mixer registrations, ECU failure rates, and hydrogen-bus coverage are not published without verified data.

## Actual research collection and summaries

- [`scripts/ingest_research.py`](scripts/ingest_research.py) discovers relevant studies from the [OpenAlex Works API](https://help.openalex.org/api/), checks DOI/title/year/abstract metadata, and writes [`data/research-official.json`](data/research-official.json). It stores OpenAlex's inverted-index abstract representation and its SHA-256 digest with each record, without publishing plaintext abstracts. Cards link to the DOI resolver and display authors, institution when provided, publication year and journal/series.
- [GitHub Actions](.github/workflows/update_research.yml) refreshes the DOI metadata at 00:15 KST daily. A change to the JSON triggers Cloudflare's GitHub-connected build. The workflow uses `GITHUB_TOKEN` with repository Contents permission and no external API key.
- The deployed Worker has an AI binding and a dedicated KV namespace for summaries. When a reader opens a research card, `/api/research/summary?doi=…` allows only a DOI in the verified catalog, reconstructs the stored inverted index inside the Worker, checks its SHA-256 digest, then requests three Korean sentences from Cloudflare Workers AI `@cf/meta/llama-3.1-8b-instruct`. Valid summaries are cached in KV for 30 days. On API, quota or format failure, the card reports that a summary is unavailable and still links to the DOI source. It never supplies synthetic fallback text.
- The Cloudflare account is on Workers Free. Workers AI's published free allocation is 10,000 Neurons/day; overage requests fail on the Free plan. No OpenAI API key or paid LLM is configured.

## Build and deployment

```bash
pnpm install
pnpm lint
CI=true pnpm exec opennextjs-cloudflare build
```

Pushing `main` to [`Yennyx/automobilecu`](https://github.com/Yennyx/automobilecu) triggers Cloudflare Builds (`CI=true npx opennextjs-cloudflare build`, then `npx wrangler deploy`) for [allaboutecu.com](https://allaboutecu.com/). The GitHub–Cloudflare connection persists independently of a local Git push credential.

MOLIT API application `form_id=5498`, `style_num=2` has not been validated as an available feed. Development approvals for TS new registrations, electric chargers and hydrogen stations do not by themselves establish comparable figures, so those values remain unpublished. The registration dashboard is a verified monthly snapshot and does not claim live API refresh.
