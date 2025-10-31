import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export const GET = async () => {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "yetkisiz" }, { status: 401 });
        }

        const secret = process.env.JWT_KEY!;
        const decoded = jwt.verify(token, secret) as JwtPayload;
        const userId = decoded.id;
        const { error, data } = await supabase.from("servers").select("created_by").eq("created_by", userId).single();
        if (error) {
            return NextResponse.json({ error: "db hatası" }, { status: 402 });
        }
        if (data.created_by == userId) {
            return NextResponse.json({ access: true }, { status: 200 });
        } else {
            return NextResponse.json({ access: false }, { status: 200 });
        }
    } catch (err) {
        return NextResponse.json({ error: "beklenmeyen hata" }, { status: 500 });
    }
}