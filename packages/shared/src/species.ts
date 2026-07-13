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

export interface SpeciesLabel {
  pl: string;
  latin: string;
}

// Display names for the UI (Polish app language) with scientific names.
export const SPECIES_LABELS: Record<Species, SpeciesLabel> = {
  BOROWIK: { pl: "Borowik szlachetny", latin: "Boletus edulis" },
  PODGRZYBEK: { pl: "Podgrzybek brunatny", latin: "Imleria badia" },
  KURKA: { pl: "Kurka / Pieprznik jadalny", latin: "Cantharellus cibarius" },
  MASLAK: { pl: "Maślak zwyczajny", latin: "Suillus luteus" },
  KOZLARZ: { pl: "Koźlarz babka", latin: "Leccinum scabrum" },
  RYDZ: { pl: "Rydz / Mleczaj rydz", latin: "Lactarius deliciosus" },
  OPIENKA: { pl: "Opieńka miodowa", latin: "Armillaria mellea" },
  KANIA: { pl: "Czubajka kania", latin: "Macrolepiota procera" },
};
