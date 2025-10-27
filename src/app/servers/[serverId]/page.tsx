'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { FaHashtag, FaVolumeUp, FaCog, FaUser, FaUserPlus, FaCrown, FaEllipsisV } from 'react-icons/fa'
import { IoSend } from 'react-icons/io5'
import { BsEmojiSmile } from 'react-icons/bs'

const ServerPage = () => {
    const { id } = useParams()
    const [activeChannel, setActiveChannel] = useState<string | null>(null)

    // Örnek veri - API'den gelecek
    const serverData = {
        id: '1',
        name: 'Oyun Topluluğu',
        description: 'Oyun severler için harika bir topluluk',
        image: 'https://via.placeholder.com/400x200',
        memberCount: 1234,
        onlineCount: 567
    }

    const textChannels = [
        { id: '1', name: 'genel' },
        { id: '2', name: 'duyurular' },
        { id: '3', name: 'sohbet' }
    ]

    const voiceChannels = [
        { id: '4', name: 'Genel Ses', members: 5 },
        { id: '5', name: 'Oyun Odası', members: 12 },
        { id: '6', name: 'AFK', members: 2 }
    ]

    const members = [
        { id: '1', name: 'Kullanıcı 1', role: 'admin', status: 'online', avatar: null },
        { id: '2', name: 'Kullanıcı 2', role: 'moderator', status: 'online', avatar: null },
        { id: '3', name: 'Kullanıcı 3', role: 'member', status: 'idle', avatar: null },
        { id: '4', name: 'Kullanıcı 4', role: 'member', status: 'offline', avatar: null }
    ]

    const messages = [
        { id: '1', user: 'Kullanıcı 1', content: 'Merhaba arkadaşlar!', timestamp: '14:30', avatar: null },
        { id: '2', user: 'Kullanıcı 2', content: 'Selam, nasılsınız?', timestamp: '14:32', avatar: null },
        { id: '3', user: 'Kullanıcı 1', content: 'İyiyiz, sen nasılsın?', timestamp: '14:33', avatar: null }
    ]

    return (
        <div className="w-full h-full flex">
            <div className="w-60 h-full bg-card/50 flex xl:flex-col">
                <div className="p-4">
                    <h3 className="font-semibold text-sm text-gray-700">Üyeler — {members.length}</h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    <div>
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                            Üyeler — {members.filter(m => m.role !== 'admin').length}
                        </div>
                        {members.filter(m => m.role !== 'admin').map((member) => (
                            <div key={member.id} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-card transition-all cursor-pointer">
                                <div className="relative">
                                    <div className="w-8 h-8 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                        {member.avatar ? (
                                            <img src={member.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <FaUser className="text-gray-400 text-xs" />
                                        )}
                                    </div>
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${member.status === 'online' ? 'bg-green-500' :
                                        member.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-400'
                                        }`}></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{member.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                <div className="h-14 px-4 flex items-center justify-between bg-card/30">
                    <div className="flex items-center gap-2">
                        <FaHashtag className="text-gray-500" />
                        <h3 className="font-semibold text-lg">
                            {textChannels.find(ch => ch.id === activeChannel)?.name || 'Kanal seçin'}
                        </h3>
                    </div>
                    <button className="w-9 h-9 hover:bg-gray-100 dark:hover:bg-card rounded-lg flex items-center justify-center transition-all">
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

export default ServerPage