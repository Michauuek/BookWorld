import { AppError } from "../exceptions/appError";
import { UserFullResponse, UserResponse } from "../model/userDto";
import { UserRole } from "../model/userRole";
import { prisma } from "../utils/prisma";
import { UserService } from "./userService";
import { AES } from 'crypto-ts';
import { enc } from 'crypto-ts';
import { NextFunction, Request, RequestHandler, Response } from "express";
// 15 minutes
const TOKEN_EXP_TIME = 1000 * 60 * 15;
// 7 days
const REFRESH_TOKEN_EXP_TIME = 1000 * 60 * 60 * 24 * 7;

interface TokenPayload {
    id: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    expAt: Date;
}

interface RefreshToken {
    token: string;
    expAt: Date;
}

function createToken(user: UserFullResponse): string {
    const payload: TokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
        createdAt: new Date(),
        expAt: new Date(Date.now() + TOKEN_EXP_TIME)
    };

    const token = AES.encrypt(JSON.stringify(payload), process.env.JWT_SECRET || '');
    return token.toString();
}

function createRefreshToken(user: UserFullResponse): string {
    const payload: TokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
        createdAt: new Date(),
        expAt: new Date(Date.now() + REFRESH_TOKEN_EXP_TIME)
    };

    const token = AES.encrypt(JSON.stringify(payload), process.env.JWT_SECRET || '');
    return token.toString();
}

function tryParseJSON(jsonString: string): any {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        return null;
    }
}

const userService = new UserService();

type Action<T> = (user: UserResponse) => Promise<T>;


/**
 * # let ME IN@32123@!#$@!@!
 * 
 * usage:
 * ```ts
 * letMeIn(req, async (user) => {
 *    // happy path
 *    return res.status(200).json(user); 
 * })
 * ```
 * If you want to allow only certain roles:
 * ```ts
 * letMeIn(req, 
 *    async (user) => {
 *       // happy path
 *       return res.status(200).json(user); 
 *    }
 *    // allow only ADMIN role
 *    allowedRoles = ["ADMIN"]
 * )
 * ```
 * If you want to handle errors:
 * ```ts
 * letMeIn(req, 
 *   async (user) => {
 *     // happy path
 *     return res.status(200).json(user);
 *   }, ["ADMIN"]
 * ).catch((err) => {
 *   // error handling
 *   return res.status(err.httpCode).json(err);
 * });
 * ```
 */
async function letMeIn<T=boolean>(req: Request, action: Action<T> = async () => { return true as unknown as T }, allowedRoles: UserRole[] = ["ADMIN", "USER"]): Promise<T> {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new AppError({
            httpCode: 401,
            name: "MissingToken",
            description: "Unauthorized"
        });
    }

    const decryptedToken = AES.decrypt(token, process.env.JWT_SECRET || '');
    const payload: TokenPayload | null = tryParseJSON(decryptedToken.toString(enc.Utf8));

    if (!payload) {
        throw new AppError({
            httpCode: 401,
            name: "Forbidden",
            description: "Forbidden"
        });
    }
    
    if (payload.expAt < new Date()) {
        throw new AppError({
            httpCode: 401,
            name: "TokenExpired",
            description: "Token expired"
        });
    }
    

    if (!allowedRoles.includes(payload.role)) {
        throw new AppError({
            httpCode: 401,
            name: "Forbidden",
            description: "Forbidden"
        });
    }

    const user = await userService.getById(payload.id).catch((err) => {
        throw new AppError({
            httpCode: 401,
            name: "Forbidden",
            description: "Forbidden"
        });
    });

    return action(user);
}

/**
 * # am I in?
 * Example usage:
 * ```ts
 * if(await amIIn(req)) {
 *   // happy path
 * } else {
 *  // sad path
 * }
 */
export const amIIn = (req: Request, allowedRoles: UserRole[] = ["ADMIN", "USER"]) => letMeIn(req, async () => { return true }, allowedRoles).catch((err) => { return false });

/**
 * # allow only certain roles
 * Example usage:
 * ```ts
 * // this code will return 401 if user is not ADMIN or credentials are not valid
 * router.get("/test-handler", allowOnly(["ADMIN"]), async (req, res) => {
 *  return res.status(200).json({
 *   message: "You are in!"
 * });
 * ```
 */
export const allowOnly = (allowedRoles: UserRole[] = ["ADMIN", "USER"]): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        letMeIn(req, async () => {
            next();
            return true;
        }, allowedRoles)
        .catch((err: AppError) => {
            return res.status(err.httpCode||401).json(err);
        });
    }
}

export class AuthService {
    userService = new UserService();

    authenticate = async (email: string, password: string) => {
        const user: UserFullResponse|null = await prisma.users.findUnique({
            where: { email: email }
        });
        

        if (!user) {
            return null;
        }

        const isPasswordValid = await this.userService.verifyPassword(password, user.password);

        if (!isPasswordValid) {
            return null;
        }

        const token = createToken(user);
        const refreshToken = createRefreshToken(user);

        return {
            token,
            refreshToken
        };
    }

    authorizeRefreshToken = async (refreshToken: string) => {
        // decrypt refreshToken and check if it is valid
        const decryptedToken = AES.decrypt(refreshToken, process.env.JWT_SECRET || '');
        const payload: TokenPayload = JSON.parse(decryptedToken.toString());

        if (payload.expAt < new Date()) {
            throw new AppError({
                httpCode: 401,
                name: "TokenExpired",
                description: "Token expired"
            });
        }


    }
}

export default letMeIn;