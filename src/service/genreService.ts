import {GenreRequest, GenreResponse} from "../model/genreDto";
import {prisma} from "../utils/prisma";


export class GenreService {

    async getAll(): Promise<GenreResponse[]> {
        return prisma.genres.findMany({
            select: {
                id: true,
                name: true,
            }
        });
    }

    async getById(id: number): Promise<GenreResponse | null> {
        console.info(`getById() - id: `, id);
        return prisma.genres.findUnique({
            where: { id: id }
        });
    }

    async save(genreRequest: GenreRequest): Promise<GenreResponse> {
        const savedGenre = await prisma.genres.create({
            data: { name: genreRequest.name },
            select: {
                id: true,
                name: true,
            }
        });
        console.info(`save() - savedGenre: `, savedGenre);
        return savedGenre;
    }

    async deleteById(id: number): Promise<void> {
        prisma.genres.delete({
            where: { id: id }
        });
    }

}