import { create } from "zustand";

interface themeStoreState {
    theme: string,
    setTheme: (theme: string) => void
}

export const useThemeStore = create<themeStoreState>((set) => ({
    theme: localStorage.getItem("talkative-theme") || "light",
    setTheme: (theme) => {
        localStorage.setItem("talkative-theme", theme);
        set({ theme });
    },
}));