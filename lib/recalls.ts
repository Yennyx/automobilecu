export type RecallNotice = {
  id: string;
  manufacturer: string;
  model: string;
  ecuPartNumber: string | null;
  productionStart: string | null;
  productionEnd: string | null;
  sourceName: string;
  sourceUrl: string;
  verified: boolean;
};

export type RecallQuery = { manufacturer: string; model: string; ecuPartNumber: string; productionDate: string };

export function matchVerifiedRecalls(query: RecallQuery, notices: RecallNotice[]): RecallNotice[] {
  const required = [query.manufacturer, query.model, query.ecuPartNumber, query.productionDate];
  if (required.some(value => !value.trim())) return [];
  const normalized = (value: string) => value.trim().toLocaleLowerCase();
  return notices.filter(notice =>
    notice.verified &&
    normalized(notice.manufacturer) === normalized(query.manufacturer) &&
    normalized(notice.model) === normalized(query.model) &&
    notice.ecuPartNumber !== null && normalized(notice.ecuPartNumber) === normalized(query.ecuPartNumber) &&
    (!notice.productionStart || query.productionDate >= notice.productionStart) &&
    (!notice.productionEnd || query.productionDate <= notice.productionEnd) &&
    notice.sourceUrl.startsWith("https://")
  );
}
