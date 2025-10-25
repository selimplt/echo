import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabaseClient";

export const POST = async (req: Request) => {
    try {
        const { id, reqid } = await req.json();
        if (!id || !reqid) {
            return NextResponse.json({ error: "id yok" }, { status: 401 });
        }
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;

        if (!token) {
            return NextResponse.json({ valid: false, error: "yetkisiz" }, { status: 401 });
        }

        const secret = process.env.JWT_KEY!;
        const decoded = jwt.verify(token, secret) as JwtPayload;
        const userId = decoded.id;


        const { error: e1 } = await supabase.from("follows").update([{ "status": "accepted" }]).eq("id", reqid);
        if (e1) {
            return NextResponse.json({ error: "db hatası" }, { status: 403 });
        }
        const { error: e2 } = await supabase.from("follows").insert([{ "follower_id": userId, "following_id": id, "status": "accepted" }])
        if (e2) {
            return NextResponse.json({ error: "db hatası 2" }, { status: 408 });
        }
        return NextResponse.json({ message: "başarılı" }, { status: 202 });
    } catch (error: any) {
        return NextResponse.json({ error: "HATA" }, { status: 500 });
    }
}