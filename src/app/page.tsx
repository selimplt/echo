'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import axios from "axios";
import Link from "next/link";
import { FaUser, FaUserFriends } from "react-icons/fa";
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

  const acceptedFollowers = followers.filter(f => f.status === 'accepted');

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-foreground animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-2xl md:text-3xl mb-1">Arkadaşlarım</h1>
            <p className="text-sm text-gray-500">
              {acceptedFollowers.length > 0 
                ? `${acceptedFollowers.length} arkadaşın var` 
                : 'Henüz arkadaşın yok'}
            </p>
          </div>
          <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-sm">
            <FaUserFriends className="text-xl text-foreground" />
          </div>
        </div>

        {acceptedFollowers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mb-4 shadow-sm">
              <FaUserFriends className="text-4xl text-gray-400" />
            </div>
            <p className="text-gray-500 text-center text-lg mb-2">Henüz arkadaşın yok</p>
            <p className="text-gray-400 text-center text-sm max-w-md">
              Yeni arkadaşlar ekleyerek sohbete başlayabilirsin
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {acceptedFollowers.map((f) => (
              <Link 
                href={`/dm/${f.users.id}`} 
                key={f.id} 
                className="group p-4 bg-card rounded-xl border border-transparent hover:border-gray-200 dark:border-0 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div className='w-14 h-14 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm'>
                      {f.users.profile_img ? (
                        <img 
                          src={f.users.profile_img} 
                          alt="profil fotosu" 
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <FaUser className='text-gray-400 text-xl' />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base truncate mb-1 group-hover:text-foreground transition-colors">
                      {f.users.seen_name}
                    </p>
                    {f.users.bio && (
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {f.users.bio}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}