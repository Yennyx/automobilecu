# 상용차 ECU Intelligence 운영·배포 매뉴얼

## 먼저: 비용

### 추천 구성
- Cloudflare Pages Free: 정적 웹사이트 호스팅
- GitHub Free: 소스 관리/자동 배포 연결
- Google Sheets: 수리사례·시장데이터 관리
- Google Apps Script: 이메일 구독 + 공개 데이터 API
- 기본 도메인: 무료
- 자체 `.com/.kr` 도메인: 별도 도메인 등록비

Cloudflare Pages의 현재 Free 한도에는 월 500회 빌드, 사이트당 최대 20,000개 파일, 정적 asset 요청 무료 등이 있습니다.
이 프로젝트처럼 정적 사이트 + 작은 데이터 API에는 충분합니다.

단, Cloudflare 전체 Free 플랜 안내에는 'personal or hobby projects' 문구가 있으므로, 실제 영리사업의 핵심 운영 사이트로 장기간 사용할 때는 약관/요금제를 확인하세요.
또한 Vercel Hobby는 현재 약관상 personal/non-commercial 용도이므로 사업용 사이트에는 Hobby를 권장하지 않습니다.

## A. 가장 먼저 배포

### 1. GitHub Repository 생성
예:
commercial-ecu-intelligence

### 2. ZIP 압축 해제
이 폴더 안의 파일을 Repository 루트에 업로드합니다.
`index.html`이 최상위에 있어야 합니다.

### 3. Cloudflare Pages
Cloudflare Dashboard > Workers & Pages > Create > Pages > Connect to Git

GitHub Repository 선택.

Build command:
비워둠

Build output directory:
`.`

저장/배포.

그러면 `*.pages.dev` 주소가 생성됩니다.

### 4. 테스트
다음이 모두 보이는지 확인:
- 메인 대시보드
- 시장 데이터
- 그랜버드
- 미래차 로드맵
- ECU 수리사례
- 이메일 구독

## B. 실제 ECU 데이터 연결

### 1. Google Sheet 생성
탭:
- subscribers
- ecu_cases
- market_monthly

### 2. ecu_cases
`data/ecu_cases.csv`의 헤더를 그대로 첫 행에 넣습니다.

중요:
공개 데이터에는 다음을 넣지 않습니다.
- 고객 이름
- 전화번호
- 차량번호
- VIN
- 주소
- 사진 속 개인정보
- 업체가 공개를 허용하지 않은 정보

### 3. market_monthly
`data/market_monthly.csv` 헤더 사용.

### 4. Apps Script
Google Sheet > 확장 프로그램 > Apps Script

`google_apps_script/Code.gs` 붙여넣기.

### 5. 배포
Deploy > New deployment > Web app
- Execute as: Me
- Who has access: Anyone

URL 복사.

### 6. app.js 연결
다음 줄을 수정:

const APPS_SCRIPT_ENDPOINT = "여기에_URL";

GitHub에 commit/push.

Cloudflare Pages가 자동 재배포합니다.

## C. 이메일 구독

Apps Script URL을 연결한 뒤 사이트에서 테스트 이메일을 입력합니다.

Google Sheet `subscribers`에 들어오고 구독확인 메일이 발송되면 성공.

무료 Gmail 계정 기준 MailApp 이메일 수신자는 현재 1일 100명 수준의 quota가 있으므로 소규모 뉴스레터에 적합합니다.
구독자가 커지면 전문 이메일 서비스로 이전합니다.

## D. 매주 운영 루틴

월요일:
1. 국토부 등록대수 확인
2. KAMA 판매/생산 월보 확인
3. 산업부 자동차산업 동향 확인
4. 기아 IR 확인
5. 그랜버드/대형버스 시장 신호 확인
6. 친환경 상용차 뉴스 확인

화~금:
7. 실제 ECU 수리사례 입력
8. DTC/증상/원인/수리방법 기록
9. 사진·파형·CAN 로그 등 증거자료 별도 보관
10. 개인정보 제거

금요일:
11. 이번 주 수리건수
12. ECU별 수리건수
13. 차종별 수리건수
14. DTC별 수리건수
15. 반복고장 패턴
16. 다음 주 주목 ECU

## E. 매월 공개할 KPI

- 공개 가능한 수리사례 수
- 차종 수
- ECU 종류 수
- 제조사 수
- DTC 종류 수
- 수리 성공률
- 재발률
- 평균 처리시간
- 월간 신규 사례
- 반복 고장 TOP 10

단순히 "몇 건 고쳤다"보다
`차량 → ECU → 증상 → DTC → 원인 → 수리 → 결과`
가 연결된 사례 수를 핵심 지표로 삼습니다.

## F. 신용보증기금용 페이지

사이트에 `/business` 페이지를 추가할 때 다음 구조를 권장합니다.

1. 시장성
2. 타깃 고객
3. 기술 전문성
4. 실제 수리 데이터
5. 차별화된 진단 프로세스
6. 미래차 대응
7. 매출/수익모델
8. 시설·장비 투자계획
9. 향후 3년 기술개발 계획

## G. 3년 기술 준비

### 2026~2027
CAN / UDS / 회로분석 / 오실로스코프 / ECU 반도체 / Engine ECU / TCU / ABS-EBS / DPF-SCR

### 2027~2029
BMS / VCU / Inverter / MCU / OBC / DC-DC / HV 안전 / 열관리

### 2028+
DoIP / Automotive Ethernet / Firmware / Secure Boot / Software Update / Cybersecurity

## H. 데이터 자산 보호

GitHub에는 공개용 집계 데이터만 올리고,
원본 ECU 수리자료는 별도 비공개 저장소/Google Drive/사내 저장공간 등에 보관합니다.

공개 사이트:
- 익명화
- 집계
- 기술 인사이트

비공개 원본:
- 고객/차량 식별정보
- ECU 원본 dump
- 사진 원본
- 로그
- 작업지시서
- 영업정보

## I. 나중에 고도화

1. Google Sheets
2. Cloudflare D1
3. 관리자 로그인
4. 수리사례 검색
5. ECU Part No 검색
6. DTC 검색
7. 차종별 고장패턴
8. 월별 시장 그래프
9. 자동 리포트 PDF
10. 이메일 자동 발송
11. 진단 지식 Graph DB
12. 내부용 GraphRAG

처음부터 DB 서버를 크게 만들 필요 없습니다.
실제 데이터가 쌓인 뒤 D1/PostgreSQL/Neo4j로 단계적으로 이동합니다.
