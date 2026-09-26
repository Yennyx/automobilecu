import Link from "next/link";

export default function Methodology() {
  return <main className="methodology-page"><Link href="/">← 대시보드로 돌아가기</Link><h1>데이터 출처와 방법</h1><p>현재 화면의 2025 월별 차량 수치는 기능 시연을 위해 코드에 작성한 가상 시계열입니다. 실제 등록·판매·재고 통계를 나타내지 않으며, 통계 추정에도 사용할 수 없습니다.</p><p>ECU 점수는 입력된 연식, 주행거리, 활성 DTC 개수, 펌웨어 업데이트 경과, 후처리 경고에 고정 가중치를 적용합니다. 수명·고장 확률·리콜 위험의 검증된 예측이 아닙니다.</p><p>각 외부 원천의 출처 URL은 화면의 출처 뱃지에 표시합니다. 원천 공개일, 수집일, 적용 차종, 지표 분모가 검증된 데이터만 실측값으로 전환합니다.</p></main>;
}
