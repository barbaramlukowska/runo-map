import { describe, expect, it } from "vitest";
import { sightingInputSchema } from "@runo-map/shared";
import { toSightingInput } from "./report-input";

const location = { lat: 52.23, lng: 21.01 };

describe("toSightingInput", () => {
  it("converts the date to UTC-midnight ISO", () => {
    const result = toSightingInput({ species: "BOROWIK", foundAt: "2026-07-13", comment: "" }, location);
    expect(result.foundAt).toBe("2026-07-13T00:00:00.000Z");
  });

  it("carries the clicked coordinates and species", () => {
    const result = toSightingInput({ species: "KURKA", foundAt: "2026-07-13", comment: "" }, location);
    expect(result).toMatchObject({ species: "KURKA", lat: 52.23, lng: 21.01 });
  });

  it("maps an empty comment to undefined", () => {
    const result = toSightingInput({ species: "RYDZ", foundAt: "2026-07-13", comment: "" }, location);
    expect(result.comment).toBeUndefined();
  });

  it("maps a whitespace-only comment to undefined", () => {
    const result = toSightingInput({ species: "RYDZ", foundAt: "2026-07-13", comment: "   " }, location);
    expect(result.comment).toBeUndefined();
  });

  it("keeps a real comment", () => {
    const result = toSightingInput({ species: "RYDZ", foundAt: "2026-07-13", comment: "skraj lasu" }, location);
    expect(result.comment).toBe("skraj lasu");
  });

  it("produces a body that passes the shared schema", () => {
    const result = toSightingInput({ species: "MASLAK", foundAt: "2026-07-13", comment: "" }, location);
    expect(sightingInputSchema.safeParse(result).success).toBe(true);
  });
});
