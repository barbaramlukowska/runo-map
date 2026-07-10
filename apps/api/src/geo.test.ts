import { describe, expect, it } from "vitest";
import { roundCoord } from "./geo.js";

describe("roundCoord", () => {
  it("snaps a coordinate to the nearest 0.005 degrees (~500 m)", () => {
    expect(roundCoord(52.1337)).toBe(52.135);
    expect(roundCoord(52.1312)).toBe(52.13);
  });

  it("leaves a value already on the grid unchanged", () => {
    expect(roundCoord(52.13)).toBe(52.13);
  });

  it("avoids floating-point noise in the result", () => {
    expect(roundCoord(21.2468)).toBe(21.245);
  });
});
