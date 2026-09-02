"use client";

import * as React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { searchTeams, searchLeagues } from "@/lib/thesportsdb";
import { loadSettings } from "@/lib/settings";
import { Team, League } from "@/lib/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function SearchPage() {
  const [query, setQuery] = React.useState("");
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [leagues, setLeagues] = React.useState<League[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searched, setSearched] = React.useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const settings = loadSettings();
      const [t, l] = await Promise.all([
        searchTeams(query, settings.sportsDbApiKey),
        searchLeagues(query, settings.sportsDbApiKey),
      ]);
      setTeams(t);
      setLeagues(l);
    } catch {
      setTeams([]);
      setLeagues([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col pitch-bg">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pretraga</h1>
            <p className="text-muted-foreground mt-1">Pronađite momčadi i lige iz cijelog svijeta.</p>
          </div>
          <ThemeToggle />
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Unesite ime momčadi ili lige..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="lg" className="gap-2">
              <Search className="h-4 w-4" /> Pretraži
            </Button>
          </div>
        </form>

        {!searched && !loading && (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-12 text-center text-muted-foreground">
              <Search className="h-12 w-12 opacity-50" />
              <p>Unesite pojam za pretraživanje nogometnih liga i momčadi.</p>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        )}

        {!loading && searched && (
          <Tabs defaultValue="teams">
            <TabsList>
              <TabsTrigger value="teams" className="gap-2">
                <Users className="h-4 w-4" /> Momčadi ({teams.length})
              </TabsTrigger>
              <TabsTrigger value="leagues" className="gap-2">
                <Trophy className="h-4 w-4" /> Lige ({leagues.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="teams" className="mt-4">
              {teams.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {teams.map((team) => (
                    <Link key={team.idTeam} href={`/momcad/${team.idTeam}`}>
                      <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
                        <CardContent className="flex items-center gap-3 p-4">
                          {team.strBadge ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={team.strBadge}
                              alt={team.strTeam}
                              className="h-12 w-12 rounded object-contain"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                              <Users className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{team.strTeam}</p>
                            {team.strLeague && (
                              <p className="text-xs text-muted-foreground truncate">{team.strLeague}</p>
                            )}
                            {team.strCountry && (
                              <Badge variant="outline" className="mt-1 text-xs">{team.strCountry}</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    Nema pronađenih momčadi za "{query}".
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="leagues" className="mt-4">
              {leagues.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {leagues.map((league) => (
                    <Link key={league.idLeague} href={`/liga/${league.idLeague}`}>
                      <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
                        <CardContent className="flex items-center gap-3 p-4">
                          {league.strBadge ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={league.strBadge}
                              alt={league.strLeague}
                              className="h-12 w-12 rounded object-contain"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                              <Trophy className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{league.strLeague}</p>
                            {league.strCountry && (
                              <p className="text-xs text-muted-foreground">{league.strCountry}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    Nema pronađenih liga za "{query}".
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
      <Footer />
    </div>
  );
}
