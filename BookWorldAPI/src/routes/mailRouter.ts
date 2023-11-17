import express, {Request, Response} from "express";
import {MailService} from "../service/mailService";
import {plainToInstance} from "class-transformer";
import {EmailRequest} from "../model/mailDto";


const mailRouter = express.Router();
const mailService = new MailService();


mailRouter.get("/", async (req: Request, res: Response) => {
    const request = plainToInstance(EmailRequest, req.body);
    await mailService.sendMail(request);
    return res.status(200).json({message: "Mail sent!"});
});

export default mailRouter;