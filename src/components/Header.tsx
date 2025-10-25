'use client'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FaMoon, FaSun, FaUser, FaCog } from "react-icons/fa"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import usePageStore from '@/store/pagestore'
import useAuthStore from '@/store/userstor'

const Header = () => {
    const pathname = usePathname();
    const { setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { user, fetchUser } = useAuthStore();
    const pagename = usePageStore((state) => state.pagename);

    useEffect(() => {
        setMounted(true);
        fetchUser();
    }, [fetchUser]);

    const handleSignOut = async () => {
        try {
            await axios.post("/api/auth/signout");
            alert("Çıkış yapıldı!");
            window.location.reload();
        } catch {
            alert("Çıkış yapılamadı!");
        }
    };

    if (!mounted) return null;

    return (
        <div className='relative w-full h-full flex items-center justify-between px-4 gap-4'>
            <div className='flex items-center gap-3'>
                <h1 className='text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block'>
                    ECHO
                </h1>
            </div>

            <div className='absolute left-1/2 -translate-x-1/2'>
                <h2 className='hidden md:block text-lg font-semibold text-gray-700 dark:text-gray-300'>
                    {pagename || ""}
                </h2>
            </div>

            <div className='flex items-center gap-2'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className='w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-all outline-none'>
                            <FaSun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-amber-500" />
                            <FaMoon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-blue-400" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className='min-w-32'>
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            <FaSun className="mr-2 h-4 w-4 text-amber-500" /> Açık
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            <FaMoon className="mr-2 h-4 w-4 text-blue-400" /> Karanlık
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            <FaCog className="mr-2 h-4 w-4 text-gray-500" /> Sistem
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {user ? (
                    <Popover>
                        <PopoverTrigger className='flex items-center gap-2 px-3 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all'>
                            <span className='hidden sm:block font-medium text-sm text-gray-700 dark:text-gray-300'>
                                {user.seen_name}
                            </span>
                            <div className='w-8 h-8 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white dark:ring-gray-800 shadow-sm'>
                                {user.profile_img ? (
                                    <img src={user.profile_img} alt="profil" className='w-full h-full object-cover' />
                                ) : (
                                    <FaUser className='text-gray-400 text-xs' />
                                )}
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className='w-56 p-2' align='end'>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <div className='w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse'></div>
                )}
            </div>
        </div>
    );
}

export default Header;
