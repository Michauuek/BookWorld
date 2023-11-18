import express, {NextFunction, Request, Response} from "express";
import {BookGenresService} from "../service/bookGenresService";
import {errorHandler} from "../exceptions/customExceptionHandler";
import bookRouter from "./bookRouter";


const bookGenresRouter = express.Router();
const bookGenresService = new BookGenresService();


bookGenresRouter.get("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const response = await bookGenresService.getBooksByGenreId(id);
    return res.status(200).json(response);
});

bookGenresRouter.get("/elastic/get", async (req: Request, res: Response) => {
    const response = await bookGenresService.get(req.body);
    return res.status(200).json(response);
});

bookGenresRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler.handleError(err, res);
});

export default bookGenresRouter;