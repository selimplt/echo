import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const GET = async () => {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;

        if (!token) {
            return NextResponse.json({ valid: false, error: "Token bulunamadı" }, { status: 401 });
        }

        const secret = process.env.JWT_KEY!;
        const decoded = jwt.verify(token, secret);

        return NextResponse.json({ valid: true, decoded }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { valid: false, error: "Token geçersiz veya süresi dolmuş" },
            { status: 401 }
        );
    }
};
