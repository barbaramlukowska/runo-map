import { SPECIES } from "@mushroom-map/shared";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "4rem 1.5rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>MushroomMap</h1>
      <p style={{ marginBottom: "2rem", color: "#2d5a3d" }}>
        Społecznościowa mapa grzybów w Polsce. Mapa pojawi się w kolejnym kroku
        — poniżej lista gatunków wczytana z pakietu shared.
      </p>
      <ul style={{ listStyle: "none", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {SPECIES.map((species) => (
          <li
            key={species}
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: 999,
              background: "rgba(160, 196, 157, 0.3)",
              fontSize: "0.875rem",
            }}
          >
            {species}
          </li>
        ))}
      </ul>
    </main>
  );
}
