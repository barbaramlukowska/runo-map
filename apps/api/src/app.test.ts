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

describe("GET /api/sightings/:id", () => {
  it("responds 200 with the sighting for a known id", async () => {
    const res = await request(createApp()).get("/api/sightings/seed-1");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: "seed-1", species: "BOROWIK" });
  });

  it("responds 404 for an unknown id", async () => {
    const res = await request(createApp()).get("/api/sightings/no-such-id");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Not found" });
  });
});

describe("GET /api/sightings filters", () => {
  it("filters by species", async () => {
    const res = await request(createApp()).get("/api/sightings?species=KURKA");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].species).toBe("KURKA");
  });

  it("filters by foundAt date range", async () => {
    // seed-1 found 2026-07-05, seed-2 found 2026-07-08
    const res = await request(createApp()).get(
      "/api/sightings?from=2026-07-07T00:00:00.000Z&to=2026-07-09T00:00:00.000Z",
    );

    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe("seed-2");
  });

  it("responds 400 for an unknown species filter", async () => {
    const res = await request(createApp()).get("/api/sightings?species=SMERF");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid input");
  });
});

describe("rate limiting", () => {
  it("responds 429 after 10 sightings from one IP within the window", async () => {
    const app = createApp();

    for (let i = 0; i < 10; i++) {
      const ok = await request(app).post("/api/sightings").send({
        species: "KANIA",
        lat: 51.1,
        lng: 17.03,
        foundAt: "2026-07-09T00:00:00.000Z",
      });
      expect(ok.status).toBe(201);
    }

    const blocked = await request(app).post("/api/sightings").send({
      species: "KANIA",
      lat: 51.1,
      lng: 17.03,
      foundAt: "2026-07-09T00:00:00.000Z",
    });

    expect(blocked.status).toBe(429);
  });

  it("does not rate-limit reads", async () => {
    const app = createApp();

    for (let i = 0; i < 15; i++) {
      const res = await request(app).get("/api/sightings");
      expect(res.status).toBe(200);
    }
  });
});

describe("error handling", () => {
  it("responds 500 with a generic message when a route throws", async () => {
    const brokenStore = {
      list() {
        throw new Error("db exploded: secret connection string leaked");
      },
      add() {
        throw new Error("db exploded");
      },
      getById() {
        throw new Error("db exploded");
      },
    };
    const app = createApp(brokenStore);

    const res = await request(app).get("/api/sightings");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
    // the real error message must never reach the client
    expect(JSON.stringify(res.body)).not.toContain("secret");
  });

  it("responds 404 as JSON for unknown routes", async () => {
    const app = createApp();

    const res = await request(app).get("/api/nonsense");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Not found" });
  });
});

describe("security headers", () => {
  it("does not reveal Express via X-Powered-By", async () => {
    const res = await request(createApp()).get("/api/health");

    expect(res.headers["x-powered-by"]).toBeUndefined();
  });

  it("sets basic security headers via helmet", async () => {
    const res = await request(createApp()).get("/api/health");

    expect(res.headers["x-content-type-options"]).toBe("nosniff");
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
