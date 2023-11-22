import {IsNumber} from "class-validator";


export class FavouriteBookRequest {

    @IsNumber()
    bookId: number;
}

export interface FavouriteBookResponse {
    userId: number;
    bookId: number;
}