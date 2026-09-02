"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Loader as Loader2, Save, CircleAlert as AlertCircle } from "lucide-react";
import { MatchEvent, TeamStanding, TeamLastEvent, AISettings, Prediction } from "@/lib/types";
import { getPrediction, PredictionResult } from "@/lib/ai";
import { loadSettings, savePrediction } from "@/lib/settings";
import { toast } from "sonner";

export function PredictionPanel({
  match,
  standings,
  homeForm,
  awayForm,
}: {
  match: MatchEvent;
  standings: TeamStanding[];
  homeForm: TeamLastEvent[];
  awayForm: TeamLastEvent[];
}) {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<PredictionResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const autoTriggered = React.useRef(false);

  async function handlePredict() {
    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);

    try {
      const settings = loadSettings();
      const res = await getPrediction(match, homeForm, awayForm, standings, settings);
      setResult(res);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Neočekivana greška pri predviđanju.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (autoTriggered.current) return;
    autoTriggered.current = true;
    handlePredict();
  }, []);

  function handleSave() {
    if (!result) return;
    const pred: Prediction = {
      id: crypto.randomUUID(),
      matchId: match.idEvent,
      homeTeam: match.strHomeTeam,
      awayTeam: match.strAwayTeam,
      league: match.strLeague,
      dateEvent: match.dateEvent || "",
      predictedHomeScore: result.homeScore,
      predictedAwayScore: result.awayScore,
      predictedScore: `${result.homeScore}:${result.awayScore}`,
      reasoning: result.reasoning,
      confidence: result.confidence,
      createdAt: new Date().toISOString(),
    };
    savePrediction(pred);
    setSaved(true);
    toast.success("Predviđanje spremljeno!");
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI predviđanje rezultata
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!result && !loading && !error && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium">Predvidi točan rezultat utakmice</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                AI analizira formu momčadi, tablicu lige i nedavne rezultate da predvidi konačni ishod.
              </p>
            </div>
            <Button onClick={handlePredict} size="lg" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Pokreni AI predviđanje
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">AI analizira podatke o utakmici...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <p className="font-medium text-destructive">Greška pri predviđanju</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">{error}</p>
            </div>
            <Button onClick={handlePredict} variant="outline" size="lg">
              Pokušaj ponovno
            </Button>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-center gap-4 sm:gap-8 py-6">
              <div className="flex-1 text-right">
                <p className="font-semibold text-sm text-muted-foreground">{match.strHomeTeam}</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-6 py-4">
                <span className="text-5xl font-bold tabular-nums text-primary">
                  {result.homeScore}
                </span>
                <span className="text-3xl font-light text-muted-foreground">:</span>
                <span className="text-5xl font-bold tabular-nums text-primary">
                  {result.awayScore}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-muted-foreground">{match.strAwayTeam}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pouzdanost</span>
                <span className="font-medium">{result.confidence}%</span>
              </div>
              <Progress value={result.confidence} />
            </div>

            {result.reasoning && (
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm leading-relaxed">{result.reasoning}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handlePredict} variant="outline" className="flex-1 gap-2">
                <Sparkles className="h-4 w-4" /> Predvidi ponovno
              </Button>
              <Button
                onClick={handleSave}
                variant={saved ? "secondary" : "default"}
                className="flex-1 gap-2"
                disabled={saved}
              >
                <Save className="h-4 w-4" />
                {saved ? "Spremljeno" : "Spremi predviđanje"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
