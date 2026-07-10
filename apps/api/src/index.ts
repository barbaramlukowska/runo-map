import type { SightingPreview } from "@mushroom-map/shared";

// Stage 0 placeholder — Express server arrives in stage 1.
const sample: SightingPreview = {
  id: "demo-1",
  species: "BOROWIK",
  foundAt: new Date(),
};

console.log("api placeholder, shared import works:", sample);
