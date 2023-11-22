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
          <SideBar />
          <Outlet />
          <Toaster />
        </>
       )
    }
    </>
  )
}

export default App
