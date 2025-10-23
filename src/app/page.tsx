'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import axios from "axios";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import usePageStore from "@/store/pagestore";

export default function Home() {
  const [loading, SetLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setPageName = usePageStore((state) => state.setPageName);
  const [followers, setFollowers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    setPageName("Ana Sayfa");
  }, [setPageName]);

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
        <p className="text-gray-500">Henüz arkadaşın yok</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
          {followers.map((f) => (
            f.status == 'accepted' ? (
              <Link href={"/"} key={f.id} className="p-2 bg-card rounded-lg flex flex-col">
                <div className="w-full h-fit flex items-center gap-2">
                  <div className='w-12 h-12 bg-foreground rounded-full flex items-center justify-center'>
                    {
                      f.users.profile_img ? (
                        <img src={f.users.profile_img} alt="profil fotosu" className='rounded-full' />
                      ) : (
                        <FaUser className='text-background text-2xl' />
                      )
                    }
                  </div>
                  <p className="font-semibold truncate">{f.users.user_name}</p>
                </div>
                <p className="text-sm text-gray-500 truncate ml-14">{f.users.bio}</p>
              </Link>
            ) : null
          ))}
        </div>
      )}
    </div>
  );
}
