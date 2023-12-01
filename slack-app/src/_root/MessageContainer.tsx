import { Input } from '@/components/ui/input'
import '../App.css'
import { addMessage, messageQuery} from '@/react_query/utils'
import { useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import React, { useState } from 'react'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { Channels, User } from './SideBar'
import MessageCard from './MessageCard'
import { Message } from '@/_types/types'
import { toast } from '@/components/ui/use-toast'
import ChannelInfo from './components/ChannelInfo'


const MessageContainer = ({ queryClient }: { queryClient: any }) => {
    const initialData = useLoaderData()
    const newQueryClient = useQueryClient()

    const params = useParams<{ id?: string; class?: string }>()
    const id: string = params.id || ''

    const { data: message } = useQuery({
        ...messageQuery({
            id: params.id || '',
            class: params.class || '',
        }),
        initialData
    }) 

    const { mutateAsync: addMessageMutation } = useMutation({
        mutationFn: addMessage,
        onSuccess: () => {
            newQueryClient.invalidateQueries([`${params.class}_${params.id}`])
        }
    })
    
    const [sendMessage, setSendMessage] = useState<string>('')

    const allUsers = queryClient.getQueryData(['allUsers'])
    const allChannels = queryClient.getQueryData(['allChannels'])

    let data!: Channels | User

    if (params.class === 'User' && params.id) {
        const user = allUsers?.find((user) => user.id === parseInt(id, 10));
        if (user) {
            data = user;
        }
    } else {
        const channel = allChannels?.find((channel) => channel.id === parseInt(id, 10));
        if (channel) {
            data = channel;
        }
    }

    const navigate = useNavigate()

    const handleMessageSubmit = async(e: any) => {
        e.preventDefault()
        if(sendMessage !== '') {
            try {
                await addMessageMutation({ id: params.id, class: params.class, message: sendMessage })
                setSendMessage('')
                toast({
                    title: 'You sent a message',
                    description: ''
                })
                navigate(`/${params.class}/${params.id}`)
            } catch(error: any) {
                console.log(error)
            }
        }
    }

  return (
    <section className='flex flex-col w-full h-full'>
        <section className='p-4 font-anton text-2xl bg-slate-300 h-[10%] flex items-center'>
            { 
                params.class === 'User' && data && 'email' in data ? (
                    <div>{(data as User).email}</div>
                ) : (
                    data && <div className=''>
                            <h1>
                                {(data as Channels).name}
                            </h1>
                            <ChannelInfo paramsProp={params}/>
                        </div>
                )
            }
        </section>
       <section className='relative flex flex-col p-8 items-center w-full h-[90%] '>
        <div className='h-[90%] overflow-y-auto w-full'>
        {
            !message || message.length === 0 ? (
                <div className='w-full h-full flex justify-center items-center font-sourceCodePro text-2xl'>No existing conversation</div>
            ) : (
                message.map((messages: Message) => {
                    return <MessageCard messageProp={messages}/>
                })
                )
            }
        </div>
        <div className='w-full absolute bottom-0 p-8'>
            <form method='post' onSubmit={handleMessageSubmit} className='relative'>
                <Input placeholder='Type your message here' value={sendMessage} onChange={(e) => {
                    setSendMessage(e.target.value)
                }} />
                {
                    message !== '' && 
                    <span className='material-symbols-outlined absolute right-4 bottom-2'>
                        send
                    </span>
                }
            </form>
        </div>
       </section>
    </section>
  )
}

export default MessageContainer