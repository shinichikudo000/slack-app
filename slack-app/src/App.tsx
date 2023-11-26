import React from 'react'
import './App.css'
import { Toaster } from './components/ui/toaster'
import { Navigate, Outlet, useLoaderData } from 'react-router-dom'
import { User } from './_hooks/context'
import SideBar from './_root/SideBar'


function App() {
  const { "access-token": accessToken, uid, expiry, client } = useLoaderData() as User
  
  return (
    <>
    { 
      !accessToken && !uid && !expiry && !client ? (
        <Navigate to='/sign-in' />
      ) : (
        <>
          <section className='absolute top-0 left-0 w-full min-w-[1000px] flex h-full'>
            <SideBar />
            <Outlet />
          </section>
          <Toaster />
        </>
       )
    }
    </>
  )
}

export default App
