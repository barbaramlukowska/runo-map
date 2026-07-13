export type PinAge = "fresh" | "recent" | "older";

const DAY_MS = 24 * 60 * 60 * 1000;

// Thresholds match the map legend: fresh < 7 days, recent 7–14, older 14+.
export function pinAgeCategory(foundAt: string, now: Date): PinAge {
  const ageDays = (now.getTime() - new Date(foundAt).getTime()) / DAY_MS;
  if (ageDays < 7) return "fresh";
  if (ageDays < 14) return "recent";
  return "older";
}
