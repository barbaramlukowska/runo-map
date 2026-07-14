"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { useRouter } from "next/navigation";
import { SPECIES, SPECIES_LABELS, sightingInputSchema } from "@runo-map/shared";
import { toSightingInput, type ReportFormValues } from "@/lib/report-input";

interface ReportFormProps {
  location: { lat: number; lng: number };
  onClose: () => void;
}

const FIELD_MESSAGES_PL: Record<string, string> = {
  species: "Wybierz gatunek grzyba.",
  foundAt: "Podaj poprawną datę znalezienia.",
  comment: "Komentarz może mieć maksymalnie 280 znaków.",
  root: "Wybrane miejsce leży poza granicami Polski.",
};

// Resolver backed by the shared schema: assemble the payload, validate it,
// translate Zod issues into Polish messages per field (lat/lng → a top-level banner).
function makeResolver(location: { lat: number; lng: number }): Resolver<ReportFormValues> {
  return (values) => {
    const parsed = sightingInputSchema.safeParse(toSightingInput(values, location));
    if (parsed.success) return { values, errors: {} };
    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "root");
      const key = field === "lat" || field === "lng" ? "root" : field;
      if (!errors[key]) {
        errors[key] = { type: "validate", message: FIELD_MESSAGES_PL[key] ?? "Nieprawidłowa wartość." };
      }
    }
    return { values: {}, errors: errors as never };
  };
}

const todayIso = () => new Date().toISOString().slice(0, 10);

const LABEL_CLASS =
  "mb-1 block text-[10px] font-semibold uppercase tracking-wider text-forest-deep/70";
const INPUT_CLASS =
  "w-full rounded-lg border border-forest-pale/40 bg-forest-pale/20 px-3 py-2.5 text-[13px] text-forest-deep focus:border-forest-soft focus:outline-none";
const ERROR_CLASS = "mt-1 text-[11px] text-[#b3261e]";

export function ReportForm({ location, onClose }: ReportFormProps) {
  const router = useRouter();
  const firstFieldRef = useRef<HTMLSelectElement | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormValues>({
    resolver: makeResolver(location),
    defaultValues: { species: SPECIES[0], foundAt: todayIso(), comment: "" },
  });

  // Esc closes the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Focus the first field when the dialog opens.
  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  const commentLength = watch("comment")?.length ?? 0;
  const rootError = (errors as { root?: { message?: string } }).root?.message;

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sightings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSightingInput(values, location)),
      });
      if (res.status === 201) {
        onClose();
        router.refresh();
        return;
      }
      if (res.status === 429) {
        setServerError("Zbyt wiele zgłoszeń z tego adresu. Spróbuj ponownie za godzinę.");
        return;
      }
      if (res.status === 400) {
        setServerError("Nie udało się zapisać zgłoszenia — sprawdź wprowadzone dane.");
        return;
      }
      setServerError("Coś poszło nie tak. Spróbuj ponownie.");
    } catch {
      setServerError("Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.");
    }
  });

  // Merge react-hook-form's ref with ours so we can focus the select on open.
  const { ref: speciesRef, ...speciesField } = register("species");

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-forest-deep/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-form-title"
        className="w-full max-w-sm rounded-2xl border border-forest-pale/30 bg-cream/95 p-6 shadow-[0_8px_32px_rgba(26,60,42,0.15)] backdrop-blur-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="report-form-title" className="font-serif text-lg text-forest-deep">
          Zgłoś znalezisko
        </h2>
        <p className="mb-4 mt-0.5 text-xs text-forest-mid/70">
          Podziel się obserwacją ze społecznością
        </p>

        <form onSubmit={onSubmit} className="grid gap-3">
          <div>
            <label htmlFor="species" className={LABEL_CLASS}>
              Gatunek
            </label>
            <select
              id="species"
              className={INPUT_CLASS}
              ref={(el) => {
                speciesRef(el);
                firstFieldRef.current = el;
              }}
              {...speciesField}
            >
              {SPECIES.map((s) => (
                <option key={s} value={s}>
                  {SPECIES_LABELS[s].pl}
                </option>
              ))}
            </select>
            {errors.species && <p className={ERROR_CLASS}>{errors.species.message}</p>}
          </div>

          <div>
            <label htmlFor="foundAt" className={LABEL_CLASS}>
              Data znalezienia
            </label>
            <input id="foundAt" type="date" className={INPUT_CLASS} {...register("foundAt")} />
            {errors.foundAt && <p className={ERROR_CLASS}>{errors.foundAt.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="comment" className={LABEL_CLASS}>
                Komentarz (opcjonalnie)
              </label>
              <span className="text-[10px] text-forest-soft">{commentLength}/280</span>
            </div>
            <textarea
              id="comment"
              rows={2}
              maxLength={280}
              placeholder="Np. skraj lasu iglastego, dużo młodych…"
              className={`${INPUT_CLASS} resize-none`}
              {...register("comment")}
            />
            {errors.comment && <p className={ERROR_CLASS}>{errors.comment.message}</p>}
          </div>

          <p className="text-[10px] font-light leading-relaxed text-forest-soft">
            Lokalizacja zostanie zaokrąglona do ok. 500 m — widać las, nie dokładny mech.
          </p>

          {(rootError || serverError) && (
            <p className={ERROR_CLASS} role="alert">
              {rootError ?? serverError}
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="flex-1 cursor-pointer rounded-lg border border-forest-pale/40 py-2.5 text-[13px] text-forest-mid transition-colors hover:bg-forest-pale/20"
              onClick={onClose}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="flex-1 cursor-pointer rounded-lg bg-forest-mid py-2.5 text-[13px] font-semibold text-cream transition-colors hover:bg-forest-deep disabled:cursor-default disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Wysyłanie…" : "Dodaj zgłoszenie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
