-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'USER'
);

-- CreateTable
CREATE TABLE "Authors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Ratings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "comment" TEXT,
    "rating" INTEGER NOT NULL,
    CONSTRAINT "Ratings_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Books" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isbn" TEXT,
    "authorId" INTEGER NOT NULL,
    "coverUrl" TEXT,
    CONSTRAINT "Books_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Authors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Genres" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BookGenres" (
    "bookId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,

    PRIMARY KEY ("bookId", "genreId"),
    CONSTRAINT "BookGenres_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookGenres_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genres" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserFavouriteGenres" (
    "userId" TEXT NOT NULL,
    "genreId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "genreId"),
    CONSTRAINT "UserFavouriteGenres_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserFavouriteGenres_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genres" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserFavouriteBooks" (
    "userId" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "bookId"),
    CONSTRAINT "UserFavouriteBooks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserFavouriteBooks_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserFavouriteAuthors" (
    "userId" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "authorId"),
    CONSTRAINT "UserFavouriteAuthors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserFavouriteAuthors_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Authors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
