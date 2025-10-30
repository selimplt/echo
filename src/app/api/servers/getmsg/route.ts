import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const POST = async (req: Request) => {
    try {
        const { room } = await req.json();
        const { error, data } = await supabase.from("messages").select("*").eq("room", room);
        if (error) {
            return NextResponse.json({ error: "db hatası" }, { status: 402 });
        }
        return NextResponse.json({ message: "başarılı", data }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "beklenmeyen hata" }, { status: 500 });
    }
}