import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { createApp } from "./app.js";
import { PrismaClient } from "./generated/prisma/client.js";
import { createPrismaStore } from "./prisma-store.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const port = Number(process.env.PORT ?? 3001);

createApp(createPrismaStore(prisma)).listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
