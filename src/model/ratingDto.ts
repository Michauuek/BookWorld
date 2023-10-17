import {IsNumber, IsString, Max, Min} from "class-validator";

export class RatingRequest {

    @IsNumber()
    bookId: number;

    @IsNumber()
    userId: number;

    @IsString()
    comment?: string;

    @IsNumber()
    @Min(0)
    @Max(10)
    rating: number;
}

export interface RatingResponse {
    id: number;
    bookId: number;
    userId: number;
    comment?: string;
    rating: number;
}