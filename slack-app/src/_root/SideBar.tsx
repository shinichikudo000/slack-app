import React, { useEffect, useState } from 'react';
import SignOut from './SignOut';
import SearchBar from './components/SearchBar';
import { useQuery } from '@tanstack/react-query';
import { fetchChannels, fetchUsers, filterChannels, filterUsers } from '@/react_query/utils';
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

export interface Channels {
    error: string,
    id: number;
    name: string
}

const SideBar = () => {
    const { data: allUsers, isLoading: isAllUsersLoading} = useQuery<User[], Error>({
        queryKey: ['allUsers'],
        queryFn: fetchUsers,
    })
    
    const {data: allChannels, isLoading: isAllChannelsLoading} = useQuery<Channels[]>({
        queryKey: ['allChannels'],
        queryFn: fetchChannels
    })

    const [users, setUsers] = useState<User[]>([])
    const [search, setSearch] = useState<string>()
    const debouncedSearch = useDebounce(search, 500)
    const [receiver, setReceiver] = useState<string>('users')
    const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false)
    const [channels, setChannels] = useState<Channels[]>([])

    useEffect(() => {
        const loadUsers = async () => {
            setIsSearchLoading(true)
            const users = await filterUsers(debouncedSearch || '', allUsers || [])
            setUsers(users)
            setIsSearchLoading(false)
        }
        const loadChannels = async () => {
            setIsSearchLoading(true)
            const channels = await filterChannels(debouncedSearch || '', allChannels || [])
            setChannels(channels)
            setIsSearchLoading(false)
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
        <section className='absolute top-0 left-0 p-8 h-full overflow-hidden min-w-[300px]'>
        <img src='/antisocial.png' alt='AntiSocial' className='w-[100px] mb-4'/>
        <SearchBar onChange={setSearch} />
        <ToggleGroup type="single" className='my-4 flex justify-start'>
            <ToggleGroupItem value="users" onClick={() => {setReceiver('users')}}>
                <p className='font-oxygen'>Users</p> 
            </ToggleGroupItem>
            <ToggleGroupItem value="channels" onClick={() => {setReceiver('channels')}}>
                <p className='font-oxygen'>Channels</p>
            </ToggleGroupItem>
        </ToggleGroup>
        {
            isAllUsersLoading || isAllChannelsLoading ? (
                <IsLoading />
        ) : (
            <div className='overflow-y-auto overflow-x-hidden h-[65%] w-full text-ellipsis'>
                <ul> 
                    { isSearchLoading ? (
                        <IsLoading />
                    ) : receiver === 'users' ? (
                        users.length > 0 ? (
                            users?.map((user) => {
                                return <UserCard userProp={user}/>
                            })
                        ) : (
                            <div className='font-oxygen'>No user found.</div>
                        )
                    ) : (
                       channels.length > 0 ? (
                        channels.map((channel) => {
                            return <div>{channel.id}</div>
                        })
                       ) : (
                            <div className='font-oxygen'>No channel found.</div>
                       )
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