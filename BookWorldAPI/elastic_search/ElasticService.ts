import {PrismaClient} from "@prisma/client";
import {ElasticRequest, Filter} from "./ElasticRequest";


export abstract class ElasticService<T> {

     protected constructor(private prisma: PrismaClient, private readonly model: string) {
        this.prisma = prisma;
        this.model = model;
     }


     async get(elasticRequest: ElasticRequest): Promise<any> {

         console.log(elasticRequest);

         const field = elasticRequest.filter.field
         const operator = elasticRequest.filter.operator
         const value = elasticRequest.filter.value

         const sortField = elasticRequest.sort.field
         const desc = elasticRequest.sort.desc

         const skip = elasticRequest.pagination.skip
         const take = elasticRequest.pagination.take

         const model = this.model as T;

         // @ts-ignore
         return this.prisma[model].findMany({
             where: {
                 [field]: {
                     [operator]: value
                 }
             },
             orderBy: {
                 [sortField]: desc ? "desc" : "asc"
             },
             take: take,
             skip: skip
         });
     }

}

// function tak(filters: Filter[]) {
//
//     // validateFilters(filters);
//
//     let queryWhere = "";
//
//     const whereConditions = filters.map((condition) => {
//
//         if (condition.nextLogicalOperator != null) {
//             return {[condition.field]: {[(<FilterOperator>condition.operator)]: condition.value}};
//         }
//
//         return {[condition.field]: {[(<FilterOperator>condition.operator)]: condition.value}};
//     });
//
//     console.log("WHERE CONDITIONS")
//     console.log(whereConditions);
//
// }
//
// function validateFilters(filters: (Filter | FilterLogicalOperator)[]) {
//
//     if (filters.length % 2 != 1) {
//         throw new Error("Invalid number of filters");
//     }
//
//     filters.forEach((element, index) => {
//         console.log(typeof element + " " + index);
//         if (element as Filter && index % 2 == 0) {
//             console.log("Filter");
//             console.log(element as Filter);
//             return;
//         }
//         else if (element as FilterLogicalOperator && index % 2 == 1) {
//             console.log("LogicalOperatorWrapper");
//             console.log(element as FilterLogicalOperator);
//             return;
//         }
//         else {
//             console.log(typeof element);
//             console.log(element);
//             console.log(index % 2);
//             throw new Error("Invalid filter 3");
//         }
//     });
//
// }

