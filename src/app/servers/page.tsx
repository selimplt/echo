'use client'
import usePageStore from '@/store/pagestore';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Link from 'next/link';
import { FaServer, FaUsers, FaCrown } from 'react-icons/fa';

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
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    fetchServers();
  }, []);

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
            <h1 className="font-bold text-2xl md:text-3xl mb-1">Sunucularım</h1>
            <p className="text-sm text-gray-500">
              {servers.length > 0
                ? `${servers.length} sunucuya üyesin`
                : 'Henüz bir sunucuya katılmadın'}
            </p>
          </div>
          <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-sm">
            <FaServer className="text-xl text-foreground" />
          </div>
        </div>
        {servers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mb-4 shadow-sm">
              <FaServer className="text-4xl text-gray-400" />
            </div>
            <p className="text-gray-500 text-center text-lg mb-2">Henüz bir sunucuya katılmadın</p>
            <p className="text-gray-400 text-center text-sm max-w-md">
              Yeni sunuculara katılarak topluluklarla bağlantı kurabilirsin
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {servers.map((s) => (
              <Link
                href={`/server/${s.servers.id}`}
                key={s.id}
                className="group relative bg-card rounded-xl overflow-hidden border border-transparent hover:border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={s.servers.sv_img || "https://img.freepik.com/free-vector/game-level-landscape-with-ground-platform_107791-30139.jpg?semt=ais_hybrid&w=740&q=80"}
                    alt={s.servers.sv_name}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
                  {s.role === 'admin' && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500/90 backdrop-blur-sm rounded-full flex items-center gap-1.5">
                      <FaCrown className="text-white text-xs" />
                      <span className="text-white text-xs font-semibold">Admin</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 truncate group-hover:text-foreground transition-colors">
                    {s.servers.sv_name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-3">
                    {s.servers.sv_description || 'Açıklama bulunmuyor'}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <FaUsers className="text-sm" />
                      <span>Üye</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Aktif</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default page