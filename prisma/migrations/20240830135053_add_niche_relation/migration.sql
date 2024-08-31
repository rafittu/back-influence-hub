/*
  Warnings:

  - You are about to drop the column `niche` on the `influencers` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "influencer_niches" (
    "influencerId" INTEGER NOT NULL,
    "nicheId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "influencer_niches_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "influencers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "influencer_niches_nicheId_fkey" FOREIGN KEY ("nicheId") REFERENCES "niches" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "brand_niches" (
    "brandId" INTEGER NOT NULL,
    "nicheId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "brand_niches_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "brand_niches_nicheId_fkey" FOREIGN KEY ("nicheId") REFERENCES "niches" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "niches" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_influencers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "reach" INTEGER NOT NULL,
    "photo" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_influencers" ("created_at", "id", "name", "photo", "reach", "updated_at", "username") SELECT "created_at", "id", "name", "photo", "reach", "updated_at", "username" FROM "influencers";
DROP TABLE "influencers";
ALTER TABLE "new_influencers" RENAME TO "influencers";
CREATE UNIQUE INDEX "influencers_username_key" ON "influencers"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "influencer_niches_influencerId_nicheId_key" ON "influencer_niches"("influencerId", "nicheId");

-- CreateIndex
CREATE UNIQUE INDEX "brand_niches_brandId_nicheId_key" ON "brand_niches"("brandId", "nicheId");

-- CreateIndex
CREATE UNIQUE INDEX "niches_name_key" ON "niches"("name");
