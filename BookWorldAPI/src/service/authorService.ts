import {AuthorRequest, AuthorResponse} from "../model/authorDto";
import {prisma} from "../utils/prisma";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";
import globalLogger from "../utils/logger";
import { Prisma } from "@prisma/client";
import { ElasticSearchService } from "../../elastic_search/ElasticService";


const logger = globalLogger.child({class: 'AuthorService'});

export class AuthorService extends ElasticSearchService<'authors', AuthorResponse> {


    constructor() {
        super('authors');
    }

    async getAll(): Promise<AuthorResponse[]> {
        const authors = await prisma.authors.findMany();
        return Promise.all(authors.map(async (author) => {
            return await this.mapToResponse(author);
        }));
    }

    async getById(id: number): Promise<AuthorResponse> {
        logger.info(`getById() - id: ${id}`);
        const author = await prisma.authors.findUnique({
            where: { id: id }
        });

        if (!author) {
            throw new EntityNotFoundException(`Author with id ${id} does not exist`)
        }
        return this.mapToResponse(author);
    }

    async save(authorRequest: AuthorRequest): Promise<AuthorResponse> {
        logger.info(`save() - authorRequest: ${authorRequest}`);
        const savedAuthor = await prisma.authors.create({
            data: { name: authorRequest.name, lastName: authorRequest.lastName }
        });
        logger.info(`save() - savedAuthor: ${savedAuthor}`);
        return this.mapToResponse(savedAuthor);
    }

    async update(id: number, authorRequest: AuthorRequest): Promise<AuthorResponse> {
        logger.info(`update() - id: ${id}, authorRequest: ${authorRequest}`);
        const author = await prisma.authors.update({
            where: { id: id },
            data: { name: authorRequest.name, lastName: authorRequest.lastName }
        });
        logger.info(`update() - author: ${author}`);
        return this.mapToResponse(author);
    }

    async deleteById(id: number): Promise<void> {
        logger.info(`deleteById() - id: ${id}`);
        await prisma.authors.delete({
            where: { id: id }
        });
    }

    async mapToResponse(item: Prisma.AuthorsGetPayload<any>): Promise<AuthorResponse> {
        return {
            id: item.id,
            name: item.name,
            lastName: item.lastName
        }
    }
}