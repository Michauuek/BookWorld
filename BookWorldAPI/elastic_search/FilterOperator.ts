

export enum FilterOperator {
    EQUALS = "equals",
    NOT_EQUALS = "not",
    IN = "in",
    LESS_THAN = "lt",
    LESS_THAN_OR_EQUAL = "lte",
    GREATER_THAN = "gt",
    GREATER_THAN_OR_EQUAL = "gte",
    CONTAINS = "contains",
    STARTS_WITH = "startsWith",
    ENDS_WITH = "endsWith",
    SEARCH = "search",
}


export enum FilterLogicalOperator {
    AND = "AND",
    OR = "OR",
}
