import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";

export const POST = async (req: Request) => {
    try {
        const { name, user_name, password } = await req.json();
        const hashed = await bcrypt.hash(password, 10);
        const { error } = await supabase.from("users").insert([{ "seen_name": name, "user_name": user_name, "password": hashed }]);
        if (error) {
            return NextResponse.json({ error: "server hatası" }, { status: 404 });
        }
        return NextResponse.json({ message: "hesap başarıyla oluşturuldu" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Hesap oluşturma başarısız" }, { status: 500 });
    }
}