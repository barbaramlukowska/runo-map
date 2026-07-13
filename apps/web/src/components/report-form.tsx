"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { useRouter } from "next/navigation";
import { SPECIES, SPECIES_LABELS, sightingInputSchema } from "@mushroom-map/shared";
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
    <div style={overlayStyle} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-form-title"
        style={panelStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="report-form-title" style={titleStyle}>
          Zgłoś znalezisko
        </h2>
        <p style={subtitleStyle}>Podziel się obserwacją ze społecznością</p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <div>
            <label htmlFor="species" style={labelStyle}>
              Gatunek
            </label>
            <select
              id="species"
              style={inputStyle}
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
            {errors.species && <p style={errorStyle}>{errors.species.message}</p>}
          </div>

          <div>
            <label htmlFor="foundAt" style={labelStyle}>
              Data znalezienia
            </label>
            <input id="foundAt" type="date" style={inputStyle} {...register("foundAt")} />
            {errors.foundAt && <p style={errorStyle}>{errors.foundAt.message}</p>}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label htmlFor="comment" style={labelStyle}>
                Komentarz (opcjonalnie)
              </label>
              <span style={counterStyle}>{commentLength}/280</span>
            </div>
            <textarea
              id="comment"
              rows={2}
              maxLength={280}
              placeholder="Np. skraj lasu iglastego, dużo młodych…"
              style={{ ...inputStyle, resize: "none" }}
              {...register("comment")}
            />
            {errors.comment && <p style={errorStyle}>{errors.comment.message}</p>}
          </div>

          <p style={noteStyle}>
            Lokalizacja zostanie zaokrąglona do ok. 500 m — widać las, nie dokładny mech.
          </p>

          {(rootError || serverError) && (
            <p style={errorStyle} role="alert">
              {rootError ?? serverError}
            </p>
          )}

          <div style={actionsStyle}>
            <button type="button" style={cancelStyle} onClick={onClose}>
              Anuluj
            </button>
            <button type="submit" style={submitStyle} disabled={isSubmitting}>
              {isSubmitting ? "Wysyłanie…" : "Dodaj zgłoszenie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(45,76,59,0.4)",
  backdropFilter: "blur(2px)",
  padding: 16,
};

const panelStyle: CSSProperties = {
  width: "100%",
  maxWidth: 360,
  background: "#fdfbf7",
  border: "1px solid #d8d4ce",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 10px 30px rgba(45,76,59,0.25)",
};

const titleStyle: CSSProperties = { margin: 0, color: "#2d4c3b", fontSize: "1.125rem", fontWeight: 600 };
const subtitleStyle: CSSProperties = { margin: "2px 0 16px", color: "#5a8a5c", fontSize: "0.75rem" };
const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: 4,
  color: "#2d4c3b",
  fontSize: "0.625rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};
const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  fontSize: "0.8125rem",
  color: "#2d4c3b",
  background: "rgba(216,212,206,0.2)",
  border: "1px solid rgba(216,212,206,0.7)",
  borderRadius: 8,
  boxSizing: "border-box",
};
const counterStyle: CSSProperties = { color: "#5a8a5c", fontSize: "0.625rem" };
const noteStyle: CSSProperties = { color: "#5a8a5c", fontSize: "0.625rem", lineHeight: 1.5, fontWeight: 300 };
const errorStyle: CSSProperties = { margin: "4px 0 0", color: "#b3261e", fontSize: "0.6875rem" };
const actionsStyle: CSSProperties = { display: "flex", gap: 8, marginTop: 16 };
const cancelStyle: CSSProperties = {
  flex: 1,
  padding: "10px",
  fontSize: "0.8125rem",
  color: "#5a8a5c",
  background: "transparent",
  border: "1px solid rgba(216,212,206,0.7)",
  borderRadius: 8,
  cursor: "pointer",
};
const submitStyle: CSSProperties = {
  flex: 1,
  padding: "10px",
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#fdfbf7",
  background: "#5a8a5c",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
