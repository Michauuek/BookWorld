
import {Filter} from "./Filter";
import {Sort} from "./Sort";
import {Pagination} from "./Pagination";


export class ElasticRequest {

    // filters to be applied
    // e.g. filter: {"name", "equals, "dupa"}
    filter: Filter = new Filter();
    sort: Sort = new Sort();
    pagination: Pagination = new Pagination();
}

