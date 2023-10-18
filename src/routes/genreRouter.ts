import express, {Request, Response} from "express";
import {validationMiddleware} from "../service/validator";
import {GenreRequest} from "../model/genreDto";
import {plainToInstance} from "class-transformer";
import {GenreService} from "../service/genreService";


const genreService = new GenreService();
const genreRouter = express.Router();

genreRouter.post("/create", validationMiddleware(GenreRequest), async (req: Request, res: Response) => {
    const genre = plainToInstance(GenreRequest, req.body);
    try {
        const savedGenre = await genreService.save(genre);
        return res.status(201).json(savedGenre);
    } catch (error: any) {
        return res.status(500).json({message: error.message});
    }
});

genreRouter.get("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        const genre = await genreService.getById(id);
        return res.status(200).json(genre);
    } catch (error: any) {
        return res.status(500).json({message: error.message});
    }
});

export default genreRouter;
