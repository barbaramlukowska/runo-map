import { randomUUID } from "node:crypto";
import type { Sighting, SightingInput } from "@mushroom-map/shared";

// In-memory store for stage 1 — replaced by Prisma + PostgreSQL in stage 2.
// Factory (like createApp) so each test gets an isolated instance.
export function createStore(seed: Sighting[] = []) {
  const sightings: Sighting[] = [...seed];

  return {
    list(): Sighting[] {
      return sightings;
    },
    add(input: SightingInput): Sighting {
      const sighting: Sighting = {
        id: randomUUID(),
        ...input,
        createdAt: new Date().toISOString(),
      };
      sightings.push(sighting);
      return sighting;
    },
  };
}

export type Store = ReturnType<typeof createStore>;
