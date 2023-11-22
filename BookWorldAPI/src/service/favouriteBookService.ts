import {UserResponse} from "../model/userDto";
import {FavouriteBookRequest} from "../model/favouriteBookDto";
import {prisma} from "../utils/prisma";
import {BookService} from "./bookService";
import {BadRequestException} from "../exceptions/badRequestException";
import {ElasticSearchService} from "../../elastic_search/ElasticService";
import {BookResponse} from "../model/bookDto";
import {Prisma} from "@prisma/client";


const bookService = new BookService();

export class FavouriteBookService extends ElasticSearchService<'userFavouriteBooks', BookResponse> {


    constructor() {
        super('userFavouriteBooks');
    }

    async addBookToFavourites(user: UserResponse, request: FavouriteBookRequest) {

        if (request.like) {

            const liked = await prisma.userFavouriteBooks.findMany({
                where: {
                    bookId: request.bookId,
                    userId: user.id
                }
            });

            if (liked.length > 0) {
                throw new BadRequestException("Book already liked");
            }

            return prisma.userFavouriteBooks.create({
                data: {
                    bookId: request.bookId,
                    userId: user.id
                }
            });
        } else {
            return prisma.userFavouriteBooks.deleteMany({
                where: {
                    bookId: request.bookId,
                    userId: user.id
                }
            });
        }
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

    mapToResponse(model: Prisma.UserFavouriteBooksGetPayload<any>): Promise<BookResponse> {
        return bookService.getById(model.bookId)
    }

}