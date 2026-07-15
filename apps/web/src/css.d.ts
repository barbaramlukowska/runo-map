// Newer editor TS versions flag side-effect CSS imports without a declaration.
declare module "*.css";

// Bare subpath (no .css extension) that only resolves via the package's
// "exports" map — editor TS can't see it, so declare it explicitly.
declare module "react-leaflet-markercluster/styles";
