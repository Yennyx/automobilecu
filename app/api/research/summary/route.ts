import { getCloudflareContext } from "@opennextjs/cloudflare";
import papers from "@/data/research-official.json";

export const dynamic = "force-dynamic";

type Work = { abstract_inverted_index?: Record<string, number[]> };
type AI = { run: (model: string, input: { messages: { role: string; content: string }[]; max_tokens: number; temperature: number }) => Promise<{ response?: string }> };
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

function threeLines(response: string): string[] | null {
  const lines = response.split(/\r?\n/).map(line => line.trim().replace(/^[-*0-9.]+\s*/, "")).filter(Boolean);
  return lines.length === 3 && lines.every(line => line.length >= 12 && line.length <= 300) ? lines : null;
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
    const sourceResponse = await fetch(paper.metadataUrl, { headers: { Accept: "application/json" } });
    if (!sourceResponse.ok) throw new Error(`OpenAlex ${sourceResponse.status}`);
    const source = await sourceResponse.json() as Work;
    const abstract = abstractFrom(source.abstract_inverted_index ?? {});
    if (abstract.length < 180 || await sha256(abstract) !== paper.abstractSha256) {
      return Response.json({ error: "원문 초록이 수집 시점과 달라 요약을 보류합니다." }, { status: 409 });
    }
    const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fp8", {
      messages: [
        { role: "system", content: "You summarize academic abstracts faithfully in Korean. Return exactly three Korean sentences, each on its own line. No heading, bullets, or invented numbers." },
        { role: "user", content: `Title: ${paper.title}\nDOI: ${paper.doi}\nAbstract: ${abstract.slice(0, 6000)}\nWrite three factual Korean sentences using only the abstract.` },
      ],
      max_tokens: 320,
      temperature: 0.1,
    });
    const lines = threeLines(result.response ?? "");
    if (!lines) return Response.json({ error: "요약 형식 검증에 실패했습니다." }, { status: 502 });
    await env.RESEARCH_KV.put(key, JSON.stringify(lines), { expirationTtl: 60 * 60 * 24 * 30 });
    return Response.json({ doi: paper.doi, lines, model: "Cloudflare Workers AI · Llama 3.1 8B", cached: false });
  } catch {
    return Response.json({ error: "원문 또는 무료 AI 요약 서비스에 연결할 수 없습니다." }, { status: 503 });
  }
}
