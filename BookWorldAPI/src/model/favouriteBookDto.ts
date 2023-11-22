import {IsNumber} from "class-validator";
import {FavouriteRequest} from "./favouriteAuthor";


export class FavouriteBookRequest extends FavouriteRequest {

    @IsNumber()
    bookId: number;
}

export interface FavouriteBookResponse {
    userId: number;
    bookId: number;
}