import express, {NextFunction, Request, Response} from "express";
import {MailService} from "../service/mailService";
import {plainToInstance} from "class-transformer";
import {EmailRequest} from "../model/mailDto";
import {errorHandler} from "../exceptions/customExceptionHandler";
import bookRouter from "./bookRouter";


const mailRouter = express.Router();
const mailService = new MailService();


mailRouter.get("/", async (req: Request, res: Response) => {
    const request = plainToInstance(EmailRequest, req.body);
    await mailService.sendMail(request);
    return res.status(200).json({message: "Mail sent!"});
});

mailRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler.handleError(err, res);
});

export default mailRouter;