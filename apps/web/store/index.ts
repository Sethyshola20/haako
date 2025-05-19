import { create } from "zustand";

interface Auth {
    authErrorMessaege: string | null;
    authSuccessMessage: string | null;
    setAuthSuccessMessage: (message: string | null) => void;
    setAuthErrorMessage: (message: string | null) => void;
}

export const useAuthStore = create<Auth>((set) => ({
    authErrorMessaege: null,
    authSuccessMessage: null,
    setAuthSuccessMessage: (message) => set({ authSuccessMessage: message }),
    setAuthErrorMessage: (message) => set({ authErrorMessaege: message }),
}));