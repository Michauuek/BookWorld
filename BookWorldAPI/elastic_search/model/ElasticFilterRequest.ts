import {Filter} from "./Filter";
import {Sort} from "./Sort";
import {Pagination} from "./Pagination";
import {FilterLogicalOperator} from "./FilterOperator";


export class ElasticFilterRequest {
    operator: FilterLogicalOperator = FilterLogicalOperator.AND;
    first: Filter = new Filter();
    second: Filter = new Filter();
    sort: Sort = new Sort();
    pagination: Pagination = new Pagination();
}