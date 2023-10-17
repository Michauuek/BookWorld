import {IsNotEmpty, IsNumber, IsString, Max, Min} from "class-validator";
import {GenreResponse} from "./genreDto";


export class BookRequest {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsString()
    description?: string;

    @IsString()
    isbn?: string;

    @IsNumber()
    authorId: number;

    @IsString()
    coverUrl?: string;

    genresIds: number[];
}

export interface BookResponse {
    id: number;
    title: string;
    description?: string;
    isbn?: string;
    authorId: number;
    coverUrl?: string;
    genres?: GenreResponse[];
}