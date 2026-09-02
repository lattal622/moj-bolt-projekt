"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Globe } from "lucide-react";
import Link from "next/link";
import { searchLeagues } from "@/lib/thesportsdb";
import { loadSettings } from "@/lib/settings";
import { League } from "@/lib/types";

export function AllLeagues() {
  const [leagues, setLeagues] = React.useState<League[]>([]);
  const [filtered, setFiltered] = React.useState<League[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    async function load() {
      try {
        const settings = loadSettings();
        const all = await searchLeagues("", settings.sportsDbApiKey);
        setLeagues(all);
        setFiltered(all);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  React.useEffect(() => {
    if (!search) {
      setFiltered(leagues);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      leagues.filter(
        (l) =>
          l.strLeague.toLowerCase().includes(q) ||
          (l.strCountry || "").toLowerCase().includes(q)
      )
    );
  }, [search, leagues]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, League[]>();
    filtered.forEach((l) => {
      const country = l.strCountry || "Ostalo";
      if (!map.has(country)) map.set(country, []);
      map.get(country)!.push(l);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  if (loading) {
    return (
      <div>
        <h2 className="mb-4 text-xl font-semibold">Sve države</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Sve države</h2>
        <Badge variant="secondary">{filtered.length} liga pronađeno</Badge>
      </div>

      <input
        type="text"
        placeholder="Pretraži lige po imenu ili državi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />

      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
        {grouped.map(([country, items]) => (
          <div key={country}>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground sticky top-0 bg-background/80 backdrop-blur py-1">
              {country}
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((league) => (
                <Link key={league.idLeague} href={`/liga/${league.idLeague}`}>
                  <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-sm">
                    <CardContent className="flex items-center justify-between p-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{league.strLeague}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {grouped.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Nema pronađenih liga za "{search}".
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
