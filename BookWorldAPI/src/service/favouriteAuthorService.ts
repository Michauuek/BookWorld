import {UserResponse} from "../model/userDto";
import {prisma} from "../utils/prisma";
import {FavouriteAuthorRequest} from "../model/favouriteAuthor";
import {AuthorService} from "./authorService";
import {BadRequestException} from "../exceptions/badRequestException";
import {ElasticSearchService} from "../../elastic_search/ElasticService";
import {BookResponse} from "../model/bookDto";
import {AuthorResponse} from "../model/authorDto";
import {Prisma} from "@prisma/client";


const authorService = new AuthorService();

export class FavouriteAuthorService extends ElasticSearchService<'userFavouriteAuthors', AuthorResponse> {


    constructor() {
        super('userFavouriteAuthors');
    }

    async addAuthorToFavourites(user: UserResponse, request: FavouriteAuthorRequest) {

        const liked = await prisma.userFavouriteAuthors.findMany({
            where: {
                authorId: request.authorId,
                userId: user.id
            }
        });

        if (liked.length > 0) {
            throw new BadRequestException("Book already liked");
        }

        return prisma.userFavouriteAuthors.create({
            data: {
                authorId: request.authorId,
                userId: user.id
            }
        });
    }

    async deleteAuthorFromFavourites(user: UserResponse, request: FavouriteAuthorRequest) {
        return prisma.userFavouriteAuthors.deleteMany({
            where: {
                authorId: request.authorId,
                userId: user.id
            }
        });
    }


    async getFavouritesAuthors(user: UserResponse) {
        console.log(`getFavouritesAuthors() - user: `, user.email)
        const favouritesAuthors = await prisma.userFavouriteAuthors.findMany({
            where: {
                userId: user.id
            }
        });
        return Promise.all(favouritesAuthors.map(async (favouriteAuthor) => {
            return authorService.getById(favouriteAuthor.authorId);
        }));
    }

    mapToResponse(model: Prisma.UserFavouriteAuthorsGetPayload<any>): Promise<AuthorResponse> {
        return authorService.getById(model.authorId)
    }

}