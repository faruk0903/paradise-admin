import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "../types";

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            Isdark: false,
            user: null,
            token: null,
            accessToken: null,
            data: null,
            setUser: (user) => set(() => ({ user: user })),
            setData: (data) => set(() => ({ data: data })),
            setIsdark: (Isdark) => set(() => ({ Isdark: Isdark })),
            setToken: (token) => set(() => ({ token: token })),
            setAccessToken: (accessToken) => set(() => ({ accessToken: accessToken })),
            removeAll: () => set(() => ({ token: null, user: null, accessToken: null, data: null })),
        }),
        {
            name: "auth",
            getStorage: () => {
                let rememberMe = localStorage.getItem("rememberMe");
                if (rememberMe !== null) {
                    rememberMe = JSON.parse(rememberMe);
                }
                if (typeof rememberMe === "boolean" && !rememberMe) {
                    return sessionStorage;
                }
                return localStorage;
            },
        }
    )
);
