
import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";
import {RatingResponse} from "./ratingDto";
import {FavouriteGenreResponse} from "./favouriteGenreDto";
import {FavouriteBookResponse} from "./favouriteBookDto";
import {FavouriteAuthorResponse} from "./favouriteAuthor";
import {UserRole} from "./userRole";

export class CreateUserRequest {
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

export class UpdateUserRequest {
    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class ChangeUserRoleRequest extends UpdateUserRequest {

    @IsNotEmpty()
    role: UserRole;
}

export class ChangeUserStatusRequest extends UpdateUserRequest {

    @IsNotEmpty()
    active: boolean;
}

export class UserChangePasswordRequest {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @IsString()
    @IsNotEmpty()
    newPassword: string;

    // @IsString()
    // @IsNotEmpty()
    // resetToken: string;
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

export interface UserFullResponse extends UserResponse {
    active: boolean;
    password: string;
}