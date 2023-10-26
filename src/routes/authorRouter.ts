import express, {NextFunction, Request, Response} from "express";
import 'express-async-errors';
import {validationMiddleware} from "../utils/validator";
import {plainToInstance} from "class-transformer";
import {AuthorService} from "../service/authorService";
import {AuthorRequest} from "../model/authorDto";
import {errorHandler} from "../exceptions/customExceptionHandler";
import {allowOnly} from "../service/authService";


const authorService = new AuthorService();
const authorRouter = express.Router();

authorRouter.post("/create", allowOnly(["ADMIN"]), validationMiddleware(AuthorRequest), async (req: Request, res: Response) => {
    const author = plainToInstance(AuthorRequest, req.body);
    const response = await authorService.save(author);
    return res.status(201).json(response);
});

authorRouter.get("/", async (req: Request, res: Response) => {
    const response = await authorService.getAll();
    return res.status(200).json(response);
});

authorRouter.get("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const response = await authorService.getById(id);
    return res.status(200).json(response);
});

authorRouter.put("/:id", allowOnly(["ADMIN"]), validationMiddleware(AuthorRequest), async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const author = plainToInstance(AuthorRequest, req.body);
    const response = await authorService.update(id, author);
    return res.status(200).json(response);
});

authorRouter.delete("/:id", allowOnly(["ADMIN"]), async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    await authorService.deleteById(id);
    return res.status(204).send();
});

authorRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler.handleError(err, res);
});

export default authorRouter;

