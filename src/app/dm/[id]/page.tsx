'use client'
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FaArrowRight } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from 'emoji-picker-react';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"

const page = () => {
    const [message, SetMessage] = useState<string>("");
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)

    const sendMessage = async () => {
        if (!message.trim()) return
        SetMessage("");
        console.log(message)
    }

    const addEmoji = (emojiData: any) => {
        SetMessage((prev) => prev + emojiData.emoji)
    }

    return (
        <div className="w-full h-[calc(100%-48px)] p-2">
            <div className='w-full h-full flex flex-col overflow-y-scroll'>

            </div>
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className='w-full h-12 rounded-lg sticky bottom-0 flex items-center gap-2'>
                <InputGroup className='h-12'>
                    <InputGroupInput
                        value={message}
                        onChange={(e) => SetMessage(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                    />
                    <InputGroupAddon align="inline-end">
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-10 h-10 flex items-center justify-center"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            <BsEmojiSmile className="text-xl" />
                        </Button>
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