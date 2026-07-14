import { describe, expect, it } from "vitest";
import {
  buildApiQuery,
  buildPageQuery,
  parseDaysParam,
  parseSpeciesParam,
  presetToFromParam,
} from "./filter-params";

const now = new Date("2026-07-14T15:00:00Z");

describe("parseSpeciesParam", () => {
  it("returns [] when the param is absent", () => {
    expect(parseSpeciesParam(undefined)).toEqual([]);
  });

  it("wraps a single value in an array", () => {
    expect(parseSpeciesParam("BOROWIK")).toEqual(["BOROWIK"]);
  });

  it("keeps multiple values", () => {
    expect(parseSpeciesParam(["BOROWIK", "KURKA"])).toEqual(["BOROWIK", "KURKA"]);
  });

  it("drops unknown species from a hand-edited link", () => {
    expect(parseSpeciesParam(["BOROWIK", "SMERF"])).toEqual(["BOROWIK"]);
  });

  it("returns [] for a single unknown value", () => {
    expect(parseSpeciesParam("SMERF")).toEqual([]);
  });
});

describe("parseDaysParam", () => {
  it('returns "all" when the param is absent', () => {
    expect(parseDaysParam(undefined)).toBe("all");
  });

  it.each([
    ["3", 3],
    ["7", 7],
    ["14", 14],
  ])("parses %s as a numeric preset", (raw, preset) => {
    expect(parseDaysParam(raw)).toBe(preset);
  });

  it.each([["999"], ["abc"], [""]])('falls back to "all" for %j', (raw) => {
    expect(parseDaysParam(raw)).toBe("all");
  });

  it("takes the first value when the key is repeated", () => {
    expect(parseDaysParam(["7", "14"])).toBe(7);
  });
});

describe("presetToFromParam", () => {
  it('returns undefined for "all"', () => {
    expect(presetToFromParam("all", now)).toBeUndefined();
  });

  it("preset 3 covers 3 calendar days including today", () => {
    expect(presetToFromParam(3, now)).toBe("2026-07-12T00:00:00.000Z");
  });

  it("crosses a month boundary", () => {
    expect(presetToFromParam(7, new Date("2026-07-03T08:00:00Z"))).toBe("2026-06-27T00:00:00.000Z");
  });

  it("preset 14 from mid-July lands on July 1", () => {
    expect(presetToFromParam(14, now)).toBe("2026-07-01T00:00:00.000Z");
  });
});

describe("buildApiQuery", () => {
  it("is empty without active filters", () => {
    expect(buildApiQuery([], "all", now)).toBe("");
  });

  it("repeats species and converts the day preset to from", () => {
    const query = new URLSearchParams(buildApiQuery(["BOROWIK", "KURKA"], 7, now));

    expect(query.getAll("species")).toEqual(["BOROWIK", "KURKA"]);
    expect(query.get("from")).toBe("2026-07-08T00:00:00.000Z");
    expect(query.has("days")).toBe(false);
  });
});

describe("buildPageQuery", () => {
  it("is empty for the default state", () => {
    expect(buildPageQuery([], "all")).toBe("");
  });

  it("keeps days as a preset and repeats species", () => {
    const query = new URLSearchParams(buildPageQuery(["RYDZ"], 3));

    expect(query.getAll("species")).toEqual(["RYDZ"]);
    expect(query.get("days")).toBe("3");
    expect(query.has("from")).toBe(false);
  });
});
