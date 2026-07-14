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
const SECTION_LABEL = "text-xs font-semibold uppercase tracking-wider text-forest-deep/80";

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
        className="fixed left-4 top-[72px] z-[500] cursor-pointer rounded-lg border border-forest-pale/30 bg-cream/90 px-4 py-2 text-[13px] font-semibold text-forest-deep shadow-[0_3px_10px_rgba(45,76,59,0.25)] backdrop-blur-lg"
        onClick={() => setOpen(!open)}
      >
        Filtry
      </button>
      <aside
        id="filter-panel"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 z-[500] max-h-[60dvh] overflow-y-auto rounded-t-2xl border-t border-forest-pale/30 bg-cream/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_32px_rgba(26,60,42,0.25)] backdrop-blur-lg md:inset-x-auto md:bottom-auto md:left-4 md:top-[120px] md:max-h-[calc(100dvh-136px)] md:w-[300px] md:rounded-xl md:border md:pb-0 md:shadow-[0_8px_32px_rgba(26,60,42,0.15)]"
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-muted md:hidden" aria-hidden="true" />
        <div className="flex items-center justify-between p-4 pb-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-forest-soft">
              Filtry
            </p>
            <h2 className="font-serif text-lg text-forest-deep">Zgłoszenia</h2>
          </div>
          <button
            type="button"
            className="cursor-pointer text-xs font-medium text-amber transition-colors hover:text-forest-mid"
            onClick={() => applyFilters([], "all")}
          >
            Wyczyść
          </button>
        </div>

        <fieldset className="mb-4 px-4">
          <legend className={`mb-2 ${SECTION_LABEL}`}>Zakres czasu</legend>
          <div className="flex gap-0.5 rounded-lg bg-forest-pale/20 p-0.5">
            {DAY_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-pressed={days === preset}
                className={`flex-1 cursor-pointer rounded-md py-1.5 text-xs font-medium transition-all ${
                  days === preset
                    ? "bg-forest-mid text-cream shadow-[0_1px_4px_rgba(45,90,61,0.3)]"
                    : "text-forest-mid"
                }`}
                onClick={() => applyFilters(selected, preset)}
              >
                {DAY_LABELS[preset]}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="border-t border-forest-pale/30">
          <fieldset>
            <legend className={`px-4 pb-1 pt-3 ${SECTION_LABEL}`}>Gatunki</legend>
            {SPECIES.map((species) => {
              const isSelected = selected.includes(species);
              return (
                <label
                  key={species}
                  className={`flex cursor-pointer items-center gap-3 border-b border-forest-pale/20 px-4 py-3 transition-colors last:border-b-0 ${
                    isSelected ? "bg-forest-mid/10" : "hover:bg-forest-soft/5"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-forest-mid"
                    checked={isSelected}
                    onChange={() => toggleSpecies(species)}
                  />
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ background: SPECIES_COLORS[species] }}
                  />
                  <span className="flex-1">
                    <span className="block text-xs font-medium leading-tight text-forest-deep">
                      {SPECIES_LABELS[species].pl}
                    </span>
                    <span className="block text-[10px] font-light italic text-forest-soft">
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
