import express, {NextFunction, Request, Response} from "express";
import 'express-async-errors';
import {validationMiddleware} from "../utils/validator";
import {plainToInstance} from "class-transformer";
import {BookService} from "../service/bookService";
import {BookRequest} from "../model/bookDto";
import {errorHandler} from "../exceptions/customExceptionHandler";
import authorRouter from "./authorRouter";


const bookService = new BookService();
const bookRouter = express.Router();

bookRouter.post("/create", validationMiddleware(BookRequest), async (req: Request, res: Response) => {
    const book = plainToInstance(BookRequest, req.body);
    const response = await bookService.save(book);
    return res.status(201).json(response);
});

bookRouter.get("/", async (req: Request, res: Response) => {
    const response = await bookService.getAll();
    return res.status(200).json(response);
});

bookRouter.get("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const response = await bookService.getById(id);
    return res.status(200).json(response);
});

bookRouter.put("/:id", validationMiddleware(BookRequest), async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const book = plainToInstance(BookRequest, req.body);
    const response = await bookService.update(id, book);
    return res.status(200).json(response);
});

bookRouter.delete("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    await bookService.deleteById(id);
    return res.status(204).send();
});

bookRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler.handleError(err, res);
});

export default bookRouter;