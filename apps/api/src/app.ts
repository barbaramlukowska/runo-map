import express, { type Express } from "express";
import { sightingInputSchema } from "@mushroom-map/shared";
import { addSighting, listSightings } from "./store.js";

// App factory — tests create their own instance without starting a real server.
export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.get("/api/sightings", (_req, res) => {
    res.json(listSightings());
  });

  app.post("/api/sightings", (req, res) => {
    const parsed = sightingInputSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input", issues: parsed.error.issues });
      return;
    }
    res.status(201).json(addSighting(parsed.data));
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return app;
}
