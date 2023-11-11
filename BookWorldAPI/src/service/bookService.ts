import {prisma} from "../utils/prisma";
import {BookRequest, BookResponse} from "../model/bookDto";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";
import globalLogger from "../utils/logger";
import {ElasticService} from "../../elastic_search/ElasticService";
import { Prisma } from "@prisma/client";
import {GenreResponse} from "../model/genreDto";

const logger = globalLogger.child({class: 'BookService'});

export class BookService extends ElasticService<Prisma.BooksDelegate, Prisma.BooksWhereInput, BookResponse> {

    constructor() {
        super(prisma, 'Books');
    }

    async getAll(): Promise<BookResponse[]> {
        return prisma.books.findMany();
    }

    async getById(id: number): Promise<BookResponse> {
        console.info({id},`getById() - id: `);
        const book = await prisma.books.findUnique({
            where: { id: id }
        });

        if (!book) {
            throw new EntityNotFoundException(`Book with id ${id} does not exist`)
        }
        return book;
    }

    async save(bookRequest: BookRequest): Promise<BookResponse> {

        logger.info(`save() - bookRequest: `, bookRequest);
        const savedBook: BookResponse = await prisma.books.create({
            data: {
                title: bookRequest.title,
                description: bookRequest.description,
                authorId: bookRequest.authorId,
                isbn: bookRequest.isbn,
                coverUrl: bookRequest.coverUrl
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

    async getBookGenres(bookId: number): Promise<any> {
        return prisma.bookGenres.findMany({
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
    }

    mapToResponse(item: Prisma.BooksGetPayload<any>): BookResponse {
        // const genres = this.getBookGenres(item.id);
        return {
            id: item.id,
            title: item.title,
            description: item.description,
            authorId: item.authorId,
            isbn: item.isbn,
            coverUrl: item.coverUrl,
            // genres: genres.then((genres) => genres.map((genre: any) => {
            //     return {
            //         id: genre.genre.id,
            //         name: genre.genre.name
            //     }
            // })).catch((err) => {
            //     console.error(err);
            //     return [];
            // })
        }
    }

}