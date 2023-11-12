import {AppError} from "./appError";
import {HttpCode} from "./httpCode";


export class BadRequestException extends AppError {
    constructor(description: string) {
        super({
            description,
            httpCode: HttpCode.BAD_REQUEST,
        });
    }
}