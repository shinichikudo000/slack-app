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
            <>
                <section className='flex flex-1 justify-center items-center flex-col py-10'>
                    {/* <UserContext.Provider value={{user, dispatch}}> */}
                        <Outlet />
                    {/* </UserContext.Provider> */}
                </section>
                <section className=''>

                </section>
                <Toaster />
            </>
          )
     }
    </>
  );
};

export default AuthLayout;