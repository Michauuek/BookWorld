import {prisma} from "../utils/prisma";
import {RatingRequest, RatingResponse} from "../model/ratingDto";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";


export class RatingService {


    async getAllForBook(bookId: number): Promise<RatingResponse[]> {
        return prisma.ratings.findMany({
            where: { bookId: bookId },
        });
    }


    async getById(id: number): Promise<RatingResponse> {
        console.info(`getById() - id: `, id);
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
        console.info(`save() - savedRating: `, savedRating);
        return savedRating;
    }
}