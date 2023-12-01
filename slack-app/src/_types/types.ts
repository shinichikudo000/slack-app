import { QueryFunction, QueryKey } from "@tanstack/react-query";

export interface MessageQueryParams {
    id: string;
    class: string
}
export interface MessageQuery {
    queryKey: QueryKey;
    queryFn: QueryFunction<any>;
}

export interface SearchBarProps {
    onChange: (value: string) => void;
    value: string;
}

export interface Message {
    id: number;
    body: string;
    created_at: string;
    sender: Sender;
}

export interface Sender {
    id: number,
    email: string,
}

export interface ChannelMember {
    user_id: number
}
