import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const POST = async (req: Request) => {
    try {
        const { serverId, newRoom } = await req.json();
        if (!serverId || !newRoom) {
            return NextResponse.json({ error: "eksik" }, { status: 403 });
        }
        const { error, data } = await supabase.from("rooms").insert([{ "name": newRoom, "sv_id": serverId }]);
        if (error) {
            return NextResponse.json({ error: "db hatası" }, { status: 402 });
        }
        return NextResponse.json({ message: "başarılı" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "beklenmeyen hata" }, { status: 500 });
    }
}