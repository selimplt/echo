'use client'
import React, { useState } from 'react'
import { useCallStore } from '@/store/useCallStore'
import { FaPhone, FaPhoneSlash, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'

const CallTest = () => {
    const {
        callStatus,
        caller,
        callee,
        localStream,
        remoteStream,
        startCall,
        acceptCall,
        rejectCall,
        endCall
    } = useCallStore()

    const [isMuted, setIsMuted] = useState(false)
    const [targetUserId, setTargetUserId] = useState('')

    const handleStartCall = async () => {
        if (!targetUserId.trim()) {
            alert('Hedef kullanıcı ID girin')
            return
        }

        const targetUser = {
            id: targetUserId,
            user_name: 'Test User',
            seen_name: 'testuser'
        }

        try {
            await startCall(targetUser)
        } catch (error) {
            console.error('Arama başlatma hatası:', error)
        }
    }

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = isMuted
            })
            setIsMuted(!isMuted)
        }
    }

    return (
        <div className="p-4 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Sesli Arama Test</h3>

            <div className="space-y-4">
                <div className="p-3 bg-background rounded-lg">
                    <p className="text-sm font-medium">Durum: {callStatus}</p>
                    {caller && <p className="text-sm">Arayan: {caller.user_name}</p>}
                    {callee && <p className="text-sm">Aranan: {callee.user_name}</p>}
                </div>
                {callStatus === 'idle' && (
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Hedef kullanıcı ID"
                            value={targetUserId}
                            onChange={(e) => setTargetUserId(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                        <button
                            onClick={handleStartCall}
                            className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg flex items-center justify-center gap-2"
                        >
                            <FaPhone />
                            Arama Başlat
                        </button>
                    </div>
                )}
                {callStatus === 'ringing' && (
                    <div className="flex gap-2">
                        <button
                            onClick={acceptCall}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg flex items-center justify-center gap-2"
                        >
                            <FaPhone />
                            Kabul Et
                        </button>
                        <button
                            onClick={rejectCall}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg flex items-center justify-center gap-2"
                        >
                            <FaPhoneSlash />
                            Reddet
                        </button>
                    </div>
                )}
                {(callStatus === 'calling' || callStatus === 'connected') && (
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <button
                                onClick={toggleMute}
                                className={`flex-1 p-2 rounded-lg flex items-center justify-center gap-2 ${isMuted
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-gray-500 hover:bg-gray-600 text-white'
                                    }`}
                            >
                                {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                                {isMuted ? 'Sesi Aç' : 'Sustur'}
                            </button>
                            <button
                                onClick={endCall}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg flex items-center justify-center gap-2"
                            >
                                <FaPhoneSlash />
                                Kapat
                            </button>
                        </div>

                        <div className="text-xs text-gray-500 space-y-1">
                            <p>Local Stream: {localStream ? '✅' : '❌'}</p>
                            <p>Remote Stream: {remoteStream ? '✅' : '❌'}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CallTest
