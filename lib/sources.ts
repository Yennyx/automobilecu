export type Source = {
  id: string;
  name: string;
  url: string;
  provider: string;
  kind: "official" | "publisher";
  accessedAt: string | null;
};

export const sources: Record<string, Source> = {
  molit: { id: "molit", name: "자동차등록현황보고 · 2026년 월별 XLSX", provider: "국토교통부 통계누리", url: "https://stat.molit.go.kr/portal/cate/statMetaView.do?hFormId=1244&hRsId=58", kind: "official", accessedAt: "2026-09-26" },
  tsRegistration: { id: "tsRegistration", name: "신규 자동차 등록 정보 API", provider: "한국교통안전공단", url: "https://www.data.go.kr/data/15059401/openapi.do", kind: "official", accessedAt: "2026-09-26" },
  kia: { id: "kia", name: "Granbird 공식 가격표", provider: "Kia", url: "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/pdf/price/price_new-granbird.pdf", kind: "official", accessedAt: "2026-09-26" },
  ev: { id: "ev", name: "전기자동차 충전소 정보 API", provider: "한국환경공단", url: "https://www.data.go.kr/data/15076352/openapi.do", kind: "official", accessedAt: "2026-09-26" },
  hydrogen: { id: "hydrogen", name: "수소충전소 운영 정보 API", provider: "한국석유관리원", url: "https://www.data.go.kr/data/15133332/openapi.do", kind: "official", accessedAt: "2026-09-26" },
  recall: { id: "recall", name: "자동차리콜센터", provider: "국토교통부", url: "https://www.car.go.kr/", kind: "official", accessedAt: "2026-09-26" },
  scrap: { id: "scrap", name: "2026 조기폐차 지원 안내", provider: "기후에너지환경부", url: "https://www.me.go.kr/home/web/board/read.do?boardMasterId=1&boardId=1841450", kind: "official", accessedAt: "2026-09-26" },
  euro7: { id: "euro7", name: "Regulation (EU) 2024/1257", provider: "EUR-Lex", url: "https://eur-lex.europa.eu/eli/reg/2024/1257/oj/eng", kind: "official", accessedAt: "2026-09-26" },
  sae: { id: "sae", name: "J1939-73 Diagnostics", provider: "SAE International", url: "https://saemobilus.sae.org/standards/j193973_201705-application-layer-diagnostics", kind: "publisher", accessedAt: "2026-09-26" },
};

export type RelatedMetric = "ev_charger_count" | "hydrogen_station_count" | "scrappage_count" | "subsidy_amount" | "semiconductor_index" | "rare_earth_index" | "bus_replacement_cycle";

export const extendedSources: { metric: RelatedMetric; title: string; sourceId?: keyof typeof sources; status: string; note: string }[] = [
  { metric: "ev_charger_count", title: "전기 충전 인프라", sourceId: "ev", status: "개발계정 승인 · 데이터 검증 대기", note: "전체 충전소가 상용차 이용 가능 시설을 뜻하지 않습니다." },
  { metric: "hydrogen_station_count", title: "수소 충전 인프라", sourceId: "hydrogen", status: "개발계정 승인 · 데이터 검증 대기", note: "고속·시외버스 이용 가능 여부와 구축률 분모를 확인해야 합니다." },
  { metric: "scrappage_count", title: "노후 경유차 조기폐차", sourceId: "scrap", status: "지표 정의 중", note: "정책 발표 수치와 실제 대형버스 폐차 실적을 구분합니다." },
  { metric: "subsidy_amount", title: "친환경 차량 지원금", status: "원천 검증 중", note: "지역·차종·연도별 공고를 분리해야 합니다." },
  { metric: "semiconductor_index", title: "차량용 반도체", status: "원천 검증 중", note: "검증된 공공 시계열을 확보하기 전에는 수치화하지 않습니다." },
  { metric: "rare_earth_index", title: "희토류", status: "원천 검증 중", note: "ECU 영향과 전동기 자석 공급 영향을 구분합니다." },
  { metric: "bus_replacement_cycle", title: "대형버스 교체 주기", status: "원천 검증 중", note: "차령 분포만으로 교체 주기를 추정하지 않습니다." },
];
