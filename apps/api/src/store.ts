import { randomUUID } from "node:crypto";
import type { Sighting, SightingFilter, SightingInput } from "@mushroom-map/shared";

// Async because production data lives behind the network (Prisma + PostgreSQL).
export interface Store {
  list(filter?: SightingFilter): Promise<Sighting[]>;
  getById(id: string): Promise<Sighting | undefined>;
  add(input: SightingInput): Promise<Sighting>;
}

const inBbox = (s: Sighting, [minLng, minLat, maxLng, maxLat]: [number, number, number, number]) =>
  s.lng >= minLng && s.lng <= maxLng && s.lat >= minLat && s.lat <= maxLat;

// In-memory implementation — used by tests; production uses createPrismaStore.
// Factory (like createApp) so each test gets an isolated instance.
export function createStore(seed: Sighting[] = []): Store {
  const sightings: Sighting[] = [...seed];

  return {
    async list(filter: SightingFilter = {}): Promise<Sighting[]> {
      return sightings.filter(
        (s) =>
          (!filter.species || filter.species.includes(s.species)) &&
          (!filter.from || s.foundAt >= filter.from) &&
          (!filter.to || s.foundAt <= filter.to) &&
          (!filter.bbox || inBbox(s, filter.bbox)),
      );
    },
    async getById(id: string): Promise<Sighting | undefined> {
      return sightings.find((s) => s.id === id);
    },
    async add(input: SightingInput): Promise<Sighting> {
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
