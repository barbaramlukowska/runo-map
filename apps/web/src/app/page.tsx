import { MapView } from "@/components/map-view";
import { FilterPanel } from "@/components/filter-panel";
import { buildApiQuery, parseDaysParam, parseSpeciesParam } from "@/lib/filter-params";
import type { Sighting } from "@runo-map/shared";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

// null = API unreachable; [] = API up with no sightings.
async function fetchSightings(query: string): Promise<Sighting[] | null> {
  try {
    const url = query ? `${API_URL}/api/sightings?${query}` : `${API_URL}/api/sightings`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as Sighting[];
  } catch {
    return null;
  }
}

interface HomePageProps {
  // Next 15: searchParams is async in server components.
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const species = parseSpeciesParam(params.species);
  const days = parseDaysParam(params.days);
  const sightings = await fetchSightings(buildApiQuery(species, days, new Date()));

  return (
    <main>
      {sightings === null && (
        <div
          style={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            background: "#fdfbf7",
            border: "1px solid #d8d4cb",
            borderRadius: 8,
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
          }}
        >
          Nie udało się pobrać zgłoszeń — sprawdź, czy API działa.
        </div>
      )}
      <MapView sightings={sightings ?? []} />
      <FilterPanel />
    </main>
  );
}
