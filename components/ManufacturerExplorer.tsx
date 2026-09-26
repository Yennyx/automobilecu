"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { kaidaAnnouncement, kamaStatistics, manufacturerPeriod, manufacturers, verifiedImportedManufacturers } from "@/lib/manufacturer-data";

const augustTotal = verifiedImportedManufacturers.reduce((sum, maker) => sum + maker.augustRegistrations, 0);
const ytdTotal = verifiedImportedManufacturers.reduce((sum, maker) => sum + maker.ytdRegistrations, 0);

export function ManufacturerExplorer() {
  const [selected, setSelected] = useState("all");
  const maker = manufacturers.find(item => item.id === selected);

  return <section className="card manufacturer-explorer" aria-label="제조사별 상용차 통계">
    <div className="extended-head"><div><span className="eyebrow">MANUFACTURER VIEW</span><h3>제조사별 상용차</h3><p>국내·수입 업체를 한곳에서 선택하고 확인된 등록 실적을 봅니다.</p></div><span className="manufacturer-period">{manufacturerPeriod} 기준</span></div>
    <div className="manufacturer-controls"><label htmlFor="manufacturer-select">자동차 업체</label><select id="manufacturer-select" value={selected} onChange={event => setSelected(event.target.value)}><option value="all">확인된 업체 전체</option><optgroup label="국내 업체">{manufacturers.filter(item => item.origin === "국내").map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</optgroup><optgroup label="수입 업체">{manufacturers.filter(item => item.origin === "수입").map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</optgroup></select></div>
    {maker ? <div className="manufacturer-detail"><div><span className="manufacturer-origin">{maker.origin} 업체</span><h4>{maker.name}</h4><p>{maker.augustRegistrations === null ? "같은 기준의 공개 제조사별 상용차 등록 수치를 확인하지 못했습니다. 미확인은 0대를 뜻하지 않습니다." : "KAIDA가 발표한 국내 수입 상용차 신규등록 실적입니다."}</p></div><div className="manufacturer-numbers"><div><span>8월 신규등록</span><strong>{maker.augustRegistrations === null ? "미확인" : `${maker.augustRegistrations.toLocaleString()}대`}</strong></div><div><span>1~8월 누계</span><strong>{maker.ytdRegistrations === null ? "미확인" : `${maker.ytdRegistrations.toLocaleString()}대`}</strong></div></div><a className="manufacturer-source" href={maker.sourceUrl} target="_blank" rel="noreferrer">출처 · {maker.sourceName} <ExternalLink size={14}/></a>{maker.id === "kia" && <p className="manufacturer-note">그랜버드 모델별 등록은 별도 검증 전입니다. 위의 기아 전체 실적과 혼동하지 마세요.</p>}</div> : <><div className="manufacturer-summary"><div><span>8월 확인된 수입 6개 브랜드</span><strong>{augustTotal.toLocaleString()}<small>대</small></strong></div><div><span>1~8월 누계</span><strong>{ytdTotal.toLocaleString()}<small>대</small></strong></div><p>이 합계는 KAIDA 발표의 수입 상용차 범위입니다. 국내 제조사와 미집계 업체를 포함한 국내 전체 시장 합계가 아닙니다.</p></div><div className="manufacturer-bars">{verifiedImportedManufacturers.map(item => <button key={item.id} type="button" onClick={() => setSelected(item.id)} className="manufacturer-bar"><span>{item.name}</span><span className="manufacturer-track"><span style={{ width: `${item.augustRegistrations / verifiedImportedManufacturers[0].augustRegistrations * 100}%` }} /></span><strong>{item.augustRegistrations}대</strong></button>)}</div><div className="manufacturer-unverified"><strong>국내 업체 7곳</strong><span>{manufacturers.filter(item => item.origin === "국내").map(item => item.name).join(" · ")}</span><small>업체를 선택하면 수치 확인 상태와 원천을 볼 수 있습니다.</small></div><div className="manufacturer-links"><a href={kaidaAnnouncement} target="_blank" rel="noreferrer">KAIDA 발표 목록 <ExternalLink size={13}/></a><a href={kamaStatistics} target="_blank" rel="noreferrer">KAMA 국내 업체 통계 <ExternalLink size={13}/></a></div></>}
    <p className="manufacturer-footnote">출처: 한국수입자동차협회(KAIDA) 2026년 8월 상용차 신규등록 발표. 수입은 KAIDA 집계 범위이며 국토부 전체 차종별 신규등록 통계와 합산하지 않습니다. 국내 업체는 KAMA 생산판매통계의 출고 기준과 등록 기준이 달라 임의 환산하지 않았습니다.</p>
  </section>;
}
