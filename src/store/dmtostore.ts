import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

interface User_dm {
    id: string;
    seen_name: string;
    user_name: string;
    bio?: string;
    last_seen?: any;
    profile_img?: string;
    created_at?: any;
}

interface DmStore {
    User_dm: User_dm | null;
    fetchUser: (id: string) => Promise<void>;
}

export const useGetDmStore = create<DmStore>((set, get) => ({
    User_dm: null,
    fetchUser: async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('id, seen_name, user_name, bio, last_seen, profile_img, created_at')
                .eq('id', id)
                .single();

            if (error) throw error;

            if (data) {
                set({ User_dm: data });
            }
        } catch (err) {
            console.error("Kullanıcı bilgisi çekme hatası:", err);
        }
    }
}));
