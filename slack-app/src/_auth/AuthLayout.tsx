import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const AuthLayout = () => {
  const isAuthenticated: boolean = false;

  return (
    <>
     {
        isAuthenticated ? (
            <Navigate to="/" />
          ) : (
            <>
                <section>
                    <Outlet />
                </section>
                <section>

                </section>
            </>
          )
     }
    </>
  );
};

export default AuthLayout;