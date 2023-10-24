import {AuthorRequest, AuthorResponse} from "../model/authorDto";
import {prisma} from "../utils/prisma";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";
import globalLogger from "../utils/logger";


const logger = globalLogger.child({class: 'AuthorService'});

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
        logger.info(`getById() - id: ${id}`);
        const author = await prisma.authors.findUnique({
            where: { id: id }
        });

        if (!author) {
            throw new EntityNotFoundException(`Author with id ${id} does not exist`)
        }
        return author;
    }

    async save(authorRequest: AuthorRequest): Promise<AuthorResponse> {
        logger.info(`save() - authorRequest: ${authorRequest}`);
        const savedAuthor = await prisma.authors.create({
            data: { name: authorRequest.name, lastName: authorRequest.lastName },
            select: {
                id: true,
                name: true,
                lastName: true,
                books: false
            }
        });
        logger.info(`save() - savedAuthor: ${savedAuthor}`);
        return savedAuthor;
    }

    async update(id: number, authorRequest: AuthorRequest): Promise<AuthorResponse> {
        logger.info(`update() - id: ${id}, authorRequest: ${authorRequest}`);
        const author = await prisma.authors.update({
            where: { id: id },
            data: { name: authorRequest.name, lastName: authorRequest.lastName },
            select: {
                id: true,
                name: true,
                lastName: true,
                books: false
            }
        });
        logger.info(`update() - author: ${author}`);
        return author;
    }

    async deleteById(id: number): Promise<void> {
        logger.info(`deleteById() - id: ${id}`);
        prisma.authors.delete({
            where: { id: id }
        });
    }
}