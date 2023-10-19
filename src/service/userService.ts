import {UserRequest, UserResponse} from "../model/userDto";
import {prisma} from "../utils/prisma";
import {DEFAULT_USER_ROLE, SALT_ROUNDS} from "../utils/constants";
import {EntityNotFoundException} from "../exceptions/entityNotFoundException";

import * as bcrypt from 'bcryptjs';

export class UserService {

    async getAll(): Promise<UserResponse[]> {
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
        console.info(`getById() - id: `, id);
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

    async save(userRequest: UserRequest): Promise<UserResponse> {
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
        console.info(`save() - savedUser: `, savedUser);
        return savedUser;
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, SALT_ROUNDS);
    }

    async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}