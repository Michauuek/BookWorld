import {PrismaClient} from "@prisma/client";
import {ElasticRequest} from "./model/ElasticRequest";


export abstract class ElasticService<T, R> {

     protected constructor(private prisma: PrismaClient, private readonly model: string) {
        this.prisma = prisma;
        this.model = model;
     }

    async get(request: ElasticRequest): Promise<any> {
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
            where[request.operator] = filterConditions;
        }
        // @ts-ignore
        return this.prisma[model].findMany({
            where: where,
            orderBy: {
                [column]: desc ? "desc" : "asc"
            },
            take: take,
            skip: skip
        });
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

}

