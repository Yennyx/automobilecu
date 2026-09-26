import { getCloudflareContext } from "@opennextjs/cloudflare";
import papers from "@/data/research-official.json";

export const dynamic = "force-dynamic";

type AI = { run: (model: string, input: { messages: { role: string; content: string }[]; max_tokens: number; temperature: number }) => Promise<{ response?: unknown }> };
type KV = { get: (key: string) => Promise<string | null>; put: (key: string, value: string, options: { expirationTtl: number }) => Promise<void> };

function abstractFrom(index: Record<string, number[]>): string {
  return Object.entries(index).flatMap(([word, positions]) => positions.map(position => [position, word] as const))
    .sort((a, b) => a[0] - b[0]).map(([, word]) => word).join(" ");
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
    .map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function threeLines(response: unknown): string[] | null {
  const cleaned = typeof response === "string" ? response.trim().replace(/^```(?:json)?\s*|\s*```$/g, "") : "";
  let candidates: unknown[] = [];
  let parsed: unknown = response;
  try {
    if (cleaned) parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) candidates = parsed;
    else if (parsed && typeof parsed === "object") {
      if ("lines" in parsed && Array.isArray(parsed.lines)) candidates = parsed.lines;
      else if ("line1" in parsed && "line2" in parsed && "line3" in parsed) candidates = [parsed.line1, parsed.line2, parsed.line3];
    }
  } catch {
    // Models may return numbered lines or one paragraph instead of JSON.
  }
  if (!candidates.length) {
    candidates = cleaned.split(/\r?\n|(?=\s*[1-3][.)]\s+)/)
      .map(line => line.trim().replace(/^[-*•\s]*[1-3]?[.)]?\s*/, "")).filter(Boolean);
  }
  if (candidates.length !== 3) {
    candidates = cleaned.replace(/\s+/g, " ").split(/(?<=[.!?。！？])\s+/).filter(Boolean);
  }
  const lines = candidates.map(line => typeof line === "string" ? line.trim() : "")
    .filter(line => line.length >= 12 && line.length <= 400 && /[가-힣]/.test(line))
    .slice(0, 3);
  return lines.length === 3 ? lines : null;
}

export async function GET(request: Request) {
  const doi = new URL(request.url).searchParams.get("doi")?.toLowerCase();
  const paper = papers.find(item => item.doi.toLowerCase() === doi);
  if (!paper) return Response.json({ error: "등록된 DOI가 아닙니다." }, { status: 404 });

  let env: { AI: AI; RESEARCH_KV: KV };
  try {
    env = getCloudflareContext().env as unknown as typeof env;
    if (!env.AI || !env.RESEARCH_KV) throw new Error("Missing AI or KV binding");
  } catch {
    return Response.json({ error: "요약 서비스가 연결되지 않았습니다." }, { status: 503 });
  }

  const key = `summary:llama31:v1:${paper.doi}:${paper.abstractSha256}`;
  const cached = await env.RESEARCH_KV.get(key);
  if (cached) return Response.json({ doi: paper.doi, lines: JSON.parse(cached), model: "Cloudflare Workers AI · Llama 3.1 8B", cached: true });

  try {
    const index = (paper as typeof paper & { abstractInvertedIndex?: Record<string, number[]> }).abstractInvertedIndex ?? {};
    const abstract = abstractFrom(index);
    if (abstract.length < 180 || await sha256(abstract) !== paper.abstractSha256) {
      return Response.json({ error: "출처 초록의 검증 데이터가 없어 요약을 보류합니다." }, { status: 409 });
    }
    const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fp8", {
      messages: [
        { role: "system", content: "You summarize academic abstracts faithfully in Korean. Return exactly three Korean sentences, each on its own line. No heading, bullets, or invented numbers." },
        { role: "user", content: `Title: ${paper.title}\nDOI: ${paper.doi}\nAbstract: ${abstract.slice(0, 6000)}\nWrite three factual Korean sentences using only the abstract.` },
      ],
      max_tokens: 320,
      temperature: 0.1,
    });
    let lines = threeLines(result.response);
    if (!lines) {
      const retry = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fp8", {
        messages: [
          { role: "system", content: "Write Korean only. Answer with exactly three numbered, complete sentences. Each sentence must state a fact explicitly present in the supplied abstract. No introduction or conclusion." },
          { role: "user", content: `Abstract: ${abstract.slice(0, 4500)}\n1. 연구 목적\n2. 사용한 방법\n3. 확인된 결과 또는 결론` },
        ],
        max_tokens: 400,
        temperature: 0,
      });
      lines = threeLines(retry.response);
    }
    if (!lines) return Response.json({ error: "요약 형식 검증에 실패했습니다." }, { status: 502 });
    await env.RESEARCH_KV.put(key, JSON.stringify(lines), { expirationTtl: 60 * 60 * 24 * 30 });
    return Response.json({ doi: paper.doi, lines, model: "Cloudflare Workers AI · Llama 3.1 8B", cached: false });
  } catch {
    return Response.json({ error: "무료 AI 요약 서비스에 연결할 수 없습니다." }, { status: 503 });
  }
}
