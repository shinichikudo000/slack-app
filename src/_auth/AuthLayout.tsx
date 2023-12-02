import React from 'react';
import { Outlet, Navigate, useLoaderData } from 'react-router-dom';
import { User } from '@/_hooks/context';
import { Toaster } from '@/components/ui/toaster';

const AuthLayout = () => {
  const { "access-token": accessToken, uid, expiry, client } = useLoaderData() as User;
    
  return (
    <>
     {
        accessToken && uid && expiry && client ? (
            <Navigate to="/" />
          ) : (
            <section className='w-full h-full flex justify-center items-center'>
                <div className='flex justify-center items-center flex-col py-10 h-full w-[400px]'>
                        <Outlet />
                </div>
                <Toaster />
            </section>
          )
     }
    </>
  );
};

export default AuthLayout;