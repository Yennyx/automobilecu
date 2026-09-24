const APPS_SCRIPT_ENDPOINT = ""; // Google Apps Script Web App URL
const state = { cases: [], market: [] };

const $ = (s) => document.querySelector(s);

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

async function loadData() {
  try {
    if (APPS_SCRIPT_ENDPOINT) {
      const [cases, market] = await Promise.all([
        fetchJson(APPS_SCRIPT_ENDPOINT + "?type=cases"),
        fetchJson(APPS_SCRIPT_ENDPOINT + "?type=market")
      ]);
      state.cases = cases;
      state.market = market;
    }
  } catch (e) {
    console.warn("Backend unavailable; showing local market/source content.", e);
  }
  renderCases();
  renderCaseInsights();
}

function renderCases() {
  const total = state.cases.length;
  const success = state.cases.filter(x => String(x.success).toLowerCase() === "true").length;
  const recur = state.cases.filter(x => String(x.recurred).toLowerCase() === "true").length;
  const successRate = total ? Math.round(success / total * 100) : 0;

  const el = $("#caseMetrics");
  if (!el) return;
  el.innerHTML = `
    <div><small>공개 수리사례</small><b>${total.toLocaleString()}건</b></div>
    <div><small>수리 성공률</small><b>${total ? successRate + "%" : "—"}</b></div>
    <div><small>재발 사례</small><b>${total ? recur.toLocaleString() + "건" : "—"}</b></div>
    <div><small>데이터 상태</small><b>${APPS_SCRIPT_ENDPOINT ? "LIVE" : "연결 전"}</b></div>`;
}

function renderCaseInsights() {
  const el = $("#caseInsights");
  if (!el) return;
  if (!state.cases.length) {
    el.innerHTML = `<div class="empty">아직 공개 수리사례가 연결되지 않았습니다.<br>Google Sheet의 <strong>ecu_cases</strong> 탭에 데이터를 넣으면 자동으로 반영됩니다.</div>`;
    return;
  }

  const count = (key) => state.cases.reduce((m,x) => {
    const v = x[key] || "미분류";
    m[v] = (m[v] || 0) + 1;
    return m;
  }, {});

  const ecu = Object.entries(count("ecu_name")).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const model = Object.entries(count("vehicle_model")).sort((a,b)=>b[1]-a[1]).slice(0,8);

  el.innerHTML = `
    <div class="insight-block">
      <h3>수리사례 상위 ECU</h3>
      ${ecu.map(([k,v]) => `<div class="rank"><span>${escapeHtml(k)}</span><b>${v}</b></div>`).join("")}
    </div>
    <div class="insight-block">
      <h3>수리사례 상위 차종</h3>
      ${model.map(([k,v]) => `<div class="rank"><span>${escapeHtml(k)}</span><b>${v}</b></div>`).join("")}
    </div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

// Browser-only CSV preview: useful before putting real data into Google Sheets.
$("#csvFile")?.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const text = await file.text();
  const rows = parseCSV(text);
  $("#csvPreview").textContent = `${file.name}: ${Math.max(rows.length - 1, 0).toLocaleString()}건 감지됨`;
});

function parseCSV(text) {
  return text.trim().split(/\r?\n/).map(line => {
    const out = []; let cur = "", quote = false;
    for (let i=0;i<line.length;i++) {
      const ch=line[i];
      if(ch === '"') {
        if(quote && line[i+1] === '"'){cur+='"';i++;}
        else quote=!quote;
      } else if(ch === "," && !quote){out.push(cur);cur="";}
      else cur+=ch;
    }
    out.push(cur);
    return out;
  });
}

$("#newsletterForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = $("#email").value.trim();
  const msg = $("#formMsg");
  if (!APPS_SCRIPT_ENDPOINT) {
    msg.textContent = "아직 메일 서버가 연결되지 않았습니다. Apps Script 배포 URL을 app.js에 넣어주세요.";
    return;
  }
  try {
    const res = await fetch(APPS_SCRIPT_ENDPOINT, {
      method: "POST",
      headers: {"Content-Type":"text/plain;charset=utf-8"},
      body: JSON.stringify({email})
    });
    const data = await res.json();
    msg.textContent = data.message || "구독 완료";
  } catch (e) {
    msg.textContent = "구독 처리 중 오류가 발생했습니다.";
  }
});

loadData();
