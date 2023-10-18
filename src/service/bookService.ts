import {prisma} from "../utils/prisma";
import {BookRequest, BookResponse} from "../model/bookDto";
import {AppError} from "../exceptions/appError";
import {HttpCode} from "../exceptions/httpCode";


export class BookService {

    async getAll(): Promise<BookResponse[]> {
        return prisma.books.findMany();
    }

    async getById(id: number): Promise<BookResponse> {
        console.info(`getById() - id: `, id);
        const book = await prisma.books.findUnique({
            where: { id: id }
        });

        if (!book) {
            throw new AppError({
                httpCode: HttpCode.NOT_FOUND,
                description: `Book with id ${id} does not exist`,
            })
        }
        return book;
    }

    async save(bookRequest: BookRequest): Promise<BookResponse> {

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

        console.info(`save() - savedBook: `, savedBook);
        return savedBook;

    }

}