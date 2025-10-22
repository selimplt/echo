'use client'
import React from 'react'
import { FaHome, FaPlus, FaUserFriends, FaServer } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { AiFillMessage } from "react-icons/ai";
import { IoSettingsSharp } from "react-icons/io5";
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname()
    return (
        <div className='w-full h-fit flex flex-col items-center px-2 gap-2'>
            <Link href={'/'} className={`hover:bg-background-5 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${pathname === '/' ? 'bg-background-5' : ''}`}>
                <FaHome className='text-[#d6d5f0] text-2xl' />
            </Link>
            <Link href={'/messages'} className={`hover:bg-background-5 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${pathname === '/messages' ? 'bg-background-5' : ''}`}>
                <AiFillMessage className='text-[#d6d5f0] text-2xl' />
            </Link>
            <Link href={'/servers'} className={`hover:bg-background-5 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${pathname === '/servers' ? 'bg-background-5' : ''}`}>
                <FaServer className='text-[#d6d5f0] text-2xl' />
            </Link>
            <Link href={'/friends'} className={`hover:bg-background-5 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${pathname === '/friends' ? 'bg-background-5' : ''}`}>
                <FaUserFriends className='text-[#d6d5f0] text-2xl' />
            </Link>
            <Link href={'/search'} className={`hover:bg-background-5 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${pathname === '/search' ? 'bg-background-5' : ''}`}>
                <TbWorld className='text-[#d6d5f0] text-2xl' />
            </Link>
            <Link href={'/settings'} className={`hover:bg-background-5 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${pathname === '/settings' ? 'bg-background-5' : ''}`}>
                <IoSettingsSharp className='text-[#d6d5f0] text-2xl' />
            </Link>
            <div className={`hover:bg-background-5 w-10 h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer`}>
                <FaPlus className='text-[#d6d5f0] text-2xl' />
            </div>
        </div>
    )
}

export default Navbar