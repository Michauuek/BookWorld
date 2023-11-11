import {CreateUserRequest, UserResponse} from "../model/userDto";
import {prisma} from "../utils/prisma";
import {DEFAULT_USER_ROLE, SALT_ROUNDS} from "../utils/constants";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";

import * as bcrypt from 'bcryptjs';
import globalLogger from "../utils/logger";
import {EntityAlreadyExistsException} from "../exceptions/entityAlreadyExistsException";
import { Prisma } from "@prisma/client";
import {ElasticService} from "../../elastic_search/ElasticService";

const logger = globalLogger.child({class: 'UserService'});

export class UserService extends ElasticService<Prisma.UsersDelegate, Prisma.UsersWhereInput> {


    constructor() {
        super(prisma, 'Users');
    }

    async getAll(): Promise<UserResponse[]> {
        logger.info(`getAll()`);
        return prisma.users.findMany({
            where: { role: DEFAULT_USER_ROLE },
            select: {
                id: true,
                email: true,
                name: true,
                lastName: true,
                password: false,
                role: true,
                createdAt: true,
            }
        });
    }

    async getById(id: string): Promise<UserResponse> {
        logger.info({id}, `getById() - id:`);
        const user = await prisma.users.findUnique({
            where: { id: id },
            select: {
                id: true,
                email: true,
                name: true,
                lastName: true,
                password: false,
                role: true,
                createdAt: true,
            }
        });

        if (!user) {
            throw new EntityNotFoundException(`User with id ${id} does not exist`)
        }
        return user;
    }

    async save(userRequest: CreateUserRequest): Promise<UserResponse> {
        const hashedPassword = await this.hashPassword(userRequest.password);
        const checkUser = await this.getUserByEmail(userRequest.email);
        if (checkUser) {
            throw new EntityAlreadyExistsException(`User with email ${userRequest.email} already exists`)
        }
        const savedUser = await prisma.users.create({
            data: {
                email: userRequest.email,
                name: userRequest.name,
                lastName: userRequest.lastName,
                password: hashedPassword,
                role: DEFAULT_USER_ROLE
            },
            select: {
                id: true,
                email: true,
                name: true,
                lastName: true,
                password: false,
                role: true,
                createdAt: true,
            }
        });
        logger.info({savedUser}, `save() - savedUser: `);
        return savedUser;
    }

    async update(id: string, userRequest: CreateUserRequest): Promise<UserResponse> {
        logger.info(`update() - id: ${id}, userRequest: ${userRequest}`);
        const user = await prisma.users.update({
            where: { id: id },
            data: {
                email: userRequest.email,
                name: userRequest.name,
                lastName: userRequest.lastName,
            },
            select: {
                id: true,
                email: true,
                name: true,
                lastName: true,
                password: false,
                role: true,
                createdAt: true,
            }
        });
        logger.info({user}, `update() - user:`);
        return user;
    }

    async deleteById(id: string): Promise<void> {
        logger.info({id}, `deleteById() - id:`);
        await prisma.users.delete({
            where: { id: id }
        });
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, SALT_ROUNDS);
    }

    async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    private async getUserByEmail(email: string): Promise<UserResponse | null> {
        return prisma.users.findUnique({
            where: { email: email },
        });
    }
}