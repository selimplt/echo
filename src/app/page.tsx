'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import axios from "axios";
import { boolean } from "zod";

export default function Home() {
  const [loading, SetLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const cntrl = async () => {
      try {
        const { data }: any = await axios.get("/api/auth/control");
        SetLoading(false);
        return data.valid;
      } catch {
        router.push("/auth");
        return false;
      }
    }
    cntrl();
  }, [])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-linear-to-r from-background via-background to-foreground flex items-center justify-center animate-spin">
          <div className="w-13 h-13 rounded-full bg-background"/>
        </div>
      </div>
    );
  }

  return (
    <div>

    </div>
  );
}
