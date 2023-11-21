import React from 'react'
import { API } from '../../_api/api'
import { zodResolver } from '@hookform/resolvers/zod'
import  { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { signUpSchema, TSignUpSchema } from '../validation/validation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link, Navigate, useLoaderData, useNavigate } from 'react-router-dom'
import { User } from '@/_hooks/context'

const SignUpForm = () => {
    const { "access-token": accessToken, uid, expiry, client } = useLoaderData() as User;

    const form = useForm<TSignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: ''
        }
    })

    const navigate = useNavigate()

    const onSubmit = async (data: TSignUpSchema) => {
        try {
            const res = await API.post('/auth', {
                email: data.email,
                password: data.password,
                password_confirmation: data.confirmPassword
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
        
                navigate('/sign-in');
              }
        } catch (error: any) {
            console.log(error.response.data.errors)
            if (error.response && error.response.data && error.response.data.errors) {
                const { errors } = error.response.data;
        
                Object.keys(errors).forEach((field: any) => {
                    form.setError(field, {
                      type: 'manual',
                      message: `${field} ${errors[field][0]}`, 
                    })
                  })
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
                    <Form {...form}>
                        <div>
                            <h2>Create New Account</h2>
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
                                <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type='password' placeholder="Confirm Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={form.formState.isSubmitting} className='shad-button_primary'>Submit</Button>
                                {
                                    form.formState.isSubmitting ? 'Creating New Account...' : ''
                                }

                                <p>
                                    Already have an account? <Link to='/sign-in'>Log in</Link>
                                </p>
                            </form>
                        </div>
                    </Form>
                )
            }
        </>
    )
}

export default SignUpForm
