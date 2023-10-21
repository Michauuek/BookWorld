import { Router } from "express";
import letMeIn, { AuthService } from "../service/authService";


const authRouter = Router();
const authService = new AuthService();

authRouter.get("/", async (req, res) => {
    // generate token
    authService.authenticate(req.body.email, req.body.password).then((token) => {
        return res.status(200).json(token);
    }).catch((err) => {
        return res.status(err.httpCode).json(err);
    });
});

authRouter.get("/auth-test", async (req, res) => {
    letMeIn(req, async (user) => {
        // we are in.
        return res.status(200).json(user);
    }).catch((err) => {
        // something  went wrong
        return res.status(err.httpCode).json(err);
    });
});

