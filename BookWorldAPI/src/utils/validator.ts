

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

const validationPipe = async (schema: new () => {}, requestObject: object) => {
    const transformedClass: any = plainToInstance(schema, requestObject);
    const errors = await validate(transformedClass);
    if (errors.length > 0) {
        return errors;
    }
    return true;
};

export const validationMiddleware = (validationSchema: any) => async (req: Request, res: Response, next: NextFunction) => {
    const result: any = await validationPipe(validationSchema, req.body);
    if (Array.isArray(result)) {
        console.warn(result);
        return res.status(400).json({
            success: false,
            errors: result,
        });
    }

    next();
    return true;
};