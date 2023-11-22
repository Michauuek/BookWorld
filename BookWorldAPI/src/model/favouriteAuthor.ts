import {IsNotEmpty, IsNumber} from "class-validator";



export class FavouriteRequest {

    @IsNotEmpty()
    like: boolean = true;
}

export class FavouriteAuthorRequest extends FavouriteRequest {

    @IsNumber()
    authorId: number;
}

export interface FavouriteAuthorResponse {
    userId: number;
    authorId: number;
}