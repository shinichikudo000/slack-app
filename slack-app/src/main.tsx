import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import SignInForm from './_auth/forms/SignInForm.tsx'
import AuthLayout from './_auth/AuthLayout.tsx'
import SignUpForm from './_auth/forms/SignUpForm.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { currentUserLoader, messageLoader } from './_route/loader.ts'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import MessageContainer from './_root/MessageContainer.tsx'
import NoChatSelected from './_root/NoChatSelected.tsx'
import Practice from './_root/Practice.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import { messageAction } from './_route/action.ts'
import CreateChannel from './_root/components/CreateChannel.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: currentUserLoader,
    children: [
      {
        element: <NoChatSelected />,
        index: true
      },
      { 
        path: '/:class/:id',
        element: <MessageContainer />,
      },
      {
        path: '/create_channel',
        element: <CreateChannel />
      }
    ]
  },
  {
    path: '/practice',
    element: <Practice />
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient} >
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
)
