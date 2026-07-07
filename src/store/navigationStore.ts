'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NavigationState {
    backPath: string;
    setBackPath: (path: string) => void;
}

export const useNavigationStore = create<NavigationState>()(
    persist(
        (set) => ({
            backPath: '/dashboard/wallets', // default fallback routing path
            setBackPath: (path: string) => set({ backPath: path }),
        }),
        {
            name: 'wallet-navigation-storage', // key name in localStorage
        }
    )
)
