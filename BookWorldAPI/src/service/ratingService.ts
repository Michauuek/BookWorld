import {prisma} from "../utils/prisma";
import {RatingRequest, RatingResponse} from "../model/ratingDto";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";
import globalLogger from "../utils/logger";
import { Prisma } from "@prisma/client";
import { ElasticSearchService } from "../../elastic_search/ElasticService";

const logger = globalLogger.child({class: 'RatingService'});

export class RatingService extends ElasticSearchService<'ratings'>{



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


    async save(ratingRequest: RatingRequest): Promise<RatingResponse> {
        const savedRating = await prisma.ratings.create({
            data: {
                rating: ratingRequest.rating,
                bookId: ratingRequest.bookId,
                userId: ratingRequest.userId,
                comment: ratingRequest.comment
            },
            select: {
                id: true,
                rating: true,
                bookId: true,
                userId: true,
                comment: true,
                book: false,
                user: false
            }
        });
        logger.info({savedRating},`save() - savedRating: `);
        return savedRating;
    }

    async deleteById(id: number): Promise<void> {
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