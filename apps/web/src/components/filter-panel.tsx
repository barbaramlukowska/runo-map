"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SPECIES, SPECIES_LABELS, type Species } from "@runo-map/shared";
import {
  DAY_PRESETS,
  buildPageQuery,
  parseDaysParam,
  parseSpeciesParam,
  type DayPreset,
} from "@/lib/filter-params";

const DAY_LABELS: Record<DayPreset, string> = {
  3: "3 dni",
  7: "7 dni",
  14: "14 dni",
  all: "Wszystkie",
};

// Disclosure panel (not a modal): the map behind it stays interactive.
export function FilterPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  // Desktop starts expanded; mobile stays collapsed so the map is visible.
  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) setOpen(true);
  }, []);

  const selected = parseSpeciesParam(searchParams.getAll("species"));
  const days = parseDaysParam(searchParams.get("days") ?? undefined);

  const applyFilters = (species: Species[], nextDays: DayPreset) => {
    const query = buildPageQuery(species, nextDays);
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const toggleSpecies = (species: Species) => {
    const next = selected.includes(species)
      ? selected.filter((s) => s !== species)
      : [...selected, species];
    applyFilters(next, days);
  };

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="filter-panel"
        style={toggleStyle}
        onClick={() => setOpen(!open)}
      >
        Filtry
      </button>
      <aside id="filter-panel" hidden={!open} style={panelStyle}>
        <div style={headerRowStyle}>
          <div>
            <p style={kickerStyle}>Filtry</p>
            <h2 style={titleStyle}>Zgłoszenia</h2>
          </div>
          <button type="button" style={clearStyle} onClick={() => applyFilters([], "all")}>
            Wyczyść
          </button>
        </div>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Zakres czasu</legend>
          <div style={segmentRowStyle}>
            {DAY_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-pressed={days === preset}
                style={days === preset ? segmentActiveStyle : segmentStyle}
                onClick={() => applyFilters(selected, preset)}
              >
                {DAY_LABELS[preset]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Gatunki</legend>
          {SPECIES.map((species) => (
            <label key={species} style={speciesRowStyle}>
              <input
                type="checkbox"
                checked={selected.includes(species)}
                onChange={() => toggleSpecies(species)}
              />
              <span>
                <span style={speciesNameStyle}>{SPECIES_LABELS[species].pl}</span>
                <span style={speciesLatinStyle}>{SPECIES_LABELS[species].latin}</span>
              </span>
            </label>
          ))}
        </fieldset>
      </aside>
    </>
  );
}

// z-index 500: above the map tiles (~400), below the report modal and the
// API-error banner (both 1000), clear of the bottom-right zoom control.
const toggleStyle: CSSProperties = {
  position: "fixed",
  top: 16,
  left: 16,
  zIndex: 500,
  padding: "8px 16px",
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#2d4c3b",
  background: "#fdfbf7",
  border: "1px solid #d8d4ce",
  borderRadius: 8,
  boxShadow: "0 3px 10px rgba(45,76,59,0.25)",
  cursor: "pointer",
};

const panelStyle: CSSProperties = {
  position: "fixed",
  top: 64,
  left: 16,
  zIndex: 500,
  width: 280,
  maxHeight: "calc(100dvh - 80px)",
  overflowY: "auto",
  background: "#fdfbf7",
  border: "1px solid #d8d4ce",
  borderRadius: 16,
  padding: 16,
  boxShadow: "0 10px 30px rgba(45,76,59,0.25)",
};

const headerRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 12,
};

const kickerStyle: CSSProperties = {
  margin: 0,
  color: "#5a8a5c",
  fontSize: "0.625rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

const titleStyle: CSSProperties = { margin: 0, color: "#2d4c3b", fontSize: "1.125rem", fontWeight: 600 };

const clearStyle: CSSProperties = {
  padding: "4px 8px",
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#b3702d",
  background: "transparent",
  border: "none",
  cursor: "pointer",
};

const fieldsetStyle: CSSProperties = { margin: "0 0 12px", padding: 0, border: "none" };

const legendStyle: CSSProperties = {
  marginBottom: 6,
  padding: 0,
  color: "#2d4c3b",
  fontSize: "0.625rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const segmentRowStyle: CSSProperties = {
  display: "flex",
  gap: 2,
  padding: 2,
  background: "rgba(216,212,206,0.35)",
  borderRadius: 8,
};

const segmentStyle: CSSProperties = {
  flex: 1,
  padding: "6px 0",
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#5a8a5c",
  background: "transparent",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const segmentActiveStyle: CSSProperties = {
  ...segmentStyle,
  color: "#fdfbf7",
  background: "#2d4c3b",
  fontWeight: 600,
};

const speciesRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "8px 4px",
  borderBottom: "1px solid rgba(216,212,206,0.5)",
  cursor: "pointer",
};

const speciesNameStyle: CSSProperties = {
  display: "block",
  color: "#2d4c3b",
  fontSize: "0.8125rem",
  fontWeight: 500,
  lineHeight: 1.2,
};

const speciesLatinStyle: CSSProperties = {
  display: "block",
  color: "#8a9a88",
  fontSize: "0.6875rem",
  fontStyle: "italic",
  fontWeight: 300,
};
