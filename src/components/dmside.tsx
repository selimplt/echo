'use client'
import React, { useEffect } from 'react'
import { FaUser, FaClock, FaInfoCircle, FaBan, FaUserMinus } from 'react-icons/fa'
import { useGetDmStore } from '@/store/dmtostore'

const Dmside = () => {
  const { User_dm } = useGetDmStore();

  const formatLastSeen = (lastSeen: any) => {
    if (!lastSeen) return 'Bilinmiyor';
    const date = new Date(lastSeen);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Şimdi aktif';
    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    return `${days} gün önce`;
  };

  const formatJoinDate = (date: any) => {
    if (!date) return 'Bilinmiyor';
    const joinDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return joinDate.toLocaleDateString('tr-TR', options);
  };

  if (!User_dm) {
    return (
      <div className='w-72 h-full flex flex-col gap-4 p-4 bg-card/30'>
        <div className="flex items-center justify-center h-full">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-foreground animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-72 h-full flex flex-col gap-4 p-4 bg-card/30 overflow-y-auto custom-scrollbar'>
      <div className='w-full flex flex-col items-center gap-3 pb-4 border-b border-gray-200'>
        <div className='relative'>
          <div className='w-24 h-24 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white shadow-lg'>
            {User_dm.profile_img ? (
              <img src={User_dm.profile_img} alt="profil" className='w-full h-full object-cover' />
            ) : (
              <FaUser className='text-gray-400 text-3xl' />
            )}
          </div>
          <div className='absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-background'></div>
        </div>
        <div className='text-center'>
          <h2 className='font-bold text-xl mb-1'>{User_dm.user_name}</h2>
          {User_dm.seen_name && (
            <p className='text-sm text-gray-500'>@{User_dm.seen_name}</p>
          )}
        </div>
      </div>
      {User_dm.bio && (
        <section className='w-full flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <FaInfoCircle className='text-gray-400 text-sm' />
            <h3 className='font-semibold text-sm text-gray-700'>Hakkında</h3>
          </div>
          <div className='bg-background rounded-xl p-3'>
            <p className='text-sm text-gray-600 leading-relaxed wrap-break-word'>
              {User_dm.bio}
            </p>
          </div>
        </section>
      )}
      <section className='w-full flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <FaClock className='text-gray-400 text-sm' />
          <h3 className='font-semibold text-sm text-gray-700'>Son Görülme</h3>
        </div>
        <div className='bg-background rounded-xl p-3'>
          <p className='text-sm text-gray-600'>
            {formatLastSeen(User_dm.last_seen)}
          </p>
        </div>
      </section>
      <section className='w-full flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <FaUser className='text-gray-400 text-sm' />
          <h3 className='font-semibold text-sm text-gray-700'>Üyelik</h3>
        </div>
        <div className='bg-background rounded-xl p-3'>
          <p className='text-sm text-gray-600'>
            {formatJoinDate(User_dm.created_at)} tarihinden beri üye
          </p>
        </div>
      </section>
      <section className='w-full flex flex-col gap-2'>
        <h3 className='font-semibold text-sm text-gray-700'>İşlemler</h3>
        <div className='flex flex-col gap-2'>
          <button className='w-full bg-background hover:bg-gray-50 rounded-xl p-3 flex items-center gap-3 transition-all border border-transparent hover:border-gray-200'>
            <div className='w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center'>
              <FaBan className='text-red-600 text-sm' />
            </div>
            <div className='flex-1 text-left'>
              <p className='font-semibold text-sm'>Arkadaşı Engelle</p>
              <p className='text-xs text-gray-400'>Mesaj gönderemez</p>
            </div>
          </button>
          <button className='w-full bg-background hover:bg-gray-50 rounded-xl p-3 flex items-center gap-3 transition-all border border-transparent hover:border-gray-200'>
            <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
              <FaUserMinus className='text-orange-600 text-sm' />
            </div>
            <div className='flex-1 text-left'>
              <p className='font-semibold text-sm'>Arkadaşı Çıkar</p>
              <p className='text-xs text-gray-400'>Arkadaşlığı sonlandır</p>
            </div>
          </button>
        </div>
      </section>
    </div>
  )
}

export default Dmside