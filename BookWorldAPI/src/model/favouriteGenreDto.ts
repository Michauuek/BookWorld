import {IsNumber} from "class-validator";


export class FavouriteGenreRequest {

    @IsNumber()
    userId: number;

    @IsNumber()
    genreId: number;
}

export interface FavouriteGenreResponse {
    userId: number;
    genreId: number;
}