import type { Sighting } from "@mushroom-map/shared";

// Stage 0 placeholder — Next.js app arrives in stage 3.
export function formatSighting(s: Sighting): string {
  return `${s.species} found on ${s.foundAt.slice(0, 10)}`;
}
