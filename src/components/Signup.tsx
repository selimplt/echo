'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
    name: z.string().min(2).max(36),
    user_name: z.string().min(2).max(36),
    password: z.string().min(6).max(100),
    passwordAgain: z.string().min(6).max(100),
}).refine(data => data.password === data.passwordAgain, {
    message: "Şifreler eşleşmiyor",
    path: ["passwordAgain"],
})

const Signup = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: z.infer<typeof schema>) => {

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full bg-card p-4 md:p-8 rounded-lg shadow-lg border border-border flex flex-col gap-4'>
            <h2 className='text-xl'>Kayıt ol</h2>
            <p>Lütfen kullanıcı adı adresinizi ve şifrenizi girin.</p>
            <div className='w-full h-fit flex flex-col gap-2'>
                <label htmlFor="name" className='text-sm font-medium'>Ad</label>
                <input type="text" id='name' {...register('name')} className='w-full p-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent' placeholder='Adınızı girin' />
                {errors.name && <p className='text-red-500 text-sm'>{errors.name.message ? "Geçersiz ad" : ""}</p>}
            </div>
            <div className='w-full h-fit flex flex-col gap-2'>
                <label htmlFor="user_name" className='text-sm font-medium'>Kullanıcı adı</label>
                <input type="text" id='user_name' {...register('user_name')} className='w-full p-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent' placeholder='Kullanıcı adınızı girin' />
                {errors.user_name && <p className='text-red-500 text-sm'>{errors.user_name.message ? "Geçersiz Kullanıcı adı" : ""}</p>}
            </div>
            <div className='w-full h-fit flex flex-col gap-2'>
                <label htmlFor="password" className='text-sm font-medium'>Şifre</label>
                <input type="password" id='password' {...register('password')} className='w-full p-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent' placeholder='Şifrenizi girin' />
                {errors.password && <p className='text-red-500 text-sm'>{errors.password.message ? "Geçersiz şifre" : ""}</p>}
            </div>
            <div className='w-full h-fit flex flex-col gap-2'>
                <label htmlFor="passwordAgain" className='text-sm font-medium'>Şifre (Tekrar)</label>
                <input type="password" id='passwordAgain' {...register('passwordAgain')} className='w-full p-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent' placeholder='Şifrenizi girin' />
                {errors.passwordAgain && <p className='text-red-500 text-sm'>{errors.passwordAgain.message ? "Şifreler eşleşmiyor" : ""}</p>}
            </div>
            {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
            {successMessage && <p className='text-green-500 text-sm'>{successMessage}</p>}
            <Button type='submit' className='w-full mt-4 bg-background hover:bg-background text-foreground text-lg cursor-pointer'>Kayıt ol</Button>
        </form>
    )
}

export default Signup