import {IsNumber, IsString, Max, Min} from "class-validator";

export class RatingRequest {

    @IsNumber()
    bookId: number;

    @IsString()
    userId: string;

    @IsString()
    comment?: string;

    @IsNumber()
    @Min(0)
    @Max(5)
    rating: number;
}

export interface RatingResponse {
    id: number;
    bookId: number;
    userId: string;
    comment: string | null;
    rating: number;
}