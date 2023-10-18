import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import genreRouter from "./routes/genreRouter";

const app: Application = express();
const PORT = process.env.PORT || 8000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true }))
app.use("/api/genres", genreRouter);


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});