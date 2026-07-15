"use client";

import { useState } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { SPECIES, SPECIES_LABELS, sightingInputSchema } from "@runo-map/shared";
import { toSightingInput, type ReportFormValues } from "@/lib/report-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ReportFormProps {
  location: { lat: number; lng: number };
  onClose: () => void;
  onReported: () => void;
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

const LABEL_CLASS = "mb-1 text-xs font-semibold uppercase tracking-wider text-content";
const ERROR_CLASS = "mt-1 text-[11px] text-danger";

export function ReportForm({ location, onClose, onReported }: ReportFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormValues>({
    resolver: makeResolver(location),
    defaultValues: { species: SPECIES[0], foundAt: todayIso(), comment: "" },
  });

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
        // Refetch through MapView's single data path; no SSR to revalidate.
        onReported();
        onClose();
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

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-sm rounded-2xl border-line/30 bg-surface/95 shadow-panel backdrop-blur-lg sm:max-w-sm">
        <DialogHeader className="text-left">
          <DialogTitle className="font-serif text-lg font-normal text-content">
            Zgłoś znalezisko
          </DialogTitle>
          <DialogDescription className="text-xs text-content-muted">
            Podziel się obserwacją ze społecznością
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-3">
          <div>
            <Label htmlFor="species" className={LABEL_CLASS}>
              Gatunek
            </Label>
            <Controller
              control={control}
              name="species"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="species" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {SPECIES_LABELS[s].pl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.species && <p className={ERROR_CLASS}>{errors.species.message}</p>}
          </div>

          <div>
            <Label htmlFor="foundAt" className={LABEL_CLASS}>
              Data znalezienia
            </Label>
            <Input
              id="foundAt"
              type="date"
              aria-invalid={errors.foundAt ? true : undefined}
              {...register("foundAt")}
            />
            {errors.foundAt && <p className={ERROR_CLASS}>{errors.foundAt.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="comment" className={LABEL_CLASS}>
                Komentarz (opcjonalnie)
              </Label>
              <span className="text-[10px] text-content-muted">{commentLength}/280</span>
            </div>
            <Textarea
              id="comment"
              rows={2}
              maxLength={280}
              placeholder="Np. skraj lasu iglastego, dużo młodych…"
              className="resize-none"
              aria-invalid={errors.comment ? true : undefined}
              {...register("comment")}
            />
            {errors.comment && <p className={ERROR_CLASS}>{errors.comment.message}</p>}
          </div>

          <p className="text-[10px] font-light leading-relaxed text-content-muted">
            Lokalizacja zostanie zaokrąglona do ok. 500 m — widać las, nie dokładny mech.
          </p>

          {(rootError || serverError) && (
            <p className={ERROR_CLASS} role="alert">
              {rootError ?? serverError}
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Anuluj
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Wysyłanie…" : "Dodaj zgłoszenie"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
