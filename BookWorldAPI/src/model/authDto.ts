import { IsNotEmpty, IsString } from "class-validator";




export class LoginRequest {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class RefreshTokenRequest {
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}


export class AuthResponse {
    bearerToken: string;
    refreshToken: string;
    expiresTimestamp: number;
}