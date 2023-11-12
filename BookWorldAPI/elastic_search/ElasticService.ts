import {PrismaClient} from "@prisma/client";
import {ElasticRequest} from "./model/ElasticRequest";
import {BadRequestException} from "../src/exceptions/badRequestException";

export abstract class ElasticService<T, R, M> {

    protected constructor(private prisma: PrismaClient, private readonly model: string) {
        this.prisma = prisma;
        this.model = model;
    }

    abstract mapToResponse(item: any): Promise<M>;

    async get(request: ElasticRequest): Promise<M[]> {
        console.log(request);

        const {skip, take} = request.pagination;
        const {column, desc} = request.sort;

        const model = this.model as T;
        const where: any = {};
        const filterConditions: R[] = [];

        request.filters.forEach((filter, index) => {
            const { field, operator, value } = filter;
            // @ts-ignore
            filterConditions.push({
                [field]: {
                    [operator]: value,
                },
            });
        });

        if (filterConditions.length > 0) {
            where[request.operator.toUpperCase()] = filterConditions;
        }

        try {
            // @ts-ignore
            const items = await this.prisma[model].findMany({
                where: where,
                orderBy: {
                    [column]: desc ? "desc" : "asc"
                },
                take: take,
                skip: skip
            });
            return await Promise.all(items.map((item: any) => this.mapToResponse(item)));
        } catch (error) {
            console.error("Error executing Prisma query:", error);
            throw new BadRequestException("Error executing Prisma query");
        }
    }

}




// async get(request: ElasticRequest): Promise<any> {
//
//     console.log(request);
//
//     const { field, operator, value } = request.filters[0];
//     const {skip, take} = request.pagination;
//     const sortField = request.sort.field
//     const desc = request.sort.desc
//
//     const model = this.model as T;
//
//     // @ts-ignore
//     return this.prisma[model].findMany({
//         where: {
//             [field]: {
//                 [operator]: value
//             }
//         },
//         orderBy: {
//             [sortField]: desc ? "desc" : "asc"
//         },
//         take: take,
//         skip: skip
//     });
// }

