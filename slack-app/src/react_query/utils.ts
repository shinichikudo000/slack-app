import { API } from "@/_api/api";
import { Channels, User } from "@/_root/SideBar";
import { MessageQuery, MessageQueryParams } from "@/_types/types";

export const fetchUsers = async (): Promise<User[]> => {
    const response = await API.get('/users');
    return response.data.data;
}

export const messageQuery = ({ id, class: className }: any) => ({
    queryKey: [`${className}_${id}`],
    queryFn: async () => {
        const response = await API.get('/messages', {
           params: {
                receiver_id: id,
                receiver_class: className
           }
        })
        if(response) {
            console.log(response.data)
        }
        if(response.data.error) {
             throw new Response('', {
                status: 404,
                 statusText: 'Not Found'
             })
        }
        return response.data.data
    }
})

export const filterUsers = async (search: string, users: User[] | undefined): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    if(users && search !== '') {
        const filteredUsers = users.filter((user) => {
            return user.email && user.email.toLowerCase().includes(search?.toLowerCase())
        })
        return filteredUsers
    } else if(users && search === '') {
        return []
    }
    return []
}

export const fetchChannels = async () => {
    const response = await API.get('/channels')
    return response.data
}

export const filterChannels = async (search: string, channels: Channels[] | undefined): Promise<Channels[]>=> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    if(channels) {
        const filteredChannels = channels.filter((channel) => {
            return channel.name && channel.name.toLowerCase().includes(search?.toLowerCase())
        })
        return filteredChannels
    }
    return []
}