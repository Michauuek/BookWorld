import express, {NextFunction, Request, Response} from "express";
import 'express-async-errors';
import {validationMiddleware} from "../utils/validator";
import {plainToInstance} from "class-transformer";
import {RatingService} from "../service/ratingService";
import {RatingRequest} from "../model/ratingDto";
import {errorHandler} from "../exceptions/customExceptionHandler";
import {allowOnly} from "../service/authService";
import {ElasticRequest} from "../../elastic_search/model/ElasticRequest";
import {ElasticFilterRequest} from "../../elastic_search/model/ElasticFilterRequest";


const ratingService = new RatingService();
const ratingRouter = express.Router();


ratingRouter.post("/elastic/get", async (req: Request, res: Response) => {
    const elasticRequest = plainToInstance(ElasticRequest, req.body);
    const response = await ratingService.get(elasticRequest);
    return res.status(200).json(response);
});

ratingRouter.post("/elastic/get/filter", async (req: Request, res: Response) => {
    const elasticRequest = plainToInstance(ElasticFilterRequest, req.body);
    const response = await ratingService.getDoubleFilter(elasticRequest);
    return res.status(200).json(response);
});

ratingRouter.post("/create", allowOnly(["USER", "ADMIN"]), validationMiddleware(RatingRequest), async (req: Request, res: Response) => {
    const rating = plainToInstance(RatingRequest, req.body);
    const response = await ratingService.save(rating);
    return res.status(201).json(response);
});

ratingRouter.get("/book/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const response = await ratingService.getAllForBook(id);
    return res.status(200).json(response);
});

ratingRouter.get("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const response = await ratingService.getById(id);
    return res.status(200).json(response);
});

ratingRouter.delete("/:id", allowOnly(["USER", "ADMIN"]), async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    await ratingService.deleteById(id);
    return res.status(204).send();
});

ratingRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler.handleError(err, res);
});

export default ratingRouter;

