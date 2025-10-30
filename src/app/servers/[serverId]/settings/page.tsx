'use client'
import React, { useEffect, useState } from 'react'
import { FaServer, FaImage, FaHashtag, FaTrash, FaPlus, FaSave } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

const ServerSettingsPage = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { serverId } = useParams();
  const router = useRouter();

  const [serverName, setServerName] = useState<string>("");
  const [serverDescription, setServerDescription] = useState<string>("");
  const [serverImage, setServerImage] = useState<string | null>(null);
  const [newRoom, SetNewRoom] = useState<string>("");
  const [rooms, SetRooms] = useState<any[]>([]);

  const addroom = async () => {
    try {
      const res = await axios.post<any>("/api/servers/addroom", { serverId, newRoom });
      toast("oda başarıyla oluşturuldu")
    } catch (error: any) {
      toast("bir sorun meydana geldi", {
        description: `hata : ${error}`,
      })
    }
  }

  const delroom = async (id: string) => {
    try {
      const res = axios.post<any>("/api/servers/delroom", { id });
      toast("oda başarıyla silindi", {
        description: `${id}: numaralı oda silindi`,
      })
    } catch (error: any) {
      toast("bir sorun meydana geldi", {
        description: `hata : ${error}`,
      })
    }
  }

  const updatesv = async () => {
    try {
      const res = axios.post<any>("/api/servers/updatesv", { serverName, serverDescription, serverId });
      toast("güncelleme başarılı")
    } catch (error: any) {
      toast("bir sorun meydana geldi", {
        description: `hata : ${error}`,
      })
    }
  }

  useEffect(() => {
    if (!serverId) return;
    const getrooms = async () => {
      try {
        const res = await axios.post<any>("/api/servers/svrooms", { serverId });
        SetRooms(res.data.rooms);
      } catch (error: any) {
        setErrorMessage("Sunucular yüklenirken hata oluştu.");
      }
    }
    getrooms();
  }, [])

  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-6 custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="font-bold text-2xl md:text-3xl mb-2">Sunucu Ayarları</h1>
          <p className="text-sm text-gray-500">Sunucunuzu özelleştirin ve yönetin</p>
        </div>
        <div className="bg-card rounded-xl p-6 mb-6 border border-gray-200 dark:border-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
              <FaServer className="text-background" />
            </div>
            <h2 className="font-bold text-xl">Genel Ayarlar</h2>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Sunucu Görseli</label>
            <div className="flex items-start gap-4">
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-neutral-600">
                <img alt="Server" className="w-full h-full object-cover" />
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
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-600 dark:hover:bg-neutral-700 rounded-lg cursor-pointer transition-all font-medium text-sm"
                >
                  Görsel Yükle
                </label>
              </div>
            </div>
          </div>
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
          <Button
            className="w-full md:w-auto px-6 py-3 bg-foreground text-background rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
            onClick={updatesv}
          >
            <FaSave />
            Değişiklikleri Kaydet
          </Button>
        </div>
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
            <Dialog open={open} onOpenChange={setOpen}>
              <form>
                <DialogTrigger
                  className="px-4 py-2 bg-foreground text-background rounded-lg font-medium text-sm flex items-center gap-2 transition-all"
                >
                  <FaPlus className="text-xs" />
                  Oda Ekle
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Oda oluştur</DialogTitle>
                  </DialogHeader>
                  <Input placeholder='Oda ismi' value={newRoom} onChange={(e) => SetNewRoom(e.target.value)} />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button className='cursor-pointer'>İptal et</Button>
                    </DialogClose>
                    <Button className='cursor-pointer' onClick={addroom}>Oluştur</Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
          <div className="space-y-2">
            {!rooms ? (
              <div className="text-center py-8">
                <FaHashtag className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Henüz oda yok</p>
                <p className="text-gray-400 text-sm">Yeni bir oda oluşturarak başlayın</p>
              </div>
            ) : (
              rooms.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-4 bg-background dark:border-0 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg border border-gray-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <FaHashtag className="text-gray-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-400">{channel.name}</span>
                  </div>
                  <button
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg font-medium text-sm flex items-center gap-2 transition-all opacity-0 group-hover:opacity-100"
                    onClick={() => delroom(channel.id)}
                  >
                    <FaTrash className="text-xs" />
                    Sil
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
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