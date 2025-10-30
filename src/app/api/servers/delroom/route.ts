import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const POST = async (req: Request) => {
    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "eksik" }, { status: 403 });
        }
        const { error } = await supabase.from("rooms").delete().eq("id", id);
        if (error) {
            return NextResponse.json({ error: "db hatası" }, { status: 402 });
        }
        return NextResponse.json({ message: "başarılı" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "beklenmeyen hata" }, { status: 500 });
    }
}