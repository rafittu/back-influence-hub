/*
  Warnings:

  - Added the required column `email` to the `influencers` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_influencers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reach" INTEGER NOT NULL,
    "photo" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_influencers" ("created_at", "id", "name", "photo", "reach", "updated_at", "username") SELECT "created_at", "id", "name", "photo", "reach", "updated_at", "username" FROM "influencers";
DROP TABLE "influencers";
ALTER TABLE "new_influencers" RENAME TO "influencers";
CREATE UNIQUE INDEX "influencers_username_key" ON "influencers"("username");
CREATE UNIQUE INDEX "influencers_email_key" ON "influencers"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
