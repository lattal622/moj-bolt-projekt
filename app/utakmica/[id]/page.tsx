import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { getEventById, getStandings, getTeamLastEvents, getLeagueById } from "@/lib/thesportsdb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PredictionPanel } from "@/components/prediction-panel";
import { formatMatchDate, formatMatchTime, getFormResult, formColor } from "@/lib/format";
import { MatchEvent, TeamStanding, TeamLastEvent } from "@/lib/types";
import Link from "next/link";
import { Calendar, Clock, MapPin, TrendingUp } from "lucide-react";

export default async function MatchPage({
  params,
}: {
  params: { id: string };
}) {
  let match: MatchEvent | null = null;
  let standings: TeamStanding[] = [];
  let homeForm: TeamLastEvent[] = [];
  let awayForm: TeamLastEvent[] = [];
  let leagueName = "";

  try {
    match = await getEventById(params.id);
    if (match) {
      const leagueId = match.idLeague;
      leagueName = match.strLeague;
      if (leagueId) {
        standings = await getStandings(leagueId);
      }
      if (match.idHomeTeam) {
        homeForm = await getTeamLastEvents(match.idHomeTeam);
      }
      if (match.idAwayTeam) {
        awayForm = await getTeamLastEvents(match.idAwayTeam);
      }
    }
  } catch {
    // handled below
  }

  return (
    <div className="min-h-screen flex flex-col pitch-bg">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href={match ? `/liga/${match.idLeague}` : "/"} className="text-sm text-muted-foreground hover:text-foreground">
            ← Natrag
          </Link>
          <ThemeToggle />
        </div>

        {!match ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Utakmica nije pronađena.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Badge variant="secondary">{match.strLeague}</Badge>
              <div className="flex items-center justify-center gap-4 sm:gap-12 py-4">
                <div className="flex-1 text-right">
                  <p className="text-xl sm:text-2xl font-bold">{match.strHomeTeam}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2 rounded-xl bg-muted px-4 py-2">
                  {match.intHomeScore && match.intAwayScore ? (
                    <span className="text-2xl sm:text-3xl font-bold tabular-nums">
                      {match.intHomeScore} : {match.intAwayScore}
                    </span>
                  ) : (
                    <span className="text-lg font-medium text-muted-foreground">VS</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xl sm:text-2xl font-bold">{match.strAwayTeam}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                {match.dateEvent && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> {formatMatchDate(match.dateEvent)}
                  </span>
                )}
                {match.strTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {formatMatchTime(match.strTime)}
                  </span>
                )}
                {match.strVenue && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {match.strVenue}
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1 space-y-4">
                <TeamFormCard
                  teamName={match.strHomeTeam}
                  form={homeForm}
                  standings={standings}
                  teamId={match.idHomeTeam}
                />
                <TeamFormCard
                  teamName={match.strAwayTeam}
                  form={awayForm}
                  standings={standings}
                  teamId={match.idAwayTeam}
                />
              </div>

              <div className="lg:col-span-2">
                <PredictionPanel
                  match={match}
                  standings={standings}
                  homeForm={homeForm}
                  awayForm={awayForm}
                />
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function TeamFormCard({
  teamName,
  form,
  standings,
  teamId,
}: {
  teamName: string;
  form: TeamLastEvent[];
  standings: TeamStanding[];
  teamId: string;
}) {
  const standing = standings.find((s) => s.idTeam === teamId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4 text-primary" />
          {teamName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {standing && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pozicija u ligi</span>
            <Badge variant="outline">{standing.intRank}. mjesto</Badge>
          </div>
        )}
        {standing && (
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="rounded bg-muted/50 p-2">
              <p className="font-bold tabular-nums">{standing.intPlayed}</p>
              <p className="text-muted-foreground">Utakmice</p>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <p className="font-bold tabular-nums text-success">{standing.intWin}</p>
              <p className="text-muted-foreground">Pobjede</p>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <p className="font-bold tabular-nums text-warning">{standing.intDraw}</p>
              <p className="text-muted-foreground">Neodlučeno</p>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <p className="font-bold tabular-nums text-destructive">{standing.intLoss}</p>
              <p className="text-muted-foreground">Izgubljeno</p>
            </div>
          </div>
        )}
        {standing && standing.strForm && (
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Forma (zadnjih 5)</p>
            <div className="flex gap-1">
              {getFormResult(standing.strForm).map((r, i) => (
                <span
                  key={i}
                  className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${formColor(r)}`}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}
        {form.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Zadnje utakmice</p>
            <div className="space-y-1">
              {form.slice(0, 5).map((e) => {
                const isHome = e.idHomeTeam === teamId;
                const hs = parseInt(e.intHomeScore || "0", 10);
                const as = parseInt(e.intAwayScore || "0", 10);
                const result = isHome
                  ? hs > as ? "P" : hs < as ? "I" : "N"
                  : hs < as ? "P" : hs > as ? "I" : "N";
                return (
                  <div key={e.idEvent} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground truncate">{e.strHomeTeam} v {e.strAwayTeam}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="tabular-nums">{e.intHomeScore}-{e.intAwayScore}</span>
                      <span className={`flex h-4 w-4 items-center justify-center rounded text-[9px] font-bold ${formColor(result as "P" | "N" | "I")}`}>
                        {result}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {!standing && form.length === 0 && (
          <p className="text-sm text-muted-foreground">Nema dostupnih podataka o formi.</p>
        )}
      </CardContent>
    </Card>
  );
}
