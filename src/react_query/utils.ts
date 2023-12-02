import { API } from "@/_api/api";
import { Channels, User } from "@/_root/SideBar";
import { Message } from "@/_types/types";

export const fetchUsers = async (): Promise<User[]> => {
    const response = await API.get('/users');
    return response.data.data;
}

export const usersQuery = () => ({
    queryKey: ['allUsers'],
    queryFn: fetchUsers,
})

export const messageQuery = ({ id, class: className}: any) => ({
    queryKey: [`${className}_${id}`],
    queryFn: async () => {
        const response = await API.get('/messages', {
           params: {
                receiver_id: id,
                receiver_class: className
           }
        })
        if(response.data.error) {
             throw new Response('', {
                status: 404,
                 statusText: 'Not Found'
             })
        }
        return response.data.data
    }
})

export const fetchMessage = async ({ id, class: className, page}: any ) => {
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
    return response.data.data.slice((page - 1) * 10, page * 10)
}

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
    return response.data.data
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

export const addMessage =  async ({ id, class: receiverClass, message }): Promise<Message> => {
    try {
        const response = await API.post('messages', {
            receiver_id: id,
            receiver_class: receiverClass,
            body: message,
        });
        return response.data
    } catch (error) {
        console.error('Error adding message:', error)
        throw error
    }
}

export const addChannel = async ({ data: { channelName, memberArray } }: { data: { channelName: string; memberArray: string[] } }) => {
    try {
      const res = await API.post('/channels', {
        name: channelName,
        user_ids: memberArray,
      });
      return res.data;
    } catch (error) {
      console.error('Error creating channel:', error);
      throw error;
    }
  };

  export const additionalMembersFunc = async ({ channelId, memberArray }) => {
    const res = memberArray.map((member) => {
        try {
            const response = API.post('/channel/add_member', {
                id: channelId,
                member_id: member
            });
            // Handle the response if needed
            return response
        } catch (error) {
            // Handle errors here
            console.error(error);
        }
    })
    return res
};