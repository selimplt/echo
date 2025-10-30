import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const POST = async (req: Request) => {
    try {
        const { user_name, password } = await req.json();
        if (!user_name || !password) {
            return NextResponse.json({ error: "Kullanıcı adı veya şifre eksik" }, { status: 500 });
        }
        const { error, data } = await supabase.from("users").select("*").eq("user_name", user_name).single();;
        if (!data) {
            return NextResponse.json({ error: "Bötle bir kullanıcı yok" }, { status: 500 });
        }
        if (error) {
            return NextResponse.json({ error: "hata" }, { status: 500 });
        }
        const comp = await bcrypt.compare(password, data.password);
        if (!comp) {
            return NextResponse.json({ error: "Şifre yanlış" }, { status: 401 });
        }
        const token = jwt.sign({ id: data.id, seen_name: data.seen_name, user_name: data.user_name, profile_img: data.profile_img, bio: data.bio }, process.env.JWT_KEY!, { expiresIn: "7d" });
        const response = NextResponse.json({ message: "Giriş başarılı" }, { status: 200 });
        response.cookies.set("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });
        return response;
    } catch (error) {
        return NextResponse.json({ error: "Giriş yapma başarısız" }, { status: 500 });
    }
}