import {FilterOperator} from "./FilterOperator";


export class Filter {
    field: string = "id";
    operator: FilterOperator = FilterOperator.GREATER_THAN_OR_EQUAL;
    value: any = 0;
}