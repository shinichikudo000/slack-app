import { User } from "@/_hooks/context";

export async function currentUserLoader() {

    try {
        const currentUser = {
            'access-token': localStorage.getItem('access-token') || '',
            'uid': localStorage.getItem('uid') || '',
            'expiry': localStorage.getItem('expiry') || '',
            'client': localStorage.getItem('client') || ''
        };
        console.log(currentUser as User)
        return currentUser as User
    } catch (error) {
        console.log(error)
        throw error
    }
}