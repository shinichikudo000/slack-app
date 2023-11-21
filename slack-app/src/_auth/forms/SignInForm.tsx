import React from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { TSignInSchema, signInSchema } from '../validation/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Link, useNavigate, Navigate, useLoaderData } from 'react-router-dom'
import { API } from '@/_api/api'
// import { UserContext } from '../AuthLayout'
import { Progress } from '@/components/ui/progress'
import { User } from '@/_hooks/context'
// import { User, CurrentUserAction } from '@/_hooks/context'

const SignInForm = () => {
    // const dispatch = useContext(UserContext) as { user: User; dispatch: Dispatch<CurrentUserAction> } | null
    // const { user, dispatch } = useContext(UserContext)!

    const { "access-token": accessToken, uid, expiry, client } = useLoaderData() as User;

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
                const headers = res.headers || {}

                API.defaults.headers['uid'] = headers['uid'];
                API.defaults.headers['access-token'] = headers['access-token'];
                API.defaults.headers['client'] = headers['client'];
                API.defaults.headers['expiry'] = headers['expiry'];
        
                localStorage.setItem('uid', headers['uid']);
                localStorage.setItem('access-token', headers['access-token']);
                localStorage.setItem('client', headers['client']);
                localStorage.setItem('expiry', headers['expiry']);

                // dispatch({
                //     type: 'currentUser',
                //     accessToken: res.headers['access-token'],
                //     uid: res.headers['uid'],
                //     expiry: res.headers['expiry'],
                //     client: res.headers['client'],
                // })
                
                navigate('/')
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
            accessToken && uid && expiry && client ? (
                <Navigate to='/' />
            ) : (
                <>
                    <Form {...form}>   
                        <div>
                            <h2>Sign In</h2>
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
                                    form.formState.isSubmitting ? <Progress value={33} /> : ''
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