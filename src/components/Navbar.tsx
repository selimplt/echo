'use client'
import React, { useState, useEffect } from 'react'
import { FaHome, FaPlus, FaServer } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { IoSettingsSharp } from "react-icons/io5";
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import useAuthStore from '@/store/userstor';
import { NativeSelect, NativeSelectOption } from './ui/native-select';
import { toast } from "sonner"
import axios from 'axios';

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname()
    const { user, fetchUser, logout, isLoading, error } = useAuthStore();
    const [svName, SetSvName] = useState<string>("");
    const [svDescription, SetSvDescription] = useState<string>("Merhaba, sunucuma hoş geldiniz.");
    const [svPublic, SetSvPublic] = useState<string>("true");
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        SetSvName(`${user?.seen_name} sunucusu` || "");
    }, [user])

    const createsv = async () => {
        try {
            const res = await axios.post<any>("/api/servers/createsv", { svName, svDescription, svPublic });
            if (res.data.message == "başarılı") {
                toast("Tebrikler", {
                    description: "sunucu başarıyla oluşturuldu",
                })
                setOpen(false);
            } else {
                toast("bir sorun meydana geldi", {
                    description: "bir hata meydana geldi",
                })
            }
        } catch (error: any) {
            toast("bir sorun meydana geldi", {
                description: `hata : ${error}`,
            })
        }
    }

    return (
        <div className={`${pathname === '/auth' ? `hidden w-0` : `w-14 h-fit flex flex-col items-center px-2 pt-2 gap-2`}`}>
            <Link href={'/'} className={`hover:bg-background-5 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${pathname === '/' ? 'bg-background-5' : ''}`}>
                <FaHome className='text-gray-700 dark:text-gray-300 text-2xl' />
            </Link>
            <Link href={'/servers'} className={`hover:bg-background-5 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${pathname === '/servers' ? 'bg-background-5' : ''}`}>
                <FaServer className='text-gray-700 dark:text-gray-300 text-2xl' />
            </Link>
            <Link href={'/search'} className={`hover:bg-background-5 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${pathname === '/search' ? 'bg-background-5' : ''}`}>
                <TbWorld className='text-gray-700 dark:text-gray-300 text-2xl' />
            </Link>
            <Link href={'/settings'} className={`hover:bg-background-5 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${pathname === '/settings' ? 'bg-background-5' : ''}`}>
                <IoSettingsSharp className='text-gray-700 dark:text-gray-300 text-2xl' />
            </Link>
            <Dialog open={open} onOpenChange={setOpen}>
                <form>
                    <DialogTrigger>
                        <div className={`hover:bg-background-5 w-10 h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer`}>
                            <FaPlus className='text-gray-700 dark:text-gray-300 text-2xl' />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Sunucu oluştur</DialogTitle>
                            <DialogDescription>
                                Kendine ait bir sunucu oluştur ve insanları davet et
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <label htmlFor="sv_name">Sunucu adı</label>
                                <Input id="sv_name" name="sv_name" value={svName} onChange={(e) => SetSvName(e.target.value)} maxLength={20}/>
                            </div>
                            <div className="grid gap-3">
                                <label htmlFor="sv_description">Sunucu açıklaması</label>
                                <Input id="sv_description" name="sv_description" value={svDescription} onChange={(e) => SetSvDescription(e.target.value)} />
                            </div>
                            <div className="grid gap-3">
                                <label htmlFor="sv_description">Herkese açık ayarı</label>
                                <NativeSelect value={svPublic} onChange={(e) => SetSvPublic(e.target.value)}>
                                    <NativeSelectOption value="true">Açık</NativeSelectOption>
                                    <NativeSelectOption value="false">Kapalı</NativeSelectOption>
                                </NativeSelect>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button className='cursor-pointer'>İptal et</Button>
                            </DialogClose>
                            <Button onClick={createsv} className='cursor-pointer'>Oluştur</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </div>
    )
}

export default Navbar