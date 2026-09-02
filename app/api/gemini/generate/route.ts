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
    const model = body.model || "gemini-2.5-flash";
    const prompt = body.prompt;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Nedostaje Gemini API ključ. Dodajte ga u postavkama." },
        { status: 400, headers: corsHeaders }
      );
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 800,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      let friendly = `Gemini API greška: ${res.status}`;
      if (res.status === 400) {
        friendly = "Gemini API ključ nije valjan. Nabavite novi ključ na aistudio.google.com/apikey ili koristite Groq.";
      } else if (res.status === 403) {
        friendly = "Gemini API ključ nema pristup ovom modelu. Koristite Groq u postavkama.";
      } else if (res.status === 404) {
        friendly = `Model "${model}" nije dostupan. Koristite Groq u postavkama.`;
      } else if (res.status === 429) {
        friendly = "Prekoračen besplatni limit za Gemini (1500/dan). Pokušajte Groq.";
      }
      return NextResponse.json(
        { error: `${friendly} ${errText.substring(0, 150)}` },
        { status: res.status, headers: corsHeaders }
      );
    }

    const data = await res.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      data.candidates?.[0]?.content?.parts?.map((p: { text: string }) => p.text).join("") ||
      "";

    if (!text) {
      return NextResponse.json(
        { error: "Gemini nije vratio odgovor. Pokušajte s Groq izvorom u postavkama." },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json({ response: text }, { headers: corsHeaders });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Nepoznata greška";
    return NextResponse.json(
      { error: `Greška pri spajanju na Gemini: ${msg}` },
      { status: 502, headers: corsHeaders }
    );
  }
}
