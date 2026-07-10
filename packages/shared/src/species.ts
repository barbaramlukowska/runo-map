// Popular mushroom species in Poland — single list shared by form, validation and DB.
export const SPECIES = [
  "BOROWIK",
  "PODGRZYBEK",
  "KURKA",
  "MASLAK",
  "KOZLARZ",
  "RYDZ",
  "OPIENKA",
  "KANIA",
] as const;

export type Species = (typeof SPECIES)[number];
