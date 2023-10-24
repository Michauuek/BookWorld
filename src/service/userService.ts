import {CreateUserRequest, UserResponse} from "../model/userDto";
import {prisma} from "../utils/prisma";
import {DEFAULT_USER_ROLE, SALT_ROUNDS} from "../utils/constants";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";

import * as bcrypt from 'bcryptjs';
import globalLogger from "../utils/logger";

const logger = globalLogger.child({class: 'UserService'});

export class UserService {

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
        logger.info(`getById() - id: `, id);
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
        logger.info(`save() - savedUser: `, savedUser);
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
        logger.info(`update() - user: ${user}`);
        return user;
    }

    async deleteById(id: string): Promise<void> {
        logger.info(`deleteById() - id: ${id}`);
        prisma.users.delete({
            where: { id: id }
        });
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, SALT_ROUNDS);
    }

    async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}