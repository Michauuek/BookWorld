import {AuthorRequest, AuthorResponse} from "../model/authorDto";
import {prisma} from "../utils/prisma";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";


export class AuthorService {

    async getAll(): Promise<AuthorResponse[]> {
        return prisma.authors.findMany({
            select: {
                id: true,
                name: true,
                lastName: true,
                books: false
            }
        });
    }

    async getById(id: number): Promise<AuthorResponse> {
        console.info(`getById() - id: `, id);
        const author = await prisma.authors.findUnique({
            where: { id: id }
        });

        if (!author) {
            throw new EntityNotFoundException(`Author with id ${id} does not exist`)
        }
        return author;
    }

    async save(authorRequest: AuthorRequest): Promise<AuthorResponse> {
        const savedAuthor = await prisma.authors.create({
            data: { name: authorRequest.name, lastName: authorRequest.lastName },
            select: {
                id: true,
                name: true,
                lastName: true,
                books: false
            }
        });
        console.info(`save() - savedAuthor: `, savedAuthor);
        return savedAuthor;
    }
}