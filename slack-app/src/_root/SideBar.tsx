import React, { useEffect, useState } from 'react';
import SignOut from './SignOut';
import SearchBar from './components/SearchBar';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/react_query/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/_hooks/hooks';

export interface User {
    id: number;
    provider: string;
    uid: string;
    allow_password_change: boolean;
    name: string | null;
    nickname: string | null;
    image: string | null;
    email: string;
    created_at: string;
    updated_at: string;
}

const SideBar = () => {
  const { data: allUsers, isLoading } = useQuery<User[], Error>({
    queryKey: ['allUsers'],
    queryFn: fetchUsers,
  })

    const [users, setUsers] = useState<User[]>([])
    const [search, setSearch] = useState<string>()
    const debouncedSearch = useDebounce(search, 500)

    useEffect(() => {
        const loadUsers = async () => {
            const users = filterAllUser(debouncedSearch)
            setUsers(users)
        }
        loadUsers()
    }, [debouncedSearch])

  return (
    <>
      <section className='w-1/4'>
        <SearchBar onChange={setSearch} />
        {
            isLoading ? (
                <div className="flex items-center space-x-4 w-full">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[15rem]" />
                        <Skeleton className="h-4 w-[10rem]" />
                    </div>
                </div>
        ) : (
            <div>
                <ul>
                { users?.map((user) => {
                    return <div>{user.id}</div>
                })}
                </ul>
            </div>
        )}
        <SignOut />
      </section>
    </>
  )
}

export default SideBar;