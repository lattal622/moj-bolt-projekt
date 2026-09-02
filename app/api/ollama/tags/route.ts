import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const ollamaUrl = req.nextUrl.searchParams.get("url") || "http://localhost:11434";
  const cleanUrl = ollamaUrl.replace(/\/$/, "");

  try {
    const res = await fetch(`${cleanUrl}/api/tags`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, message: `Ollama nije dostupna (HTTP ${res.status}).` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, ...data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Nepoznata greška";
    return NextResponse.json(
      {
        ok: false,
        message: `Nije moguće spojiti se na Ollama na ${cleanUrl}. Provjerite je li Ollama pokrenuta (naredba "ollama serve"). Greška: ${msg}`,
      },
      { status: 502 }
    );
  }
}
