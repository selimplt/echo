import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabaseClient";

export const GET = async () => {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;

        if (!token) {
            return NextResponse.json({ valid: false, error: "HATA 1" }, { status: 401 });
        }
        const secret = process.env.JWT_KEY!;
        const decoded = jwt.verify(token, secret) as JwtPayload;
        const userId = decoded.id;

        const { error, data } = await supabase.from("follows").select(`follower_id,users!follower_id(*)`).eq("following_id", userId);

        if (error) {
            console.error(error);
            return NextResponse.json({ error: "Veri çekme hatası" }, { status: 500 });
        }

        return NextResponse.json({ followers: data.map((f) => f.users) }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: "HATA" }, { status: 401 });
    }
};
