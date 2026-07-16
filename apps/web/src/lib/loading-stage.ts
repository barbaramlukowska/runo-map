// Two-stage loading feedback for the sightings fetch. The API sleeps on
// Render's free tier and a cold start takes ~40 s, so past a threshold the
// UI switches from a plain loader to an explicit "server is waking" note.
export const LOADING_BANNER_DELAY_MS = 400;
export const WAKING_THRESHOLD_MS = 5000;

export type LoadingStage = "hidden" | "loading" | "waking";

export function loadingStage(elapsedMs: number): LoadingStage {
  if (elapsedMs < LOADING_BANNER_DELAY_MS) return "hidden";
  if (elapsedMs < WAKING_THRESHOLD_MS) return "loading";
  return "waking";
}
