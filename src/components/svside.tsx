'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'

const svside = () => {
    const [rooms, SetRooms] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { serverId } = useParams()

    useEffect(() => {
        if (!serverId) return;
        const getrooms = async () => {
            try {
                const res = await axios.post<any>("/api/servers/svrooms", { serverId });
                SetRooms(res.data);
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
                rooms.length ? (
                    null
                ) : (
                    <p>Henüz bir oda oluşturulmadı</p>
                )
            }
        </div>
    )
}

export default svside