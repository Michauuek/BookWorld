-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ratings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "comment" TEXT,
    "rating" INTEGER NOT NULL,
    CONSTRAINT "Ratings_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Ratings" ("bookId", "comment", "id", "rating", "userId") SELECT "bookId", "comment", "id", "rating", "userId" FROM "Ratings";
DROP TABLE "Ratings";
ALTER TABLE "new_Ratings" RENAME TO "Ratings";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
