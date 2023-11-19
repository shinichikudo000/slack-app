import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import SignInForm from './_auth/forms/SignInForm.tsx'
import AuthLayout from './_auth/AuthLayout.tsx'
import SignUpForm from './_auth/forms/SignUpForm.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/sign-in',
        element: <SignInForm />
      },
      {
        path: '/sign-up',
        element: <SignUpForm />
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
