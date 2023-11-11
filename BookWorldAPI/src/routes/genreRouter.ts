import express, {NextFunction, Request, Response} from "express";
import 'express-async-errors';
import {validationMiddleware} from "../utils/validator";
import {GenreRequest} from "../model/genreDto";
import {plainToInstance} from "class-transformer";
import {GenreService} from "../service/genreService";
import {errorHandler} from "../exceptions/customExceptionHandler";
import {allowOnly} from "../service/authService";
import {ElasticRequest} from "../../elastic_search/model/ElasticRequest";


const genreService = new GenreService();
const genreRouter = express.Router();


genreRouter.post("/elastic/get", async (req: Request, res: Response) => {
    const elasticRequest = plainToInstance(ElasticRequest, req.body);
    const response = await genreService.get(elasticRequest);
    return res.status(200).json(response);
});

genreRouter.post("/create", allowOnly(["ADMIN"]), validationMiddleware(GenreRequest), async (req: Request, res: Response) => {
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

genreRouter.put("/:id", validationMiddleware(GenreRequest), async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const genre = plainToInstance(GenreRequest, req.body);
    const response = await genreService.update(id, genre);
    return res.status(200).json(response);
});

genreRouter.delete("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    await genreService.deleteById(id);
    return res.status(204).send();
});

genreRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler.handleError(err, res);
});

export default genreRouter;