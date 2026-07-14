"use client";

import { useState } from "react";
import { AboutModal } from "./about-modal";

// Same mushroom path the map pins use.
function MushroomLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3C7.5 3 4 6.5 4 10c0 2.5 1.5 4.5 3.5 5.5V19c0 .6.4 1 1 1h7c.6 0 1-.4 1-1v-3.5C18.5 14.5 20 12.5 20 10c0-3.5-3.5-7-8-7z"
        fill="#1a3c2a"
        opacity="0.15"
      />
      <path
        d="M12 3C7.5 3 4 6.5 4 10c0 2.5 1.5 4.5 3.5 5.5V19c0 .6.4 1 1 1h7c.6 0 1-.4 1-1v-3.5C18.5 14.5 20 12.5 20 10c0-3.5-3.5-7-8-7z"
        stroke="#1a3c2a"
        strokeWidth="1.2"
      />
      <line x1="12" y1="15.5" x2="12" y2="20" stroke="#1a3c2a" strokeWidth="1.2" />
    </svg>
  );
}

// z-index 600: above the filter panel (500), below modals (1000).
export function TopBar() {
  const [legendOpen, setLegendOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[600] border-b border-forest-soft/25 bg-cream/95 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <MushroomLogo />
          <span className="font-serif text-xl tracking-wide text-forest-deep">Runo Map</span>
          <span className="hidden border-l border-forest-pale/40 pl-3 text-xs font-light uppercase tracking-widest text-forest-soft sm:inline">
            Polska
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-expanded={legendOpen}
            aria-controls="legend-panel"
            className="cursor-pointer rounded-sm border border-forest-soft/35 px-3 py-1 text-xs uppercase tracking-widest text-forest-soft transition-colors hover:bg-forest-soft/10"
            onClick={() => setLegendOpen(!legendOpen)}
          >
            Legenda
          </button>
          <button
            type="button"
            className="hidden cursor-pointer text-xs uppercase tracking-widest text-forest-soft transition-colors hover:text-forest-deep md:block"
            onClick={() => setAboutOpen(true)}
          >
            O aplikacji
          </button>
        </div>
      </div>

      {/* Disclosure legend expanding from the bar; colors match the map pins. */}
      <div id="legend-panel" hidden={!legendOpen} className="border-t border-forest-pale/30 px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-forest-soft">
            Wiek zgłoszenia
          </p>
          <div className="h-1.5 rounded-xs bg-linear-to-r from-[#2d4c3b] via-[#5a8a5c] to-muted" />
          <div className="mt-1.5 flex justify-between text-xs font-light">
            <span className="text-forest-deep">Świeże — dziś</span>
            <span className="text-forest-mid">7 dni</span>
            <span className="text-forest-soft">14 dni</span>
            <span className="text-[#b8b097]">starsze</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs font-light text-forest-deep">
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full bg-[#2d4c3b]" /> Świeże (do 7 dni)
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#5a8a5c]" /> Ostatnie (7–14 dni)
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#d8d4ce]" /> Starsze (14+ dni)
            </span>
            <span className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2d4c3b] text-[8px] font-semibold text-cream">
                12
              </span>
              Klaster — wiele zgłoszeń
            </span>
          </div>
        </div>
      </div>
      </header>
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
    </>
  );
}
