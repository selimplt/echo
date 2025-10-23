import { create } from 'zustand';

interface pagestore {
    pagename: string;
    setPageName: (name: string) => void;
}

const usePageStore = create<pagestore>((set) => ({
    pagename: "",
    setPageName: (name) => set({ pagename: name }),
}))

export default usePageStore;