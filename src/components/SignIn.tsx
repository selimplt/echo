'use client'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const schema = z.object({
    user_name: z.string().min(2).max(36),
    password: z.string().min(6).max(100),
})

const SignIn = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(schema),
    })

    const push = async () => {
        try {
            const res = await axios.get<any>('/api/auth/control');
            if (res.data.valid == true){
                router.push("/");
            }
        } catch {
            setErrorMessage("hata")
        }
    }

    const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
            const res = await axios.post('/api/auth/signin', data);
            const { message, error }: any = res.data;
            if (message) {
                setSuccessMessage(message || "giriş başarılı");
                setErrorMessage(null);
                push();
            }
            if (error) {
                setErrorMessage(error || "giriş başarılı");
                setSuccessMessage(null);
            }
        } catch (error: any) {
            setErrorMessage("hata :");
            setSuccessMessage(null);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full bg-card p-4 md:p-8 rounded-lg shadow-lg border border-border flex flex-col gap-4'>
            <h2 className='text-xl'>Giriş yap</h2>
            <p>Lütfen kullanıcı adı adresinizi ve şifrenizi girin.</p>
            <div className='w-full h-fit flex flex-col gap-2'>
                <label htmlFor="user_name" className='text-sm font-medium'>Kullanıcı adı</label>
                <input type="text" id='user_name' {...register('user_name')} className='w-full p-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent' placeholder='Kullanıcı adınızı girin' />
                {errors.user_name && <p className='text-red-500 text-sm'>{errors.user_name.message ? "E-posta adresi geçersiz" : ""}</p>}
            </div>
            <div className='w-full h-fit flex flex-col gap-2'>
                <label htmlFor="password" className='text-sm font-medium'>Şifre</label>
                <input type="password" id='password' {...register('password')} className='w-full p-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent' placeholder='Şifrenizi girin' />
                {errors.password && <p className='text-red-500 text-sm'>{errors.password.message ? "Şifre geçersiz" : ""}</p>}
            </div>
            {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
            {successMessage && <p className='text-green-500 text-sm'>{successMessage}</p>}
            <Button type='submit' className='w-full mt-4 bg-background hover:bg-background text-foreground text-lg cursor-pointer'>Giriş yap</Button>
        </form>
    )
}

export default SignIn