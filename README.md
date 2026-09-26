# allaboutecu.com — MVP

Next.js prototype for a commercial vehicle ECU intelligence platform. The visible market series is **synthetic demonstration data**. No registration, sales, inventory, DTC population, recall, or ECU lifetime prediction is presented as observed fact.

## Run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. `pnpm lint` runs TypeScript validation and `pnpm build` creates a production build.

## Implemented

- Responsive intelligence dashboard with working navigation, segment filter, chart, source status, Granbird tracking card, and research links.
- ECU input form and `/api/diagnose` with range validation and an explainable **rule-based demo** score. It does not estimate remaining life or failure probability.
- Grounded Granbird strengths and a separate list of unverified issues.
- Technology roadmap and searchable library linked to primary sources.
- D1 schema in `migrations/0001_init.sql`, a MOLIT raw-response extractor in `scripts/fetch_molit.py`, and a strict, source-preserving CSV normalizer in `scripts/ingest_market.py`.
- V2 source badges, a Granbird dual-axis chart that activates only for comparable verified observations, and an extended-source readiness panel.
- Related-indicator validation in `scripts/ingest_extended.py`, exact-identifier recall matching logic, and an explicit unavailable response until recall data has been verified and imported.
- Cloudflare Workers build configuration using the [OpenNext adapter](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/). `pnpm deploy:cf` is the deployment command after account authentication.

## Official MOLIT API key and table IDs

1. Open the [MOLIT Statistics Sharing Service](https://stat.molit.go.kr/portal/api/main.do) and sign in or join.
2. Under **서비스신청 및 내역 → 인증키신청 및 이용내역**, request an authentication key and wait for approval.
3. Under **서비스신청 및 내역 → OPEN API 신청 및 신청현황**, request access to the selected open API and wait for administrator approval. Both screens require login.
4. In the [API service list](https://stat.molit.go.kr/portal/api/apiList.do), find the exact automobile-registration table. Select its format and time series. Copy the displayed `form_id` (table ID) and `style_num` (format ID) from the generated request URL. Do not infer these IDs from an unrelated statistical page URL.
5. Store the values in local environment variables `MOLIT_API_KEY`, `MOLIT_FORM_ID`, and `MOLIT_STYLE_NUM`; never commit the key. The [official API page](https://stat.molit.go.kr/portal/api/apiList.do) specifies `key`, `form_id`, `style_num`, `start_dt`, and `end_dt` as required parameters.

Account check on 2026-09-26: an existing MOLIT authentication key was already marked usable. The **자동차등록대수현황 시도별** API application was submitted with `form_id=5498`, `style_num=2`. The application list showed **신청** and the API itself showed **중지**; this is not an approved, callable integration. The table contains registration stock by area and broad vehicle class, not verified Granbird model-level new registrations. Do not put the key in a URL committed to source control.

## Public Data Portal applications

The following official APIs are the initial application set. Each page has **활용신청** and issues an API key after a signed-in application. Keep the key in a local environment or Cloudflare secret, never in source control.

| API | Purpose | Approval shown by provider | Validation before display |
| --- | --- | --- | --- |
| [TS 신규등록정보](https://www.data.go.kr/data/15059401/openapi.do) | New registrations by month, area, fuel, size, and model code | Development and production automatic | Obtain the separate model-code table and verify the Granbird code and grouping |
| [한국환경공단 전기자동차 충전소 정보](https://www.data.go.kr/data/15076352/openapi.do) | Electric charging sites | Development automatic | Filter for actual commercial-vehicle suitability before claiming coverage |
| [한국석유관리원 수소충전소 운영정보](https://www.data.go.kr/data/15133332/openapi.do) | Hydrogen station locations and status | Development automatic | Confirm bus access and define the denominator before calculating a coverage rate |

The [TS recall file](https://www.data.go.kr/data/3048950/fileData.do) is a separate downloadable dataset. Its listed fields do not establish an ECU part-number match.

Application check on 2026-09-26: all three Public Data Portal APIs in the table above were submitted and appeared as **승인** under the user's development account, with displayed expiry 2028-09-26. Access keys and response schemas still need to be handled securely and tested before a live data switch.

## Cloudflare deployment

On 2026-09-26, the user's existing [Yennyx/automobilecu](https://github.com/Yennyx/automobilecu) `main` branch was updated with this MVP. Cloudflare Builds uses `CI=true npx opennextjs-cloudflare build` and `npx wrangler deploy` to deploy the `automobilecu` Worker at [allaboutecu.com](https://allaboutecu.com/). The previous static site remains recoverable from Git commit `a047553`. The live site and its `/api/diagnose` route were checked after deployment.

This deployment serves an explicitly labeled demonstration. The three approved Public Data Portal APIs and the MOLIT application are **not** feeding live figures to the UI. D1 creation, migration, secured API-key storage, ingestion scheduling, source reconciliation, and production monitoring for live data remain future integration work. Do not present synthetic market figures as official statistics.

## Data integration gates

1. Register for the [MOLIT Statistics Sharing API](https://stat.molit.go.kr/portal/api/apiList.do), confirm the specific vehicle registration table (`form_id`, `style_num`), dimensions, cadence, and license. The general automobile information API is not a drop-in public aggregate-registration endpoint; some vehicle-level fields require owner consent.
2. Obtain KAMA sales and TS inspection/DTG usage permissions and schemas. Sales, registrations, and inventory have distinct definitions and must be stored as separate metrics. The [TS recall file](https://www.data.go.kr/data/3048950/fileData.do) lists maker, model, production period, start date, and reason, but does not publish ECU part numbers; it cannot substantiate an ECU-specific recall match by itself.
3. Load approved data into `market_observations` with original source URL, period, geography, and publication date. Switch the UI to the live API only after reconciliation against an official published total.
4. Establish verified model-year and ECU part-number mappings before vehicle-specific scoring. Validate diagnostic models with labeled maintenance outcomes before any life or fault prediction is shown.
5. Use publisher APIs or licensed feeds for IEEE, ScienceDirect, SAE, KCI and commercial reports. Store metadata/abstracts only as permitted; disclose generated summaries and link to original publications.
6. Configure a scheduled refresh after API credentials, D1 binding, and observability are available. Cloudflare Cron Triggers use UTC; 00:00 Korea time corresponds to 15:00 UTC on the preceding day. No live data ingestion cron is configured in this MVP.

## Grounding notes

Kia's [Granbird heritage page](https://worldwide.kia.com/ko/brand/our-brand/heritage/vehicles/granbird) identifies the Super Premium model with a diesel engine; the [official price list](https://www.kia.com/content/dam/kwp/kr/ko/vehicles/pdf/price/price_new-granbird.pdf) lists DPF+SCR. An official Granbird FCEV lineup or sales share was not established from the reviewed Kia sources, so the UI leaves that item unverified. Euro 7 is linked to the [EU regulation](https://eur-lex.europa.eu/eli/reg/2024/1257/oj/eng); J1939 diagnostics are linked to [SAE](https://saemobilus.sae.org/standards/j193973_201705-application-layer-diagnostics).
