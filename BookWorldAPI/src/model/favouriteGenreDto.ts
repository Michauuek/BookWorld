import {IsNumber} from "class-validator";


export class FavouriteGenreRequest {

    @IsNumber()
    genreId: number;
}

export interface FavouriteGenreResponse {
    userId: number;
    genreId: number;
}