'use client'
import React from 'react'
import { useCallStore } from '@/store/useCallStore'
import { FaPhone, FaPhoneSlash, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'

const DmCallUI = () => {
    const { 
        callStatus, 
        caller, 
        acceptCall, 
        rejectCall
    } = useCallStore()

    if (callStatus !== 'ringing') return null

    return (
        <div className="absolute top-0 left-0 right-0 bg-linear-to-r from-indigo-600 to-purple-600 text-white z-40">
            <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <FaPhone className="text-white text-sm" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">Gelen arama - {caller?.user_name}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={acceptCall}
                            className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1"
                        >
                            <FaPhone className="text-xs" />
                            Kabul Et
                        </button>
                        <button
                            onClick={rejectCall}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1"
                        >
                            <FaPhoneSlash className="text-xs" />
                            Reddet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DmCallUI
