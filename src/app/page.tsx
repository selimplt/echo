'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import axios from "axios";
import { boolean } from "zod";

export default function Home() {
  const [loading, SetLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [followers, setFollowers] = useState<any[]>([]);
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
    const getfriends = async () => {
      try {
        const res = await axios.get<any>("/api/friends/getfriends")
        setFollowers(res.data.followers || []);
      } catch (error: any) {
        setErrorMessage(error);
      }
    }
    cntrl();
    getfriends();
  }, [])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-linear-to-r from-background via-background to-foreground flex items-center justify-center animate-spin">
          <div className="w-13 h-13 rounded-full bg-background" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-fit p-2 md:p-4">
      <p className="font-semibold text-xl">Tüm arkadaşlar</p>
      {followers.length === 0 ? (
        <p className="text-gray-500">Henüz arkadaşın yok 😢</p>
      ) : (
        <div className="flex flex-col gap-2">
          {followers.map((f) => (
            <div key={f.id} className="p-2 bg-white rounded-md shadow-sm border">
              <p className="font-medium">{f.name}</p>
              <p className="text-sm text-gray-500">{f.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
