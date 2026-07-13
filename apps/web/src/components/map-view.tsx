"use client";

import dynamic from "next/dynamic";
import type { Sighting } from "@mushroom-map/shared";

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
  return <SightingsMap sightings={sightings} />;
}
