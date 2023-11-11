
import {Filter} from "./Filter";
import {Sort} from "./Sort";
import {Pagination} from "./Pagination";
import {LogicalOperator} from "./FilterOperator";


export class ElasticRequest {
    // filter: Filter = new Filter();
    sort: Sort = new Sort();
    pagination: Pagination = new Pagination();
    operator: LogicalOperator = LogicalOperator.AND;
    filters: Filter[] = [new Filter()];
}
