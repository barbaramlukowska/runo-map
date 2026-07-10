import express, { type Express, type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { sightingFilterSchema, sightingInputSchema } from "@mushroom-map/shared";
import { roundCoord } from "./geo.js";
import { demoSeed } from "./seed.js";
import { createStore, type Store } from "./store.js";

// App factory — tests create their own instance without starting a real server.
export function createApp(store: Store = createStore(demoSeed)): Express {
  const app = express();

  app.use(helmet());
  app.use(express.json());

  app.get("/api/sightings", (req, res) => {
    const parsed = sightingFilterSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input", issues: parsed.error.issues });
      return;
    }
    res.json(store.list(parsed.data));
  });

  app.get("/api/sightings/:id", (req, res) => {
    const sighting = store.getById(req.params.id);
    if (!sighting) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(sighting);
  });

  // Anti-vandalism: max 10 new sightings per IP per hour; reads stay unlimited.
  const postLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many sightings, try again later" },
  });

  app.post("/api/sightings", postLimiter, (req, res) => {
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

  // After all routes: nothing matched → JSON 404 (default would be HTML).
  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  // Central error handler — Express recognizes it by the 4-argument signature.
  // Fail safe: log the real error server-side, never leak details to the client.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
