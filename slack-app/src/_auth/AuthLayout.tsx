import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { UserContext } from '@/_hooks/context';

export interface User {
    accessToken?: string;
    uid?: string;
    expiry?: number;
    client?: string;
}

const AuthLayout = () => {
    const [user, setUser] = useState<User>({});
    
  return (
    <>
     {
        user.accessToken? (
            <Navigate to="/home" />
          ) : (
            <>
                <section className='flex flex-1 justify-center items-center flex-col py-10'>
                    <UserContext.Provider value={{user, setUser}}>
                        <Outlet />
                    </UserContext.Provider>
                </section>
                <section className=''>

                </section>
            </>
          )
     }
    </>
  );
};

export default AuthLayout;