import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const POST = async (req: Request) => {
    try {
        const { activeTab, searchQuery } = await req.json();
        if (activeTab === "users") {
            const { error, data } = await supabase.from("users").select("*").like("seen_name", `%${searchQuery}%`);
            if (error) {
                return NextResponse.json({ error: "DB hatası" }, { status: 500 });
            }
            return NextResponse.json({ message: "başarılı", data }, { status: 200 });
        } else {
            const { error, data } = await supabase.from("servers").select("*").like("sv_name", `%${searchQuery}%`);
            if (error) {
                return NextResponse.json({ error: "DB hatası" }, { status: 500 });
            }
            return NextResponse.json({ message: "başarılı", data }, { status: 200 });
        }
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}