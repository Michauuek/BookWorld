-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Books" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isbn" TEXT,
    "authorId" INTEGER NOT NULL,
    "coverUrl" TEXT,
    "ratingValue" REAL NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Books_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Authors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Books" ("authorId", "coverUrl", "description", "id", "isbn", "ratingCount", "ratingValue", "title") SELECT "authorId", "coverUrl", "description", "id", "isbn", coalesce("ratingCount", 0) AS "ratingCount", coalesce("ratingValue", 0) AS "ratingValue", "title" FROM "Books";
DROP TABLE "Books";
ALTER TABLE "new_Books" RENAME TO "Books";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
