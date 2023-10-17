import {IsNumber} from "class-validator";


export class FavouriteAuthorRequest {

    @IsNumber()
    userId: number;

    @IsNumber()
    authorId: number;
}

export interface FavouriteAuthorResponse {
    userId: number;
    authorId: number;
}