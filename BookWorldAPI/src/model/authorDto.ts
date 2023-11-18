import {IsNotEmpty, IsString} from "class-validator";
import {BookResponse} from "./bookDto";


export class AuthorRequest {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    booksIds: number[];
}

export interface AuthorResponse {
    id: number;
    name: string;
    lastName: string | null;
}

export interface AuthorResponseWithBooks extends AuthorResponse {
    books: BookResponse[];
}