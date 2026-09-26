"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import {
  kaidaAnnouncement, kamaStatistics, manufacturerPeriod, manufacturers,
  ministryAugustReport, verifiedDomesticSales, verifiedImportedManufacturers,
} from "@/lib/manufacturer-data";

const augustImportTotal = verifiedImportedManufacturers.reduce((sum, maker) => sum + maker.augustRegistrations, 0);
const ytdImportTotal = verifiedImportedManufacturers.reduce((sum, maker) => sum + maker.ytdRegistrations, 0);
const maxDomesticSales = Math.max(...verifiedDomesticSales.map(maker => maker.augustDomesticSales));
const maxImportRegistrations = Math.max(...verifiedImportedManufacturers.map(maker => maker.augustRegistrations));

export function ManufacturerExplorer() {
  const [selected, setSelected] = useState("all");
  const maker = manufacturers.find(item => item.id === selected);

  return <section className="card manufacturer-explorer" aria-label="제조사별 자동차 통계">
    <div className="extended-head">
      <div><span className="eyebrow">MANUFACTURER VIEW</span><h3>제조사별 자동차 지표</h3><p>국내 업체와 수입 상용차 브랜드의 공개 실적을 각각의 집계 기준으로 확인합니다.</p></div>
      <span className="manufacturer-period">{manufacturerPeriod} 기준</span>
    </div>
    <div className="manufacturer-controls">
      <label htmlFor="manufacturer-select">자동차 업체</label>
      <select id="manufacturer-select" value={selected} onChange={event => setSelected(event.target.value)}>
        <option value="all">전체 업체 보기</option>
        <optgroup label="국내 업체 · 전체 차종 국내 판매">
          {manufacturers.filter(item => item.origin === "국내").map(item => <option value={item.id} key={item.id}>{item.name}{item.augustDomesticSales !== undefined ? ` · ${item.augustDomesticSales.toLocaleString()}대` : " · 공개 월간 수치 없음"}</option>)}
        </optgroup>
        <optgroup label="수입 상용차 · 신규등록">
          {verifiedImportedManufacturers.map(item => <option value={item.id} key={item.id}>{item.name} · {item.augustRegistrations.toLocaleString()}대</option>)}
        </optgroup>
      </select>
    </div>
    {maker ? <div className="manufacturer-detail">
      <div>
        <span className="manufacturer-origin">{maker.origin} 업체 · {maker.origin === "수입" ? "상용차 신규등록" : "전체 차종 국내 판매"}</span>
        <h4>{maker.name}</h4>
        <p>{maker.augustRegistrations !== null
          ? "KAIDA가 발표한 수입 상용차 신규등록 실적입니다."
          : maker.augustDomesticSales !== undefined
            ? "산업통상부가 발표한 전체 차종의 국내 판매량입니다. 상용차 신규등록 대수가 아닙니다."
            : "2026년 8월 공개 월간 자료에서 이 업체의 검증 가능한 수치를 찾지 못했습니다. 0대를 뜻하지 않습니다."}</p>
      </div>
      {(maker.augustRegistrations !== null || maker.augustDomesticSales !== undefined) && <div className="manufacturer-numbers">
        <div><span>{maker.origin === "수입" ? "8월 신규등록" : "8월 국내 판매 · 전체 차종"}</span><strong>{(maker.augustRegistrations ?? maker.augustDomesticSales)?.toLocaleString()}대</strong></div>
        <div><span>{maker.origin === "수입" ? "1~8월 신규등록 누계" : "1~8월 국내 판매 누계"}</span><strong>{(maker.ytdRegistrations ?? maker.ytdDomesticSales)?.toLocaleString()}대</strong></div>
      </div>}
      <a className="manufacturer-source" href={maker.sourceUrl} target="_blank" rel="noreferrer">출처 · {maker.sourceName} <ExternalLink size={14}/></a>
      {maker.origin === "국내" && <p className="manufacturer-note">국내 업체별 상용차 신규등록은 <a href={kamaStatistics} target="_blank" rel="noreferrer">KAMA 자동차등록통계월보 NR2·NR3</a>에 별도로 수록됩니다. 현재 원본 접근 권한이 없어 등록 수치로 표시하지 않습니다.</p>}
      {maker.id === "kia" && <p className="manufacturer-note">기아 전체 판매량을 그랜버드 모델 실적으로 대체하지 않습니다.</p>}
    </div> : <>
      <div className="manufacturer-group-head"><div><strong>국내 업체</strong><span>전체 차종 국내 판매 · 등록 대수 아님</span></div><a href={ministryAugustReport} target="_blank" rel="noreferrer">산업통상부 원문 <ExternalLink size={13}/></a></div>
      <div className="manufacturer-bars">
        {[...verifiedDomesticSales].sort((a, b) => b.augustDomesticSales - a.augustDomesticSales).map(item => <button key={item.id} type="button" onClick={() => setSelected(item.id)} className="manufacturer-bar"><span>{item.name}</span><span className="manufacturer-track"><span style={{ width: `${item.augustDomesticSales / maxDomesticSales * 100}%` }} /></span><strong>{item.augustDomesticSales.toLocaleString()}대</strong></button>)}
      </div>
      <button type="button" className="manufacturer-missing" onClick={() => setSelected("daewoo-bus")}>대우버스 · 검증 가능한 공개 월간 수치 없음 →</button>
      <div className="manufacturer-group-head"><div><strong>수입 상용차 브랜드</strong><span>국내 신규등록 · KAIDA 집계 범위</span></div><a href={kaidaAnnouncement} target="_blank" rel="noreferrer">KAIDA 발표 목록 <ExternalLink size={13}/></a></div>
      <div className="manufacturer-summary"><div><span>8월 수입 6개 브랜드 신규등록</span><strong>{augustImportTotal.toLocaleString()}<small>대</small></strong></div><div><span>1~8월 신규등록 누계</span><strong>{ytdImportTotal.toLocaleString()}<small>대</small></strong></div></div>
      <div className="manufacturer-bars">
        {verifiedImportedManufacturers.map(item => <button key={item.id} type="button" onClick={() => setSelected(item.id)} className="manufacturer-bar"><span>{item.name}</span><span className="manufacturer-track"><span style={{ width: `${item.augustRegistrations / maxImportRegistrations * 100}%` }} /></span><strong>{item.augustRegistrations.toLocaleString()}대</strong></button>)}
      </div>
    </>}
    <p className="manufacturer-footnote">2026년 8월 기준. 국내 6개 업체 수치는 산업통상부의 전체 차종 국내 판매 잠정치로 OEM 수입차가 포함될 수 있습니다. 수입 6개 브랜드 수치는 KAIDA 상용차 신규등록입니다. 두 지표는 합산·직접 비교하지 않습니다. 국내 업체별 상용차 등록 원본은 KAMA 유료 자료입니다.</p>
  </section>;
}
