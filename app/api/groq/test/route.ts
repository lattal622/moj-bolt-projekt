import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiKey = body.apiKey;
    const model = body.model || "llama-3.3-70b-versatile";

    if (!apiKey) {
      return NextResponse.json(
        { ok: false, message: "Nedostaje Groq API ključ." },
        { status: 400, headers: corsHeaders }
      );
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: 'Odgovori s JSON: {"status": "ok"}' }],
        max_tokens: 20,
        temperature: 0,
      }),
    });

    if (res.ok) {
      return NextResponse.json(
        { ok: true, message: "Groq radi! API ključ je valjan." },
        { headers: corsHeaders }
      );
    }

    if (res.status === 401) {
      return NextResponse.json(
        { ok: false, message: "Groq API ključ nije valjan. Provjerite ključ." },
        { status: 401, headers: corsHeaders }
      );
    }
    if (res.status === 429) {
      return NextResponse.json(
        { ok: false, message: "Prekoračen besplatni limit za Groq. Pokušajte kasnije." },
        { status: 429, headers: corsHeaders }
      );
    }
    if (res.status === 404) {
      return NextResponse.json(
        { ok: false, message: `Model "${model}" nije pronađen. Odaberite drugi model u postavkama.` },
        { status: 404, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { ok: false, message: `Groq greška: HTTP ${res.status}` },
      { status: res.status, headers: corsHeaders }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Nepoznata greška";
    return NextResponse.json(
      { ok: false, message: `Greška pri spajanju na Groq: ${msg}` },
      { status: 502, headers: corsHeaders }
    );
  }
}
