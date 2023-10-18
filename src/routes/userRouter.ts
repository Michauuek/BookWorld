import express, {NextFunction, Request, Response} from "express";
import 'express-async-errors';
import {validationMiddleware} from "../utils/validator";
import {plainToInstance} from "class-transformer";
import {UserService} from "../service/userService";
import {UserRequest} from "../model/userDto";
import {errorHandler} from "../exceptions/customExceptionHandler";
import authorRouter from "./authorRouter";


const userService = new UserService();
const userRouter = express.Router();

userRouter.post("/create", validationMiddleware(UserRequest), async (req: Request, res: Response) => {
    const user = plainToInstance(UserRequest, req.body);
    const response = await userService.save(user);
    return res.status(201).json(response);
});

userRouter.get("/", async (req: Request, res: Response) => {
    const response = await userService.getAll();
    return res.status(200).json(response);
});

userRouter.get("/:id", async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const response = await userService.getById(id);
    return res.status(200).json(response);
});

authorRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler.handleError(err, res);
});

export default userRouter;