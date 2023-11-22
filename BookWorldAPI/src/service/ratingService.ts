import {prisma} from "../utils/prisma";
import {RatingRequest, RatingResponse} from "../model/ratingDto";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";
import globalLogger from "../utils/logger";
import { Prisma } from "@prisma/client";

import { ElasticSearchService } from "../../elastic_search/ElasticService";
import {BookService} from "./bookService";
import {UserResponse} from "../model/userDto";

const logger = globalLogger.child({class: 'RatingService'});


const bookService = new BookService();

export class RatingService extends ElasticSearchService<'ratings', RatingResponse> {


    constructor() {
        super('ratings');
    }

    async getAllForBook(bookId: number): Promise<RatingResponse[]> {
        return prisma.ratings.findMany({
            where: { bookId: bookId },
        });
    }


    async getById(id: number): Promise<RatingResponse> {
        logger.info({id}, `getById() - id: `);
        const rating = await prisma.ratings.findUnique({
            where: { id: id }
        });

        if (!rating) {
            throw new EntityNotFoundException(`Rating with id ${id} does not exist`)
        }
        return rating;
    }


    async saveOrUpdate(user: UserResponse, ratingRequest: RatingRequest): Promise<RatingResponse> {
        logger.info({ ratingRequest }, 'save() - ratingRequest: ');

        const { bookId, rating, comment } = ratingRequest;
        const userId = user.id;
        await bookService.getById(bookId);

        const existingRating = await prisma.ratings.findFirst({
            where: {
                bookId,
                userId,
            }
        });

        const savedRating = existingRating
            ? await prisma.ratings.update({
                where: { id: existingRating.id },
                data: { rating, comment },
            })
            : await prisma.ratings.create({
                data: { rating, bookId, userId, comment },
            });

        await bookService.updateBookRating(bookId, rating);
        const ratingResponse = await this.mapToResponse(savedRating);

        logger.info({ ratingResponse }, 'save() - savedRating: ');
        return ratingResponse;
    }

    async deleteById(user: UserResponse, id: number): Promise<void> {

        const rating = await prisma.ratings.findUnique({
            where: {
                id: id,
                userId: user.id
            }
        });

        if (!rating) {
            throw new EntityNotFoundException(`Rating with id ${id} does not exist`)
        }

        logger.info({id}, `deleteById() - id:`);
        await prisma.ratings.delete({
            where: { id: id }
        });
    }

    async mapToResponse(item: Prisma.RatingsGetPayload<any>): Promise<RatingResponse> {
        return {
            id: item.id,
            bookId: item.bookId,
            userId: item.userId,
            rating: item.rating,
            comment: item.comment
        }
    }


}