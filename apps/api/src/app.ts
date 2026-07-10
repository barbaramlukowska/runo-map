import express, { type Express } from "express";
import { sightingInputSchema } from "@mushroom-map/shared";
import { roundCoord } from "./geo.js";
import { demoSeed } from "./seed.js";
import { createStore, type Store } from "./store.js";

// App factory — tests create their own instance without starting a real server.
export function createApp(store: Store = createStore(demoSeed)): Express {
  const app = express();

  app.use(express.json());

  app.get("/api/sightings", (_req, res) => {
    res.json(store.list());
  });

  app.post("/api/sightings", (req, res) => {
    const parsed = sightingInputSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input", issues: parsed.error.issues });
      return;
    }
    const sighting = store.add({
      ...parsed.data,
      lat: roundCoord(parsed.data.lat),
      lng: roundCoord(parsed.data.lng),
    });
    res.status(201).json(sighting);
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return app;
}
