"use client";

import { useEffect, useRef } from "react";

interface AboutModalProps {
  onClose: () => void;
}

export function AboutModal({ onClose }: AboutModalProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // Esc closes the dialog; focus lands on the close button when it opens.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-forest-deep/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        className="relative w-full max-w-sm rounded-2xl border border-forest-pale/30 bg-cream/95 p-6 shadow-[0_8px_32px_rgba(26,60,42,0.15)] backdrop-blur-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          aria-label="Zamknij"
          className="absolute right-4 top-4 cursor-pointer text-lg text-forest-mid hover:text-forest-deep"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 id="about-title" className="font-serif text-lg text-forest-deep">
          Runo Map
        </h2>
        <p className="mb-4 text-xs text-forest-mid/70">Społecznościowa mapa grzybów w Polsce</p>
        <div className="space-y-3 text-xs text-forest-deep">
          <p>
            <span className="font-semibold">Przeglądaj zgłoszenia</span> — sprawdź, gdzie ostatnio
            sypnęło grzybami.
          </p>
          <p>
            <span className="font-semibold">Zgłoś znalezisko</span> — kliknij mapę i podziel się
            obserwacją. Bez konta, anonimowo.
          </p>
          <p>
            <span className="font-semibold">Filtruj</span> — po gatunku i dacie znalezienia.
          </p>
          <p>
            <span className="font-semibold">Świeżość</span> — ciemne pinezki to świeże zgłoszenia,
            blade to starsze.
          </p>
        </div>
      </div>
    </div>
  );
}
