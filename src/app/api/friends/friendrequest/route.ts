import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

export const POST = async (req: Request) => {
    try {
        const { id } = await req.json();
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "yetkisiz" }, { status: 401 });
        }

        const secret = process.env.JWT_KEY!;
        const decoded = jwt.verify(token, secret) as JwtPayload;
        const userId = decoded.id;

        const { error } = await supabase.from("follows").insert([{ "follower_id": userId, "following_id": id, "status": "pending" }]);
        if (error) {
            return NextResponse.json({ error: "db hatası" }, { status: 404 });
        }

        return NextResponse.json({ message: "başarılı" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "beklenmeyen hata" }, { status: 500 });
    }
}