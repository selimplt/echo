import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const POST = async (req: Request) => {
  try {
    const { id, userName, seenName, bio, profileImage } = await req.json();

    if (!id || !userName || !seenName) {
      return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
    }

    console.log(id)

    const { data, error } = await supabase
      .from("users")
      .update({
        user_name: userName,
        seen_name: seenName,
        bio: bio || "",
        profile_img: profileImage || "",
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: data[0] }, { status: 200 });
  } catch (err) {
    console.error("Sunucu hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
};
