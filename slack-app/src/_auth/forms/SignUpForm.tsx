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
import { Progress } from '@/components/ui/progress'
import { toast } from '@/components/ui/use-toast'


const SignUpForm = () => {
    const { "access-token": accessToken, uid, expiry, client } = useLoaderData() as User

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
                const headers = res.headers || {}

                API.defaults.headers['uid'] = headers['uid'];
                API.defaults.headers['access-token'] = headers['access-token'];
                API.defaults.headers['client'] = headers['client'];
                API.defaults.headers['expiry'] = headers['expiry'];
        
                localStorage.setItem('uid', headers['uid']);
                localStorage.setItem('access-token', headers['access-token']);
                localStorage.setItem('client', headers['client']);
                localStorage.setItem('expiry', headers['expiry']);
        
                navigate('/sign-in');
              }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errors  = error.response.data.errors.full_messages;

                form.setError('email', {
                    type: 'manual',
                    message: errors[0], 
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
                        <img src='/antisocial.png' alt='AntiSocial' className='w-[150px]'/>
                        <div>
                            <h2 className='font-sourceCodePro text-2xl'>Create New Account</h2>
                            <p className='font-sourceCodePro text-lg'>To use AntiSocial enter your details</p>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4 text-left">
                                <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className='font-oxygen'>Email</FormLabel>
                                    <FormControl>
                                        <Input type='email' placeholder="Email" {...field}  className='font-oxygen'/>
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
                                    <FormLabel className='font-oxygen'>Password</FormLabel>
                                    <FormControl>
                                        <Input type='password' placeholder="Password" {...field}  className='font-oxygen'/>
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
                                    <FormLabel className='font-oxygen'>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type='password' placeholder="Confirm Password" {...field} className='font-oxygen'/>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={form.formState.isSubmitting} className='shad-button_primary font-sourceCodePro'>Submit</Button>
                                {
                                    form.formState.isSubmitting ? <Progress value={33} /> : ''
                                }

                                <p className='font-oxygen text-center'>
                                    Already have an account? <Link to='/sign-in'>Log in</Link>
                                </p>
                            </form>
                        </div>
                    </Form>
                )
            }
            {
                form.formState.isSubmitSuccessful && toast({
                    title: 'Account Creation Successful',
                    description: 'Your new account has been successfully created.'
                    })
            }
        </>
    )
}

export default SignUpForm
