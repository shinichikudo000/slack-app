import React from 'react'
import './App.css'
import SignOut from './_root/SignOut'
import { Toaster } from './components/ui/toaster'
import { Navigate, useLoaderData } from 'react-router-dom'
import { User } from './_hooks/context'
// import { useLoaderData } from 'react-router-dom'


function App() {
  const { "access-token": accessToken, uid, expiry, client } = useLoaderData() as User
  
  return (
    <>
    { 
      !accessToken && !uid && !expiry && !client ? (
        <Navigate to='/sign-in' />
      ) : (
        <section>
          <SignOut />
          <Toaster />
        </section>
       )
    }
    </>
  )
}

export default App
