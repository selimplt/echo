'use client'
import { useEffect, useRef } from 'react'
import { useCallStore } from '@/store/useCallStore'
import useAuthStore from '@/store/userstor'

export default function CallListener() {
    const { user } = useAuthStore()
    const { initListeners, callStatus, caller, callee, localStream, remoteStream, cleanup } = useCallStore()
    const localAudioRef = useRef<HTMLAudioElement>(null)
    const remoteAudioRef = useRef<HTMLAudioElement>(null)
    const initialized = useRef(false)

    useEffect(() => {
        if (user?.id && !initialized.current) {
            initListeners(user.id)
            initialized.current = true
        }
    }, [user?.id, initListeners])

    useEffect(() => {
        if (localStream && localAudioRef.current) {
            localAudioRef.current.srcObject = localStream
            localAudioRef.current.muted = true
        }
    }, [localStream])

    useEffect(() => {
        if (remoteStream && remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStream
        }
    }, [remoteStream])

    useEffect(() => {
        return () => {
            if (initialized.current) {
                cleanup()
            }
        }
    }, [cleanup])

    return (
        <>
            <audio 
                ref={localAudioRef} 
                autoPlay 
                playsInline 
                style={{ display: 'none' }}
            />
            <audio 
                ref={remoteAudioRef} 
                autoPlay 
                playsInline 
                style={{ display: 'none' }}
            />
        </>
    )
}
