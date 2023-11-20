import React from 'react'
import { API } from '../../_api/api'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import  { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(10, 'Password must be atleast 10 characters'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: 'Password must match.', 
    path: ['confirmPassword']
})

type SignUpSchema = z.infer<typeof signUpSchema>

const SignUpForm = () => {
    const form = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: ''
        }
    })

    const onSubmit = async (data: SignUpSchema) => {
        try {
            const res = await API.post('/auth', {
                email: data.email,
                password: data.password,
                password_confirmation: data.confirmPassword
            })
            API.defaults.headers['uid'] = res.headers['uid']
            API.defaults.headers['access-token'] = res.headers['access-token']
            API.defaults.headers['client'] = res.headers['client']
            API.defaults.headers['expiry'] = res.headers['expiry']

            localStorage.setItem('uid' , res.headers['uid'])
            localStorage.setItem('access-token' , res.headers['access-token'])
            localStorage.setItem('client' , res.headers['client'])
            localStorage.setItem('expiry' , res.headers['expiry'])

        } catch (error) {

        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Button type="submit" disabled={form.formState.isSubmitting}>Submit</Button>
                {
                    form.formState.isSubmitting ? 'Creating New Account...' : ''
                }
            </form>
        </Form>
    )
}

export default SignUpForm
