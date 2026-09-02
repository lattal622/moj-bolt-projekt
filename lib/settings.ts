import { AISettings, DEFAULT_SETTINGS, Prediction } from "./types";

const SETTINGS_KEY = "csai_settings";
const PREDICTIONS_KEY = "csai_predictions";

export function loadSettings(): AISettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AISettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadPredictions(): Prediction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PREDICTIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function savePrediction(pred: Prediction) {
  const all = loadPredictions();
  const filtered = all.filter((p) => p.matchId !== pred.matchId);
  filtered.unshift(pred);
  localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(filtered.slice(0, 100)));
}

export function deletePrediction(id: string) {
  const all = loadPredictions().filter((p) => p.id !== id);
  localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(all));
}

export function clearPredictions() {
  localStorage.removeItem(PREDICTIONS_KEY);
}
