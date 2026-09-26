import { ExternalLink } from "lucide-react";
import { sources } from "@/lib/sources";

export function SourceBadge({ sourceId, updatedAt, label }: { sourceId: keyof typeof sources; updatedAt?: string | null; label?: string }) {
  const source = sources[sourceId];
  const title = label || source.provider;
  const content = <><span className="source-badge-label">출처 · {title}</span><span className="source-badge-date">{updatedAt ? `갱신 ${updatedAt}` : source.kind === "sample" ? "실제 통계 아님" : "원문"}</span>{source.url && <ExternalLink size={12} />}</>;
  return source.url ? <a className={`source-badge source-badge-${source.kind}`} href={source.url} target="_blank" rel="noreferrer" title={source.name}>{content}</a> : <span className="source-badge source-badge-sample" title={source.name}>{content}</span>;
}
