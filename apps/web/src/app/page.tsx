import { Suspense } from "react";
import { MapView } from "@/components/map-view";
import { FilterPanel } from "@/components/filter-panel";

// Data lives fully in the client now: the map never renders on the server, so a
// second (SSR) fetch path would add work with no visual benefit. MapView owns it.
// MapView and FilterPanel read filters via useSearchParams(), which needs a
// Suspense boundary now that this page prerenders statically.
export default function HomePage() {
  return (
    <main>
      <Suspense>
        <MapView />
        <FilterPanel />
      </Suspense>
    </main>
  );
}
