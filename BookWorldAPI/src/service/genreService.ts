import {GenreRequest, GenreResponse} from "../model/genreDto";
import {prisma} from "../utils/prisma";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";
import globalLogger from "../utils/logger";
import {ElasticService} from "../../elastic_search/ElasticService";
import { Prisma, PrismaClient } from "@prisma/client";


const logger = globalLogger.child({class: 'GenreService'});

export class GenreService extends ElasticService<Prisma.GenresDelegate, Prisma.GenresWhereInput, GenreResponse> {


    constructor() {
        super(prisma, 'Genres');
    }

    async getAll(): Promise<GenreResponse[]> {
        return prisma.genres.findMany({
            select: {
                id: true,
                name: true,
            }
        });
    }

    async getById(id: number): Promise<GenreResponse> {
        logger.info(`getById() - id: {$id}`);
        const genre = await prisma.genres.findUnique({
            where: { id: id }
        });

        if (!genre) {
            throw new EntityNotFoundException(`Genre with id ${id} does not exist`)
        }
        return genre;
    }

    async getByBookId(bookId: number): Promise<GenreResponse[]> {
        logger.info(`getByBookId() - bookId: ${bookId}`);
        const genre = await prisma.bookGenres.findMany({
            where: { bookId: bookId },
            select: {
                genre: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        if (!genre) {
            throw new EntityNotFoundException(`Genre with bookId ${bookId} does not exist`)
        }
        return genre.map((item) => item.genre);
    }

    async save(genreRequest: GenreRequest): Promise<GenreResponse> {
        const savedGenre = await prisma.genres.create({
            data: { name: genreRequest.name },
            select: {
                id: true,
                name: true,
            }
        });
        logger.info(`save() - savedGenre: ${savedGenre}`);
        return savedGenre;
    }

    async update(id: number, genreRequest: GenreRequest): Promise<GenreResponse> {
        logger.info(`update() - id: ${id}, genreRequest: ${genreRequest}`);
        const genre = await prisma.genres.update({
            where: { id: id },
            data: { name: genreRequest.name },
            select: {
                id: true,
                name: true,
            }
        });
        logger.info(`update() - genre: ${genre}`);
        return genre;
    }

    async deleteById(id: number): Promise<void> {
        logger.info(`deleteById() - id: ${id}`);
        await prisma.genres.delete({
            where: { id: id }
        });
    }

    async mapToResponse(item: Prisma.GenresGetPayload<any>): Promise<GenreResponse> {
        return {
            id: item.id,
            name: item.name,
        };
    }

}