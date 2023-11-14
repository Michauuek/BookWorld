import {prisma} from "../utils/prisma";
import {BookRequest, BookResponse} from "../model/bookDto";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";
import globalLogger from "../utils/logger";
import {ElasticService} from "../../elastic_search/ElasticService";
import { Prisma } from "@prisma/client";
import {GenreResponse} from "../model/genreDto";
import {AuthorResponse} from "../model/authorDto";
import {AuthorService} from "./authorService";
import {GenreService} from "./genreService";

const logger = globalLogger.child({class: 'BookService'});

const authorService = new AuthorService();
const genreService = new GenreService();

export class BookService extends ElasticService<Prisma.BooksDelegate, Prisma.BooksWhereInput, BookResponse> {

    constructor() {
        super(prisma, 'Books');
    }

    async getAll() {
        const books = await prisma.books.findMany();
        return Promise.all(books.map(async (book) => {
            return await this.mapToResponse(book);
        }));
    }

    async getById(id: number): Promise<BookResponse> {
        logger.info(`getById() - id: `, id);

        const book = await prisma.books.findUnique({
            where: { id: id }
        });

        if (!book) {
            throw new EntityNotFoundException(`Book with id ${id} does not exist`)
        }

        const bookResponse = await this.mapToResponse(book);
        logger.info({bookResponse}, `getById() - bookResponse: `);
        return bookResponse;
    }

    async save(bookRequest: BookRequest): Promise<BookResponse> {
        logger.info(`save() - bookRequest: `, bookRequest);

        const savedBook = await prisma.books.create({
            data: {
                title: bookRequest.title,
                description: bookRequest.description,
                isbn: bookRequest.isbn,
                coverUrl: bookRequest.coverUrl,
                authorId: bookRequest.authorId,
            }
        });

        const genres = await prisma.genres.findMany({
            where: { id: { in: bookRequest.genresIds } }
        });

        genres.map(async (genre) => {
            await prisma.bookGenres.create({
                data: {
                    bookId: savedBook.id,
                    genreId: genre.id
                }
            });
        });

        const bookResponse = await this.mapToResponse(savedBook);
        logger.info({bookResponse}, `save() - savedBook: `);
        return bookResponse;

    }

    async update(id: number, bookRequest: BookRequest): Promise<BookResponse> {
        logger.info(`update() - id: ${id}, bookRequest: ${bookRequest}`);
        const book = await prisma.books.update({
            where: { id: id },
            data: {
                title: bookRequest.title,
                description: bookRequest.description,
                authorId: bookRequest.authorId,
                isbn: bookRequest.isbn,
                coverUrl: bookRequest.coverUrl
            }
        });
        const bookResponse = await this.mapToResponse(book);
        logger.info({bookResponse}, `update() - book:`);
        return bookResponse;
    }

    async deleteById(id: number): Promise<void> {
        logger.info({id}, `deleteById() - id:`);
        await prisma.books.delete({
            where: { id: id }
        });
    }

    async updateBookRating(bookId: number, newRating: number) {
        const book = await this.getById(bookId)
        const ratingValue = book.ratingValue;
        const ratingCount = book.ratingCount;
        const newRatingValue = (ratingValue * ratingCount + newRating) / (ratingCount + 1);
        await prisma.books.update({
            where: { id: bookId },
            data: {
                ratingValue: newRatingValue,
                ratingCount: ratingCount + 1
            }
        });
    }

    async mapToResponse(item: Prisma.BooksGetPayload<any>): Promise<BookResponse> {
        const genres: GenreResponse[] = await genreService.getByBookId(item.id);
        const author: AuthorResponse = await authorService.getById(item.authorId);
        const itemResponse = {
            id: item.id,
            title: item.title,
            description: item.description,
            author: author,
            isbn: item.isbn,
            coverUrl: item.coverUrl,
            ratingValue: item.ratingValue,
            ratingCount: item.ratingCount,
            genres: genres
        }
        console.log(itemResponse)
        return itemResponse;
    }

}