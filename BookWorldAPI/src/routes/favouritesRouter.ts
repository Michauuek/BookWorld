import letMeIn, {allowOnly} from "../service/authService";
import express, {Request, Response} from "express";
import {FavouritesService} from "../service/favouritesService";
import {plainToInstance} from "class-transformer";
import {FavouriteAuthorRequest} from "../model/favouriteAuthor";
import {FavouriteBookRequest} from "../model/favouriteBookDto";
import {FavouriteGenreRequest} from "../model/favouriteGenreDto";
import {validationMiddleware} from "../utils/validator";



const favouritesService = new FavouritesService();
const favouritesRouter = express.Router();


favouritesRouter.post("/book", allowOnly(["USER", "ADMIN"]), validationMiddleware(FavouriteBookRequest), async (req: Request, res: Response) => {
    const request = plainToInstance(FavouriteBookRequest, req.body);
    await letMeIn(req, async (user) => {
        const response = await favouritesService.addBookToFavourites(user, request);
        return res.status(201).json(response);
    })
});

favouritesRouter.get("/book", allowOnly(["USER", "ADMIN"]), async (req: Request, res: Response) => {
    await letMeIn(req, async (user) => {
        const response = await favouritesService.getFavouritesBooks(user);
        return res.status(200).json(response);
    })
});

favouritesRouter.post("/author", allowOnly(["USER", "ADMIN"]), validationMiddleware(FavouriteAuthorRequest), async (req: Request, res: Response) => {
    const request = plainToInstance(FavouriteAuthorRequest, req.body);
    await letMeIn(req, async (user) => {
        const response = await favouritesService.addAuthorToFavourites(user, request);
        return res.status(201).json(response);
    })
});

favouritesRouter.get("/author", allowOnly(["USER", "ADMIN"]), async (req: Request, res: Response) => {
    await letMeIn(req, async (user) => {
        const response = await favouritesService.getFavouritesAuthors(user);
        return res.status(200).json(response);
    })
});


favouritesRouter.post("/genre", allowOnly(["USER", "ADMIN"]), validationMiddleware(FavouriteGenreRequest), async (req: Request, res: Response) => {
    const request = plainToInstance(FavouriteGenreRequest, req.body);
    await letMeIn(req, async (user) => {
        const response = await favouritesService.addGenreToFavourites(user, request);
        return res.status(201).json(response);
    })
});

favouritesRouter.get("/genre", allowOnly(["USER", "ADMIN"]), async (req: Request, res: Response) => {
    await letMeIn(req, async (user) => {
        const response = await favouritesService.getFavouritesGenres(user);
        return res.status(200).json(response);
    })
});

export default favouritesRouter;