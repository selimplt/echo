import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

export const GET = async (req: Request) => {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "yetkisiz" }, { status: 401 });
        }

        const secret = process.env.JWT_KEY!;
        const decoded = jwt.verify(token, secret) as JwtPayload;
        const userId = decoded.id;

        const { searchParams } = new URL(req.url);
        const targetId = searchParams.get("id");
        if (!targetId) {
            return NextResponse.json({ error: "eksik id" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("direct_messages")
            .select("*,users:writed_by(*)")
            .or(`and(writed_by.eq.${userId},writed_to.eq.${targetId}),and(writed_by.eq.${targetId},writed_to.eq.${userId})`)
            .order("created_at", { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ messages: data }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "beklenmeyen hata" }, { status: 500 });
    }
};