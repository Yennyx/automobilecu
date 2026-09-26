export type DiagnosisInput = { year: number; mileage: number; faultCount: number; firmwareAge: number; aftertreatmentAlert: boolean };

export function diagnose(input: DiagnosisInput) {
  const age = Math.max(0, new Date().getFullYear() - input.year);
  const mileagePenalty = Math.min(22, Math.floor(input.mileage / 30000) * 2);
  const faultPenalty = Math.min(24, input.faultCount * 6);
  const agePenalty = Math.min(15, age * 1.5);
  const firmwarePenalty = Math.min(10, input.firmwareAge * 2);
  const alertPenalty = input.aftertreatmentAlert ? 12 : 0;
  const score = Math.max(15, Math.round(100 - mileagePenalty - faultPenalty - agePenalty - firmwarePenalty - alertPenalty));
  const band = score >= 80 ? "양호" : score >= 60 ? "점검 권장" : "우선 점검";
  const actions = [
    ...(input.faultCount > 0 ? ["활성 DTC 원문과 발생 시점을 확인하세요."] : []),
    ...(input.aftertreatmentAlert ? ["DPF·SCR 계통의 센서값과 재생 이력을 점검하세요."] : []),
    ...(input.firmwareAge >= 3 ? ["제조사 서비스 채널에서 적용 가능한 펌웨어를 확인하세요."] : []),
    "제조사 진단기로 실측 데이터를 확인한 뒤 정비를 결정하세요.",
  ];
  return { score, band, actions, factors: { mileagePenalty, faultPenalty, agePenalty, firmwarePenalty, alertPenalty }, method: "설명 가능한 규칙 기반 데모. 수명·고장 확률 예측이나 정비 판정이 아닙니다." };
}
