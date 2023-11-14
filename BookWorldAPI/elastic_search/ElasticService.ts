import { Prisma, PrismaClient } from "@prisma/client";
import { Sort } from "./model/Sort";
import { Pagination } from "./model/Pagination";

type Models = Prisma.TypeMap["meta"]["modelProps"];

type AllFilters = Prisma.StringFilter | Prisma.IntFilter | Prisma.DateTimeFilter;

export type ElasticRequestSelect<T> = {
    AND?: Array<ElasticRequestSelect<T>>;
    OR?: Array<ElasticRequestSelect<T>>;
    NOT?: Array<ElasticRequestSelect<T>>;
} & {
    [P in keyof T]?: T[P] extends string ? AllFilters : never;
};

export type ElasticRequest<T> = {
    where: ElasticRequestSelect<T>;
    orderBy?: Sort;
    pagination?: Pagination;
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

export class ElasticSearchService<T extends Models> {
    modelName: FindManyKeys<PrismaClient>;

    constructor(modelName: FindManyKeys<PrismaClient>) {
        this.modelName = modelName;
    }

    async search(request: ElasticRequest<WhereInputTypes<T>>): Promise<ReturnType<PrismaClient[FindManyKeys<PrismaClient>]['findMany']>> {
        const prisma = new PrismaClient();
        const model = prisma[this.modelName];

        // @ts-ignore
        return await model.findMany({
                where: request.where,
                orderBy: request.orderBy,
                skip: request.pagination?.skip,
                take: request.pagination?.take,
            })
    }
}
