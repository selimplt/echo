'use client'
import React, { useEffect, useState } from 'react'
import { FaUser, FaPlus, FaMinus } from 'react-icons/fa'
import axios from 'axios'

const Mainpagenav = () => {
    const [loading, SetLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [followers, setFollowers] = useState<any[]>([]);

    useEffect(() => {
        const getfriends = async () => {
            try {
                const res = await axios.get<any>("/api/friends/getfriends")
                setFollowers(res.data.followers || []);
            } catch (error: any) {
                setErrorMessage(error);
            }
        }
        getfriends();
    }, [])

    const accept = async (id: string) => {
        console.log(id)
    }

    const reject = async (id: string) => {
        try {
            const res = await axios.post<any>("/api/friends/reject", { id })
            if (res.data.message == "başarılı") {
                window.location.reload();
            }
        }
        catch (error: any) {
            console.log(error);
        }
    }

    return (
        <div className='w-72 h-fit flex flex-col gap-2'>
            <div className='w-full h-10 bg-background rounded-t-lg flex items-center justify-center'>
                <p className='font-semibold'>Bildirimler</p>
            </div>
            <section className='w-full h-fit p-2 gap-2 flex flex-col'>
                <p className='font-semibold ml-2'>Son Mesajlar</p>
                <div className='flex flex-col gap-2'>
                    <div className='bg-background rounded-lg p-2 flex-col gap-2'>
                        <div className='w-full h-fit flex gap-2'>
                            <div className='w-7 h-7 bg-foreground rounded-full flex items-center justify-center'>
                                <FaUser className='text-background' />
                            </div>
                            <p className='font-semibold truncate flex-1'>Arkadaş 1</p>
                        </div>
                        <p className='truncate mt-2 text-neutral-400'>asdfdsgd ada sdas dasdasd asda sda sfgh</p>
                    </div>
                    <div className='bg-background rounded-lg p-2 flex-col gap-2'>
                        <div className='w-full h-fit flex gap-2'>
                            <div className='w-7 h-7 bg-foreground rounded-full flex items-center justify-center'>
                                <FaUser className='text-background' />
                            </div>
                            <p className='font-semibold truncate flex-1'>Arkadaş 2 aaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                        </div>
                        <p className='truncate mt-2 text-neutral-400'>asdfdsgd ada sdas dasdasd asda sda sfgh</p>
                    </div>
                </div>
            </section>
            <section className='w-full h-fit p-2 gap-2 flex flex-col'>
                <p className='font-semibold ml-2'>Arkadaşlık istekleri</p>
                <div className='flex flex-col gap-2'>
                    {
                        followers.map((f) => (
                            f.status == 'pending' ? (
                                <div key={f.id} className='bg-background rounded-lg p-2 flex gap-2'>
                                    <div className='w-7 h-7 bg-foreground rounded-full flex items-center justify-center'>
                                        {
                                            f.users.profile_img ? (
                                                <img src={f.users.profile_img} alt="profil fotosu" className='rounded-full' />
                                            ) : (
                                                <FaUser className='text-background' />
                                            )
                                        }
                                    </div>
                                    <p className='font-semibold truncate flex-1'>{f.users.user_name}</p>
                                    <button onClick={() => accept(f.users.id)} className='w-5 h-5 border-green-600 opacity-50 border rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-all'>
                                        <FaPlus className='text-green-600 text-sm' />
                                    </button>
                                    <button onClick={() => reject(f.id)} className='w-5 h-5 border-red-600 opacity-50 border rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-all'>
                                        <FaMinus className='text-red-600 text-sm' />
                                    </button>
                                </div>
                            ) : null
                        ))
                    }
                </div>
            </section>
        </div>
    )
}

export default Mainpagenav