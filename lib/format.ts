export function formatMatchDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("hr-HR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatMatchTime(timeStr: string): string {
  if (!timeStr) return "";
  // TheSportsDB returns time like "20:00" or with seconds
  const parts = timeStr.split(":");
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  return timeStr;
}

export function getFormResult(form: string): ("P" | "N" | "I")[] {
  return form
    .split("")
    .filter((c) => c === "P" || c === "N" || c === "I")
    .slice(-5) as ("P" | "N" | "I")[];
}

export function formColor(result: "P" | "N" | "I"): string {
  switch (result) {
    case "P":
      return "bg-success text-success-foreground";
    case "N":
      return "bg-warning text-warning-foreground";
    case "I":
      return "bg-destructive text-destructive-foreground";
  }
}

export function formLabel(result: "P" | "N" | "I"): string {
  switch (result) {
    case "P":
      return "Pobjeda";
    case "N":
      return "Neodlučeno";
    case "I":
      return "Izgubljeno";
  }
}
