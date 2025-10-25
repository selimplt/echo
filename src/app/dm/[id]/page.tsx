'use client'
import React, { useState, useEffect, useRef } from 'react'
import { BsEmojiSmile } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import EmojiPicker from 'emoji-picker-react';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import axios from 'axios';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { FaUser } from 'react-icons/fa';
import useAuthStore from '@/store/userstor';
import { useGetDmStore } from '@/store/dmtostore';
import usePageStore from '@/store/pagestore';

const page = () => {
    const [message, SetMessage] = useState<string>("");
    const [error, SetError] = useState<string | null>("");
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
    const { id } = useParams();
    const [messages, setMessages] = useState<any[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const { user } = useAuthStore();
    const { User_dm, fetchUser } = useGetDmStore();
    const setPageName = usePageStore((state) => state.setPageName);

    useEffect(() => {
        setPageName("DM");
      }, [setPageName]);
    

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get<any>(`/api/messages/getdm?id=${id}`);
                setMessages(res.data.messages || []);
                console.log(res.data.messages)
            } catch (err) {
                SetError(`Mesajları alırken hata:, ${err}`);
            }
        };

        getMessages();
    }, [id]);

    useEffect(() => {
        if (id) fetchUser(id as string);
    }, [id, fetchUser]);

    useEffect(() => {
        const channel = supabase
            .channel('direct_messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'direct_messages' },
                (payload) => {
                    const newMessage = payload.new;
                    if (
                        (newMessage.writed_by === id || newMessage.writed_to === id)
                    ) {
                        setMessages((prev) => [...prev, newMessage]);
                    }
                }
            ).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

    const sendMessage = async () => {
        if (!message.trim()) return
        try {
            const res = await axios.post<any>("/api/messages/senddm", {
                writed_to: id,
                content: message
            })
            if (res.data.message === "başarılı") {
                SetMessage("")
                setShowEmojiPicker(false)
            }
        } catch (err) {
            SetError(`Mesajları gönderme hata:, ${err}`);
        }
    }

    const addEmoji = (emojiData: any) => {
        SetMessage((prev) => prev + emojiData.emoji)
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="w-full h-[calc(100%-48px)] p-2">
            <div className='w-full h-full flex flex-col gap-3 overflow-y-scroll p-2 custom-scrollbar'>
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mb-4">
                            {User_dm?.profile_img ? (
                                <img src={User_dm.profile_img} alt="profil" className='w-full h-full object-cover rounded-full' />
                            ) : (
                                <FaUser className="text-2xl text-gray-400" />
                            )}
                        </div>
                        <p className="text-gray-500 font-medium mb-1">Henüz mesaj yok</p>
                        <p className="text-gray-400 text-sm">İlk mesajı göndererek sohbeti başlat</p>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isReceived = msg.writed_by == id;
                        const showAvatar = i === 0 || messages[i - 1]?.writed_by !== msg.writed_by;
                        const showTime = i === messages.length - 1 || messages[i + 1]?.writed_by !== msg.writed_by;

                        return (
                            <div
                                className={`flex items-end gap-2 ${isReceived ? "justify-start" : "justify-end"} group`}
                                key={msg.id || i}
                            >
                                {isReceived && (
                                    <div className='w-8 h-8 shrink-0 mb-1'>
                                        {showAvatar && (
                                            <div className='w-8 h-8 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center overflow-hidden'>
                                                {User_dm?.profile_img ? (
                                                    <img src={User_dm.profile_img} alt="profil" className='w-full h-full object-cover' />
                                                ) : (
                                                    <FaUser className='text-gray-400 text-xs' />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className={`flex flex-col max-w-[70%] ${isReceived ? "items-start" : "items-end"} w-full`}>
                                    {showAvatar && (
                                        <p className='text-xs font-semibold text-gray-600 mb-1 px-3'>
                                            {isReceived ? User_dm?.user_name : user?.user_name}
                                        </p>
                                    )}

                                    <div className={`px-4 py-2.5 max-w-[70%] rounded-2xl wrap-break-word relative ${isReceived
                                        ? 'bg-card border border-gray-100'
                                        : 'bg-foreground text-background'
                                        } ${!showAvatar ? 'mt-1' : ''}`}>
                                        <p className='wrap-break-word max-w-36 md:max-w-72 lg:max-w-72 xl:max-w-98 2xl:max-w-132'>{msg.content}</p>
                                        {!showTime && (
                                            <span className={`absolute ${isReceived ? 'left-full ml-2' : 'right-full mr-2'} top-1/2 -translate-y-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
                                                {new Date(msg.created_at).getHours().toString().padStart(2, '0')}:{new Date(msg.created_at).getMinutes().toString().padStart(2, '0')}
                                            </span>
                                        )}
                                    </div>
                                    {showTime && (
                                        <p className='text-xs text-gray-400 mt-1 px-3'>
                                            {new Date(msg.created_at).getHours().toString().padStart(2, '0')}:{new Date(msg.created_at).getMinutes().toString().padStart(2, '0')}
                                        </p>
                                    )}
                                </div>
                                {!isReceived && (
                                    <div className='w-8 h-8 shrink-0 mb-1'>
                                        {showAvatar && (
                                            <div className='w-8 h-8 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center overflow-hidden'>
                                                {user?.profile_img ? (
                                                    <img src={user.profile_img} alt="profil" className='w-full h-full object-cover' />
                                                ) : (
                                                    <FaUser className='text-gray-400 text-xs' />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
                <div ref={scrollRef}></div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className='w-full h-fit rounded-lg sticky bottom-0 flex items-center gap-2'>
                <InputGroup className='min-h-12 bg-card border border-gray-200 rounded-xl'>
                    <InputGroupInput
                        placeholder='Mesajını yaz...'
                        value={message}
                        onChange={(e) => SetMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage()
                            }
                        }}
                        className='border-0 focus:ring-0 bg-transparent min-h-12 py-3'
                    />
                    <InputGroupAddon align="inline-end" className='gap-1 px-2'>
                        <InputGroupButton
                            type="button"
                            variant="ghost"
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            <BsEmojiSmile className="text-lg text-gray-600" />
                        </InputGroupButton>
                        <InputGroupButton
                            type="submit"
                            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${message.trim()
                                ? 'bg-foreground hover:opacity-90 text-background'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            disabled={!message.trim()}
                        >
                            <IoSend className="text-lg" />
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
                {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute bottom-full mb-2 right-0 z-50 shadow-xl rounded-xl overflow-hidden">
                        <EmojiPicker
                            onEmojiClick={addEmoji}
                            width={300}
                            height={350}
                            searchDisabled={false}
                        />
                    </div>
                )}
            </form>
        </div>
    )
}

export default page