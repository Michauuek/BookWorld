import {IsEmail, IsNotEmpty, IsString} from "class-validator";


export class EmailRequest {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    templateAliasName: string;

    @IsNotEmpty()
    @IsString()
    requiredDynamicData: object;

}