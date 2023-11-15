import {GenreRequest, GenreResponse} from "../model/genreDto";
import {prisma} from "../utils/prisma";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";
import globalLogger from "../utils/logger";
import { Prisma, PrismaClient } from "@prisma/client";
import {ElasticSearchService} from "../../elastic_search/ElasticService";


const logger = globalLogger.child({class: 'GenreService'});

export class GenreService extends ElasticSearchService<'genres', GenreResponse> {

    constructor() {
        super('genres');
    }

    async getAll(): Promise<GenreResponse[]> {
        const genres = await prisma.genres.findMany();
        return Promise.all(genres.map(async (genre) => {
            return await this.mapToResponse(genre);
        }));
    }

    async getById(id: number): Promise<GenreResponse> {
        logger.info(`getById() - id: {$id}`);
        const genre = await prisma.genres.findUnique({
            where: { id: id }
        });

        if (!genre) {
            throw new EntityNotFoundException(`Genre with id ${id} does not exist`)
        }
        return this.mapToResponse(genre);
    }

    async getByBookId(bookId: number): Promise<GenreResponse[]> {
        logger.info(`getByBookId() - bookId: ${bookId}`);
        const bookGenres = await prisma.bookGenres.findMany({
            where: { bookId: bookId }
        });

        const genres = await prisma.genres.findMany({
            where: { id: { in: bookGenres.map((item) => item.genreId) } },
        });

        if (!genres) {
            throw new EntityNotFoundException(`Genre with bookId ${bookId} does not exist`)
        }
        return Promise.all(genres.map(async (genre) => {
            return await this.mapToResponse(genre);
        }));
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
        return this.mapToResponse(savedGenre);
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
        return this.mapToResponse(genre);
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