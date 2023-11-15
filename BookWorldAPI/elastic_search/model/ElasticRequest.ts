import {Sort} from "./Sort";
import {Pagination} from "./Pagination";
import {ElasticRequestSelect} from "../ElasticService";


export type ElasticRequest<T> = {
    where: ElasticRequestSelect<T>;
    orderBy?: Sort;
    pagination?: Pagination;
};

