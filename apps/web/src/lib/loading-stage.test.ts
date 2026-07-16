import { describe, expect, it } from "vitest";
import {
  LOADING_BANNER_DELAY_MS,
  WAKING_THRESHOLD_MS,
  loadingStage,
} from "./loading-stage";

describe("loadingStage", () => {
  it("stays hidden below the banner delay", () => {
    expect(loadingStage(0)).toBe("hidden");
    expect(loadingStage(LOADING_BANNER_DELAY_MS - 1)).toBe("hidden");
  });

  it("shows the loading stage from the delay up to the waking threshold", () => {
    expect(loadingStage(LOADING_BANNER_DELAY_MS)).toBe("loading");
    expect(loadingStage(WAKING_THRESHOLD_MS - 1)).toBe("loading");
  });

  it("switches to waking at the threshold and stays there", () => {
    expect(loadingStage(WAKING_THRESHOLD_MS)).toBe("waking");
    expect(loadingStage(WAKING_THRESHOLD_MS + 60_000)).toBe("waking");
  });
});
