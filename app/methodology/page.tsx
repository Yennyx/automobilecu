import Link from "next/link";
import { monthly, sourcePage } from "@/lib/market-data";

export default function Methodology() {
  return <main className="methodology-page"><Link href="/">← 대시보드로 돌아가기</Link><h1>데이터 출처와 산출 방법</h1>
    <p>등록 수치는 국토교통부 통계누리의 <a href={sourcePage} target="_blank" rel="noreferrer">자동차등록현황보고</a> 월별 원본 XLSX에서 추출했습니다. 기준 기간은 2026년 1~8월, 확인일은 2026년 9월 26일입니다. 각 월의 ‘20.신규 등록현황(당월)’ 시트에서 전국 ‘총계’ 행의 승합·화물·특수 열을 읽었습니다.</p>
    <p>‘전체’는 세 분류의 합계이며 승용차를 포함하지 않습니다. 월별 합계와 전국 전체 등록 총계를 교차 검산했습니다. 8월 말 화물 덤프형 등록 잔존대수는 8월 원본 ‘09.차종별_유형별 현황’ 시트의 전국 계 51,632대입니다. 신규 등록과 잔존대수, 등록과 판매는 서로 다른 지표입니다.</p>
    <p>각 월의 원본: {monthly.map((row, index) => <span key={row.period}><a href={row.sourceUrl} target="_blank" rel="noreferrer">{row.period} XLSX</a>{index < monthly.length - 1 ? " · " : ""}</span>)}. 원본 파일의 SHA-256 해시는 <a href="https://github.com/Yennyx/automobilecu/blob/main/data/official-molit-2026.json" target="_blank" rel="noreferrer">데이터 기록</a>에 보존했습니다.</p>
    <p>그랜버드 모델별 실적, 믹서 등록, ECU 잔여 수명, 리콜 위험 점수, 수소충전소 구축률은 공식 자료와 비교 가능한 지표 정의가 확보되지 않아 수치를 표시하지 않습니다.</p>
  </main>;
}
