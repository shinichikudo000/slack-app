import React, { useContext } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { TSignInSchema, signInSchema } from '../validation/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { API } from '@/_api/api'
import { UserContext } from '@/_hooks/context'

const SignInForm = () => {
    const { user , setUser } = useContext(UserContext)


    const form = useForm<TSignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const navigate = useNavigate()

    const onSubmit = async (data: TSignInSchema) => {
        try {
            const res = await API.post('/auth/sign_in', {
                email: data.email,
                password: data.password
            })
            if (res.status === 200) {
                API.defaults.headers['uid'] = res.headers['uid'];
                API.defaults.headers['access-token'] = res.headers['access-token'];
                API.defaults.headers['client'] = res.headers['client'];
                API.defaults.headers['expiry'] = res.headers['expiry'];
        
                localStorage.setItem('uid', res.headers['uid']);
                localStorage.setItem('access-token', res.headers['access-token']);
                localStorage.setItem('client', res.headers['client']);
                localStorage.setItem('expiry', res.headers['expiry']);
                
                contextValue?.setUserAuthenticated()

                console.log('User after authentication:', contextValue?.user);
                console.log('IsAuthenticated:', isAuthenticated)
                console.log(res)
                console.log(isAuthenticated)

                navigate('/home')

            }
        } catch (error: any) {
            console.log(error.response);

            if (error.response && error.response.data && error.response.data.errors) {
                const { errors } = error.response.data;

                Object.keys(errors).forEach((field: any) => {
                    form.setError(field, {
                    type: 'manual',
                    message: errors[field], 
                    });
                });
            } else {
                alert('An error occurred. Please try again.');
            }
        }
    }
  return (
    <>
        {
            isAuthenticated? (
                <Navigate to='/home' />
            ) : (
                <>
                    <Form {...form}>   
                        <div>
                            <h2>Log in</h2>
                            <p>To use ... enter your details</p>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4 text-left">
                                <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type='email' placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type='password' placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={form.formState.isSubmitting} className='shad-button_primary'>Sign in</Button>
                                {
                                    form.formState.isSubmitting ? 'Loading' : ''
                                }

                                <p>
                                    Doesn't have an account? <Link to='/sign-up'>Sign up</Link>
                                </p>
                            </form>
                        </div>
                    </Form>
                </>
            )
        }
    </>
  )
}

export default SignInForm