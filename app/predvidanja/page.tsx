"use client";

import * as React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { loadPredictions, deletePrediction, clearPredictions } from "@/lib/settings";
import { Prediction } from "@/lib/types";
import { Trash2, Trophy, Calendar, Sparkles, CircleAlert as AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function PredictionsPage() {
  const [predictions, setPredictions] = React.useState<Prediction[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setPredictions(loadPredictions());
  }, []);

  function handleDelete(id: string) {
    deletePrediction(id);
    setPredictions(loadPredictions());
    toast.success("Predviđanje obrisano.");
  }

  function handleClearAll() {
    clearPredictions();
    setPredictions([]);
    toast.success("Sva predviđanja obrisana.");
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col pitch-bg">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8" />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pitch-bg">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Spremljena predviđanja</h1>
            <p className="text-muted-foreground mt-1">
              {predictions.length} predviđanja u lokalnoj pohrani
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {predictions.length > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 text-destructive">
                    <Trash2 className="h-4 w-4" /> Obriši sve
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Obrisati sva predviđanja?</DialogTitle>
                    <DialogDescription>
                      Ova radnja je nepovratna. Sva spremljena predviđanja će biti trajno obrisana.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>
                      Odustani
                    </Button>
                    <Button variant="destructive" onClick={handleClearAll} className="gap-2">
                      <Trash2 className="h-4 w-4" /> Obriši sve
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {predictions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">Nema spremljenih predviđanja</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Pronađite utakmicu i pokrenite AI predviđanje da ga spremite ovdje.
                </p>
              </div>
              <Link href="/">
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" /> Pronađi utakmice
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {predictions.map((pred) => (
              <Card key={pred.id} className="group">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <Badge variant="secondary" className="text-xs mb-1">{pred.league}</Badge>
                      <p className="font-semibold text-sm truncate">
                        {pred.homeTeam} vs {pred.awayTeam}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(pred.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-3 py-3 rounded-lg bg-primary/5">
                    <span className="text-3xl font-bold tabular-nums text-primary">
                      {pred.predictedHomeScore}
                    </span>
                    <span className="text-xl text-muted-foreground">:</span>
                    <span className="text-3xl font-bold tabular-nums text-primary">
                      {pred.predictedAwayScore}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(pred.createdAt).toLocaleDateString("hr-HR")}
                    </span>
                    {typeof pred.confidence === "number" && (
                      <Badge variant="outline">{pred.confidence}% pouzdanost</Badge>
                    )}
                  </div>

                  {pred.reasoning && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{pred.reasoning}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
