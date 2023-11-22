import { API } from "@/_api/api";
import { User } from "@/_root/SideBar";

export const fetchUsers = async (): Promise<User[]> => {
    const response = await API.get('/users');
    return response.data.data;
}

export const filterUsers = async (search: string, users: User[] | undefined): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    if(users) {
        const filteredUsers = users.filter((user) => {
            return user.email && user.email.toLowerCase().includes(search?.toLowerCase())
        })
        return filteredUsers
    }
    return []
}

export const fetchChannels = async () => {
    const response = await API.get('/channels')
    console.log(response.data.errors)
    return response.data
}