import { AISettings, MatchEvent, TeamLastEvent, TeamStanding } from "./types";

export interface PredictionResult {
  homeScore: number;
  awayScore: number;
  reasoning: string;
  confidence: number;
}

interface AIPredictionResponse {
  homeScore?: number;
  awayScore?: number;
  reasoning?: string;
  confidence?: number;
  score?: string;
  prediction?: string;
}

function buildPrompt(
  match: MatchEvent,
  homeForm: TeamLastEvent[],
  awayForm: TeamLastEvent[],
  standings: TeamStanding[]
): string {
  const homeTeam = match.strHomeTeam;
  const awayTeam = match.strAwayTeam;
  const league = match.strLeague;
  const date = match.dateEvent || "nepoznat";

  const homeStand = standings.find((s) => s.strTeam === homeTeam);
  const awayStand = standings.find((s) => s.strTeam === awayTeam);

  const homeFormStr = homeForm
    .slice(0, 5)
    .map((e) => {
      const isHome = e.idHomeTeam === match.idHomeTeam;
      const hs = parseInt(e.intHomeScore || "0", 10);
      const as = parseInt(e.intAwayScore || "0", 10);
      const result = isHome
        ? hs > as
          ? "P"
          : hs < as
            ? "I"
            : "N"
        : hs < as
          ? "P"
          : hs > as
            ? "I"
            : "N";
      return `${e.strHomeTeam} ${e.intHomeScore}-${e.intAwayScore} ${e.strAwayTeam} (${result})`;
    })
    .join(", ");

  const awayFormStr = awayForm
    .slice(0, 5)
    .map((e) => {
      const isHome = e.idHomeTeam === match.idAwayTeam;
      const hs = parseInt(e.intHomeScore || "0", 10);
      const as = parseInt(e.intAwayScore || "0", 10);
      const result = isHome
        ? hs > as
          ? "P"
          : hs < as
            ? "I"
            : "N"
        : hs < as
          ? "P"
          : hs > as
            ? "I"
            : "N";
      return `${e.strHomeTeam} ${e.intHomeScore}-${e.intAwayScore} ${e.strAwayTeam} (${result})`;
    })
    .join(", ");

  const homeGoalsAvg = homeStand
    ? (parseInt(homeStand.intGoalsFor, 10) / Math.max(parseInt(homeStand.intPlayed, 10), 1)).toFixed(2)
    : "?";
  const awayGoalsAvg = awayStand
    ? (parseInt(awayStand.intGoalsAgainst, 10) / Math.max(parseInt(awayStand.intPlayed, 10), 1)).toFixed(2)
    : "?";

  return `Ti si stručni nogometni analitičar i statističar s godinama iskustva. Tvoj zadatak je predvidjeti TOČAN konačni rezultat utakmice na temelju svih dostupnih podataka.

Analiziraj sljedeće faktore za predviđanje:
1. Trenutna forma momčadi (zadnjih 5 utakmica)
2. Pozicija na tablici i bodovi
3. Prosječni broj postignutih i primljenih golova
4. Prednost domaćeg terena (domaćin pobjeđuje ~45% utakmica)
5. Povijesni trendovi golova u ligi
6. Razlika u kvaliteti momčadi

UTAKMICA: ${homeTeam} (domaćin) vs ${awayTeam} (gost)
LIGA: ${league}
DATUM: ${date}

TABLICA:
${homeTeam}: ${homeStand ? `Pozicija ${homeStand.intRank}, ${homeStand.intPlayed} utakmica, ${homeStand.intWin}P ${homeStand.intDraw}N ${homeStand.intLoss}I, Golovi ${homeStand.intGoalsFor}:${homeStand.intGoalsAgainst}, Bodovi ${homeStand.intPoints}, Forma ${homeStand.strForm || "N/A"}` : "Nema podataka"}
${awayTeam}: ${awayStand ? `Pozicija ${awayStand.intRank}, ${awayStand.intPlayed} utakmica, ${awayStand.intWin}P ${awayStand.intDraw}N ${awayStand.intLoss}I, Golovi ${awayStand.intGoalsFor}:${awayStand.intGoalsAgainst}, Bodovi ${awayStand.intPoints}, Forma ${awayStand.strForm || "N/A"}` : "Nema podataka"}

STATISTIKA GOLOVA:
${homeTeam} prosječno zabija: ${homeGoalsAvg} golova po utakmici
${awayTeam} prosječno prima: ${awayGoalsAvg} golova po utakmici

ZADNJIH 5 UTAKMICA ${homeTeam}: ${homeFormStr || "Nema podataka"}
ZADNJIH 5 UTAKMICA ${awayTeam}: ${awayFormStr || "Nema podataka"}

Upute za predviđanje:
- Budi realan: većina utakmica završava s 1-3 gola ukupno
- Najčešći rezultati su 1:1, 1:0, 2:1, 0:0, 2:0, 0:1, 1:2
- Domaćin ima blagu prednost
- Ako je velika razlika u kvaliteti, predvidi uvjerljiviju pobjedu favorita
- Razmisli o obrambenoj čvrstoći obje momčadi

Odgovori isključivo u JSON formatu bez dodatnog teksta:
{
  "homeScore": <cijeli broj 0-10>,
  "awayScore": <cijeli broj 0-10>,
  "confidence": <broj 1-95 koji pokazuje koliko si siguran u ovaj točan rezultat>,
  "reasoning": "<detaljno obrazloženje na hrvatskom, 2-4 rečenice, objasni zašto si odabrao ovaj rezultat na temelju podataka>"
}`;
}

function parseResponse(text: string): PredictionResult {
  let jsonStr = text.trim();
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) jsonStr = fenceMatch[1].trim();

  const jsonStart = jsonStr.indexOf("{");
  const jsonEnd = jsonStr.lastIndexOf("}");
  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    jsonStr = jsonStr.substring(jsonStart, jsonEnd + 1);
  }

  try {
    const parsed: AIPredictionResponse = JSON.parse(jsonStr);
    if (typeof parsed.homeScore === "number" && typeof parsed.awayScore === "number") {
      const homeScore = Math.max(0, Math.min(10, Math.round(parsed.homeScore)));
      const awayScore = Math.max(0, Math.min(10, Math.round(parsed.awayScore)));
      return {
        homeScore,
        awayScore,
        reasoning: parsed.reasoning || "",
        confidence: typeof parsed.confidence === "number" ? Math.max(1, Math.min(95, Math.round(parsed.confidence))) : 50,
      };
    }
  } catch {
    // fall through
  }

  const scoreMatch = text.match(/(\d+)\s*[-:]\s*(\d+)/);
  if (scoreMatch) {
    return {
      homeScore: parseInt(scoreMatch[1], 10),
      awayScore: parseInt(scoreMatch[2], 10),
      reasoning: text.substring(0, 300),
      confidence: 50,
    };
  }

  return { homeScore: 1, awayScore: 1, reasoning: "AI nije vratio valjan rezultat.", confidence: 0 };
}

export async function getPrediction(
  match: MatchEvent,
  homeForm: TeamLastEvent[],
  awayForm: TeamLastEvent[],
  standings: TeamStanding[],
  settings: AISettings
): Promise<PredictionResult> {
  const prompt = buildPrompt(match, homeForm, awayForm, standings);

  if (settings.aiSource === "ollama") {
    return await predictWithOllama(prompt, settings);
  }
  if (settings.aiSource === "groq") {
    return await predictWithGroq(prompt, settings);
  }
  return await predictWithGemini(prompt, settings);
}

async function predictWithGemini(prompt: string, settings: AISettings): Promise<PredictionResult> {
  if (!settings.geminiApiKey) {
    throw new Error("Nedostaje Google Gemini API ključ. Dodajte ga u postavkama.");
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${settings.geminiApiKey}`,
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
    if (res.status === 404) {
      friendly = "Gemini model nije dostupan. Pokušajte koristiti Groq (besplatno) u postavkama.";
    } else if (res.status === 403 || res.status === 400) {
      friendly = "Gemini API ključ nije valjan ili nema pristup. Provjerite ključ u postavkama ili koristite Groq.";
    }
    throw new Error(`${friendly} ${errText.substring(0, 150)}`);
  }

  const data = await res.json();
  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    data.candidates?.[0]?.content?.parts?.map((p: { text: string }) => p.text).join("") ||
    "";

  if (!text) throw new Error("Gemini nije vratio odgovor. Pokušajte s Groq izvorom u postavkama.");
  return parseResponse(text);
}

async function predictWithGroq(prompt: string, settings: AISettings): Promise<PredictionResult> {
  if (!settings.groqApiKey) {
    throw new Error("Nedostaje Groq API ključ. Dodajte ga u postavkama.");
  }

  const res = await fetch("/api/groq/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: settings.groqApiKey,
      model: settings.groqModel || "llama-3.3-70b-versatile",
      prompt,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: "Nepoznata greška" }));
    throw new Error(errData.error || `Groq greška: ${res.status}`);
  }

  const data = await res.json();
  if (!data.response) throw new Error("Groq nije vratio odgovor.");
  return parseResponse(data.response);
}

async function predictWithOllama(prompt: string, settings: AISettings): Promise<PredictionResult> {
  const res = await fetch("/api/ollama/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ollamaUrl: settings.ollamaUrl,
      model: settings.ollamaModel || "llama3.2",
      prompt,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: "Nepoznata greška" }));
    throw new Error(errData.error || `Ollama greška: ${res.status}`);
  }

  const data = await res.json();
  if (!data.response) throw new Error("Ollama nije vratio odgovor.");
  return parseResponse(data.response);
}

export async function testOllamaConnection(settings: AISettings): Promise<{ ok: boolean; message: string; models?: string[] }> {
  try {
    const res = await fetch(`/api/ollama/tags?url=${encodeURIComponent(settings.ollamaUrl)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      return { ok: false, message: data.message || `Ollama nije dostupna.` };
    }

    const models: string[] = (data.models || []).map((m: { name: string }) => m.name);

    const modelExists = models.some(
      (m) => m === settings.ollamaModel || m.startsWith(settings.ollamaModel + ":")
    );

    if (!modelExists) {
      return {
        ok: false,
        message: `Model "${settings.ollamaModel}" nije pronađen. Dostupni modeli: ${models.join(", ") || "nema"}. Pokrenite "ollama pull ${settings.ollamaModel}" u terminalu.`,
        models,
      };
    }

    return {
      ok: true,
      message: `Ollama radi! Model "${settings.ollamaModel}" je dostupan.`,
      models,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Nepoznata greška";
    return {
      ok: false,
      message: `Nije moguće spojiti se na Ollama na ${settings.ollamaUrl}. Provjerite je li Ollama pokrenuta (naredba "ollama serve"). Greška: ${msg}`,
    };
  }
}

export async function testGroqConnection(settings: AISettings): Promise<{ ok: boolean; message: string }> {
  if (!settings.groqApiKey) {
    return { ok: false, message: "Nedostaje Groq API ključ. Dodajte ga u postavkama." };
  }

  try {
    const res = await fetch("/api/groq/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: settings.groqApiKey,
        model: settings.groqModel || "llama-3.3-70b-versatile",
      }),
    });

    const data = await res.json();

    if (res.ok && data.ok) {
      return { ok: true, message: data.message };
    }

    return { ok: false, message: data.message || `Groq greška: HTTP ${res.status}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Nepoznata greška";
    return { ok: false, message: `Greška pri spajanju na Groq: ${msg}` };
  }
}
