import { create } from 'zustand';
import axios from 'axios';

interface UserPayload {
    id: string;
    seen_name: string;
    user_name: string;
    profile_img: string;
    bio: string;
}

interface AuthStore {
    user: UserPayload | null;
    isLoading: boolean;
    error: string | null;

    fetchUser: () => Promise<void>;
    logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    fetchUser: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.get('/api/auth/control', {});

            const data: any = response.data;

            if (response.status === 200 && data.valid) {
                set({
                    user: data.decoded as UserPayload,
                    isLoading: false,
                });
            } else {
                set({
                    user: null,
                    isLoading: false,
                    error: data.error || 'Token doğrulanamadı.'
                });
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Sunucuya erişilemedi.';
            set({
                user: null,
                isLoading: false,
                error: errorMessage
            });
        }
    },

    logout: () => {
        set({ user: null, error: null, isLoading: false });
    }
}));

export default useAuthStore;