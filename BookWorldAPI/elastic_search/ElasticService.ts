import {PrismaClient} from "@prisma/client";
import {ElasticRequest} from "./model/ElasticRequest";
import {ElasticFilterRequest} from "./model/ElasticFilterRequest";
import {Filter} from "./model/Filter";
import {FilterLogicalOperator} from "./model/FilterOperator";


export abstract class ElasticService<T> {

     protected constructor(private prisma: PrismaClient, private readonly model: string) {
        this.prisma = prisma;
        this.model = model;
     }

     async get(request: ElasticRequest): Promise<any> {

         console.log(request);

         const field = request.filter.field
         const operator = request.filter.operator
         const value = request.filter.value

         const sortField = request.sort.field
         const desc = request.sort.desc

         const skip = request.pagination.skip
         const take = request.pagination.take

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

     async getDoubleFilter(request: ElasticFilterRequest): Promise<any> {

         console.log(request);

         const fieldFirst = request.first.field
         const operatorFirst = request.first.operator
         const valueFirst = request.first.value

         const fieldSecond = request.second.field
         const operatorSecond = request.second.operator
         const valueSecond = request.second.value

         const sortField = request.sort.field
         const desc = request.sort.desc

         const logicalOperator = request.operator

         const skip = request.pagination.skip
         const take = request.pagination.take

         const model = this.model as T;

         // @ts-ignore
         return this.prisma[model].findMany({
             where: {
                 [logicalOperator]: [
                     {
                         [fieldFirst]: {
                             [operatorFirst]: valueFirst
                         }
                     },
                     {
                        [fieldSecond]: {
                            [operatorSecond]: valueSecond
                        }
                    }
                 ]
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

