/**
 * Commercial ECU Intelligence - Google Apps Script
 *
 * Sheet: first row = timestamp | email
 * Deploy as Web App.
 */

const SHEET_NAME = "subscribers";

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    const email = String(body.email || "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return json({ok:false, message:"유효한 이메일을 입력해 주세요."});
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["timestamp", "email"]);
    }

    const values = sheet.getRange(2, 2, Math.max(sheet.getLastRow()-1, 1), 1).getValues().flat();
    if (!values.includes(email)) {
      sheet.appendRow([new Date(), email]);
      // 구독 확인 메일
      MailApp.sendEmail({
        to: email,
        subject: "상용차 ECU Intelligence 구독 완료",
        htmlBody: "<p>상용차 판매·등록 및 ECU 수리 인사이트 리포트 구독이 완료되었습니다.</p>"
      });
    }

    return json({ok:true, message:"구독이 완료되었습니다."});
  } catch (err) {
    return json({ok:false, message:"서버 처리 오류: " + err.message});
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 매주 월요일 아침 등 원하는 주기로 실행되도록 시간 기반 트리거를 등록합니다.
 * 실제 리포트 본문은 아래 template을 수정하면 됩니다.
 */
function sendWeeklyBrief() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return;

  const emails = sheet.getRange(2, 2, sheet.getLastRow()-1, 1).getValues()
    .flat()
    .filter(Boolean);

  const subject = "이번 주 상용차 ECU 시장 브리핑";
  const html = `
    <h2>Commercial ECU Intelligence</h2>
    <p>이번 주 시장 데이터와 ECU 수리 인사이트를 확인하세요.</p>
    <p>웹사이트의 최신 대시보드에서 판매·등록·미래차 전환 및 수리사례를 확인할 수 있습니다.</p>
  `;

  emails.forEach(email => {
    MailApp.sendEmail({to: email, subject, htmlBody: html});
  });
}
