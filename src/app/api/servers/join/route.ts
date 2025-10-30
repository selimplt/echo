import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export const POST = async (req: Request) => {
    try {
        const { serverId } = await req.json();
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "yetkisiz" }, { status: 401 });
        }

        const secret = process.env.JWT_KEY!;
        const decoded = jwt.verify(token, secret) as JwtPayload;
        const userId = decoded.id;
        const { error, data } = await supabase.from("memberships").insert([{ "user_id": userId, "sv_id": serverId }])
        if (error) {
            return NextResponse.json({ error: "db hatası" }, { status: 402 });
        }
        return NextResponse.json({ message: "başarılı" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "beklenmeyen hata" }, { status: 500 });
    }
}