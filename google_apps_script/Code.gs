/**
 * Commercial ECU Intelligence - Google Apps Script backend
 *
 * Google Sheets tabs:
 * subscribers: timestamp | email
 * ecu_cases: case_id | date | manufacturer | vehicle_model | ... (same columns as data/ecu_cases.csv)
 * market_monthly: month | segment | metric | value | unit | source | source_url | definition | verified
 *
 * Deploy:
 * Deploy > New deployment > Web app
 * Execute as: Me
 * Who has access: Anyone
 *
 * IMPORTANT:
 * - Do not put customer names, phone numbers, VINs, plate numbers, or other PII into public sheets.
 * - For the public GET endpoint, only return rows you are comfortable exposing.
 */

const SPREADSHEET_ID = ""; // same spreadsheet if script is bound; otherwise set ID
const ECU_SHEET = "ecu_cases";
const MARKET_SHEET = "market_monthly";
const SUBSCRIBER_SHEET = "subscribers";

function ss_() {
  return SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
}

function doGet(e) {
  const type = (e && e.parameter && e.parameter.type) || "health";
  if (type === "cases") return json_(publicRows_(ECU_SHEET));
  if (type === "market") return json_(publicRows_(MARKET_SHEET));
  return json_({ok:true, service:"Commercial ECU Intelligence", time:new Date().toISOString()});
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    const email = String(body.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) return json_({ok:false,message:"유효한 이메일을 입력해 주세요."});

    const sheet = sheet_(SUBSCRIBER_SHEET, ["timestamp","email"]);
    const existing = sheet.getLastRow() > 1
      ? sheet.getRange(2,2,sheet.getLastRow()-1,1).getValues().flat().map(String)
      : [];
    if (!existing.includes(email)) {
      sheet.appendRow([new Date(), email]);
      MailApp.sendEmail({
        to: email,
        subject: "상용차 ECU Intelligence 구독 완료",
        htmlBody: "<p>상용차 시장·ECU 인사이트 리포트 구독이 완료되었습니다.</p>"
      });
    }
    return json_({ok:true,message:"구독이 완료되었습니다."});
  } catch (err) {
    return json_({ok:false,message:String(err)});
  }
}

function publicRows_(name) {
  const s = ss_().getSheetByName(name);
  if (!s || s.getLastRow() < 2) return [];
  const values = s.getDataRange().getDisplayValues();
  const headers = values.shift();
  return values.filter(r => r.join("").trim()).map(r => {
    const o = {};
    headers.forEach((h,i) => o[h] = r[i]);
    return o;
  });
}

function sheet_(name, headers) {
  const s = ss_().getSheetByName(name) || ss_().insertSheet(name);
  if (s.getLastRow() === 0) s.appendRow(headers);
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
