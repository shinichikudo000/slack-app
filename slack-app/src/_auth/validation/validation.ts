import { z } from 'zod'

export const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(10, 'Password must be atleast 10 characters'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: 'Password must match.', 
    path: ['confirmPassword']
})

export type TSignUpSchema = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export type TSignInSchema = z.infer<typeof signInSchema>