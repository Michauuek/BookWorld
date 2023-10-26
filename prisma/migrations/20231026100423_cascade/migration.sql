-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BookGenres" (
    "bookId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,

    PRIMARY KEY ("bookId", "genreId"),
    CONSTRAINT "BookGenres_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BookGenres_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genres" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookGenres" ("bookId", "genreId") SELECT "bookId", "genreId" FROM "BookGenres";
DROP TABLE "BookGenres";
ALTER TABLE "new_BookGenres" RENAME TO "BookGenres";
CREATE TABLE "new_UserFavouriteAuthors" (
    "userId" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "authorId"),
    CONSTRAINT "UserFavouriteAuthors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserFavouriteAuthors_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Authors" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserFavouriteAuthors" ("authorId", "userId") SELECT "authorId", "userId" FROM "UserFavouriteAuthors";
DROP TABLE "UserFavouriteAuthors";
ALTER TABLE "new_UserFavouriteAuthors" RENAME TO "UserFavouriteAuthors";
CREATE TABLE "new_UserFavouriteBooks" (
    "userId" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "bookId"),
    CONSTRAINT "UserFavouriteBooks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserFavouriteBooks_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserFavouriteBooks" ("bookId", "userId") SELECT "bookId", "userId" FROM "UserFavouriteBooks";
DROP TABLE "UserFavouriteBooks";
ALTER TABLE "new_UserFavouriteBooks" RENAME TO "UserFavouriteBooks";
CREATE TABLE "new_Ratings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "comment" TEXT,
    "rating" INTEGER NOT NULL,
    CONSTRAINT "Ratings_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT "Ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Ratings" ("bookId", "comment", "id", "rating", "userId") SELECT "bookId", "comment", "id", "rating", "userId" FROM "Ratings";
DROP TABLE "Ratings";
ALTER TABLE "new_Ratings" RENAME TO "Ratings";
CREATE TABLE "new_UserFavouriteGenres" (
    "userId" TEXT NOT NULL,
    "genreId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "genreId"),
    CONSTRAINT "UserFavouriteGenres_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserFavouriteGenres_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genres" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserFavouriteGenres" ("genreId", "userId") SELECT "genreId", "userId" FROM "UserFavouriteGenres";
DROP TABLE "UserFavouriteGenres";
ALTER TABLE "new_UserFavouriteGenres" RENAME TO "UserFavouriteGenres";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
