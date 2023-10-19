import {GenreRequest, GenreResponse} from "../model/genreDto";
import {prisma} from "../utils/prisma";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";


export class GenreService {

    async getAll(): Promise<GenreResponse[]> {
        return prisma.genres.findMany({
            select: {
                id: true,
                name: true,
            }
        });
    }

    async getById(id: number): Promise<GenreResponse> {
        console.info(`getById() - id: `, id);
        const genre = await prisma.genres.findUnique({
            where: { id: id }
        });

        if (!genre) {
            throw new EntityNotFoundException(`Genre with id ${id} does not exist`)
        }
        return genre;
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