import {IsNotEmpty, IsString} from "class-validator";


export class GenreRequest {
    @IsNotEmpty()
    @IsString()
    name: string;
}

export interface GenreResponse {
    id: number;
    name: string;
}