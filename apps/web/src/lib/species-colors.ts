import type { Species } from "@runo-map/shared";

// Dot colors for the filter panel, from the mockup palette
// (docs/design/mockup-mvp.html); RYDZ/OPIENKA/KANIA are not in the mockup
// and extend it within the same earthy range.
export const SPECIES_COLORS: Record<Species, string> = {
  BOROWIK: "#2d5a3d",
  PODGRZYBEK: "#8b5e3c",
  KURKA: "#d4a373",
  MASLAK: "#b5835a",
  KOZLARZ: "#c9a96e",
  RYDZ: "#c96f32",
  OPIENKA: "#c9a227",
  KANIA: "#a8988a",
};
