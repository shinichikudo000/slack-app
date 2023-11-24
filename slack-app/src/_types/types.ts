import { QueryFunction, QueryKey } from "@tanstack/react-query";

export interface MessageQueryParams {
    id: string;
    class: string
}
export interface MessageQuery {
    queryKey: QueryKey;
    queryFn: QueryFunction<any>;
}