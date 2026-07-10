import { randomUUID } from "node:crypto";
import type { Sighting, SightingFilter, SightingInput } from "@mushroom-map/shared";

// In-memory store for stage 1 — replaced by Prisma + PostgreSQL in stage 2.
// Factory (like createApp) so each test gets an isolated instance.
export function createStore(seed: Sighting[] = []) {
  const sightings: Sighting[] = [...seed];

  return {
    list(filter: SightingFilter = {}): Sighting[] {
      return sightings.filter(
        (s) =>
          (!filter.species || s.species === filter.species) &&
          (!filter.from || s.foundAt >= filter.from) &&
          (!filter.to || s.foundAt <= filter.to),
      );
    },
    getById(id: string): Sighting | undefined {
      return sightings.find((s) => s.id === id);
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
