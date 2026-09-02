import { League, MatchEvent, Team, TeamStanding, TeamLastEvent } from "./types";

const BASE = "https://www.thesportsdb.com/api/v1/json";

function keyOrFree(key: string | undefined | null): string {
  return key && key.trim().length > 0 ? key.trim() : "3";
}

export async function getAllLeagues(apiKey?: string): Promise<League[]> {
  const k = keyOrFree(apiKey);
  const res = await fetch(`${BASE}/${k}/all_leagues.php`);
  if (!res.ok) throw new Error("Greška pri dohvaćanju liga");
  const data = await res.json();
  return (data.leagues || []).filter((l: League) => l.strSport === "Soccer");
}

export async function searchLeagues(name: string, apiKey?: string): Promise<League[]> {
  const k = keyOrFree(apiKey);
  const res = await fetch(`${BASE}/${k}/search_all_leagues.php?c=World&s=Soccer`);
  if (!res.ok) throw new Error("Greška pri pretraživanju liga");
  const data = await res.json();
  const all: League[] = data.countries || [];
  if (!name) return all;
  const q = name.toLowerCase();
  return all.filter(
    (l) =>
      l.strLeague.toLowerCase().includes(q) ||
      (l.strLeagueAlternate || "").toLowerCase().includes(q) ||
      (l.strCountry || "").toLowerCase().includes(q)
  );
}

export async function getLeagueById(id: string, apiKey?: string): Promise<League | null> {
  const k = keyOrFree(apiKey);
  const res = await fetch(`${BASE}/${k}/lookupleague.php?id=${id}`);
  if (!res.ok) throw new Error("Greška pri dohvaćanju lige");
  const data = await res.json();
  return (data.leagues && data.leagues[0]) || null;
}

export async function getNextEvents(leagueId: string, apiKey?: string): Promise<MatchEvent[]> {
  const k = keyOrFree(apiKey);
  const res = await fetch(`${BASE}/${k}/eventsnextleague.php?id=${leagueId}`);
  if (!res.ok) throw new Error("Greška pri dohvaćanju nadolazećih utakmica");
  const data = await res.json();
  return data.events || [];
}

export async function getLastEvents(leagueId: string, apiKey?: string): Promise<MatchEvent[]> {
  const k = keyOrFree(apiKey);
  const res = await fetch(`${BASE}/${k}/eventspastleague.php?id=${leagueId}`);
  if (!res.ok) throw new Error("Greška pri dohvaćanju prošlih utakmica");
  const data = await res.json();
  return data.events || [];
}

export async function getTeamById(id: string, apiKey?: string): Promise<Team | null> {
  const k = keyOrFree(apiKey);
  const res = await fetch(`${BASE}/${k}/lookupteam.php?id=${id}`);
  if (!res.ok) throw new Error("Greška pri dohvaćanju momčadi");
  const data = await res.json();
  return (data.teams && data.teams[0]) || null;
}

export async function searchTeams(name: string, apiKey?: string): Promise<Team[]> {
  const k = keyOrFree(apiKey);
  const res = await fetch(`${BASE}/${k}/searchteams.php?t=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error("Greška pri pretraživanju momčadi");
  const data = await res.json();
  return data.teams || [];
}

export async function getStandings(leagueId: string, apiKey?: string): Promise<TeamStanding[]> {
  const k = keyOrFree(apiKey);
  const res = await fetch(`${BASE}/${k}/lookuptable.php?l=${leagueId}`);
  if (!res.ok) throw new Error("Greška pri dohvaćanju tablice");
  const data = await res.json();
  return data.table || [];
}

export async function getTeamLastEvents(teamId: string, apiKey?: string): Promise<TeamLastEvent[]> {
  const k = keyOrFree(apiKey);
  const res = await fetch(`${BASE}/${k}/eventslast.php?id=${teamId}`);
  if (!res.ok) throw new Error("Greška pri dohvaćanju nedavnih utakmica momčadi");
  const data = await res.json();
  return data.results || [];
}

export async function getEventById(id: string, apiKey?: string): Promise<MatchEvent | null> {
  const k = keyOrFree(apiKey);
  const res = await fetch(`${BASE}/${k}/lookupevent.php?id=${id}`);
  if (!res.ok) throw new Error("Greška pri dohvaćanju utakmice");
  const data = await res.json();
  return (data.events && data.events[0]) || null;
}
