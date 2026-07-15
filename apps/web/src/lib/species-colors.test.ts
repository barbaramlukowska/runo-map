import { describe, expect, it } from "vitest";
import { SPECIES } from "@runo-map/shared";
import { SPECIES_COLORS } from "./species-colors";

describe("SPECIES_COLORS", () => {
  it("defines a 6-digit hex color for every species", () => {
    for (const species of SPECIES) {
      expect(SPECIES_COLORS[species]).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("has no duplicate colors", () => {
    const values = Object.values(SPECIES_COLORS);
    expect(new Set(values).size).toBe(values.length);
  });
});
