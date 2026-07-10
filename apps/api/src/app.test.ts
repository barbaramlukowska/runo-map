import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";

describe("GET /api/sightings", () => {
  it("responds 200 with a list of sightings", async () => {
    const app = createApp();

    const res = await request(app).get("/api/sightings");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toMatchObject({
      id: expect.any(String),
      species: expect.any(String),
      lat: expect.any(Number),
      lng: expect.any(Number),
      foundAt: expect.any(String),
    });
  });
});

describe("POST /api/sightings", () => {
  const validInput = {
    species: "RYDZ",
    lat: 53.42,
    lng: 14.55,
    foundAt: "2026-07-09T00:00:00.000Z",
    comment: "spruce forest near Szczecin",
  };

  it("creates a sighting and responds 201 with it", async () => {
    const app = createApp();

    const res = await request(app).post("/api/sightings").send(validInput);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(validInput);
    expect(res.body.id).toEqual(expect.any(String));
    expect(res.body.createdAt).toEqual(expect.any(String));
  });

  it("adds the created sighting to the list", async () => {
    const app = createApp();

    await request(app).post("/api/sightings").send(validInput);
    const res = await request(app).get("/api/sightings");

    expect(res.body.map((s: { species: string }) => s.species)).toContain("RYDZ");
  });

  it("rounds coordinates to ~500 m before saving (location privacy)", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/api/sightings")
      .send({ ...validInput, lat: 53.4271, lng: 14.5538 });

    expect(res.body.lat).toBe(53.425);
    expect(res.body.lng).toBe(14.555);
  });

  it("responds 400 with issues for an unknown species", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/api/sightings")
      .send({ ...validInput, species: "MUCHOMOR_SROMOTNIKOWY" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid input");
  });

  it("responds 400 for coordinates outside Poland", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/api/sightings")
      .send({ ...validInput, lat: 35.0 });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/health", () => {
  it("responds 200 with status ok", async () => {
    const app = createApp();

    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
