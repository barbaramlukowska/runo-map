import { randomUUID } from "node:crypto";
import type { Sighting, SightingInput } from "@mushroom-map/shared";

// In-memory store for stage 1 — replaced by Prisma + PostgreSQL in stage 2.
const sightings: Sighting[] = [
  {
    id: "seed-1",
    species: "BOROWIK",
    lat: 52.13,
    lng: 21.24,
    foundAt: "2026-07-05T00:00:00.000Z",
    comment: "Kabaty forest, near the black trail",
    createdAt: "2026-07-05T18:20:00.000Z",
  },
  {
    id: "seed-2",
    species: "KURKA",
    lat: 52.35,
    lng: 20.79,
    foundAt: "2026-07-08T00:00:00.000Z",
    createdAt: "2026-07-08T09:05:00.000Z",
  },
];

export function listSightings(): Sighting[] {
  return sightings;
}

export function addSighting(input: SightingInput): Sighting {
  const sighting: Sighting = {
    id: randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  };
  sightings.push(sighting);
  return sighting;
}
