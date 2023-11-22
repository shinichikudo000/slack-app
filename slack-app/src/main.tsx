import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import SignInForm from './_auth/forms/SignInForm.tsx'
import AuthLayout from './_auth/AuthLayout.tsx'
import SignUpForm from './_auth/forms/SignUpForm.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { currentUserLoader } from './_route/loader.ts'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: currentUserLoader
  },
  { 
    element: <AuthLayout />,
    loader: currentUserLoader,
    children: [
      {
        path: '/sign-in',
        element: <SignInForm />,
        loader: currentUserLoader
      },
      {
        path: '/sign-up',
        element: <SignUpForm />,
        loader: currentUserLoader
      }
    ]
  }
])

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient} >
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
