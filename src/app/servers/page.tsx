'use client'
import usePageStore from '@/store/pagestore';
import React, { useEffect, useState } from 'react'
import axios from 'axios';

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
    <div>page</div>
  )
}

export default page