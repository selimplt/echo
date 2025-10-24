import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

export const POST = async (req: Request) => {
    try {
        const { writed_to, content } = await req.json();
        if (!writed_to || !content?.trim()) {
            return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
        }
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;

        if (!token) {
            return NextResponse.json({ valid: false, error: "HATA 1" }, { status: 401 });
        }
        const secret = process.env.JWT_KEY!;
        const decoded = jwt.verify(token, secret) as JwtPayload;
        const userId = decoded.id;
        const { error, data } = await supabase.from("direct_messages").insert([{ "writed_by": userId, writed_to, content }]).select("*").single();
        if (error) {
            return NextResponse.json({ error: "DB hatası" }, { status: 500 });
        }
        return NextResponse.json({ message: "başarılı", data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Beklenmeyen hata" }, { status: 500 });
    }
}