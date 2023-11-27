import { Input } from '@/components/ui/input'
import '../App.css'
import { fetchMessage, messageQuery} from '@/react_query/utils'
import { useInfiniteQuery, useQuery} from '@tanstack/react-query'
import React, { useState } from 'react'
import { redirect, useNavigate, useParams } from 'react-router-dom'
import { API } from '@/_api/api'


const MessageContainer = () => {
    const params = useParams<{ id?: string; class?: string }>()
    const {data: message } = useQuery(messageQuery({
        id: params.id || '',
        class: params.class || '',
        
    })) 
    const [sendMessage, setSendMessage] = useState<string>('')

    const navigate = useNavigate()

    const handleMessageSubmit = async(e: any) => {
        e.preventDefault()
        if(sendMessage !== '') {
            try {
                const res = await API.post('/messages', {
                    receiver_id: params.id,
                    receiver_class: params.class,
                    body: sendMessage
                })
                if (res.status === 200) {
                    setSendMessage('')
                    navigate(`/${params.class}/${params.id}`)
                }
            } catch(error: any) {
                console.log(error)
            }
        }
    }

  return (
    <>
       <section className='relative flex flex-col p-8 justify-center items-center w-full h-full '>
        {
            !message || message.length === 0 ? (
                <div>No existing conversation</div>
            ) : (
                message.map((messages: any) => {
                    return <div>{messages.body}</div>
                })
                )
            }
        <div className='w-full absolute bottom-0 p-8'>
            <form onSubmit={handleMessageSubmit} className='relative'>
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
    </>
  )
}

export default MessageContainer