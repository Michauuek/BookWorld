import {prisma} from "../utils/prisma";
import {BookRequest, BookResponse} from "../model/bookDto";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";
import globalLogger from "../utils/logger";
import {ElasticSearchService} from "../../elastic_search/ElasticService";
import {Prisma} from "@prisma/client";
import {GenreResponse} from "../model/genreDto";
import {AuthorResponse} from "../model/authorDto";
import {AuthorService} from "./authorService";
import {GenreService} from "./genreService";

const logger = globalLogger.child({class: 'BookService'});

const authorService = new AuthorService();
const genreService = new GenreService();

export class BookService extends ElasticSearchService<'books', BookResponse> {

    constructor() {
        super('books', ['author', 'genres', 'ratings']);
    }

    async getAll(): Promise<BookResponse[]> {
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

        const createBookGenresPromises = genres.map((genre) =>
            prisma.bookGenres.create({
                data: {
                    bookId: savedBook.id,
                    genreId: genre.id,
                },
            })
        );
        await Promise.all(createBookGenresPromises);

        const bookResponse = await this.mapToResponse(savedBook);
        logger.info({ bookResponse }, `save() - savedBook: `);
        return bookResponse;
    }

    async update(id: number, bookRequest: BookRequest): Promise<BookResponse> {
        logger.info(`update() - id: ${id}, bookRequest: ${bookRequest}`);

        const updatedBook = await prisma.$transaction(async (prismaClient) => {
            // Fetch the existing book with its associated genres
            const existingBook = await prismaClient.books.findUnique({
                where: { id: id },
                include: {
                    genres: true,
                },
            });

            if (!existingBook) {
                throw new EntityNotFoundException(`Book with id ${id} does not exist`)
            }

            // Update book fields
            const updatedBook = await prismaClient.books.update({
                where: { id: id },
                data: {
                    title: bookRequest.title,
                    description: bookRequest.description,
                    authorId: bookRequest.authorId,
                    isbn: bookRequest.isbn,
                    coverUrl: bookRequest.coverUrl,
                },
            });

            // Update genres
            const newGenreIds = bookRequest.genresIds;
            const existingGenreIds = existingBook.genres.map((genre) => genre.genreId);

            const genresToAdd = newGenreIds.filter((genreId) => !existingGenreIds.includes(genreId));
            const genresToRemove = existingGenreIds.filter((genreId) => !newGenreIds.includes(genreId));

            // Add new genres
            await Promise.all(
                genresToAdd.map(async (genreId) => {
                    await prismaClient.bookGenres.create({
                        data: {
                            bookId: id,
                            genreId: genreId,
                        },
                    });
                })
            );

            // Remove old genres
            await Promise.all(
                genresToRemove.map(async (genreId) => {
                    await prismaClient.bookGenres.delete({
                        where: {
                            bookId_genreId: {
                                bookId: id,
                                genreId: genreId,
                            },
                        },
                    });
                })
            );
            return updatedBook;
        });

        const bookResponse = await this.mapToResponse(updatedBook);
        logger.info({ bookResponse }, `update() - book:`);
        return bookResponse;
    }

    async deleteById(id: number): Promise<void> {
        logger.info({id}, `deleteById() - id:`);

        await prisma.ratings.deleteMany(
            { where: { bookId: id } }
        )
        
        
        await prisma.ratings.deleteMany(
            {where:{bookId: id}}
        );

        await prisma.books.delete({
            where: { id: id }
        });
    }

    async updateBookRating(bookId: number, newRating: number, oldRating: number, isUpdate: boolean) {
        const book = await this.getById(bookId)
        const {value, count} = book.rating;
        const newCount = isUpdate ? count : count + 1;
        const rating = isUpdate ? (value * count - oldRating + newRating) / (newCount) : (value * count + newRating) / (newCount);
        await prisma.books.update({
            where: { id: bookId },
            data: {
                ratingValue: rating,
                ratingCount: newCount
            }
        });
    }

    async mapToResponse(item: Prisma.BooksGetPayload<any>): Promise<BookResponse> {
        return BookService.toResponse(item);
    }

    static async toResponse(item: Prisma.BooksGetPayload<any>): Promise<BookResponse> {
        const genres: GenreResponse[] = await genreService.getByBookId(item.id);
        const author: AuthorResponse = await authorService.getById(item.authorId);
        return {
            id: item.id,
            title: item.title,
            description: item.description,
            author: author,
            isbn: item.isbn,
            coverUrl: item.coverUrl,
            rating: {
                value: item.ratingValue,
                count: item.ratingCount
            },
            genres: genres
        };
    }

}