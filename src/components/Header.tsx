'use client'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FaMoon, FaSun } from "react-icons/fa"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

const Header = () => {
    const pathname = usePathname();
    const { setTheme } = useTheme();
    const [pt, SetPt] = useState<string>("");
    const [signed, SetSigned] = useState<boolean>(true);

    useEffect(() => {
        switch (pathname) {
            case "/":
                SetPt("Ana Sayfa");
                break;
            default:
                SetPt("");
                break;
        }
    }, [])

    return (
        <div className='relative w-full h-full flex items-center justify-between p-2 gap-2'>
            <div className='h-full w-fit flex items-center justify-center gap-2'>
                <p className='text-2xl text-[#ddd5f5] font-bold font-serif'>ECHO</p>
            </div>
            <div className='absolute right-1/2 translate-x-1/2'>
                <p className='hidden md:flex text-[#ddd5f5] font-semibold text-md'>{pt}</p>
            </div>
            <div className='h-full w-fit flex items-center justify-center gap-2'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className='hidden w-10 h-10 cursor-pointer rounded-lg hover:bg-background-5 md:flex items-center justify-center outline-none transition-all'>
                            <FaSun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-[#ddd5f5]" />
                            <FaMoon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-[#ddd5f5]" />
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
                    signed ? (
                        <Popover>
                            <PopoverTrigger className='hover:bg-background-5 transition-all cursor-pointer px-4 rounded-lg h-10 gap-2 text-[#ddd5f5] font-semibold flex items-center'>Kullanıcı adı <div className='w-7 h-7 bg-[#ddd5f5] rounded-full'></div></PopoverTrigger>
                            <PopoverContent className='flex flex-col'><button className='hover:bg-background cursor-pointer p-2 flex items-start font-semibold rounded-lg transition-all'>Çıkış yap</button></PopoverContent>
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