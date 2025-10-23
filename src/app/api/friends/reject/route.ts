import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabaseClient";

export const POST = async (req: Request) => {
    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "id yok" }, { status: 401 });
        }
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;

        if (!token) {
            return NextResponse.json({ valid: false, error: "yetkisiz" }, { status: 401 });
        }

        const { error } = await supabase.from("follows").delete().eq("id", id);
        if (error) {
            return NextResponse.json({ error: "db hatası" }, { status: 404 });
        }
        return NextResponse.json({ message: "başarılı" }, { status: 202 });
    } catch (error: any) {
        return NextResponse.json({ error: "HATA" }, { status: 500 });
    }
}