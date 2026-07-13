import { MapView } from "@/components/map-view";
import type { Sighting } from "@mushroom-map/shared";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

// null = API unreachable; [] = API up with no sightings.
async function fetchSightings(): Promise<Sighting[] | null> {
  try {
    const response = await fetch(`${API_URL}/api/sightings`, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as Sighting[];
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const sightings = await fetchSightings();

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
    </main>
  );
}
