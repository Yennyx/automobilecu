"use client";

import { useEffect, useState } from "react";

type Summary = { lines: string[]; model: string };

export function ResearchSummary({ doi }: { doi: string }) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [status, setStatus] = useState("원문 초록의 한국어 요약을 불러오는 중입니다.");

  useEffect(() => {
    let active = true;
    fetch(`/api/research/summary?doi=${encodeURIComponent(doi)}`)
      .then(async response => {
        if (!response.ok) throw new Error("summary unavailable");
        return response.json() as Promise<Summary>;
      })
      .then(data => { if (active) setSummary(data); })
      .catch(() => { if (active) setStatus("요약을 확인할 수 없습니다. DOI 원문에서 초록을 확인하세요."); });
    return () => { active = false; };
  }, [doi]);

  return summary ? <><p>{summary.lines.join("\n")}</p><small className="research-model">초록 기반 AI 요약 · {summary.model}</small></> : <p>{status}</p>;
}
