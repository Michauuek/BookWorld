import {prisma} from "../utils/prisma";
import {BookRequest, BookResponse} from "../model/bookDto";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";
import globalLogger from "../utils/logger";
import {ElasticService} from "../../elastic_search/ElasticService";
import { Prisma } from "@prisma/client";
import {GenreResponse} from "../model/genreDto";
import {AuthorResponse} from "../model/authorDto";
import {AuthorService} from "./authorService";

const logger = globalLogger.child({class: 'BookService'});
const authorService = new AuthorService();
export class BookService extends ElasticService<Prisma.BooksDelegate, Prisma.BooksWhereInput, BookResponse> {

    constructor() {
        super(prisma, 'Books');
    }

    async getAll() {
        return prisma.books.findMany({
            include: {
                genres: true,
                author: true
            }
        });
    }

    async getById(id: number) {
        console.info({id},`getById() - id: `);
        const book = await prisma.books.findUnique({
            where: { id: id },
            include: {
                genres: true,
                author: true
            }
        });

        if (!book) {
            throw new EntityNotFoundException(`Book with id ${id} does not exist`)
        }
        return book;
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
            },
            include: {
                author: true
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

        logger.info({savedBook}, `save() - savedBook: `);
        return savedBook;

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
            },
            include: {
                author: true
            }
        });
        logger.info({book}, `update() - book:`);
        return book;
    }

    async deleteById(id: number): Promise<void> {
        logger.info({id}, `deleteById() - id:`);
        await prisma.books.delete({
            where: { id: id }
        });
    }

    async getBookGenres(bookId: number): Promise<GenreResponse[]> {
        const result = await prisma.bookGenres.findMany({
            where: { bookId: bookId },
            select: {
                genre: {
                    select: {
                        name: true,
                        id: true,
                        favouriteGenres: false,
                        books: false
                    }
                },
                book: false
            }
        });
        return result.map(item => item.genre)
    }

    async mapToResponse(item: Prisma.BooksGetPayload<any>): Promise<BookResponse> {
        const genres = await this.getBookGenres(item.id);
        const author: AuthorResponse = await authorService.getById(item.authorId);
        const itemResponse = {
            id: item.id,
            title: item.title,
            description: item.description,
            author: author,
            isbn: item.isbn,
            coverUrl: item.coverUrl,
            genres: genres
        }
        console.log(itemResponse)
        return itemResponse;
    }

}