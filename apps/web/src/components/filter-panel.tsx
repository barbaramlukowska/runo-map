"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SPECIES, SPECIES_LABELS, type Species } from "@runo-map/shared";
import { SPECIES_COLORS } from "@/lib/species-colors";
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

// z-index 500: above the map tiles (~400), below the top bar (600) and
// modals (1000), clear of the bottom-right zoom control.

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
        className="fixed left-4 top-18 z-panel cursor-pointer rounded-lg border border-line/30 bg-surface/92 backdrop-blur-lg px-4 py-2 text-[13px] font-semibold text-content shadow-toggle"
        onClick={() => setOpen(!open)}
      >
        Filtry
      </button>
      <aside
        id="filter-panel"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 z-panel max-h-[60dvh] overflow-y-auto rounded-t-2xl border-t border-line/30 bg-surface/92 backdrop-blur-lg pb-[env(safe-area-inset-bottom)] shadow-sheet md:inset-x-auto md:bottom-auto md:left-4 md:top-[120px] md:max-h-[calc(100dvh-136px)] md:w-[300px] md:rounded-xl md:border md:pb-0 md:shadow-panel"
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-stale md:hidden" aria-hidden="true" />
        <div className="flex items-center justify-between p-4 pb-3">
          <div>
            <p className="text-eyebrow">
              Filtry
            </p>
            <h2 className="text-title">Zgłoszenia</h2>
          </div>
          <button
            type="button"
            className="cursor-pointer text-xs font-medium text-accent transition-colors hover:text-content-soft"
            onClick={() => applyFilters([], "all")}
          >
            Wyczyść
          </button>
        </div>

        <fieldset className="mb-4 px-4">
          <legend className="mb-2 text-label">Zakres czasu</legend>
          <div className="flex gap-0.5 rounded-lg bg-line/20 p-0.5">
            {DAY_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-pressed={days === preset}
                className={`flex-1 cursor-pointer rounded-md py-1.5 text-xs font-medium transition-all ${
                  days === preset
                    ? "bg-fill text-inverse shadow-chip"
                    : "text-content-soft"
                }`}
                onClick={() => applyFilters(selected, preset)}
              >
                {DAY_LABELS[preset]}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="border-t border-line/30">
          <fieldset>
            <legend className="px-4 pb-1 pt-3 text-label">Gatunki</legend>
            {SPECIES.map((species) => {
              const isSelected = selected.includes(species);
              return (
                <label
                  key={species}
                  className={`flex cursor-pointer items-center gap-3 border-b border-line/20 px-4 py-3 transition-colors last:border-b-0 ${
                    isSelected ? "bg-fill/10" : "hover:bg-fill/5"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 cursor-pointer accent-fill"
                    checked={isSelected}
                    onChange={() => toggleSpecies(species)}
                  />
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ background: SPECIES_COLORS[species] }}
                  />
                  <span className="flex-1">
                    <span className="block text-xs font-medium leading-tight text-content">
                      {SPECIES_LABELS[species].pl}
                    </span>
                    <span className="block text-latin">
                      {SPECIES_LABELS[species].latin}
                    </span>
                  </span>
                </label>
              );
            })}
          </fieldset>
        </div>
      </aside>
    </>
  );
}
