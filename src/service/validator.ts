

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const validationPipe = async (schema: new () => {}, requestObject: object) => {
    const transformedClass: any = plainToInstance(schema, requestObject);
    const errors = await validate(transformedClass);
    if (errors.length > 0) {
        return errors;
    }
    return true;
};

//middleware

// export const validationMiddleware (validationSchema) => async (req, res, next) => {
//     const result: any = await validationPipe(validationSchema, { ...req.body, ...req.params }, { pretty: false });
//     if (result.errors) {
//         console.log(result);
//         return res.status(400).json({
//             success: false,
//             ...result,
//         });
//     }
//
//     next();
//     return true;
// };