import React from 'react';
import { Outlet, Navigate, useLoaderData } from 'react-router-dom';
import { User } from '@/_hooks/context';
import { Toaster } from '@/components/ui/toaster';

// export const UserContext = createContext<{ user: User; dispatch: Dispatch<CurrentUserAction> } | null>(null)

const AuthLayout = () => {
  const { "access-token": accessToken, uid, expiry, client } = useLoaderData() as User;
    // const [user, dispatch] = useReducer(reducer, {
    //   accessToken: null,
    //   uid: null,
    //   expiry: null,
    //   client: null,
    // });
    
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