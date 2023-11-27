import React, { useEffect, useReducer, useState, createContext, Dispatch } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { User } from '../SideBar'
import { filterUsers } from '@/react_query/utils'
import { useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@/_hooks/hooks'
import UserCardCreateChannel from './UserCardCreateChannel'
import IsLoading from './IsLoading'
import { API } from '@/_api/api'
import { toast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router-dom'



interface Action {
    type: 'addMember' | 'removeMember';
    user: User
}

interface ContextProps {
    dispatch: Dispatch<Action>;
  }

function reducer(members: User[], action: Action): User[] {
    const {type} = action
    switch(type) {
        case 'addMember': {
            const isMemberExists = members.some((member) => member.id === action.user.id);
            if (!isMemberExists) {
                return [...members, action.user];
            }

            return members;
        }
        case 'removeMember': {
            return members.filter((member) => member.id !== action.user.id);
        }
        default:
            return members;
    }
}

const initialState: User[] = []

export const Context = createContext({} as ContextProps)

const CreateChannel = () => {
    const queryClient = useQueryClient()
    const allUsers = queryClient.getQueriesData<User[]>(['allUsers'])[0][1]
    const [users, setUsers] = useState<User[]>([])
    const [search, setSearch] = useState<string>('')
    const debouncedSearch = useDebounce(search, 500)
    const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false)


    const [members, dispatch] = useReducer(reducer, initialState)

    const navigate = useNavigate()
    
    useEffect(() => {
        const loadUsers = async () => {
            try {
                setIsSearchLoading(true);
                const users = await filterUsers(debouncedSearch || '', allUsers || []);
                setUsers(users);
            } catch (error) {
            } finally {
                setIsSearchLoading(false);
            }
        };
        console.log(members)
        loadUsers();
    }, [debouncedSearch]);

    const form = useForm()

    const onSubmit = async (data: any) => {
        const memberArray = members.map((member) => member.id)
        try {
            const res  = await API.post('/channels', {
                name: data.channelName,
                user_ids: memberArray
            })
            if(res.status === 200) {
                toast({
                    title: 'Successfully created a channel',
                    description: ''
                })
                navigate(`/Channel/${res.data.id}`)
            }
        } catch (error) {
            console.error('Error creating channel:', error);
        }
    }

    const handleClick = () => {
        setSearch('')
    }

    return (
        <Context.Provider value={{dispatch}}>
            <section className='w-full h-full flex flex-col justify-center items-center'>
                <div className='w-[500px] h-full flex flex-col justify-center'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4 text-left">
                            <FormField
                                control={form.control}
                                name="channelName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-oxygen'>Channel Name</FormLabel>
                                        <FormControl>
                                            <Input type='text' placeholder="Channel Name" {...field} className='font-oxygen'/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="userSearch"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-oxygen'>Add User to Channel</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='text'
                                                placeholder="Search User"
                                                {...field}
                                                className='font-oxygen'
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        {
                            members?.map((member) => {
                                return <div key={member.id} className='bg-slate-200 rounded-full max-w-full p-[1rem] relative'>
                                    <span>{member.email}</span>
                                    <button className='w-[2rem] h-[2rem] rounded-full bg-slate-700 ] absolute right-[1rem] top-[1rem]' onClick={() => {dispatch({type: 'removeMember', user: member})}}>-</button>
                                </div>
                            })
                        }
                            <div className='overflow-y-auto overflow-x-hidden max-h-[450px] flex flex-col'>
                            { 
                                search === '' ? (
                                    <div></div> 
                                ) : isSearchLoading ? (
                                    <IsLoading />
                                ) : (
                                    (
                                        users.length > 0 ? (
                                            users?.map((user) => {
                                                return <UserCardCreateChannel userProp={user} onClick={handleClick}/>
                                            })
                                        ) : (
                                            <div className='font-oxygen'>No user found.</div>
                                        )
                                    )
                                )
                            }
                            </div>
                            <Button type="submit" disabled={form.formState.isSubmitting} className='shad-button_primary font-sourceCodePro'>Create Channel</Button>
                            {form.formState.isSubmitting ? <Progress value={33} /> : ''}
                        </form>
                    </Form>
                </div>
            </section>
        </Context.Provider>
    );
}

export default CreateChannel;