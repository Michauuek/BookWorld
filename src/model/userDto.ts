
import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";
import {RatingResponse} from "./ratingDto";
import {FavouriteGenreResponse} from "./favouriteGenreDto";
import {FavouriteBookResponse} from "./favouriteBookDto";
import {FavouriteAuthorResponse} from "./favouriteAuthor";

export class UserRequest {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    name: string;

    @IsString()
    lastName: string;

    @IsString()
    @Length(8)
    password: string;
}

export interface UserResponse {
    id: string;
    email: string;
    name: string | null;
    lastName: string | null;
    role: string;
    createdAt: Date;
    ratings?: RatingResponse[];
    favouriteGenres?: FavouriteGenreResponse[];
    favouriteBooks?: FavouriteBookResponse[];
    favouriteAuthors?: FavouriteAuthorResponse[];
}