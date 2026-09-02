export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate?: string;
  strCountry?: string;
  strBadge?: string;
}

export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamShort?: string;
  strAlternate?: string;
  intFormedYear?: string;
  strLeague?: string;
  idLeague?: string;
  strStadium?: string;
  strKeywords?: string;
  strStadiumThumb?: string;
  strBadge?: string;
  strCountry?: string;
  strDescription?: string;
  strWebsite?: string;
}

export interface MatchEvent {
  idEvent: string;
  strEvent: string;
  strEventAlternate?: string;
  strFilename?: string;
  strSport: string;
  idLeague: string;
  strLeague: string;
  strSeason: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore?: string;
  intAwayScore?: string;
  intRound?: string;
  intSpectators?: string;
  strOfficial?: string;
  strTimestamp?: string;
  dateEvent?: string;
  dateEventLocal?: string;
  strTime?: string;
  strTimeLocal?: string;
  strTVStation?: string;
  idHomeTeam: string;
  idAwayTeam: string;
  strResult?: string;
  strVenue?: string;
  strCountry?: string;
  strCity?: string;
  strPoster?: string;
  strSquare?: string;
  strFanart?: string;
  strThumb?: string;
  strBanner?: string;
  strMap?: string;
  strTweet1?: string;
  strVideo?: string;
  strLocked?: string;
}

export interface TeamStanding {
  idStanding: string;
  intRank: string;
  idTeam: string;
  strTeam: string;
  strTeamBadge?: string;
  idLeague: string;
  strLeague: string;
  strForm: string;
  strDescription: string;
  intPlayed: string;
  intWin: string;
  intLoss: string;
  intDraw: string;
  intGoalsFor: string;
  intGoalsAgainst: string;
  intGoalDifference: string;
  intPoints: string;
  dateUpdated?: string;
}

export interface TeamLastEvent {
  idEvent: string;
  strEvent: string;
  strLeague: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string;
  intAwayScore: string;
  dateEvent: string;
  strTime: string;
  idHomeTeam: string;
  idAwayTeam: string;
}

export interface Prediction {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  dateEvent: string;
  predictedHomeScore: number;
  predictedAwayScore: number;
  predictedScore: string;
  reasoning?: string;
  confidence?: number;
  createdAt: string;
}

export interface AISettings {
  aiSource: "gemini" | "ollama" | "groq";
  geminiApiKey: string;
  groqApiKey: string;
  groqModel: string;
  sportsDbApiKey: string;
  apiFootballKey: string;
  ollamaUrl: string;
  ollamaModel: string;
}

export const DEFAULT_SETTINGS: AISettings = {
  aiSource: "groq",
  geminiApiKey: "",
  groqApiKey: "",
  groqModel: "llama-3.3-70b-versatile",
  sportsDbApiKey: "3",
  apiFootballKey: "",
  ollamaUrl: "http://localhost:11434",
  ollamaModel: "llama3.2",
};

export const GROQ_MODELS = [
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B (najbolji za analizu)" },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B (najbrži)" },
  { id: "openai/gpt-oss-120b", name: "GPT-OSS 120B (napredni)" },
  { id: "openai/gpt-oss-20b", name: "GPT-OSS 20B (brzi)" },
  { id: "qwen-2.5-32b", name: "Qwen 2.5 32B" },
];

export const POPULAR_LEAGUES: { id: string; name: string; country: string }[] = [
  { id: "4328", name: "Engleska Premier liga", country: "Engleska" },
  { id: "4335", name: "Španjolska La Liga", country: "Španjolska" },
  { id: "4331", name: "Njemačka Bundesliga", country: "Njemačka" },
  { id: "4332", name: "Talijanska Serie A", country: "Italija" },
  { id: "4334", name: "Francuska Ligue 1", country: "Francuska" },
  { id: "4338", name: "Nizozemska Eredivisie", country: "Nizozemska" },
  { id: "4344", name: "Portugalska Primeira Liga", country: "Portugal" },
  { id: "4346", name: "Američka MLS", country: "SAD" },
  { id: "4330", name: "Škotska Premiership", country: "Škotska" },
  { id: "4339", name: "Turska Süper Lig", country: "Turska" },
  { id: "4336", name: "Belgijska First Division A", country: "Belgija" },
  { id: "4347", name: "Grčka Super League", country: "Grčka" },
  { id: "4341", name: "Austrijska Bundesliga", country: "Austrija" },
  { id: "4342", name: "Danska Superliga", country: "Danska" },
  { id: "4343", name: "Švedska Allsvenskan", country: "Švedska" },
  { id: "4340", name: "Norveška Eliteserien", country: "Norveška" },
  { id: "4348", name: "Finska Veikkausliiga", country: "Finska" },
  { id: "4349", name: "Poljska Ekstraklasa", country: "Poljska" },
  { id: "4345", name: "Hrvatska HNL", country: "Hrvatska" },
  { id: "4350", name: "Srpska SuperLiga", country: "Srbija" },
  { id: "4351", name: "Slovenska PrvaLiga", country: "Slovenija" },
  { id: "4352", name: "Bosanska Premier Liga", country: "Bosna i Hercegovina" },
  { id: "4353", name: "Bugarska First League", country: "Bugarska" },
  { id: "4354", name: "Rumunjska Liga I", country: "Rumunjska" },
  { id: "4355", name: "Mađarska NB I", country: "Mađarska" },
  { id: "4356", name: "Češka First League", country: "Češka" },
  { id: "4357", name: "Slovačka Fortuna Liga", country: "Slovačka" },
  { id: "4358", name: "Ruska Premier Liga", country: "Rusija" },
  { id: "4359", name: "Švicarska Super League", country: "Švicarska" },
  { id: "4360", name: "Ukrajinska Premier Liga", country: "Ukrajina" },
  { id: "4361", name: "Brazilski Série A", country: "Brazil" },
  { id: "4362", name: "Argentinska Primera División", country: "Argentina" },
  { id: "4363", name: "Čileanska Primera División", country: "Čile" },
  { id: "4364", name: "Kolumbijska Categoría Primera A", country: "Kolumbija" },
  { id: "4365", name: "Meksička Liga MX", country: "Meksiko" },
  { id: "4366", name: "Urugvajska Primera División", country: "Urugvaj" },
  { id: "4367", name: "Ekvadorska Serie A", country: "Ekvador" },
  { id: "4368", name: "Paragvajska Primera División", country: "Paragvaj" },
  { id: "4369", name: "Peruanska Liga 1", country: "Peru" },
  { id: "4370", name: "Japanska J1 League", country: "Japan" },
  { id: "4371", name: "Korejska K League 1", country: "Južna Koreja" },
  { id: "4372", name: "Kineska Super League", country: "Kina" },
  { id: "4373", name: "Saudijska Pro League", country: "Saudijska Arabija" },
  { id: "4374", name: "Katarska Stars League", country: "Katar" },
  { id: "4375", name: "UAE Pro League", country: "UAE" },
  { id: "4376", name: "Indijska Super League", country: "Indija" },
  { id: "4377", name: "Australska A-League", country: "Australija" },
  { id: "4378", name: "Južnoafrička Premier Division", country: "Južna Afrika" },
  { id: "4379", name: "Egipatska Premier League", country: "Egipat" },
  { id: "4380", name: "Marokanska Botola Pro", country: "Maroko" },
  { id: "4381", name: "Alžirska Ligue 1", country: "Alžir" },
  { id: "4382", name: "Tuniška Ligue Professionnelle 1", country: "Tunis" },
  { id: "4383", name: "Nigerijska Professional League", country: "Nigerija" },
  { id: "4384", name: "Obala Bjelokosti Ligue 1", country: "Obala Bjelokosti" },
];
