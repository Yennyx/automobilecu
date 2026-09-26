import { NextResponse } from "next/server";
import { matchVerifiedRecalls, type RecallQuery } from "@/lib/recalls";

export async function POST(request: Request) {
  let body: Partial<RecallQuery>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "올바른 JSON이 필요합니다." }, { status: 400 }); }
  const query: RecallQuery = {
    manufacturer: String(body.manufacturer || ""),
    model: String(body.model || ""),
    ecuPartNumber: String(body.ecuPartNumber || ""),
    productionDate: String(body.productionDate || ""),
  };
  if (Object.values(query).some(value => !value.trim()) || !/^\d{4}-\d{2}-\d{2}$/.test(query.productionDate)) {
    return NextResponse.json({ error: "제조사, 모델, ECU 부품번호, 생산일이 필요합니다." }, { status: 400 });
  }
  // No verified notices have been imported. Returning zero matches here would
  // falsely imply a completed search, so the route exposes source readiness.
  const notices = null as null | Parameters<typeof matchVerifiedRecalls>[1];
  if (notices === null) return NextResponse.json({ status: "source_unavailable", matches: null, riskIndex: null, message: "검증된 리콜 원천이 아직 연결되지 않았습니다." }, { status: 503 });
  return NextResponse.json({ status: "matched", matches: matchVerifiedRecalls(query, notices), riskIndex: null });
}
