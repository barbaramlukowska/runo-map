"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { Sighting } from "@runo-map/shared";
import { ReportForm } from "./report-form";

// Leaflet touches `window` on import, so the map must never render on the server.
const SightingsMap = dynamic(
  () => import("./sightings-map").then((mod) => mod.SightingsMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-dvh items-center justify-center text-forest-soft">
        Wczytywanie mapy…
      </div>
    ),
  },
);

interface MapViewProps {
  sightings: Sighting[];
}

export function MapView({ sightings }: MapViewProps) {
  const [pendingLocation, setPendingLocation] = useState<{ lat: number; lng: number } | null>(null);

  return (
    <>
      <SightingsMap sightings={sightings} onMapClick={setPendingLocation} />
      {pendingLocation && (
        <ReportForm location={pendingLocation} onClose={() => setPendingLocation(null)} />
      )}
    </>
  );
}
