import { FilterOperator } from "./FilterOperator";


export class ElasticRequest {

    // filters to be applied
    // e.g. filter: {"name", "equals, "dupa"}
    filter: Filter = new Filter();
    sort: Sort = new Sort();
    pagination: Pagination = new Pagination();
    // filters: (Filter | FilterLogicalOperator)[] = [];
}

export class Filter {
    field: string = "id";
    operator: FilterOperator = FilterOperator.GREATER_THAN_OR_EQUAL;
    value: any = 0;
}

export class Sort {
    field: string = "id";
    desc: boolean = false;
}

export class Pagination {
    skip: number = 0;
    take: number = 10000;
}