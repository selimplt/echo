'use client'
import usePageStore from '@/store/pagestore';
import React, { useEffect } from 'react'

const page = () => {
  const setPageName = usePageStore((state) => state.setPageName);

  useEffect(() => {
    setPageName("Sunucular");
  }, [setPageName]);

  return (
    <div>page</div>
  )
}

export default page