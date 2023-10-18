import express, {NextFunction, Request, Response} from "express";
import 'express-async-errors';
import {validationMiddleware} from "../utils/validator";
import {GenreRequest} from "../model/genreDto";
import {plainToInstance} from "class-transformer";
import {GenreService} from "../service/genreService";
import {errorHandler} from "../exceptions/customExceptionHandler";
import authorRouter from "./authorRouter";


const genreService = new GenreService();
const genreRouter = express.Router();

genreRouter.post("/create", validationMiddleware(GenreRequest), async (req: Request, res: Response) => {
    const genre = plainToInstance(GenreRequest, req.body);
    const response = await genreService.save(genre);
    return res.status(201).json(response);
});

genreRouter.get("/", async (req: Request, res: Response) => {
    const response = await genreService.getAll();
    return res.status(200).json(response);
});

genreRouter.get("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const response = await genreService.getById(id);
    return res.status(200).json(response);
});

authorRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler.handleError(err, res);
});

export default genreRouter;
