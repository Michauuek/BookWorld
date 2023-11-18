import {AuthorRequest, AuthorResponse, AuthorResponseWithBooks} from "../model/authorDto";
import {prisma} from "../utils/prisma";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";
import globalLogger from "../utils/logger";
import { Prisma } from "@prisma/client";
import { ElasticSearchService } from "../../elastic_search/ElasticService";
import {BookAuthorService} from "./bookAuthorService";

const logger = globalLogger.child({class: 'AuthorService'});

const bookAuthorService = new BookAuthorService();

export class AuthorService extends ElasticSearchService<'authors', AuthorResponseWithBooks> {


    constructor() {
        super('authors');
    }

    async getAll(): Promise<AuthorResponse[]> {
        const authors = await prisma.authors.findMany();
        return Promise.all(authors.map(async (author) => {
            return await this.toResponse(author);
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
        return this.toResponse(author);
    }

    async save(authorRequest: AuthorRequest): Promise<AuthorResponse> {
        logger.info(`save() - authorRequest: ${authorRequest}`);
        const savedAuthor = await prisma.authors.create({
            data: { name: authorRequest.name, lastName: authorRequest.lastName }
        });
        logger.info(`save() - savedAuthor: ${savedAuthor}`);
        return this.toResponse(savedAuthor);
    }

    async update(id: number, authorRequest: AuthorRequest): Promise<AuthorResponse> {
        logger.info(`update() - id: ${id}, authorRequest: ${authorRequest}`);
        const author = await prisma.authors.update({
            where: { id: id },
            data: { name: authorRequest.name, lastName: authorRequest.lastName }
        });
        logger.info(`update() - author: ${author}`);
        return this.toResponse(author);
    }

    async deleteById(id: number): Promise<void> {
        logger.info(`deleteById() - id: ${id}`);
        await prisma.authors.delete({
            where: { id: id }
        });
    }

    async mapToResponse(item: Prisma.AuthorsGetPayload<any>): Promise<AuthorResponseWithBooks> {
        const books = await bookAuthorService.getByAuthorId(item.id);
        return {
            id: item.id,
            name: item.name,
            lastName: item.lastName,
            books: books
        }
    }

    async toResponse(item: Prisma.AuthorsGetPayload<any>): Promise<AuthorResponse> {
        return {
            id: item.id,
            name: item.name,
            lastName: item.lastName,
        }
    }
}