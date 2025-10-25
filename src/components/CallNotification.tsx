'use client'
import React from 'react'
import { useCallStore } from '@/store/useCallStore'
import { FaPhone, FaPhoneSlash, FaUser } from 'react-icons/fa'

const CallNotification = () => {
    const { 
        callStatus, 
        caller, 
        callee, 
        acceptCall, 
        rejectCall, 
        endCall 
    } = useCallStore()

    if (callStatus !== 'ringing') return null

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
            <div className="max-w-4xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <FaUser className="text-white text-lg" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Gelen Arama</h3>
                            <p className="text-sm opacity-90">{caller?.user_name} sizi arıyor</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={rejectCall}
                            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-all hover:scale-105"
                            title="Reddet"
                        >
                            <FaPhoneSlash className="text-lg" />
                        </button>
                        <button
                            onClick={acceptCall}
                            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-all hover:scale-105"
                            title="Kabul Et"
                        >
                            <FaPhone className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CallNotification
