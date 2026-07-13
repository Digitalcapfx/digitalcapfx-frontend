'use client'

import { create } from 'zustand'

interface TransactionState {
    isSendOpen: boolean;
    isReceiveOpen: boolean;
    isInstantOpen: boolean;
    sendDefaultWalletId: string | null;
    receiveDefaultWalletId: string | null;
    openSend: (defaultWalletId?: string | null) => void;
    closeSend: () => void;
    openReceive: (defaultWalletId?: string | null) => void;
    closeReceive: () => void;
    openInstant: () => void;
    closeInstant: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
    isSendOpen: false,
    isReceiveOpen: false,
    isInstantOpen: false,
    sendDefaultWalletId: null,
    receiveDefaultWalletId: null,
    openSend: (defaultWalletId = null) => set({ isSendOpen: true, sendDefaultWalletId: defaultWalletId }),
    closeSend: () => set({ isSendOpen: false, sendDefaultWalletId: null }),
    openReceive: (defaultWalletId = null) => set({ isReceiveOpen: true, receiveDefaultWalletId: defaultWalletId }),
    closeReceive: () => set({ isReceiveOpen: false, receiveDefaultWalletId: null }),
    openInstant: () => set({ isInstantOpen: true }),
    closeInstant: () => set({ isInstantOpen: false }),
}))
