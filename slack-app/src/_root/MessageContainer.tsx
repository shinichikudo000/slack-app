import { messageQuery } from '@/react_query/utils'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'

const MessageContainer = () => {
    const params = useParams<{ id?: string; class?: string }>()
    const {data: message } = useQuery(messageQuery({
        id: params.id || '',
        class: params.class || ''
    }))

  return (
    <div>{message}</div>
  )
}

export default MessageContainer