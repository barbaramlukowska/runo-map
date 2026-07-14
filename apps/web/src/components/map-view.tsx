"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { Sighting } from "@mushroom-map/shared";
import { ReportForm } from "./report-form";

// Leaflet touches `window` on import, so the map must never render on the server.
const SightingsMap = dynamic(
  () => import("./sightings-map").then((mod) => mod.SightingsMap),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#5a8a5c",
        }}
      >
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
