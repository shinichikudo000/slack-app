import { Message } from '@/_types/types'
import React from 'react'

const MessageCard = ({messageProp} : {messageProp: Message}) => {
    const timestamp = messageProp.created_at
    const date = new Date(timestamp)
    const hour = date.getHours() === 0 ? 12 : date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
    const ampm = date.getHours() > 12 ? 'pm' : 'am'
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    const time = `${hour}:${minutes} ${ampm}`
  return (
    <div className='flex mb-4 gap-4'>
        <div className='w-12 h-12 rounded-lg bg-slate-400 flex justify-center items-center font-anton text-xl'>
            {messageProp.sender.email[0].toUpperCase()}
        </div>
        <div>
            <p className='font-anton'>{messageProp.sender.email}<span className='ml-4 text-xs'>{time}</span></p>
            <p className='font-oxygen'>{messageProp.body}</p>
        </div>
    </div>
  )
}

export default MessageCard