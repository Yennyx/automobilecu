# Google Apps Script 연결

## 1. Google Sheet 생성
탭을 다음처럼 만듭니다.

- `subscribers`
- `ecu_cases`
- `market_monthly`

각 탭의 첫 행은 CSV 템플릿의 헤더와 동일하게 둡니다.

## 2. Apps Script
Google Sheet > 확장 프로그램 > Apps Script에서 `Code.gs`를 붙여넣습니다.

## 3. 웹 앱 배포
Deploy > New deployment > Web app

- Execute as: Me
- Who has access: Anyone

배포 URL을 복사합니다.

## 4. 사이트 연결
`app.js`의 `APPS_SCRIPT_ENDPOINT`에 URL을 넣습니다.

## 5. 주의
공개 API에 고객 이름, 전화번호, 차량번호, VIN 등 개인정보를 넣지 마세요.
실제 사례를 공개할 때는 회사명/고객명/차량식별정보를 익명화하고, 공개 가능한 수준의 데이터만 `ecu_cases`에 넣습니다.
