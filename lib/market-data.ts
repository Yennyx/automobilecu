import rows from "@/data/official-molit-2026.json";

export type Segment = "전체" | "승합" | "화물" | "특수";
export const segments: Segment[] = ["전체", "승합", "화물", "특수"];
export const monthly = rows;
export const stock = { period: "2026.08", busClass: 614882, freight: 3687904, special: 149412, dump: 51632 };
export const sourcePage = "https://stat.molit.go.kr/portal/cate/statMetaView.do?hFormId=1244&hRsId=58";

export function countFor(row: typeof rows[number], segment: Segment) {
  if (segment === "승합") return row.busClass;
  if (segment === "화물") return row.freight;
  if (segment === "특수") return row.special;
  return row.busClass + row.freight + row.special;
}
