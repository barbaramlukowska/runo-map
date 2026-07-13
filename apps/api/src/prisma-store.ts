import type { Sighting } from "@mushroom-map/shared";
import type { PrismaClient, Sighting as SightingRow } from "./generated/prisma/client.js";
import type { Store } from "./store.js";

// DB rows carry Date objects and nullable fields; the API contract
// (shared Sighting) uses ISO strings and optional fields.
function toSighting(row: SightingRow): Sighting {
  return {
    id: row.id,
    species: row.species,
    lat: row.lat,
    lng: row.lng,
    foundAt: row.foundAt.toISOString(),
    comment: row.comment ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export function createPrismaStore(prisma: PrismaClient): Store {
  return {
    async list(filter = {}) {
      const rows = await prisma.sighting.findMany({
        where: {
          species: filter.species,
          foundAt: { gte: filter.from, lte: filter.to },
        },
      });
      return rows.map(toSighting);
    },
    async getById(id) {
      const row = await prisma.sighting.findUnique({ where: { id } });
      return row ? toSighting(row) : undefined;
    },
    async add(input) {
      return toSighting(await prisma.sighting.create({ data: input }));
    },
  };
}
