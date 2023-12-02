import React, { createContext, useEffect, useMemo, useReducer, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API } from '@/_api/api'
import { ChannelMember, MessageQueryParams } from '@/_types/types'
import { User } from '../SideBar'
import { Action, Context, initialState } from './CreateChannel'
import { useDebounce } from '@/_hooks/hooks'
import { additionalMembersFunc, filterUsers } from '@/react_query/utils'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import IsLoading from './IsLoading'
import UserCardCreateChannel from './UserCardCreateChannel'
import { Progress } from '@radix-ui/react-progress'
import { useNavigate } from 'react-router-dom'


const ChannelInfo = ({paramsProp}: {paramsProp: MessageQueryParams}) => {
    const queryClient = useQueryClient()
    const allUsers = queryClient.getQueryData(['allUsers'])
    const [users, setUsers] = useState<User[]>([])
    const [search, setSearch] = useState<string>('')
    const debouncedSearch = useDebounce(search, 500)
    const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false)

    const {data:channelInfo, isLoading} = useQuery({
        queryKey:[`${paramsProp.class}_${paramsProp.id}_info`],
        queryFn: async() => {
            try {
                const res = await API.get(`/channels/${paramsProp.id}`)
                console.log(res.data.data)
                return res.data.data
            } catch(error) {
                console.log(error)
            }
            return []
        }
    })

    const currentMembers = useMemo(() => {
        if (!channelInfo || !channelInfo.channel_members) {
            return [];
        }
    
        return channelInfo.channel_members.map((channelMember: ChannelMember) => {
            const user = (allUsers as User[])?.find((user: User) => user.id === channelMember.user_id);
            const userEmail = user ? user.email : 'Unknown';
            return { email: userEmail, id: channelMember.user_id };
        });
    }, [channelInfo, allUsers]);

    function reducer(additionalMembers: User[], action: Action, currentMembers: User[]): User[] {
        const {type} = action
        switch(type) {
            case 'addMember': {
                const isMemberExists = additionalMembers.some((member) => member.id === action.user.id)
                const isCurrentMember = currentMembers.some((member) => member.id === action.user.id)
                if (!isMemberExists && !isCurrentMember) {
                    return [...additionalMembers, action.user];
                }
    
                return additionalMembers;
            }
            case 'removeMember': {
                return additionalMembers.filter((member) => member.id !== action.user.id);
            }
            default:
                return additionalMembers;
        }
    }

    const [additionalMembers, dispatch] = useReducer(
        (state, action) => reducer(state, action, currentMembers),
        initialState
      )

    if (isLoading || !channelInfo) {
        return <div>Loading...</div>;
      }

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
    const currentMembersDisplay =  currentMembers?.map((member: {id: number, email: string}) => {
        return <span key={member.id} className='font-oxygen bg-slate-300 rounded-full text-center'>{member.email}</span>
    })
    
      useEffect(() => {
        loadUsers();
      }, [debouncedSearch]);
    

    const form = useForm()
    const navigate = useNavigate()

    const { mutateAsync: additionalMembersMutation } = useMutation({
        mutationFn: additionalMembersFunc,
        onSuccess: () => {
            queryClient.invalidateQueries([`${paramsProp.class}_${paramsProp.id}_info`])
        }
    })

    const onSubmit = async (data: any) => {
        const memberArray = additionalMembers.map((member) => member.id);
        try {
            console.log(memberArray)
            await additionalMembersMutation({ channelId: channelInfo.id, memberArray })
            navigate(`/Channel/${paramsProp.id}`)
        } catch (error) {
            console.error(error);
        }
    };

    const handleClick = () => {
        setSearch('')
    }
    
    const additionalMembersDisplay =  additionalMembers?.map((member) => {
        return <div key={member.id} className='bg-slate-200 rounded-full max-w-full p-[1rem] relative'>
            <span>{member.email}</span>
            <button className='w-[2rem] h-[2rem] rounded-full bg-slate-700 ] absolute right-[1rem] top-[1rem]' onClick={() => {dispatch({type: 'removeMember', user: member}), console.log(additionalMembers)}}>-</button>
        </div>
    })
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline">Channel Info</Button>
        </DialogTrigger>
        {isLoading ? (
            <div>Loading...</div>
        ) : (
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{channelInfo.name}</DialogTitle>
                <DialogDescription>Channel Member/s:</DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-4'>
                { currentMembersDisplay }
            </div>
            <Context.Provider value={{dispatch}}>
            <section className='w-full h-full flex flex-col justify-center items-center'>
                <div className='w-[350px] h-full flex flex-col justify-center'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4 text-left">
                            <FormField
                                control={form.control}
                                name="userSearch"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-oxygen'>Add Member</FormLabel>
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
                        { additionalMembersDisplay }
                            <div className='overflow-y-auto overflow-x-hidden max-h-[300px] flex flex-col'>
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
                            <Button type="submit" disabled={form.formState.isSubmitting} className='shad-button_primary font-sourceCodePro'>Add member/s</Button>
                            {form.formState.isSubmitting ? <Progress value={33} /> : ''}
                        </form>
                    </Form>
                </div>
            </section>
        </Context.Provider>
            </DialogContent>
        )}
    </Dialog>
  )
}

export default ChannelInfo