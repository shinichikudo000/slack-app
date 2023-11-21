import React from 'react'
import './App.css'
import SignOut from './_root/SignOut'
import { Toaster } from './components/ui/toaster'
// import { useLoaderData } from 'react-router-dom'


function App() {
  // const currentUser = useLoaderData()
  
  return (
    <section>
      <SignOut />
      <Toaster />
    </section>
  )
}

export default App
