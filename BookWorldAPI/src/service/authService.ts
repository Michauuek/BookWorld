import { randomUUID } from "crypto";
import { AppError } from "../exceptions/appError";
import { UserFullResponse, UserResponse } from "../model/userDto";
import { UserRole } from "../model/userRole";
import { RANDOM_TIME, REFRESH_TOKEN_EXP_TIME, TOKEN_EXP_TIME } from "../utils/constants";
import globalLogger from "../utils/logger";
import { prisma } from "../utils/prisma";
import { UserService } from "./userService";
import { AES } from 'crypto-ts';
import { enc } from 'crypto-ts';
import { NextFunction, Request, RequestHandler, Response } from "express";
import {BadRequestException} from "../exceptions/badRequestException";

const DEFAULT_ALLOWED: UserRole[] = ["ADMIN", "USER"];

interface TokenPayload {
    id: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    expAt: Date;
}

interface RefreshToken {
    id: string;
    user: UserFullResponse;
    createdAt: Date;
    expAt: Date;
}

function tryParseJSON(jsonString: string): any {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        return null;
    }
}

const userService = new UserService();
const logger = globalLogger.child({class: 'AuthService'});

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
 * You can also return data from lambda:
 * ```ts
 * const dataFromLambda = await letMeIn(req,
 *  async (user) => {
 *   // happy path
 *  return "Hello world!";
 * }
 * ).catch((err) => {
 *  // error handling
 *  return "Something went wrong!";
 * });
 * ```
 */
async function letMeIn<T=boolean>(req: Request, action: Action<T> = async () => { return true as unknown as T }, allowedRoles: UserRole[] = DEFAULT_ALLOWED): Promise<T> {
    // very critical code, DO NOT TOUCH
    
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

    if (new Date(payload.expAt).getTime() < new Date().getTime()) {
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

    console.log(user)

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
 * ```
 */
export const amIIn = (req: Request, allowedRoles: UserRole[] = DEFAULT_ALLOWED) => letMeIn(req, async () => { return true }, allowedRoles).catch((err) => { return false });

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
export const allowOnly = (allowedRoles: UserRole[] = DEFAULT_ALLOWED): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        letMeIn(req, async () => {
            next();
            return true;
        }, allowedRoles)
        .catch((err: AppError) => {
            res.status(err.httpCode||401).json(err);
            return false;
        });
    }
}

interface TokenList {
    expTime: Date;
    id: string;
}

export class AuthService {
    private userService = new UserService();
    private refreshTokens: TokenList[] = [];

    private removeExpiredTokens() {
        this.refreshTokens = this.refreshTokens.filter((token) => {
            return token.expTime.getTime() > new Date().getTime();
        });
    }

    private createToken(user: UserFullResponse): string {
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

    private createRefreshToken(user: UserFullResponse): string {
        const id = randomUUID();
        const payload: RefreshToken = {
            id: id,
            user: user,
            createdAt: new Date(),
            expAt: new Date(Date.now() + REFRESH_TOKEN_EXP_TIME),
        };

        this.removeExpiredTokens()

        this.refreshTokens.push({
            expTime: payload.expAt,
            id: id
        });

        const refreshToken = AES.encrypt(JSON.stringify(payload), process.env.JWT_SECRET || '');
        return refreshToken.toString();
    }

    authenticate = async (email: string, password: string) => {
        await new Promise(resolve => setTimeout(resolve, Math.random() * RANDOM_TIME));

        const user: UserFullResponse|null = await prisma.users.findUnique({
            where: { email: email }
        });
        
        if (!user) {
            logger.info(`authenticate() - user does not exists `, email);
            throw new BadRequestException("User does not exists");
        }

        const isPasswordValid = await this.userService.verifyPassword(password, user.password);

        if (!isPasswordValid) {
            logger.info(`authenticate() - auth failed for user `, user.email);
            throw new BadRequestException("Invalid credentials");
        }

        const token = this.createToken(user);
        const refreshToken = this.createRefreshToken(user);

        logger.info(`authenticate() - for user `, user.email);

        this.removeExpiredTokens()

        return {
            token,
            refreshToken,
            role: user.role,
            userId: user.id,
        };
    }

    letMeIn = async (req: Request, action: Action<boolean> = async () => { return true }, allowedRoles: UserRole[] = DEFAULT_ALLOWED): Promise<boolean> => letMeIn(req, action, allowedRoles).catch((err) => { return false });
    
    amIIn = async (req: Request, allowedRoles: UserRole[] = DEFAULT_ALLOWED) => amIIn(req, allowedRoles);

    refresh = async (refreshToken: string) => {                
        this.removeExpiredTokens()

        const decryptedToken = AES.decrypt(refreshToken, process.env.JWT_SECRET || '');
        const payload: RefreshToken = tryParseJSON(decryptedToken.toString(enc.Utf8));

        
        if (new Date(payload.expAt).getTime()  < new Date().getTime()) {
            logger.info(`authorizeRefreshToken() - token expired for user `, payload.user.email);
            throw new AppError({
                httpCode: 401,
                name: "TokenExpired",
                description: "Token expired"
            });
        }

        const token = this.refreshTokens.find((token) => {
            return token.id === payload.id;
        });

        if (!token) {
            logger.info(`authorizeRefreshToken() - token not found for user `, payload.user.email);
            throw new AppError({
                httpCode: 401,
                name: "Forbidden",
                description: "Forbidden"
            });
        }

        const newToken = this.createToken(payload.user);
        const newRefreshToken = this.createRefreshToken(payload.user);

        this.refreshTokens = this.refreshTokens.filter((token) => {
            return token.id !== payload.id;
        });

        logger.info(`authorizeRefreshToken() - for user `, payload.user.email);

        return {
            token: newToken,
            refreshToken: newRefreshToken,
            role: payload.user.role,
            userId: payload.user.id,
        };
    }
}

export default letMeIn;