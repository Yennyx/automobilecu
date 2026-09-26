export type Manufacturer = {
  id: string;
  name: string;
  origin: "국내" | "수입";
  augustRegistrations: number | null;
  ytdRegistrations: number | null;
  sourceName: string;
  sourceUrl: string;
};

// KAIDA's 2026-08 announcement counts imported commercial vehicles by brand.
// Domestic makers are selectable, but no like-for-like public registration
// breakdown has been verified; null must never be rendered as zero.
export const manufacturerPeriod = "2026.08";
export const kaidaAnnouncement = "https://www.kaida.co.kr/ko/kaida/bbsList.do?boardSeq=15&bbsType=kaida";
export const kaidaPublishedRelease = "https://www.hankyung.com/article/202609080912P";
export const kamaStatistics = "https://www.kama.or.kr/NewsController?boardmaster_id=Produce&cmd=L&menunum=0003&pagenum=1";

export const manufacturers: Manufacturer[] = [
  { id: "hyundai", name: "현대자동차", origin: "국내", augustRegistrations: null, ytdRegistrations: null, sourceName: "KAMA 생산판매통계", sourceUrl: kamaStatistics },
  { id: "kia", name: "기아", origin: "국내", augustRegistrations: null, ytdRegistrations: null, sourceName: "KAMA 생산판매통계", sourceUrl: kamaStatistics },
  { id: "tata-daewoo", name: "타타대우모빌리티", origin: "국내", augustRegistrations: null, ytdRegistrations: null, sourceName: "KAMA 생산판매통계", sourceUrl: kamaStatistics },
  { id: "daewoo-bus", name: "대우버스", origin: "국내", augustRegistrations: null, ytdRegistrations: null, sourceName: "KAMA 생산판매통계", sourceUrl: kamaStatistics },
  { id: "kgm", name: "KG모빌리티", origin: "국내", augustRegistrations: null, ytdRegistrations: null, sourceName: "KAMA 생산판매통계", sourceUrl: kamaStatistics },
  { id: "gm-korea", name: "한국GM", origin: "국내", augustRegistrations: null, ytdRegistrations: null, sourceName: "KAMA 생산판매통계", sourceUrl: kamaStatistics },
  { id: "renault-korea", name: "르노코리아", origin: "국내", augustRegistrations: null, ytdRegistrations: null, sourceName: "KAMA 생산판매통계", sourceUrl: kamaStatistics },
  { id: "volvo-trucks", name: "볼보트럭", origin: "수입", augustRegistrations: 79, ytdRegistrations: 965, sourceName: "KAIDA 2026년 8월 발표", sourceUrl: kaidaPublishedRelease },
  { id: "scania", name: "스카니아", origin: "수입", augustRegistrations: 58, ytdRegistrations: 509, sourceName: "KAIDA 2026년 8월 발표", sourceUrl: kaidaPublishedRelease },
  { id: "man", name: "MAN", origin: "수입", augustRegistrations: 41, ytdRegistrations: 522, sourceName: "KAIDA 2026년 8월 발표", sourceUrl: kaidaPublishedRelease },
  { id: "mercedes-benz", name: "메르세데스-벤츠", origin: "수입", augustRegistrations: 26, ytdRegistrations: 308, sourceName: "KAIDA 2026년 8월 발표", sourceUrl: kaidaPublishedRelease },
  { id: "mercedes-benz-van", name: "메르세데스-벤츠 밴", origin: "수입", augustRegistrations: 9, ytdRegistrations: 105, sourceName: "KAIDA 2026년 8월 발표", sourceUrl: kaidaPublishedRelease },
  { id: "iveco", name: "이베코", origin: "수입", augustRegistrations: 8, ytdRegistrations: 83, sourceName: "KAIDA 2026년 8월 발표", sourceUrl: kaidaPublishedRelease },
];

export const verifiedImportedManufacturers = manufacturers.filter(
  (maker): maker is Manufacturer & { augustRegistrations: number; ytdRegistrations: number } =>
    maker.origin === "수입" && maker.augustRegistrations !== null && maker.ytdRegistrations !== null,
);
