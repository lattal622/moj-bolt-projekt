import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ollamaUrl = (body.ollamaUrl || "http://localhost:11434").replace(/\/$/, "");

    const res = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: body.model || "llama3.2",
        prompt: body.prompt,
        stream: false,
        options: { temperature: 0.7 },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Ollama greška: ${res.status} ${errText.substring(0, 200)}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    if (!data.response) {
      return NextResponse.json({ error: "Ollama nije vratio odgovor." }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Nepoznata greška";
    return NextResponse.json(
      { error: `Nije moguće spojiti se na Ollama. Provjerite je li Ollama pokrenuta. Greška: ${msg}` },
      { status: 502 }
    );
  }
}
