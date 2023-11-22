import {IsNumber} from "class-validator";
import {FavouriteRequest} from "./favouriteAuthor";


export class FavouriteGenreRequest extends FavouriteRequest {

    @IsNumber()
    genreId: number;
}

export interface FavouriteGenreResponse {
    userId: number;
    genreId: number;
}