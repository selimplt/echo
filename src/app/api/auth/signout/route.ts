import { NextResponse } from "next/server";

export const POST = async () => {
    try {
        const response = NextResponse.json({ message: "Çıkış başarılı" }, { status: 200 });
        response.cookies.set("token", "", {
            httpOnly: true,
            maxAge: 0,
            path: "/",
        });
        return response;
    } catch (error) {
        return NextResponse.json({ error: "Çıkış işlemi başarısız" }, { status: 500 });
    }
};