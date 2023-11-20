import React from 'react'
import { API } from '../../_api/api'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import  { useForm } from 'react-hook-form'

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
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
        } = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema)
    })

    return (
        <form onSubmit={handleSubmit(e => )}>
            <input 
            {...register('email')}
                type='email'
                placeholder='Email'
            />
            {
                errors.email &&  (
                    <p>{`${errors.email.message}`}</p>
                )
            }
            <input 
            {...register('password')}
                type='password'
                placeholder='Password'
            />
            {
                errors.password &&  (
                    <p>{`${errors.password.message}`}</p>
                )
            }
            <input 
            {...register('confirmPassword')}
                type='password'
                placeholder='Confirm Password'
            />
            {
                errors.confirmPassword &&  (
                    <p>{`${errors.confirmPassword.message}`}</p>
                )
            }
            <button
                disabled={isSubmitting}
                type='submit'
            >
                SignUp
            </button>
        </form>
    )
}

export default SignUpForm