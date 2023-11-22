import { API } from "@/_api/api";
import { User } from "@/_root/SideBar";

export const fetchUsers = async (): Promise<User[]> => {
    const response = await API.get('/users');
    console.log(response.data.data)
    return response.data.data;
}