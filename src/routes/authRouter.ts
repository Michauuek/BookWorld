import { Router } from "express";
import letMeIn, { AuthService } from "../service/authService";
import { AppError } from "../exceptions/appError";
import { plainToInstance } from "class-transformer";
import { LoginRequest } from "../model/authDto";


const authRouter = Router();
const authService = new AuthService();

authRouter.get("/", async (req, res) => {
    const request = plainToInstance(LoginRequest, req.body);
    
    // generate token
    authService.authenticate(request.email, request.password).then((token) => {
        return res.status(200).json(token);
    }).catch((err: AppError) => {
        console.log(err);
        return res.status(err.httpCode).json(err);
    });
});

authRouter.get("/auth-test", async (req, res) => {
    letMeIn(req, async (user) => {
        // we are in.
        return res.status(200).json({
            message: "You are in!",
            user: user
        });
    }).catch((err) => {
        console.log(err)
        // something  went wrong
        return res.status(err.httpCode||500).json({
            message: "Authentication failed",
            user: null,
        });
        
    });
});

export default authRouter;