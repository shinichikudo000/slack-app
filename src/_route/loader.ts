import { User } from "@/_hooks/context";
import { messageQuery, usersQuery } from "@/react_query/utils";


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
export const appLoader = (queryClient: any) => async() => {
    try {
        const users = usersQuery()
        const data = await queryClient.fetchQuery(users);
        const cachedUsers = queryClient.getQueryData(users.queryKey)
        const currentUser = {
            'access-token': localStorage.getItem('access-token') || '',
            'uid': localStorage.getItem('uid') || '',
            'expiry': localStorage.getItem('expiry') || '',
            'client': localStorage.getItem('client') || ''
        }

        if (data) {
            console.log(cachedUsers)
            return {cachedUsers: cachedUsers as User[], currentUser: currentUser as User};
        } else{
            return []
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        return null; 
      }
}
export const messageLoader = (queryClient: any) => async ({ params }: any) => {
    const query = messageQuery({ id: params.id, class: params.class });
  
    const cachedData = queryClient.getQueryData(query.queryKey);
    if (cachedData) {
        return cachedData;
    }
  
    try {
      const data = await queryClient.fetchQuery(query);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null; 
    }
  };