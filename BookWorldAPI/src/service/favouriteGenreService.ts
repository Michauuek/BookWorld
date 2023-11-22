import {UserResponse} from "../model/userDto";
import {prisma} from "../utils/prisma";
import {FavouriteGenreRequest} from "../model/favouriteGenreDto";
import {GenreService} from "./genreService";
import {BadRequestException} from "../exceptions/badRequestException";
import {ElasticSearchService} from "../../elastic_search/ElasticService";
import {GenreResponse} from "../model/genreDto";
import {Prisma} from "@prisma/client";

const genreService = new GenreService();

export class FavouriteGenreService extends ElasticSearchService<'userFavouriteGenres', GenreResponse> {


    constructor() {
        super('userFavouriteGenres');
    }

    async addGenreToFavourites(user: UserResponse, request: FavouriteGenreRequest) {

        const liked = await prisma.userFavouriteGenres.findMany({
            where: {
                genreId: request.genreId,
                userId: user.id
            }
        });

        if (liked.length > 0) {
            throw new BadRequestException("Book already liked");
        }

        return prisma.userFavouriteGenres.create({
            data: {
                genreId: request.genreId,
                userId: user.id
            }
        });
    }

    async deleteGenreFromFavourites(user: UserResponse, request: FavouriteGenreRequest) {
        return prisma.userFavouriteGenres.deleteMany({
            where: {
                genreId: request.genreId,
                userId: user.id
            }
        });
    }


    async getFavouritesGenres(user: UserResponse) {
        console.log(`getFavouritesGenres() - user: `, user.email)
        const favouritesGenres = await prisma.userFavouriteGenres.findMany({
            where: {
                userId: user.id
            }
        });
        return Promise.all(favouritesGenres.map(async (favouriteGenre) => {
            return genreService.getById(favouriteGenre.genreId);
        }));
    }

    mapToResponse(model: Prisma.UserFavouriteGenresGetPayload<any>): Promise<GenreResponse> {
        return genreService.getById(model.genreId)
    }

}