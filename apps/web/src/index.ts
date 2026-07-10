import type { SightingPreview } from "@mushroom-map/shared";

// Stage 0 placeholder — Next.js app arrives in stage 3.
export function formatSighting(s: SightingPreview): string {
  return `${s.species} found on ${s.foundAt.toISOString().slice(0, 10)}`;
}
