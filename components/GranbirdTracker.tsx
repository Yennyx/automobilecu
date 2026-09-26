"use client";

import { CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SourceBadge } from "./SourceBadge";

export type GranbirdObservation = { period: string; registrations: number | null; hydrogenCoveragePct: number | null; replacementCycleYears: number | null };

export function GranbirdTracker({ observations = [] }: { observations?: GranbirdObservation[] }) {
  const ready = observations.length > 1 && observations.every(row => row.registrations !== null && row.hydrogenCoveragePct !== null);
  return <div className="card granbird-tracker"><div className="extended-head"><div><span className="eyebrow">GRANBIRD TRACKER</span><h3>그랜버드 등록 × 수소 인프라</h3><p>좌축 등록 대수 · 우축 버스 이용 가능 수소충전소 구축률</p></div><span className="status-pending">지표 검증 대기</span></div>{ready ? <div className="chart-wrap large"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={observations}><CartesianGrid stroke="#e8edf4" strokeDasharray="4 4"/><XAxis dataKey="period"/><YAxis yAxisId="registrations" unit="대"/><YAxis yAxisId="coverage" orientation="right" unit="%" domain={[0,100]}/><Tooltip/><Legend/><Line yAxisId="registrations" dataKey="registrations" name="그랜버드 등록" stroke="#4469e8" strokeWidth={2}/><Line yAxisId="coverage" dataKey="hydrogenCoveragePct" name="수소 인프라 구축률" stroke="#26ad94" strokeWidth={2}/></ComposedChart></ResponsiveContainer></div> : <div className="tracker-empty"><div className="tracker-axis left">등록 대수</div><div className="tracker-axis right">구축률 %</div><div><strong>비교 가능한 공식 시계열이 아직 없습니다</strong><p>그랜버드 모델별 등록 자료와 ‘버스 이용 가능 수소충전소’의 지역·분모 정의를 확보하면 이중 축 차트를 표시합니다.</p></div></div>}<div className="tracker-sources"><SourceBadge sourceId="molit"/><SourceBadge sourceId="kia"/><span className="tracker-note">교체 주기: 별도 검증 후 보조 지표로 표시</span></div></div>;
}
