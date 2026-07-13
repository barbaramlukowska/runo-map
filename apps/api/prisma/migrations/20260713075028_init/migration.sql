-- CreateEnum
CREATE TYPE "Species" AS ENUM ('BOROWIK', 'PODGRZYBEK', 'KURKA', 'MASLAK', 'KOZLARZ', 'RYDZ', 'OPIENKA', 'KANIA');

-- CreateTable
CREATE TABLE "Sighting" (
    "id" TEXT NOT NULL,
    "species" "Species" NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "foundAt" TIMESTAMP(3) NOT NULL,
    "comment" VARCHAR(280),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "Sighting_pkey" PRIMARY KEY ("id")
);
