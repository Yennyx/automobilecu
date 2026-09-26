export type Segment = "전체" | "덤프" | "믹서" | "버스" | "트럭";
export type Metric = "신규 등록" | "판매" | "재고";

export const segments: Segment[] = ["전체", "덤프", "믹서", "버스", "트럭"];
export const monthly = [
  { month: "1월", dump: 324, mixer: 212, bus: 443, truck: 1038 },
  { month: "2월", dump: 283, mixer: 198, bus: 391, truck: 961 },
  { month: "3월", dump: 347, mixer: 241, bus: 476, truck: 1145 },
  { month: "4월", dump: 365, mixer: 258, bus: 452, truck: 1192 },
  { month: "5월", dump: 339, mixer: 246, bus: 489, truck: 1168 },
  { month: "6월", dump: 382, mixer: 267, bus: 514, truck: 1241 },
  { month: "7월", dump: 371, mixer: 254, bus: 498, truck: 1206 },
  { month: "8월", dump: 351, mixer: 239, bus: 472, truck: 1179 },
  { month: "9월", dump: 394, mixer: 273, bus: 531, truck: 1287 },
  { month: "10월", dump: 410, mixer: 281, bus: 544, truck: 1321 },
  { month: "11월", dump: 401, mixer: 269, bus: 519, truck: 1298 },
  { month: "12월", dump: 428, mixer: 292, bus: 557, truck: 1382 },
];

export const sourceRegistry = [
  { name: "국토교통부 통계누리", category: "차량 등록", status: "연동 준비", url: "https://stat.molit.go.kr/" },
  { name: "KAMA", category: "국내 판매", status: "이용 조건 확인", url: "https://www.kama.or.kr/" },
  { name: "한국교통안전공단", category: "검사·운행", status: "이용 조건 확인", url: "https://www.kotsa.or.kr/" },
  { name: "Kia Granbird", category: "제조사 사양", status: "원문 링크", url: "https://www.kia.com/kr/vehicles/granbird/features" },
];

export const library = [
  { category: "STANDARD", title: "SAE J1939-73 · Application Layer — Diagnostics", publisher: "SAE International", author: "Truck and Bus Control and Communications Network Committee", year: "2017", doi: "10.4271/J1939/73_201705", summary: "상용차 네트워크의 진단 메시지 체계를 정의합니다.\n활성 고장 코드와 ECU 정보 조회 범위를 설명합니다.\n진단 데이터 해석을 위한 기본 참조 문서입니다.", url: "https://saemobilus.sae.org/standards/j193973_201705-application-layer-diagnostics", summaryType: "편집 요약" },
  { category: "REGULATION", title: "Euro 7 · Regulation (EU) 2024/1257", publisher: "EUR-Lex", author: "European Parliament and Council", year: "2024", doi: null, summary: "차량·엔진의 배출가스와 배터리 내구성을 다룹니다.\n상용차 제어 시스템의 규제 대응 분석 기준입니다.\n적용 일정은 차종과 승인 단계별로 확인해야 합니다.", url: "https://eur-lex.europa.eu/eli/reg/2024/1257/oj/eng", summaryType: "편집 요약" },
  { category: "OEM", title: "Kia Granbird · Official specifications", publisher: "Kia", author: "Kia", year: "2025", doi: null, summary: "공식 카탈로그에서 디젤 파워트레인을 확인할 수 있습니다.\nDPF와 SCR 후처리 장치가 명시돼 있습니다.\nECU 상세 부품번호는 별도 제조사 자료가 필요합니다.", url: "https://www.kia.com/content/dam/kwp/kr/ko/vehicles/pdf/catalog/catalog_new-granbird.pdf", summaryType: "편집 요약" },
];
