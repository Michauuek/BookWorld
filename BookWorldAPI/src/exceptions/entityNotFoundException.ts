import {HttpCode} from "./httpCode";
import {AppError} from "./appError";


export class EntityNotFoundException extends AppError {
    constructor(description: string) {
        super({
            description,
            httpCode: HttpCode.NOT_FOUND,
        });
    }
}