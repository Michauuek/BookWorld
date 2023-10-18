import express, {Application, NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import genreRouter from "./routes/genreRouter";
import bookRouter from "./routes/bookRouter";
import userRouter from "./routes/userRouter";
import ratingRouter from "./routes/ratingRouter";
import authorRouter from "./routes/authorRouter";

const app: Application = express();
const PORT = process.env.PORT || 8000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true }))

app.use("/api/genres", genreRouter);
app.use("/api/books", bookRouter);
app.use("/api/authors", authorRouter);
app.use("/api/ratings", ratingRouter);
app.use("/api/users", userRouter);


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});