import { Database, ExternalLink } from "lucide-react";
import { extendedSources, sources } from "@/lib/sources";

export function ExtendedDataPanel() {
  return <div className="extended-panel"><div className="extended-head"><div><span className="eyebrow">RELATED SIGNALS</span><h3>연관 데이터 수집 현황</h3><p>ECU와 시장 해석에 영향을 주는 주변 지표의 출처와 검증 상태입니다.</p></div><span className="extended-count">0 / {extendedSources.length} 실데이터 연결</span></div><div className="extended-grid">{extendedSources.map(item => { const source = item.sourceId ? sources[item.sourceId] : null; return <div className="extended-item" key={item.metric}><span className="extended-icon"><Database size={17}/></span><div><strong>{item.title}</strong><small>{item.status}</small><p>{item.note}</p>{source && <a href={source.url} target="_blank" rel="noreferrer">{source.provider} 원문 <ExternalLink size={12}/></a>}</div></div>; })}</div></div>;
}
