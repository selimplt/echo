import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const POST = async (req: Request) => {
    try {
        const { user_id, room_id, content, writed_name, writed_img } = await req.json();
        if (!user_id || !room_id || !content || !writed_name) {
            return NextResponse.json({ error: "eksik" }, { status: 403 });
        }
        const { error } = await supabase.from("messages").insert([
            { "writed_by": user_id, "room": room_id, "content": content, "writed_name": writed_name, "writed_img": writed_img }
        ]);
        if (error) {
            return NextResponse.json({ error: "db hatası" }, { status: 402 });
        }
        return NextResponse.json({ message: "başarılı" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "beklenmeyen hata" }, { status: 500 });
    }
}