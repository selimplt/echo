import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET() {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;

        if (!token) {
            return NextResponse.json({ valid: false, error: "HATA 1" }, { status: 401 });
        }
        const secret = process.env.JWT_KEY!;
        const decoded = jwt.verify(token, secret) as JwtPayload;
        const userId = decoded.id;

        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { data: messages, error } = await supabase
            .from('direct_messages')
            .select('*')
            .eq('writed_to', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const uniqueMessages: any[] = [];
        const senders = new Set();

        for (const msg of messages) {
            if (!senders.has(msg.writed_by)) {
                uniqueMessages.push(msg);
                senders.add(msg.writed_by);
            }
            if (uniqueMessages.length >= 5) break;
        }

        const enriched = await Promise.all(
            uniqueMessages.map(async (msg) => {
                const { data: senderData } = await supabase
                    .from('users')
                    .select('id, user_name, seen_name, profile_img')
                    .eq('id', msg.writed_by)
                    .single();
                return { ...msg, sender: senderData };
            })
        );

        return NextResponse.json(enriched);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
