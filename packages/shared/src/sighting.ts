import { z } from "zod";
import { SPECIES, type Species } from "./species.js";

// Validates new-sighting input on the frontend form AND the API request body.
export const sightingInputSchema = z.object({
  species: z.enum(SPECIES),
  lat: z.number().min(49).max(55), // Poland's latitude range
  lng: z.number().min(14).max(24.2),
  foundAt: z.iso.datetime(),
  comment: z.string().max(280).optional(),
});

export type SightingInput = z.infer<typeof sightingInputSchema>;

// Query params for listing sightings (map filters) — all optional.
export const sightingFilterSchema = z.object({
  species: z.enum(SPECIES).optional(),
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional(),
});

export type SightingFilter = z.infer<typeof sightingFilterSchema>;

// Dates travel as ISO strings (JSON has no Date type); Prisma introduces Date objects in stage 2.
export interface Sighting {
  id: string;
  species: Species;
  lat: number;
  lng: number;
  foundAt: string;
  comment?: string;
  createdAt: string;
}
