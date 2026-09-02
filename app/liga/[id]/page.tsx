import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { getLeagueById, getNextEvents, getLastEvents, getStandings } from "@/lib/thesportsdb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchCard } from "@/components/match-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMatchDate, getFormResult, formColor } from "@/lib/format";
import { TeamStanding } from "@/lib/types";
import Link from "next/link";
import { CalendarDays, Table2, History } from "lucide-react";

export default async function LeaguePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="min-h-screen flex flex-col pitch-bg">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Natrag na lige
          </Link>
          <ThemeToggle />
        </div>
        <LeagueContent id={params.id} />
      </main>
      <Footer />
    </div>
  );
}

async function LeagueContent({ id }: { id: string }) {
  let league, nextEvents, lastEvents, standings;
  try {
    league = await getLeagueById(id);
    nextEvents = await getNextEvents(id);
    lastEvents = await getLastEvents(id);
    standings = await getStandings(id);
  } catch {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Greška pri dohvaćanju podataka o ligi. Pokušajte ponovno kasnije.
        </CardContent>
      </Card>
    );
  }

  if (!league) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Liga nije pronađena.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        {league.strBadge && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={league.strBadge}
            alt={league.strLeague}
            className="h-20 w-20 rounded-lg object-contain bg-muted p-2"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{league.strLeague}</h1>
          {league.strCountry && (
            <p className="text-muted-foreground mt-1">{league.strCountry}</p>
          )}
          {league.strLeagueAlternate && (
            <p className="text-sm text-muted-foreground mt-1">{league.strLeagueAlternate}</p>
          )}
        </div>
      </div>

      <Tabs defaultValue="raspored">
        <TabsList>
          <TabsTrigger value="raspored" className="gap-2">
            <CalendarDays className="h-4 w-4" /> Raspored
          </TabsTrigger>
          <TabsTrigger value="tablica" className="gap-2">
            <Table2 className="h-4 w-4" /> Tablica
          </TabsTrigger>
          <TabsTrigger value="rezultati" className="gap-2">
            <History className="h-4 w-4" /> Rezultati
          </TabsTrigger>
        </TabsList>

        <TabsContent value="raspored" className="mt-4">
          {nextEvents.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {nextEvents.slice(0, 15).map((event) => (
                <MatchCard key={event.idEvent} match={event} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Nema nadolazećih utakmica za ovu ligu.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tablica" className="mt-4">
          {standings.length > 0 ? (
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="p-3 text-left font-medium">#</th>
                      <th className="p-3 text-left font-medium">Momčad</th>
                      <th className="p-3 text-center font-medium">U</th>
                      <th className="p-3 text-center font-medium">P</th>
                      <th className="p-3 text-center font-medium">N</th>
                      <th className="p-3 text-center font-medium">I</th>
                      <th className="p-3 text-center font-medium">G</th>
                      <th className="p-3 text-center font-medium">GR</th>
                      <th className="p-3 text-center font-medium">Bod</th>
                      <th className="p-3 text-center font-medium">Forma</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((s: TeamStanding) => (
                      <tr key={s.idStanding} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="p-3 text-center font-medium">{s.intRank}</td>
                        <td className="p-3 font-medium">{s.strTeam}</td>
                        <td className="p-3 text-center tabular-nums">{s.intPlayed}</td>
                        <td className="p-3 text-center tabular-nums">{s.intWin}</td>
                        <td className="p-3 text-center tabular-nums">{s.intDraw}</td>
                        <td className="p-3 text-center tabular-nums">{s.intLoss}</td>
                        <td className="p-3 text-center tabular-nums">{s.intGoalsFor}:{s.intGoalsAgainst}</td>
                        <td className="p-3 text-center tabular-nums">{s.intGoalDifference}</td>
                        <td className="p-3 text-center font-bold tabular-nums">{s.intPoints}</td>
                        <td className="p-3">
                          <div className="flex justify-center gap-1">
                            {getFormResult(s.strForm).map((r, i) => (
                              <span
                                key={i}
                                className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${formColor(r)}`}
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Tablica nije dostupna za ovu ligu.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rezultati" className="mt-4">
          {lastEvents.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {lastEvents.slice(0, 15).map((event) => (
                <MatchCard key={event.idEvent} match={event} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Nema nedavnih rezultata za ovu ligu.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
