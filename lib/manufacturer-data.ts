export type Manufacturer = {
  id: string;
  name: string;
  origin: "국내" | "수입";
  augustRegistrations: number | null;
  ytdRegistrations: number | null;
  augustDomesticSales?: number;
  ytdDomesticSales?: number;
  sourceName: string;
  sourceUrl: string;
};

// KAIDA's 2026-08 announcement counts imported commercial vehicles by brand.
// Domestic makers are selectable, but no like-for-like public registration
// breakdown has been verified; null must never be rendered as zero.
export const manufacturerPeriod = "2026.08";
export const kaidaAnnouncement = "https://www.kaida.co.kr/ko/kaida/bbsList.do?boardSeq=15&bbsType=kaida";
export const kaidaPublishedRelease = "https://www.hankyung.com/article/202609080912P";
export const kamaStatistics = "https://www.kama.or.kr/NewsController?board_id=506&boardmaster_id=Register&cmd=V&menunum=0003&pagenum=1&searchGubun=&searchValue=";
export const ministryAugustReport = "https://www.motir.go.kr/kor/article/ATCL3f49a5a8c/172213/view";

export const manufacturers: Manufacturer[] = [
  { id: "hyundai", name: "현대자동차", origin: "국내", augustRegistrations: null, ytdRegistrations: null, augustDomesticSales: 34333, ytdDomesticSales: 399086, sourceName: "산업통상부 자동차산업 동향", sourceUrl: ministryAugustReport },
  { id: "kia", name: "기아", origin: "국내", augustRegistrations: null, ytdRegistrations: null, augustDomesticSales: 40365, ytdDomesticSales: 391579, sourceName: "산업통상부 자동차산업 동향", sourceUrl: ministryAugustReport },
  { id: "tata-daewoo", name: "타타대우모빌리티", origin: "국내", augustRegistrations: null, ytdRegistrations: null, augustDomesticSales: 364, ytdDomesticSales: 3010, sourceName: "산업통상부 자동차산업 동향", sourceUrl: ministryAugustReport },
  { id: "daewoo-bus", name: "대우버스", origin: "국내", augustRegistrations: null, ytdRegistrations: null, sourceName: "KAMA 자동차등록통계월보", sourceUrl: kamaStatistics },
  { id: "kgm", name: "KG모빌리티", origin: "국내", augustRegistrations: null, ytdRegistrations: null, augustDomesticSales: 2300, ytdDomesticSales: 26716, sourceName: "산업통상부 자동차산업 동향", sourceUrl: ministryAugustReport },
  { id: "gm-korea", name: "한국GM", origin: "국내", augustRegistrations: null, ytdRegistrations: null, augustDomesticSales: 731, ytdDomesticSales: 6768, sourceName: "산업통상부 자동차산업 동향", sourceUrl: ministryAugustReport },
  { id: "renault-korea", name: "르노코리아", origin: "국내", augustRegistrations: null, ytdRegistrations: null, augustDomesticSales: 2024, ytdDomesticSales: 24915, sourceName: "산업통상부 자동차산업 동향", sourceUrl: ministryAugustReport },
  { id: "volvo-trucks", name: "볼보트럭", origin: "수입", augustRegistrations: 79, ytdRegistrations: 965, sourceName: "KAIDA 발표 · 한국경제 게재", sourceUrl: kaidaPublishedRelease },
  { id: "scania", name: "스카니아", origin: "수입", augustRegistrations: 58, ytdRegistrations: 509, sourceName: "KAIDA 발표 · 한국경제 게재", sourceUrl: kaidaPublishedRelease },
  { id: "man", name: "MAN", origin: "수입", augustRegistrations: 41, ytdRegistrations: 522, sourceName: "KAIDA 발표 · 한국경제 게재", sourceUrl: kaidaPublishedRelease },
  { id: "mercedes-benz", name: "메르세데스-벤츠", origin: "수입", augustRegistrations: 26, ytdRegistrations: 308, sourceName: "KAIDA 발표 · 한국경제 게재", sourceUrl: kaidaPublishedRelease },
  { id: "mercedes-benz-van", name: "메르세데스-벤츠 밴", origin: "수입", augustRegistrations: 9, ytdRegistrations: 105, sourceName: "KAIDA 발표 · 한국경제 게재", sourceUrl: kaidaPublishedRelease },
  { id: "iveco", name: "이베코", origin: "수입", augustRegistrations: 8, ytdRegistrations: 83, sourceName: "KAIDA 발표 · 한국경제 게재", sourceUrl: kaidaPublishedRelease },
];

export const verifiedImportedManufacturers = manufacturers.filter(
  (maker): maker is Manufacturer & { augustRegistrations: number; ytdRegistrations: number } =>
    maker.origin === "수입" && maker.augustRegistrations !== null && maker.ytdRegistrations !== null,
);

export const verifiedDomesticSales = manufacturers.filter(
  (maker): maker is Manufacturer & { augustDomesticSales: number; ytdDomesticSales: number } =>
    maker.origin === "국내" && maker.augustDomesticSales !== undefined && maker.ytdDomesticSales !== undefined,
);
