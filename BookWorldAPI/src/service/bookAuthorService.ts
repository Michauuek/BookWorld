import {BookService} from "./bookService";
import {BookResponse} from "../model/bookDto";
import {prisma} from "../utils/prisma";
import globalLogger from "../utils/logger";

const logger = globalLogger.child({class: 'BookAuthorService'});


export class BookAuthorService {

    async getByAuthorId(authorId: number): Promise<BookResponse[]> {
        logger.info(`getByAuthorId() - authorId: `, authorId);

        const books = await prisma.books.findMany({
            where: { authorId: authorId }
        });

        return Promise.all(books.map(async (book) => {
            return await BookService.toResponse(book);
        }));
    }

}