'use client'
import React, { useState, useEffect, useRef } from 'react'
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from 'emoji-picker-react';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import axios from 'axios';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const page = () => {
    const [message, SetMessage] = useState<string>("");
    const [error, SetError] = useState<string | null>("");
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
    const { id } = useParams();
    const [messages, setMessages] = useState<any[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

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


    const sendMessage = async () => {
        if (!message.trim()) return
        try {
            const res = await axios.post<any>("/api/messages/senddm", {
                writed_to: id,
                content: message
            })
            if (res.data.message === "başarılı") {
                SetMessage("")
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
            <div className='w-full h-full flex flex-col gap-2 overflow-y-scroll p-2 custom-scrollbar'>
                {messages.map((msg, i) => (
                    <div
                        key={msg.id || i}
                        className={`p-2 rounded-lg w-fit max-w-[70%] ${msg.writed_by === id ? "bg-muted self-start" : "bg-secondary self-end"}`}
                    >
                        {msg.content}
                    </div>
                ))}
                <div ref={scrollRef}></div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className='w-full h-12 rounded-lg sticky bottom-0 flex items-center gap-2'>
                <InputGroup className='h-12 bg-card'>
                    <InputGroupInput
                        placeholder='Mesajını yaz...'
                        value={message}
                        onChange={(e) => SetMessage(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                    />
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton
                            type="button"
                            variant="ghost"
                            className="w-10 h-10 flex items-center justify-center"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            <BsEmojiSmile className="text-xl" />
                        </InputGroupButton>
                    </InputGroupAddon>
                    {showEmojiPicker && (
                        <div className="absolute bottom-14 left-2 z-50">
                            <EmojiPicker
                                onEmojiClick={addEmoji}
                                width={300}
                                height={350}
                                searchDisabled={false}
                            />
                        </div>
                    )}
                </InputGroup>
            </form>
        </div>
    )
}

export default page