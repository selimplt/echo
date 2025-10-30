'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FaHashtag, FaCog, FaUser } from 'react-icons/fa'
import axios from 'axios'

const page = () => {
    const { serverId } = useParams()
    const [activeChannel, setActiveChannel] = useState<string | null>(null)
    const [members, SetMembers] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (!serverId) return;
        const getdata = async () => {
            try {
                const res = await axios.post<any>("/api/servers/svmembers", { serverId });
                SetMembers(res.data.followers)
            } catch (err) {
                console.log(`hata: ${err}`)
            }
        }
        getdata();
    }, [serverId])

    return (
        <div className="w-full h-full flex">
            <div className="w-60 h-full bg-card/50 flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    <div>
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase mt-4">
                            Üyeler — {members.length}
                        </div>
                        {
                            members ? (
                                members.map((member) => (
                                    <div key={member.id} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-card transition-all cursor-pointer">
                                        <div className="relative">
                                            <div className="w-8 h-8 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                                {member.users.profile_img ? (
                                                    <img src={member.users.profile_img} alt="avatar" className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    <FaUser className="text-gray-400 text-xs" />
                                                )}
                                            </div>
                                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${member.status === 'online' ? 'bg-green-500' :
                                                member.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-400'
                                                }`}></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{member.users.seen_name}</p>
                                        </div>
                                    </div>
                                ))
                            ) : null
                        }
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                <div className="h-14 px-4 flex items-center justify-between bg-card/30">
                    <div className="flex items-center gap-2">
                        <FaHashtag className="text-gray-500" />
                        <h3 className="font-semibold text-lg">
                            Kanal seçin
                        </h3>
                    </div>
                    <button onClick={() => router.push(`/servers/${serverId}/settings`)} className="w-9 h-9 hover:bg-gray-100 dark:hover:bg-card rounded-lg flex items-center justify-center transition-all">
                        <FaCog className="text-gray-600" />
                    </button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <FaHashtag className="text-6xl text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium mb-2">Kanala Hoş Geldin</p>
                        <p className="text-gray-400 text-sm">Sohbete başlamak için bir kanal seç</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page