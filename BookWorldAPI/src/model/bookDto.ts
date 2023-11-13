import {IsNotEmpty, IsNumber, IsString, Max, Min} from "class-validator";
import {GenreResponse} from "./genreDto";
import {AuthorResponse} from "./authorDto";


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
    description: string | null;
    isbn: string | null;
    author: AuthorResponse;
    coverUrl: string | null;
    genres?: GenreResponse[];
}