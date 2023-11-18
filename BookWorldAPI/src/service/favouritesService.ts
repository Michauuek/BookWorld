import {UserResponse} from "../model/userDto";
import {FavouriteBookRequest} from "../model/favouriteBookDto";
import {prisma} from "../utils/prisma";
import {FavouriteAuthorRequest} from "../model/favouriteAuthor";
import {FavouriteGenreRequest} from "../model/favouriteGenreDto";
import {BookService} from "./bookService";
import {AuthorService} from "./authorService";
import {GenreService} from "./genreService";


const bookService = new BookService();
const authorService = new AuthorService();
const genreService = new GenreService();

export class FavouritesService {

    async addBookToFavourites(user: UserResponse, request: FavouriteBookRequest) {
        return prisma.userFavouriteBooks.create({
            data: {
                bookId: request.bookId,
                userId: user.id
            }
        });
    }

    async addAuthorToFavourites(user: UserResponse, request: FavouriteAuthorRequest) {
        return prisma.userFavouriteAuthors.create({
            data: {
                authorId: request.authorId,
                userId: user.id
            }
        });
    }

    async addGenreToFavourites(user: UserResponse, request: FavouriteGenreRequest) {
        return prisma.userFavouriteGenres.create({
            data: {
                genreId: request.genreId,
                userId: user.id
            }
        });
    }

    async getFavouritesBooks(user: UserResponse) {
        console.log(`getFavouritesBooks() - user: `, user.email)
        const favouritesBooks = await prisma.userFavouriteBooks.findMany({
            where: {
                userId: user.id
            }
        });
        return Promise.all(favouritesBooks.map(async (favouriteBook) => {
            return bookService.getById(favouriteBook.bookId);
        }));
    }

    async getFavouritesAuthors(user: UserResponse) {
        console.log(`getFavouritesAuthors() - user: `, user.email)
        const favouritesAuthors = await prisma.userFavouriteAuthors.findMany({
            where: {
                userId: user.id
            }
        });
        return Promise.all(favouritesAuthors.map(async (favouriteAuthor) => {
            return authorService.getById(favouriteAuthor.authorId);
        }));
    }

    async getFavouritesGenres(user: UserResponse) {
        console.log(`getFavouritesGenres() - user: `, user.email)
        const favouritesGenres = await prisma.userFavouriteGenres.findMany({
            where: {
                userId: user.id
            }
        });
        return Promise.all(favouritesGenres.map(async (favouriteGenre) => {
            return genreService.getById(favouriteGenre.genreId);
        }));
    }
}