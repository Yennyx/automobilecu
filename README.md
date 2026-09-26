# allaboutecu.com

Next.js dashboard deployed by the GitHub-connected Cloudflare `automobilecu` Worker. The registration series shown on the site is extracted from published Ministry of Land, Infrastructure and Transport (MOLIT) XLSX files. It is a dated official snapshot, not a live API feed.

## Published data

- Source: [MOLIT 자동차등록현황보고](https://stat.molit.go.kr/portal/cate/statMetaView.do?hFormId=1244&hRsId=58), monthly files for January–August 2026, checked on 2026-09-26.
- Monthly series: sheet `20.신규 등록현황(당월)`, national `총계` row, columns J/N/R for `승합`/`화물`/`특수`. `전체` is the sum of these three classes, excluding `승용`.
- August registered stock: sheet `09.차종별_유형별 현황`, national `화물 덤프` row, 51,632 vehicles. This is stock, whereas the chart uses new registrations.
- Values, original XLSX links, and SHA-256 hashes are in [`data/official-molit-2026.json`](data/official-molit-2026.json). The monthly categories were checked against the overall monthly total in each source file.
- The source does not establish Granbird model sales, mixer registrations, ECU failure rates, battery or charging coverage. Those values are absent from the UI. The previous arbitrary ECU score and synthetic registration series were removed.

## Build and deployment

```bash
pnpm install
pnpm lint
CI=true pnpm exec opennextjs-cloudflare build
```

Pushing `main` to [`Yennyx/automobilecu`](https://github.com/Yennyx/automobilecu) triggers Cloudflare Builds (`CI=true npx opennextjs-cloudflare build`, then `npx wrangler deploy`) for [allaboutecu.com](https://allaboutecu.com/). The GitHub–Cloudflare connection persists independently of the temporary local Git push credential.

## Data refresh

This release is a reviewed snapshot. It does not claim an automatic daily feed. Refresh it by downloading a newer official monthly XLSX, verifying the national class totals and the sheet labels, adding the source URL and SHA-256, then deploying through `main`. MOLIT API application `form_id=5498`, `style_num=2` was submitted, but it has not been validated as an available data feed. Public Data Portal development approvals for TS new registrations, electric chargers, and hydrogen stations exist, but their figures are not displayed until response schemas and metric definitions are verified. Do not commit API keys or tokens.

The research cards link to original publishers. The regulation roadmap is a conceptual overview, not a release schedule. ECU diagnosis needs part-number mappings and labeled maintenance outcomes before any score or lifetime estimate can be published.
