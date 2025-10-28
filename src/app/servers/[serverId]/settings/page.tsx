'use client'
import React, { useState } from 'react'
import { FaServer, FaImage, FaHashtag, FaTrash, FaPlus, FaSave } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const ServerSettingsPage = () => {
  const [serverName, setServerName] = useState('Oyun Topluluğu')
  const [serverDescription, setServerDescription] = useState('Oyun severler için harika bir topluluk')
  const [serverImage, setServerImage] = useState('https://via.placeholder.com/400x200')
  const [newChannelName, setNewChannelName] = useState('')
  const [showAddChannel, setShowAddChannel] = useState(false)

  // Örnek veri - API'den gelecek
  const [channels, setChannels] = useState([
    { id: '1', name: 'genel', type: 'text' },
    { id: '2', name: 'duyurular', type: 'text' },
    { id: '3', name: 'sohbet', type: 'text' }
  ])

  const handleUpdateServer = () => {
    // API'ye istek atılacak
    console.log('Sunucu güncelleniyor...', { serverName, serverDescription, serverImage })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setServerImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return
    // API'ye istek atılacak
    console.log('Oda oluşturuluyor:', newChannelName)
    setChannels([...channels, { id: Date.now().toString(), name: newChannelName, type: 'text' }])
    setNewChannelName('')
    setShowAddChannel(false)
  }

  const handleDeleteChannel = (channelId: string) => {
    // API'ye istek atılacak
    console.log('Oda siliniyor:', channelId)
    setChannels(channels.filter(ch => ch.id !== channelId))
  }

  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-6 custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-bold text-2xl md:text-3xl mb-2">Sunucu Ayarları</h1>
          <p className="text-sm text-gray-500">Sunucunuzu özelleştirin ve yönetin</p>
        </div>

        {/* Server Info Section */}
        <div className="bg-card rounded-xl p-6 mb-6 border border-gray-200 dark:border-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
              <FaServer className="text-background" />
            </div>
            <h2 className="font-bold text-xl">Genel Ayarlar</h2>
          </div>

          {/* Server Image */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Sunucu Görseli</label>
            <div className="flex items-start gap-4">
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-neutral-600">
                <img src={serverImage} alt="Server" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <FaImage className="text-white text-2xl" />
                  </label>
                </div>
              </div>
              <div className="flex-1">
                <Input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-600 dark:hover:bg-neutral-700 rounded-lg cursor-pointer transition-all font-medium text-sm"
                >
                  Görsel Yükle
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  En az 512x512 piksel boyutunda bir görsel yükleyin
                </p>
              </div>
            </div>
          </div>

          {/* Server Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sunucu Adı</label>
            <Input
              type="text"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-0 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
              placeholder="Sunucu adını girin"
            />
          </div>

          {/* Server Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sunucu Açıklaması</label>
            <Textarea
              value={serverDescription}
              onChange={(e) => setServerDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border dark:border-0 border-gray-200 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all resize-none"
              placeholder="Sunucu açıklamasını girin"
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleUpdateServer}
            className="w-full md:w-auto px-6 py-3 bg-foreground text-background rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <FaSave />
            Değişiklikleri Kaydet
          </Button>
        </div>

        {/* Channels Section */}
        <div className="bg-card rounded-xl p-6 border border-gray-200 dark:border-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
                <FaHashtag className="text-background" />
              </div>
              <div>
                <h2 className="font-bold text-xl">Odalar</h2>
                <p className="text-sm text-gray-500">Metin kanallarını yönetin</p>
              </div>
            </div>
            <Button
              onClick={() => setShowAddChannel(true)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-all"
            >
              <FaPlus className="text-xs" />
              Oda Ekle
            </Button>
          </div>

          {/* Add Channel Form */}
          {showAddChannel && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 dark:border-0">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Yeni Oda Adı</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateChannel()}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                  placeholder="oda-adı"
                  autoFocus
                />
                <button
                  onClick={handleCreateChannel}
                  className="px-4 py-2 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-all"
                >
                  Oluştur
                </button>
                <button
                  onClick={() => {
                    setShowAddChannel(false)
                    setNewChannelName('')
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all"
                >
                  İptal
                </button>
              </div>
            </div>
          )}

          {/* Channels List */}
          <div className="space-y-2">
            {channels.length === 0 ? (
              <div className="text-center py-8">
                <FaHashtag className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Henüz oda yok</p>
                <p className="text-gray-400 text-sm">Yeni bir oda oluşturarak başlayın</p>
              </div>
            ) : (
              channels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-4 bg-background dark:border-0 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg border border-gray-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <FaHashtag className="text-gray-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-400">{channel.name}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteChannel(channel.id)}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg font-medium text-sm flex items-center gap-2 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <FaTrash className="text-xs" />
                    Sil
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-100 rounded-xl p-6 mt-6 border border-red-200">
          <h2 className="font-bold text-xl text-red-600 mb-2">Tehlikeli Bölge</h2>
          <p className="text-sm text-red-600 mb-4">Bu işlemler geri alınamaz!</p>
          <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all">
            Sunucuyu Sil
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServerSettingsPage