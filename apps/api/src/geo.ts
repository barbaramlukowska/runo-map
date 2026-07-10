// Location privacy: snap coordinates to a 0.005° grid (~500 m) before storing,
// so a sighting reveals the forest, not the exact spot.
const GRID = 0.005;

export function roundCoord(value: number): number {
  // toFixed strips floating-point noise like 21.244999999999997
  return Number((Math.round(value / GRID) * GRID).toFixed(3));
}
