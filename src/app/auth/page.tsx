'use client'
import React, { useEffect } from 'react'
import Tab from '@/components/Tab'
import usePageStore from '@/store/pagestore';

const page = () => {
    const setPageName = usePageStore((state) => state.setPageName);

    useEffect(() => {
        setPageName("Giriş yap veya Hesap oluştur");
      }, [setPageName]);
      
    return (
        <div className='w-full h-full flex pt-14 justify-center'>
            <Tab/>
        </div>
    )
}

export default page