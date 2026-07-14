import type { Species, SightingInput } from "@mushroom-map/shared";

// Raw values the report form collects, before shaping into the API body.
export interface ReportFormValues {
  species: Species;
  foundAt: string; // native <input type="date"> value: "YYYY-MM-DD"
  comment: string;
}

// Pure: form values + the clicked point → the exact body POST /api/sightings expects.
// Date becomes UTC midnight (we don't collect the time of day); empty comment → undefined.
export function toSightingInput(
  values: ReportFormValues,
  location: { lat: number; lng: number },
): SightingInput {
  return {
    species: values.species,
    lat: location.lat,
    lng: location.lng,
    foundAt: `${values.foundAt}T00:00:00.000Z`,
    comment: values.comment.trim() === "" ? undefined : values.comment,
  };
}
