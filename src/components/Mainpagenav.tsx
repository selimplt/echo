'use client'
import React, { useEffect, useState } from 'react'
import { FaUser, FaCheck, FaTimes, FaUserFriends } from 'react-icons/fa'
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

    const accept = async (id: string, reqid: string) => {
        try {
            const res = await axios.post<any>("/api/friends/accept", { id, reqid })
            if (res.data.message == "başarılı") {
                window.location.reload();
            }
        }
        catch (error: any) {
            console.log(error);
        }
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

    const pendingRequests = followers.filter(f => f.status === 'pending');

    return (
        <div className='w-80 h-full flex flex-col gap-4 p-4 bg-card/30'>
            <div className='w-full flex items-center gap-3 pb-3 border-b border-gray-200'>
                <div className='w-10 h-10 bg-foreground rounded-lg flex items-center justify-center'>
                    <FaUserFriends className='text-background text-lg' />
                </div>
                <div>
                    <h2 className='font-bold text-lg'>Bildirimler</h2>
                    <p className='text-xs text-gray-500'>Aktivitelerinizi takip edin</p>
                </div>
            </div>
            <section className='w-full flex flex-col gap-3'>
                <div className='flex items-center justify-between'>
                    <h3 className='font-semibold text-sm text-gray-700 dark:text-gray-300'>Son Mesajlar</h3>
                    <span className='text-xs text-gray-400'>2 yeni</span>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='bg-background rounded-xl p-3 hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-200'>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='relative'>
                                <div className='w-10 h-10 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center'>
                                    <FaUser className='text-gray-400 text-sm' />
                                </div>
                                <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background'></div>
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='font-semibold text-sm truncate'>Arkadaş 1</p>
                                <p className='text-xs text-gray-400'>2 dakika önce</p>
                            </div>
                        </div>
                        <p className='text-sm text-gray-600 truncate ml-13'>asdfdsgd ada sdas dasdasd...</p>
                    </div>

                    <div className='bg-background rounded-xl p-3 hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-200'>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='relative'>
                                <div className='w-10 h-10 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center'>
                                    <FaUser className='text-gray-400 text-sm' />
                                </div>
                                <div className='absolute bottom-0 right-0 w-3 h-3 bg-gray-400 rounded-full border-2 border-background'></div>
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='font-semibold text-sm truncate'>Arkadaş 2 aaaaaaaa...</p>
                                <p className='text-xs text-gray-400'>15 dakika önce</p>
                            </div>
                        </div>
                        <p className='text-sm text-gray-600 truncate ml-13'>asdfdsgd ada sdas dasdasd...</p>
                    </div>
                </div>
            </section>
            <section className='w-full flex flex-col gap-3'>
                <div className='flex items-center justify-between'>
                    <h3 className='font-semibold text-sm text-gray-700 dark:text-gray-300'>Arkadaşlık İstekleri</h3>
                    {pendingRequests.length > 0 && (
                        <span className='px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full'>
                            {pendingRequests.length}
                        </span>
                    )}
                </div>
                {pendingRequests.length === 0 ? (
                    <div className='bg-background rounded-xl p-4 text-center'>
                        <p className='text-sm text-gray-400'>Yeni istek yok</p>
                    </div>
                ) : (
                    <div className='flex flex-col gap-2'>
                        {pendingRequests.map((f) => (
                            <div key={f.id} className='bg-background rounded-xl p-3 border border-transparent hover:border-gray-200 transition-all'>
                                <div className='flex items-center gap-3 mb-3'>
                                    <div className='w-10 h-10 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center overflow-hidden shrink-0'>
                                        {f.users.profile_img ? (
                                            <img src={f.users.profile_img} alt="profil fotosu" className='w-full h-full object-cover' />
                                        ) : (
                                            <FaUser className='text-gray-400 text-sm' />
                                        )}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='font-semibold text-sm truncate'>{f.users.user_name}</p>
                                        <p className='text-xs text-gray-400'>Arkadaşlık isteği gönderdi</p>
                                    </div>
                                </div>
                                <div className='flex gap-2'>
                                    <button
                                        onClick={() => accept(f.users.id, f.id)}
                                        className='flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm'
                                    >
                                        <FaCheck className='text-xs' />
                                        Kabul Et
                                    </button>
                                    <button
                                        onClick={() => reject(f.id)}
                                        className='flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm'
                                    >
                                        <FaTimes className='text-xs' />
                                        Reddet
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default Mainpagenav