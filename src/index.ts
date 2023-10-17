import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import {validationMiddleware} from "./service/validator";
import {BookRequest} from "./model/bookDto";
import {prisma} from "./utils/prisma";
import {plainToInstance} from "class-transformer";
import {GenreRequest} from "./model/genreDto";

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.send("Healthy");
});


// TODO move to controller
// added only for test purposes
app.post("/api/genre/create", validationMiddleware(GenreRequest), async (req: Request, res: Response) => {
    const genre = plainToInstance(GenreRequest, req.body);
    const savedGenre = await prisma.genres.create({
        data: { name: genre.name }
    });
    res.status(201).json(savedGenre);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

app.use(cors({ origin: true }))