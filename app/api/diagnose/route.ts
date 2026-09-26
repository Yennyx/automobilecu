import { NextResponse } from "next/server";
import { diagnose } from "@/lib/diagnosis";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "올바른 JSON이 필요합니다." }, { status: 400 }); }
  const year = Number(body.year);
  const mileage = Number(body.mileage);
  const faultCount = Number(body.faultCount);
  const firmwareAge = Number(body.firmwareAge);
  const aftertreatmentAlert = body.aftertreatmentAlert === true;
  const currentYear = new Date().getFullYear();
  if (![year, mileage, faultCount, firmwareAge].every(Number.isInteger) || year < 1990 || year > currentYear || mileage < 0 || mileage > 3000000 || faultCount < 0 || faultCount > 100 || firmwareAge < 0 || firmwareAge > 30) {
    return NextResponse.json({ error: "입력 범위를 확인해 주세요." }, { status: 400 });
  }
  return NextResponse.json(diagnose({ year, mileage, faultCount, firmwareAge, aftertreatmentAlert }));
}
