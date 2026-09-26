import records from "@/data/research-official.json";

export const sourceRegistry = [
  { name: "국토교통부 통계누리", category: "2026년 1~8월 등록 원본", status: "원본 확인", url: "https://stat.molit.go.kr/portal/cate/statMetaView.do?hFormId=1244&hRsId=58" },
  { name: "OpenAlex", category: "논문 DOI·서지·초록", status: "원본 확인", url: "https://openalex.org/" },
  { name: "KAMA", category: "국내 판매", status: "이용 조건 확인", url: "https://www.kama.or.kr/" },
  { name: "한국교통안전공단", category: "검사·운행", status: "이용 조건 확인", url: "https://www.kotsa.or.kr/" },
  { name: "Kia Granbird", category: "제조사 사양", status: "원문 링크", url: "https://www.kia.com/kr/vehicles/granbird/features" },
];

export const library = records.map(item => ({
  category: item.doi.startsWith("10.4271/") ? "SAE" : item.doi.startsWith("10.1109/") ? "IEEE" : "PAPER",
  title: item.title,
  publisher: item.publisher,
  author: item.authors.join(", ") || "저자 정보 확인 필요",
  institution: item.institution,
  year: String(item.year),
  doi: item.doi,
  url: item.originalUrl,
  metadataUrl: item.metadataUrl,
  summaryType: "DOI 확인",
}));
