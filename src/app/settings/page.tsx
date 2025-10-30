'use client'
import React, { useState, useEffect } from 'react'
import { FaUser, FaImage, FaSave, FaTrash } from 'react-icons/fa'
import useAuthStore from '@/store/userstor'
import usePageStore from '@/store/pagestore'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const SettingsPage = () => {
  const { user, fetchUser } = useAuthStore()
  const setPageName = usePageStore((state) => state.setPageName)
  
  const [userName, setUserName] = useState('')
  const [seenName, setSeenName] = useState('')
  const [bio, setBio] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setPageName('Ayarlar')
  }, [setPageName])

  useEffect(() => {
    if (user) {
      setUserName(user.user_name || '')
      setSeenName(user.seen_name || '')
      setBio(user.bio || '')
      setProfileImage(user.profile_img || '')
    }
  }, [user])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => setProfileImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => setProfileImage('')

  useEffect(() =>{
    console.log(seenName)
  }, [seenName])

  const handleUpdateProfile = async () => {
    if (!userName.trim() || !seenName.trim()) {
      alert('Kullanıcı adı ve görünen ad boş olamaz')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post<any>('/api/auth/update', {
        id: user?.id,
        userName,
        seenName,
        bio,
        profileImage,
      })

      if (res.data.success) {
        alert('Profil başarıyla güncellendi!')
        await fetchUser() // local store’u güncelle
      } else {
        alert('Profil güncellenemedi!')
      }
    } catch (err) {
      console.error('Profil güncellenemedi:', err)
      alert('Profil güncellenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-6 custom-scrollbar">
      <div className="max-w-3xl mx-auto">

        <div className="mb-6">
          <h1 className="font-bold text-2xl md:text-3xl mb-2">Profil Ayarları</h1>
          <p className="text-sm text-gray-500">Profilini özelleştir ve yönet</p>
        </div>

        {/* PROFIL FOTOĞRAFI */}
        <div className="bg-card rounded-xl p-6 mb-6 border border-gray-200 dark:border-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
              <FaImage className="text-background" />
            </div>
            <h2 className="font-bold text-xl">Profil Fotoğrafı</h2>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-linear-to-br from-gray-100 to-gray-200">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUser className="text-gray-400 text-4xl" />
                  </div>
                )}
              </div>
              {profileImage && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all shadow-lg"
                  title="Fotoğrafı kaldır"
                >
                  <FaTrash className="text-xs" />
                </button>
              )}
            </div>

            <div className="flex-1">
              <Input
                type="file"
                id="profile-image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="profile-image-upload"
                className="inline-block px-6 py-3 bg-foreground text-background hover:opacity-90 rounded-lg cursor-pointer transition-all font-medium"
              >
                Fotoğraf Yükle
              </label>
              <p className="text-xs text-gray-500 mt-3">
                JPG, PNG veya GIF. Maksimum 5MB.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Önerilen boyut: 400x400 piksel
              </p>
            </div>
          </div>
        </div>

        {/* PROFIL BILGILERI */}
        <div className="bg-card rounded-xl p-6 mb-6 border border-gray-200 dark:border-0">
          <h2 className="font-bold text-xl mb-6 flex items-center gap-3">
            <FaUser className="text-foreground" /> Profil Bilgileri
          </h2>

          <label className="block text-sm font-semibold text-gray-700 mb-2">Kullanıcı Adı</label>
          <Input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="kullaniciadi"
            maxLength={30}
          />

          <label className="block text-sm font-semibold text-gray-700 mb-2 mt-6">Görünen Ad</label>
          <Input
            value={seenName}
            onChange={(e) => setSeenName(e.target.value)}
            placeholder="Görünen adınız"
            maxLength={50}
          />

          <label className="block text-sm font-semibold text-gray-700 mb-2 mt-6">Biyografi</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Kendiniz hakkında kısa bir açıklama..."
            maxLength={200}
          />

          <button
            onClick={handleUpdateProfile}
            disabled={loading}
            className="mt-6 w-full md:w-auto px-8 py-3 bg-foreground text-background rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                Kaydediliyor...
              </>
            ) : (
              <>
                <FaSave />
                Değişiklikleri Kaydet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
