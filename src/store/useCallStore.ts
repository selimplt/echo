import { create } from 'zustand'
import { supabase } from '@/lib/supabaseClient'

interface CallState {
    inCall: boolean
    caller: any | null
    callee: any | null
    callStatus: 'idle' | 'calling' | 'ringing' | 'connected' | 'ended'
    localStream: MediaStream | null
    remoteStream: MediaStream | null
    peerConnection: RTCPeerConnection | null
    callChannel: any | null

    startCall: (target: any) => Promise<void>
    endCall: () => Promise<void>
    acceptCall: () => Promise<void>
    rejectCall: () => void
    initListeners: (userId: string) => void
    cleanup: () => void
}

export const useCallStore = create<CallState>((set, get) => ({
    inCall: false,
    caller: null,
    callee: null,
    callStatus: 'idle',
    localStream: null,
    remoteStream: null,
    peerConnection: null,
    callChannel: null,

    async startCall(target) {
        try {
            const { default: useAuthStore } = await import('@/store/userstor')
            const currentUser = useAuthStore.getState().user
            if (!currentUser) {
                console.error('Kullanıcı bulunamadı')
                return
            }


            const localStream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                } 
            })

            const pc = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ],
            })

            localStream.getTracks().forEach((track) => {
                pc.addTrack(track, localStream)
            })

            const remoteStream = new MediaStream()
            pc.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remoteStream.addTrack(track)
                })
                set({ remoteStream })
            }

            pc.onicecandidate = async (event) => {
                if (event.candidate) {
                    await supabase.channel('calls').send({
                        type: 'broadcast',
                        event: 'iceCandidate',
                        payload: { 
                            from: currentUser.id, 
                            to: target.id, 
                            candidate: event.candidate 
                        },
                    })
                }
            }

            pc.onconnectionstatechange = () => {
                if (pc.connectionState === 'connected') {
                    set({ callStatus: 'connected', inCall: true })
                }
            }

            set({ 
                localStream, 
                peerConnection: pc, 
                callee: target, 
                callStatus: 'calling',
                caller: currentUser
            })

            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)

            await supabase.channel('calls').send({
                type: 'broadcast',
                event: 'callOffer',
                payload: { 
                    from: currentUser.id, 
                    to: target.id, 
                    offer,
                    caller: currentUser
                },
            })

        } catch (error) {
            console.error('📞 Arama başlatma hatası:', error)
            get().cleanup()
        }
    },

    async acceptCall() {
        try {
            const { caller, peerConnection } = get()
            if (!caller || !peerConnection) {
                console.error('Call accept için gerekli bilgiler eksik')
                return
            }


            const localStream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                } 
            })

            localStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStream)
            })

            set({ localStream })

            const answer = await peerConnection.createAnswer()
            await peerConnection.setLocalDescription(answer)

            await supabase.channel('calls').send({
                type: 'broadcast',
                event: 'callAnswer',
                payload: { 
                    from: caller.id, 
                    to: caller.id, 
                    answer 
                },
            })

            set({ callStatus: 'connected', inCall: true })

        } catch (error) {
            console.error('📞 Arama kabul etme hatası:', error)
            get().cleanup()
        }
    },

    rejectCall() {
        get().cleanup()
    },

    async endCall() {
        const { localStream, remoteStream, peerConnection, callee, caller } = get()
        
        localStream?.getTracks().forEach((track) => track.stop())
        remoteStream?.getTracks().forEach((track) => track.stop())
        
        peerConnection?.close()
        if (callee || caller) {
            await supabase.channel('calls').send({
                type: 'broadcast',
                event: 'callEnd',
                payload: { 
                    from: caller?.id || callee?.id,
                    to: callee?.id || caller?.id
                },
            })
        }

        get().cleanup()
    },

    cleanup() {
        const { localStream, remoteStream, peerConnection } = get()
        
        localStream?.getTracks().forEach((track) => track.stop())
        remoteStream?.getTracks().forEach((track) => track.stop())
        peerConnection?.close()

        set({
            inCall: false,
            callStatus: 'idle',
            localStream: null,
            remoteStream: null,
            peerConnection: null,
            callee: null,
            caller: null,
        })
    },

    initListeners(userId) {
        const channel = supabase.channel('calls')

        channel.on('broadcast', { event: 'callOffer' }, async (payload: any) => {
            if (payload.payload.to === userId) {
                const pc = new RTCPeerConnection({
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' }
                    ],
                })

                const remoteStream = new MediaStream()
                pc.ontrack = (event) => {
                    event.streams[0].getTracks().forEach((track) => {
                        remoteStream.addTrack(track)
                    })
                    set({ remoteStream })
                }

                pc.onicecandidate = async (event) => {
                    if (event.candidate) {
                        await supabase.channel('calls').send({
                            type: 'broadcast',
                            event: 'iceCandidate',
                            payload: { 
                                from: userId, 
                                to: payload.payload.from, 
                                candidate: event.candidate 
                            },
                        })
                    }
                }

                pc.onconnectionstatechange = () => {
                    if (pc.connectionState === 'connected') {
                        set({ callStatus: 'connected', inCall: true })
                    }
                }

                set({ 
                    callStatus: 'ringing', 
                    caller: payload.payload.caller,
                    callee: payload.payload.caller,
                    peerConnection: pc,
                    remoteStream
                })

                try {
                    await pc.setRemoteDescription(payload.payload.offer)
                } catch (error) {
                    console.error('📞 Remote description set etme hatası:', error)
                    get().cleanup()
                }
            }
        })

        channel.on('broadcast', { event: 'callAnswer' }, async (payload: any) => {
            const { peerConnection } = get()
            if (peerConnection && payload.payload.to === userId) {
                await peerConnection.setRemoteDescription(payload.payload.answer)
                set({ callStatus: 'connected', inCall: true })
            }
        })

        channel.on('broadcast', { event: 'iceCandidate' }, async (payload: any) => {
            const { peerConnection } = get()
            if (peerConnection && payload.payload.to === userId) {
                await peerConnection.addIceCandidate(payload.payload.candidate)
            }
        })

        channel.on('broadcast', { event: 'callEnd' }, async (payload: any) => {
            if (payload.payload.to === userId) {
                get().cleanup()
            }
        })

        channel.subscribe()
        set({ callChannel: channel })
    },
}))
