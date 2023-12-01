import React from 'react'
import { User } from '@/_hooks/context' 
import { useLoaderData } from 'react-router-dom'
const Trial = () => {
    const {cachedUsers, currentUser} = useLoaderData()
  return (
    <div>{cachedUsers}</div>
  )
}

export default Trial