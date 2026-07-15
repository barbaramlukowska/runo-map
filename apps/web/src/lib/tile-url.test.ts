import { describe, expect, it } from "vitest";
import { buildTileUrl } from "./tile-url";

const BASE = "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";

describe("buildTileUrl", () => {
  it("returns the bare URL when no API key is given (localhost dev)", () => {
    expect(buildTileUrl()).toBe(BASE);
    expect(buildTileUrl("")).toBe(BASE);
    expect(buildTileUrl(undefined)).toBe(BASE);
  });

  it("appends api_key when a key is given (production)", () => {
    expect(buildTileUrl("abc123")).toBe(`${BASE}?api_key=abc123`);
  });
});
