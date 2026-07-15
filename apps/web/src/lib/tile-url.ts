const STADIA_ALIDADE_SMOOTH =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";

// Localhost works without a key; production passes a domain-restricted key.
// Empty/undefined key → bare URL, so dev never breaks on a missing env var.
export function buildTileUrl(apiKey?: string): string {
  if (!apiKey) return STADIA_ALIDADE_SMOOTH;
  return `${STADIA_ALIDADE_SMOOTH}?api_key=${apiKey}`;
}
