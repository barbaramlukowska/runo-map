import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { demoSeed } from "../src/seed.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// skipDuplicates makes reruns safe: rows with existing ids are ignored.
const { count } = await prisma.sighting.createMany({
  data: demoSeed,
  skipDuplicates: true,
});
console.log(`Seeded ${count} sighting(s)`);

await prisma.$disconnect();
