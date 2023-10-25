import { Router } from "express";
import letMeIn, { AuthService, allowOnly, amIIn } from "../service/authService";
import { AppError } from "../exceptions/appError";
import { plainToInstance } from "class-transformer";
import { LoginRequest, RefreshTokenRequest } from "../model/authDto";
import { validationMiddleware } from "../utils/validator";


const authRouter = Router();
const authService = new AuthService();

authRouter.post("/", validationMiddleware(LoginRequest), async (req, res) => {
    const request = plainToInstance(LoginRequest, req.body);
    
    // generate token
    authService.authenticate(request.email, request.password).then((token) => {
        return res.status(200).json(token);
    }).catch((err: AppError) => {
        console.log(err);
        return res.status(err.httpCode).json(err);
    });
});

authRouter.post("/refresh",validationMiddleware(RefreshTokenRequest), async (req, res) => {
    authService.refresh(req.body.refreshToken).then((token) => {
        return res.status(200).json(token);
    }).catch((err: AppError) => {
        console.log(err);
        return res.status(err.httpCode).json(err);
    });
})

authRouter.get("/test-bool", async (req, res) => {
    // bool test
    if(await amIIn(req)) {
        console.log("I am in!");
    } else {
        console.log("I am out!");
    }
});

authRouter.get("/test-lambda", async (req, res) => {
    // lambda test
    letMeIn(req, async (user) => {
        // we are in.
        res.status(200).json({
            message: "You are in!",
            user: user
        });
    }).catch((err) => {
        // something  went wrong
        res.status(err.httpCode||500).json({
            message: "Authentication failed",
            user: null,
        });
    });
});

authRouter.get("/test-handler", allowOnly(["ADMIN", "USER"]), async (req, res) => {
    return res.status(200).json({
        message: "You are in!"
    });
});

export default authRouter;