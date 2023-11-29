import express, {NextFunction, Request, Response} from "express";
import 'express-async-errors';
import {validationMiddleware} from "../utils/validator";
import {plainToInstance} from "class-transformer";
import {UserService} from "../service/userService";
import {
    ChangeUserDataRequest,
    ChangeUserRoleRequest,
    ChangeUserStatusRequest,
    CreateUserRequest,
    UpdateUserRequest,
    UserChangePasswordRequest
} from "../model/userDto";
import {errorHandler} from "../exceptions/customExceptionHandler";
import {allowOnly} from "../service/authService";



const userService = new UserService();
const userRouter = express.Router();


userRouter.post("/elastic/get", allowOnly(["ADMIN"]), async (req: Request, res: Response) => {
    const response = await userService.get(req.body);
    return res.status(200).json(response);
});

userRouter.post("/create", validationMiddleware(CreateUserRequest), async (req: Request, res: Response) => {
    const user = plainToInstance(CreateUserRequest, req.body);
    const response = await userService.save(user);
    return res.status(201).json(response);
});

userRouter.get("/", allowOnly(["ADMIN"]), async (req: Request, res: Response) => {
    const response = await userService.getAll();
    return res.status(200).json(response);
});

userRouter.get("/:id", async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const response = await userService.getById(id);
    return res.status(200).json(response);
});
userRouter.get("/:id/status", allowOnly(["ADMIN"]), async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const status = await userService.getStatus(id)
    return res.status(200).json(status);
});

userRouter.put("/:id", allowOnly(["USER", "ADMIN"]), validationMiddleware(CreateUserRequest), async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const user = plainToInstance(CreateUserRequest, req.body);
    const response = await userService.update(id, user);
    return res.status(200).json(response);
});

userRouter.delete("/:id", allowOnly(["ADMIN"]), async (req: Request, res: Response) => {
    const id: string = req.params.id;
    await userService.deleteById(id);
    return res.status(204).send();
});

userRouter.patch("/role", allowOnly(["ADMIN"]), validationMiddleware(ChangeUserRoleRequest), async (req: Request, res: Response) => {
    const request = plainToInstance(ChangeUserRoleRequest, req.body);
    await userService.changeRole(request)
    return res.status(200).send();
});

userRouter.patch("/status", allowOnly(["ADMIN"]), validationMiddleware(ChangeUserStatusRequest), async (req: Request, res: Response) => {
    const request = plainToInstance(ChangeUserStatusRequest, req.body);
    await userService.changeStatus(request)
    return res.status(200).send();
});
userRouter.patch("/data", allowOnly(["ADMIN"]), validationMiddleware(ChangeUserDataRequest), async (req: Request, res: Response) => {
    const request = plainToInstance(ChangeUserDataRequest, req.body);
    await userService.changeUserData(request)
    return res.status(200).send();
});



userRouter.patch("/password/reset", allowOnly(["ADMIN"]), validationMiddleware(UpdateUserRequest), async (req: Request, res: Response) => {
    const request = plainToInstance(UpdateUserRequest, req.body);
    await userService.resetPassword(request.userId)
    return res.status(200).send();
});

userRouter.patch("/password/change", validationMiddleware(UserChangePasswordRequest), async (req: Request, res: Response) => {
    const request = plainToInstance(UserChangePasswordRequest, req.body);
    await userService.changePassword(request)
    return res.status(200).send();
});

userRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler.handleError(err, res);
});

export default userRouter;