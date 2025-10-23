import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabaseClient";

export const POST = async (req: Request) => {
    try {
        const { svName, svDescription, svPublic } = await req.json();
        if (!svName || !svDescription || svPublic) {
            return NextResponse.json({ error: "id yok" }, { status: 401 });
        }
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "yetkisiz" }, { status: 401 });
        }

        const secret = process.env.JWT_KEY!;
        const decoded = jwt.verify(token, secret) as JwtPayload;
        const userId = decoded.id;

        const { error } = await supabase.from("servers").insert([{ "sv_name": svName, "sv_description": svDescription, "created_by": userId, "public": svPublic }]);
        if(error) {
            return NextResponse.json({ error: "db hatası" }, { status: 405 });
        }
        return NextResponse.json({ message: "başarılı" }, { status: 202 });
    } catch (error: any) {
        return NextResponse.json({ error: "HATA" }, { status: 500 });
    }
}