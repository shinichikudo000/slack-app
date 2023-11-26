import React, { useEffect, useState } from 'react'
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

const CreateChannel = () => {
    const queryClient = useQueryClient()
    const allUsers = queryClient.getQueriesData(['allUsers'])[0][1]
    const [users, setUsers] = useState<User[]>([])
    const [search, setSearch] = useState<string>('')
    const debouncedSearch = useDebounce(search, 500)
    const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false)

    const [members, setMembers] = useState<User[]>([])
    
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
        loadUsers();
    }, [debouncedSearch]);

    const form = useForm()

    const onSubmit = async (data) => {
        // Implement logic for handling form submission
        console.log(data);
    };
    const handleClick = () => {
        setSearch('')
        const userExistsInMembers = members.some((member) => member.id === user.id);

        if (!userExistsInMembers) {
        // Add the user to the members state
        setMembers([...members, user]);
        }
        console.log(members)
    }

    return (
        <section className='w-[500px] h-full'>
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
                        return <div>{member.email}</div>
                    })
                   }
                    <div className='overflow-y-auto overflow-x-hidden h-[450px]'>
                    { 
                        search === '' ? (
                            <div></div>
                        ) : (
                            users.length > 0 ? (
                                users?.map((user) => {
                                    return <UserCardCreateChannel userProp={user} onClick={handleClick} members={members}/>
                                })
                            ) : (
                                <div className='font-oxygen'>No user found.</div>
                            )
                        )
                    }
                    </div>
                    <Button type="submit" disabled={form.formState.isSubmitting} className='shad-button_primary font-sourceCodePro'>Sign in</Button>
                    {form.formState.isSubmitting ? <Progress value={33} /> : ''}
                </form>
            </Form>
        </section>
    );
}

export default CreateChannel;