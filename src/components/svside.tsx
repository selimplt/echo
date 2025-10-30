'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const svside = () => {
    const [rooms, SetRooms] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { serverId } = useParams()

    useEffect(() => {
        if (!serverId) return;
        const getrooms = async () => {
            try {
                const res = await axios.post<any>("/api/servers/svrooms", { serverId });
                SetRooms(res.data.rooms);
            } catch (error: any) {
                setErrorMessage("Sunucular yüklenirken hata oluştu.");
            }
        }
        getrooms();
    }, [])

    return (
        <div className='w-72 h-full flex flex-col gap-4 p-4 bg-card/30 overflow-y-auto custom-scrollbar'>
            <p className='text-lg font-semibold'>Odalar</p>
            {
                rooms.length > 0 ? (
                    rooms.map((r) => (
                        <Link href={`/`} key={r.id} className='w-full h-fit p-2 rounded-lg hover:bg-card transition-all flex items-center gap-1'>
                            <p className='font-semibold text-xl text-neutral-600'>#</p>
                            <p className='font-semibold'>{r.name}</p>
                        </Link>
                    ))
                ) : (
                    <p>Henüz bir oda oluşturulmadı</p>
                )
            }
        </div>
    )
}

export default svside