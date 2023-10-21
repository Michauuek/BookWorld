import { IsNotEmpty, IsString } from "class-validator";




export class LoginRequest {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}


export class AuthResponse {
    bearerToken: string;
    refreshToken: string;
    expiresTimestamp: number;
}