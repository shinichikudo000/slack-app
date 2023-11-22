import React, { useEffect, useState } from 'react';
import SignOut from './SignOut';
import SearchBar from './components/SearchBar';
import { useQuery } from '@tanstack/react-query';
import { fetchChannels, fetchUsers, filterUsers } from '@/react_query/utils';
import { useDebounce } from '@/_hooks/hooks';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import UserCard from './components/UserCard';
import IsLoading from './components/IsLoading';

export interface User {
    id: number;
    provider: string;
    uid: string;
    name: string | null;
    email: string;
}

const SideBar = () => {
    const { data: allUsers, isLoading: isAllUsersLoading} = useQuery<User[], Error>({
        queryKey: ['allUsers'],
        queryFn: fetchUsers,
    })
    
    const {data: allChannels, isLoading: isAllChannelsLoading} = useQuery({
        queryKey: ['allChannels'],
        queryFn: fetchChannels
    })

    const [users, setUsers] = useState<User[]>([])
    const [search, setSearch] = useState<string>()
    const debouncedSearch = useDebounce(search, 500)
    const [receiver, setReceiver] = useState<string>('users')
    const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false)

    useEffect(() => {
        const loadUsers = async () => {
            setIsSearchLoading(true)
            const users = await filterUsers(debouncedSearch || '', allUsers || [])
            setUsers(users)
            setIsSearchLoading(false)
        }
        const loadChannels = async () => {

        }
        if(receiver === 'users') {
            loadUsers()
        } else if (receiver === 'channels') {
            console.log(debouncedSearch)
            loadChannels()
        }
    }, [debouncedSearch])

  return (
    <>
        <section className='w-1/4 absolute top-0 left-0 p-8 h-full overflow-hidden'>
        <SearchBar onChange={setSearch}/>
        <ToggleGroup type="single" className='my-4 flex justify-start'>
            <ToggleGroupItem value="users" onClick={() => {setReceiver('users')}}>
                <p>Users</p> 
            </ToggleGroupItem>
            <ToggleGroupItem value="channels" onClick={() => {setReceiver('channels')}}>
                <p>Channels</p>
            </ToggleGroupItem>
        </ToggleGroup>
        {
            isAllUsersLoading || isAllChannelsLoading ? (
                <IsLoading />
        ) : (
            <div className='overflow-y-auto overflow-x-hidden h-[80%] w-full text-ellipsis'>
                <ul> 
                    { isSearchLoading ? (
                        <IsLoading />
                    ) : receiver === 'users' ? (
                        users?.map((user) => {
                            return <UserCard userProp={user}/>
                        })
                    ) : (
                        <div></div>
                    )}
                </ul>
            </div>
        )}
        <SignOut />
      </section>
    </>
  )
}

export default SideBar;