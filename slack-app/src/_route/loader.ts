import { User } from "@/_hooks/context";
import { MessageQueryParams } from "@/_types/types";
import { messageQuery } from "@/react_query/utils";


export async function currentUserLoader() {
    try {
        const currentUser = {
            'access-token': localStorage.getItem('access-token') || '',
            'uid': localStorage.getItem('uid') || '',
            'expiry': localStorage.getItem('expiry') || '',
            'client': localStorage.getItem('client') || ''
        };
        return currentUser as User
    } catch (error) {
        throw error
    }
}

export const messageLoader = (queryClient: any) => async ({ params }: any) => {
    const query = messageQuery(params)
    return (
        queryClient.getQueryData(query.queryKey) ??
        (await queryClient.fetchQuery(query))
    )
}