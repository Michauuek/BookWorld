import letMeIn, {allowOnly} from "../service/authService";
import express, {NextFunction, Request, Response} from "express";
import {plainToInstance} from "class-transformer";
import {FavouriteAuthorRequest} from "../model/favouriteAuthor";
import {FavouriteBookRequest} from "../model/favouriteBookDto";
import {FavouriteGenreRequest} from "../model/favouriteGenreDto";
import {validationMiddleware} from "../utils/validator";
import {errorHandler} from "../exceptions/customExceptionHandler";
import {FavouriteBookService} from "../service/favouriteBookService";
import {FavouriteAuthorService} from "../service/favouriteAuthorService";
import {FavouriteGenreService} from "../service/favouriteGenreService";



const favouriteBookService = new FavouriteBookService();
const favouriteAuthorService = new FavouriteAuthorService();
const favouriteGenreService = new FavouriteGenreService();
const favouritesRouter = express.Router();


favouritesRouter.post("/book/elastic/get", async (req: Request, res: Response) => {
    const response = await favouriteBookService.get(req.body);
    return res.status(200).json(response);
});

favouritesRouter.post("/author/elastic/get", async (req: Request, res: Response) => {
    const response = await favouriteAuthorService.get(req.body);
    return res.status(200).json(response);
});

favouritesRouter.post("/genre/elastic/get", async (req: Request, res: Response) => {
    const response = await favouriteGenreService.get(req.body);
    return res.status(200).json(response);
});


favouritesRouter.post("/book", allowOnly(["USER", "ADMIN"]), validationMiddleware(FavouriteBookRequest), async (req: Request, res: Response) => {
    const request = plainToInstance(FavouriteBookRequest, req.body);
    await letMeIn(req, async (user) => {
        if (request.like) {
            const response = await favouriteBookService.addBookToFavourites(user, request);
            return res.status(201).json(response);
        } else {
            const response = await favouriteBookService.deleteBookFromFavourites(user, request);
            return res.status(204).json(response);
        }
    })
});

favouritesRouter.get("/book", allowOnly(["USER", "ADMIN"]), async (req: Request, res: Response) => {
    await letMeIn(req, async (user) => {
        const response = await favouriteBookService.getFavouritesBooks(user);
        return res.status(200).json(response);
    })
});

favouritesRouter.post("/author", allowOnly(["USER", "ADMIN"]), validationMiddleware(FavouriteAuthorRequest), async (req: Request, res: Response) => {
    const request = plainToInstance(FavouriteAuthorRequest, req.body);
    await letMeIn(req, async (user) => {
        if (request.like) {
            const response = await favouriteAuthorService.addAuthorToFavourites(user, request);
            return res.status(201).json(response);
        } else {
            const response = await favouriteAuthorService.deleteAuthorFromFavourites(user, request);
            return res.status(204).json(response);
        }
    })
});

favouritesRouter.get("/author", allowOnly(["USER", "ADMIN"]), async (req: Request, res: Response) => {
    await letMeIn(req, async (user) => {
        const response = await favouriteAuthorService.getFavouritesAuthors(user);
        return res.status(200).json(response);
    })
});


favouritesRouter.post("/genre", allowOnly(["USER", "ADMIN"]), validationMiddleware(FavouriteGenreRequest), async (req: Request, res: Response) => {
    const request = plainToInstance(FavouriteGenreRequest, req.body);
    await letMeIn(req, async (user) => {
        if (request.like){
            const response = await favouriteGenreService.addGenreToFavourites(user, request);
            return res.status(201).json(response);
        } else {
            const response = await favouriteGenreService.deleteGenreFromFavourites(user, request);
            return res.status(204).json(response);
        }
    })
});

favouritesRouter.get("/genre", allowOnly(["USER", "ADMIN"]), async (req: Request, res: Response) => {
    await letMeIn(req, async (user) => {
        const response = await favouriteGenreService.getFavouritesGenres(user);
        return res.status(200).json(response);
    })
});

favouritesRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler.handleError(err, res);
});

export default favouritesRouter;