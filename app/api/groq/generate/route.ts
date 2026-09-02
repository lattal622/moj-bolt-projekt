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
    const prompt = body.prompt;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Nedostaje Groq API ključ. Dodajte ga u postavkama." },
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
        messages: [
          {
            role: "system",
            content: "Ti si stručni nogometni analitičar. Uvijek odgovaraš isključivo u JSON formatu.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 800,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      let friendly = `Groq API greška: ${res.status}`;
      if (res.status === 401) {
        friendly = "Groq API ključ nije valjan. Provjerite ključ u postavkama.";
      } else if (res.status === 429) {
        friendly = "Prekoračili ste besplatni limit za Groq. Pokušajte kasnije.";
      } else if (res.status === 404) {
        friendly = `Model "${model}" nije pronađen na Groq. Odaberite drugi model u postavkama.`;
      }
      return NextResponse.json(
        { error: `${friendly} ${errText.substring(0, 150)}` },
        { status: res.status, headers: corsHeaders }
      );
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";

    if (!text) {
      return NextResponse.json(
        { error: "Groq nije vratio odgovor." },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json({ response: text }, { headers: corsHeaders });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Nepoznata greška";
    return NextResponse.json(
      { error: `Greška pri spajanju na Groq: ${msg}` },
      { status: 502, headers: corsHeaders }
    );
  }
}
