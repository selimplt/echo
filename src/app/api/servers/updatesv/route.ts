import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const POST = async (req: Request) => {
    try {
        const { serverName, serverDescription, serverId } = await req.json();
        if (!serverId) {
            return NextResponse.json({ error: "eksik" }, { status: 403 });
        }
        if (serverName) {
            const { error } = await supabase.from("servers").update([{ "sv_name": serverName }]).eq("id", serverId);
            if (error) {
                return NextResponse.json({ error: "db hatası" }, { status: 402 });
            }
        }
        if (serverDescription) {
            const { error } = await supabase.from("servers").update([{ "sv_description": serverDescription }]).eq("id", serverId);
            if (error) {
                return NextResponse.json({ error: "db hatası" }, { status: 402 });
            }
        }
        return NextResponse.json({ message: "başarılı" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "beklenmeyen hata" }, { status: 500 });
    }
}