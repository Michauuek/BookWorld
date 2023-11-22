import {ElasticSearchService} from "../../elastic_search/ElasticService";
import {BookResponse} from "../model/bookDto";
import {Prisma} from "@prisma/client";
import globalLogger from "../utils/logger";
import {BookService} from "./bookService";
import {prisma} from "../utils/prisma";
import 'express-async-errors';
import {GenreService} from "./genreService";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";
import {BadRequestException} from "../exceptions/badRequestException";

const logger = globalLogger.child({class: 'BookGenresService'});
const bookService = new BookService();
const genreService = new GenreService();

export class BookGenresService extends ElasticSearchService<'bookGenres', BookResponse> {

    constructor() {
        super('bookGenres');
    }


    async getBooksByGenreId(genreId: number): Promise<BookResponse[]> {
        logger.info(`getBooksByGenreId() - genreId: `, genreId);

        await genreService.getById(genreId);
        const books = await prisma.bookGenres.findMany({
            where: { genreId: genreId },
        });

        return Promise.all(books.map(async (book) => {
            return bookService.getById(book.bookId);
        }));
    }

    async mapToResponse(item: Prisma.BookGenresGetPayload<any>): Promise<BookResponse> {
        return bookService.getById(item.bookId);
    }

}