'use client'
import usePageStore from '@/store/pagestore';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Link from 'next/link';

interface Server {
  id: string;
  sv_name: string;
  sv_description: string;
  sv_img?: string;
  created_by?: string;
  public?: string;
  created_at?: string;
}

interface Membership {
  id: string;
  user_id: string;
  sv_id: string;
  role: string;
  created_at?: string;
  servers: Server;
}

const page = () => {
  const setPageName = usePageStore((state) => state.setPageName);
  const [servers, setServers] = useState<Membership[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setPageName("Sunucular");
  }, [setPageName]);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const res = await axios.get<any>("/api/servers/getyoursv");
        setServers(res.data.memberships || []);
        console.log(res.data.memberships)
      } catch (error: any) {
        setErrorMessage("Sunucular yüklenirken hata oluştu.");
      }
    };
    fetchServers();
  }, []);

  return (
    <div className="w-full h-fit p-2 md:p-4">
      <p className="font-semibold text-xl">Tüm sunucular</p>
      {
        servers.length === 0 ? (
          <p className="text-gray-500">Henüz bir sunucuya katılmadın</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 mt-2">
            {
              servers.map((s) => (
                <Link href={"/"} key={s.id} className="bg-card rounded-lg flex flex-col items-start justify-start hover:shadow-xl hover:scale-105 transition-all relative overflow-hidden border border-neutral-800/50">
                  <img src={s.servers.sv_img || "https://img.freepik.com/free-vector/game-level-landscape-with-ground-platform_107791-30139.jpg?semt=ais_hybrid&w=740&q=80"} alt="svimg" className='rounded-lg' />
                  <div className='absolute rounded-lg bg-linear-to-r from-transparent to-card transition-all w-2/1 h-full hover:-translate-x-1/2 z-10'/>
                  <div className='absolute w-full h-full rounded-lg bg-linear-to-r from-transparent to-card transition-all flex flex-col items-end p-2'>
                    <p className='font-semibold truncate text-lg lg:text-xl 2xl:text-2xl w-full text-right z-20'>{s.servers.sv_name}</p>
                    <p className='font-semibold wrap-break-word text-md lg:text-lg 2xl:text-xl w-full text-right z-20 opacity-80'>{s.servers.sv_description}</p>
                  </div>
                </Link>
              ))
            }
          </div>
        )
      }
    </div>
  )
}

export default page