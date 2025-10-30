import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";

export const POST = async (req: Request) => {
    try {
        const { user_name, password } = await req.json();
        if (!user_name || !password)
            return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("user_name", user_name)
            .single();

        if (error || !data)
            return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });

        const match = await bcrypt.compare(password, data.password);
        if (!match)
            return NextResponse.json({ error: "Şifre yanlış" }, { status: 401 });

        const token = jwt.sign(
            {
                id: data.id,
                seen_name: data.seen_name,
                user_name: data.user_name,
                profile_img: data.profile_img,
                bio: data.bio,
            },
            process.env.JWT_KEY!,
            { expiresIn: "7d" }
        );

        const res = NextResponse.json({ message: "Giriş başarılı" });

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, 
        });

        return res;
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
};
