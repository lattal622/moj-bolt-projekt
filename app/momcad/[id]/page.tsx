import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { getTeamById, getTeamLastEvents } from "@/lib/thesportsdb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchCard } from "@/components/match-card";
import Link from "next/link";
import { Calendar, MapPin, Globe, Trophy } from "lucide-react";

export default async function TeamPage({
  params,
}: {
  params: { id: string };
}) {
  let team, lastEvents;
  try {
    team = await getTeamById(params.id);
    lastEvents = await getTeamLastEvents(params.id);
  } catch {
    return (
      <div className="min-h-screen flex flex-col pitch-bg">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Greška pri dohvaćanju podataka o momčadi.
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex flex-col pitch-bg">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Momčad nije pronađena.
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pitch-bg">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/pretraga" className="text-sm text-muted-foreground hover:text-foreground">
            ← Natrag na pretragu
          </Link>
          <ThemeToggle />
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            {team.strBadge && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={team.strBadge}
                alt={team.strTeam}
                className="h-24 w-24 rounded-lg object-contain bg-muted p-2"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{team.strTeam}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                {team.strCountry && <Badge variant="secondary">{team.strCountry}</Badge>}
                {team.strLeague && (
                  <Link href={`/liga/${team.idLeague}`}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                      {team.strLeague}
                    </Badge>
                  </Link>
                )}
                {team.intFormedYear && (
                  <Badge variant="outline">Osnovano {team.intFormedYear}.</Badge>
                )}
              </div>
            </div>
          </div>

          {team.strStadium && (
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Stadion</p>
                    <p className="text-sm font-medium">{team.strStadium}</p>
                  </div>
                </CardContent>
              </Card>
              {team.strCountry && (
                <Card>
                  <CardContent className="flex items-center gap-3 p-4">
                    <Globe className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Država</p>
                      <p className="text-sm font-medium">{team.strCountry}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {team.strLeague && (
                <Card>
                  <CardContent className="flex items-center gap-3 p-4">
                    <Trophy className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Liga</p>
                      <p className="text-sm font-medium truncate">{team.strLeague}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div>
            <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Zadnje utakmice
            </h2>
            {lastEvents && lastEvents.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {lastEvents.slice(0, 10).map((event) => (
                  <MatchCard key={event.idEvent} match={event as any} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Nema nedavnih utakmica za ovu momčad.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
