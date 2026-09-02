"use client";

import Link from "next/link";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchEvent } from "@/lib/types";
import { formatMatchDate, formatMatchTime } from "@/lib/format";

export function MatchCard({ match }: { match: MatchEvent }) {
  return (
    <Link href={`/utakmica/${match.idEvent}`}>
      <Card className="group overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {match.strLeague}
            </Badge>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {match.dateEvent && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatMatchDate(match.dateEvent)}
                </span>
              )}
              {match.strTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatMatchTime(match.strTime)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 text-right">
              <p className="font-semibold text-sm">{match.strHomeTeam}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
              {match.intHomeScore && match.intAwayScore ? (
                <span className="text-lg font-bold tabular-nums">
                  {match.intHomeScore} : {match.intAwayScore}
                </span>
              ) : (
                <span className="text-sm font-medium text-muted-foreground">VS</span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{match.strAwayTeam}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-end">
            <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Predvidi rezultat <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
