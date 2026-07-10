// Trial type for stage 0 — proves shared imports work across the monorepo.
// Will grow into the full Sighting model + Zod schemas in later stages.
export interface SightingPreview {
  id: string;
  species: string;
  foundAt: Date;
}
