import { Prisma, PrismaClient } from "@prisma/client";
import {ElasticRequest} from "./model/ElasticRequest";
import {BadRequestException} from "../src/exceptions/badRequestException";
import {prisma} from "../src/utils/prisma";

type Models = Prisma.TypeMap["meta"]["modelProps"];

type AllFilters = Prisma.StringFilter | Prisma.IntFilter | Prisma.DateTimeFilter;

export type ElasticRequestSelect<T> = {
    AND?: Array<ElasticRequestSelect<T>>;
    OR?: Array<ElasticRequestSelect<T>>;
    NOT?: Array<ElasticRequestSelect<T>>;
} & {
    [P in keyof T]?: T[P] extends string ? AllFilters : never;
};

type ExtractWhereInput<T> = T extends {
    where: infer U;
}
    ? U extends Record<string, any>
    ? U
    : never
    : never;

type WhereInputTypes<T extends Models> = {
    [K in keyof T]: ExtractWhereInput<T[K]>;
};

type FindManyKeys<T> = {
    [K in keyof T]: T[K] extends { findMany: (...args: any[]) => any } ? K : never;
}[keyof T];

export abstract class ElasticSearchService<T extends Models, R> {
    modelName: FindManyKeys<PrismaClient>;

    abstract mapToResponse(model: object): Promise<R>;

    protected constructor(modelName: FindManyKeys<PrismaClient>) {
        this.modelName = modelName;
    }

    async get(request: ElasticRequest<WhereInputTypes<T>>): Promise<R[]> {
        console.log(request);
        const result = await this.search(request);

        return Promise.all(result.map(async (model) => {
            return this.mapToResponse(model);
        }));
    }

    private async search(request: ElasticRequest<WhereInputTypes<T>>): Promise<ReturnType<PrismaClient[FindManyKeys<PrismaClient>]['findMany']>> {
        const model = prisma[this.modelName];

        try {
            // @ts-ignore
            return await model.findMany({
                where: request.where,
                orderBy: request.orderBy,
                skip: request.pagination?.skip,
                take: request.pagination?.take,
            })
        } catch (e) {
            throw new BadRequestException(`Bad request body: ${(e as Error).name}`)
        }
    }
}
