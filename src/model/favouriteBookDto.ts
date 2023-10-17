import {IsNumber} from "class-validator";


export class FavouriteBookRequest {

    @IsNumber()
    userId: number;

    @IsNumber()
    bookId: number;
}

export interface FavouriteBookResponse {
    userId: number;
    bookId: number;
}