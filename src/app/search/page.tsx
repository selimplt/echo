'use client'
import React, { useState, useEffect } from 'react'
import usePageStore from '@/store/pagestore'
import { FaUser, FaServer, FaSearch, FaUserPlus, FaCheck } from 'react-icons/fa'
import axios from 'axios'

const SearchPage = () => {
    const setPageName = usePageStore((state) => state.setPageName)
    const [activeTab, setActiveTab] = useState<'users' | 'servers'>('users')
    const [searchQuery, setSearchQuery] = useState('')
    const [users, setUsers] = useState<any[]>([])
    const [servers, setServers] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setPageName('Keşfet')
    }, [setPageName])

    useEffect(() => {
        if (searchQuery) {
            const timer = setTimeout(() => {
                if (activeTab === "servers"){
                    console.log("sunucu:", searchQuery)
                } else {
                    console.log("kullanıcı:", searchQuery)
                }
            }, 350);

            return () => clearTimeout(timer);
        }
    }, [searchQuery]);


    const sendFriendRequest = async (userId: string) => {
        try {
            await axios.post('/api/friends/send', { userId })
        } catch (err) {
            console.error('Arkadaşlık isteği gönderilemedi')
        }
    }

    const joinServer = async (serverId: string) => {
        try {
            await axios.post('/api/servers/join', { serverId })
        } catch (err) {
            console.error('Sunucuya katılınamadı')
        }
    }

    return (
        <div className="w-full h-full p-4 md:p-6">
            <div className="max-w-5xl mx-auto flex flex-col h-full">
                <div className="mb-6">
                    <h1 className="font-bold text-2xl md:text-3xl mb-2">Ara</h1>
                    <p className="text-sm text-gray-500">Yeni arkadaşlar ve sunucular keşfet</p>
                </div>
                <div className="mb-6">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder={activeTab === 'users' ? 'Kullanıcı ara...' : 'Sunucu ara...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 bg-card focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                            />
                            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <button
                            className="px-6 h-12 bg-foreground text-background rounded-xl font-semibold hover:opacity-90 transition-all"
                        >
                            Ara
                        </button>
                    </div>
                </div>
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all relative ${activeTab === 'users'
                                ? 'text-foreground'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <FaUser className="text-sm" />
                        Kullanıcılar
                        {activeTab === 'users' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('servers')}
                        className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all relative ${activeTab === 'servers'
                                ? 'text-foreground'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <FaServer className="text-sm" />
                        Sunucular
                        {activeTab === 'servers' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"></div>
                        )}
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-t-foreground animate-spin"></div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <p className="text-red-500 mb-2">{error}</p>
                        </div>
                    ) : activeTab === 'users' ? (
                        users.length === 0 && searchQuery ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <FaUser className="text-4xl text-gray-300 mb-4" />
                                <p className="text-gray-500">Kullanıcı bulunamadı</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="bg-card rounded-xl p-4 border border-transparent hover:border-gray-200 hover:shadow-lg transition-all"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-14 h-14 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                                {user.profile_img ? (
                                                    <img src={user.profile_img} alt="profil" className="w-full h-full object-cover" />
                                                ) : (
                                                    <FaUser className="text-gray-400 text-lg" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-base truncate">{user.user_name}</p>
                                                <p className="text-sm text-gray-500 truncate">@{user.seen_name}</p>
                                            </div>
                                        </div>
                                        {user.bio && (
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{user.bio}</p>
                                        )}
                                        <button
                                            onClick={() => sendFriendRequest(user.id)}
                                            className="w-full py-2 bg-foreground text-background rounded-lg font-medium text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                        >
                                            <FaUserPlus className="text-xs" />
                                            Arkadaşlık İsteği Gönder
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        servers.length === 0 && searchQuery ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <FaServer className="text-4xl text-gray-300 mb-4" />
                                <p className="text-gray-500">Sunucu bulunamadı</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {servers.map((server) => (
                                    <div
                                        key={server.id}
                                        className="bg-card rounded-xl overflow-hidden border border-transparent hover:border-gray-200 hover:shadow-lg transition-all"
                                    >
                                        <div className="relative w-full h-40 overflow-hidden">
                                            <img
                                                src={server.sv_img || 'https://via.placeholder.com/400x200'}
                                                alt={server.sv_name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg mb-2 truncate">{server.sv_name}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                                                {server.sv_description || 'Açıklama bulunmuyor'}
                                            </p>
                                            <button
                                                onClick={() => joinServer(server.id)}
                                                className="w-full py-2 bg-green-500 text-white rounded-lg font-medium text-sm hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                                            >
                                                <FaCheck className="text-xs" />
                                                Sunucuya Katıl
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                    {!searchQuery && users.length === 0 && servers.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mb-4">
                                <FaSearch className="text-3xl text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg mb-2">Aramaya başla</p>
                            <p className="text-gray-400 text-sm text-center max-w-md">
                                Yeni arkadaşlar bul veya ilginç sunuculara katıl
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SearchPage