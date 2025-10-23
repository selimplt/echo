'use client'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FaMoon, FaSun, FaUser } from "react-icons/fa"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import usePageStore from '@/store/pagestore'
import useAuthStore from '@/store/userstor'

const Header = () => {
    const pathname = usePathname();
    const { setTheme } = useTheme();
    const [signed, SetSigned] = useState<boolean>(true);
    const router = useRouter();
    const { user, fetchUser, logout, isLoading, error } = useAuthStore();
    const pagename = usePageStore((state) => state.pagename);

    const handleSignOut = async () => {
        try {
            await axios.post("/api/auth/signout");
            alert("Çıkış yapıldı!");
            window.location.reload();
        } catch {
            alert("Çıkış yapılamadı!");
        }
    };

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <div className='relative w-full h-full flex items-center justify-between p-2 gap-2'>
            <div className='h-full w-fit flex items-center justify-center gap-2'>
                <p className='text-2xl text-[#d6d5f0] font-bold font-serif'>ECHO</p>
            </div>
            <div className='absolute right-1/2 translate-x-1/2'>
                <p className='hidden md:flex text-[#d6d5f0] font-semibold text-md'>{pagename! || ""}</p>
            </div>
            <div className='h-full w-fit flex items-center justify-center gap-2'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className='hidden w-10 h-10 cursor-pointer rounded-lg hover:bg-background-5 md:flex items-center justify-center outline-none transition-all'>
                            <FaSun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-[#d6d5f0]" />
                            <FaMoon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-[#d6d5f0]" />
                            <span className="sr-only">Toggle theme</span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {
                    user ? (
                        <Popover>
                            <PopoverTrigger className='hover:bg-background-5 transition-all cursor-pointer px-4 rounded-lg h-10 gap-2 text-[#d6d5f0] font-semibold flex items-center'>
                                {user.seen_name}
                                <div className='w-7 h-7 bg-[#d6d5f0] rounded-full flex items-center justify-center'>
                                    {
                                        user.profile_img ? (
                                            <img src={user.profile_img} alt="profil fotosu" className='rounded-full' />
                                        ) : (
                                            <FaUser className='text-[#262330]' />
                                        )
                                    }
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className='flex flex-col'>
                                <button onClick={handleSignOut} className='hover:bg-background cursor-pointer p-2 flex items-start font-semibold rounded-lg transition-all'>Çıkış yap</button>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <div></div>
                    )
                }
            </div>
        </div>
    )
}

export default Header