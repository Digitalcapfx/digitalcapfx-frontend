'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface VirtualCard {
    id: string;
    name: string;
    holder: string;
    number: string;
    spent: number;
    limit: number;
    currency: string;
    status: 'active' | 'frozen';
    type: 'virtual';
    bgGradient: string;
}

interface CardState {
    cards: VirtualCard[];
    isFundOpen: boolean;
    isIssueOpen: boolean;
    activeCardId: string | null;
    addCard: (card: Omit<VirtualCard, 'id' | 'number' | 'spent' | 'status' | 'type' | 'bgGradient'>) => void;
    toggleFreeze: (id: string) => void;
    terminateCard: (id: string) => void;
    fundCard: (id: string, amount: number) => void;
    openFund: (id: string) => void;
    closeFund: () => void;
    openIssue: () => void;
    closeIssue: () => void;
}

const INITIAL_CARDS: VirtualCard[] = [
    { 
        id: '1', 
        name: 'Personal', 
        holder: 'Sarah Okonkwo', 
        number: '4921', 
        spent: 3420, 
        limit: 5000, 
        currency: 'USD', 
        status: 'active', 
        type: 'virtual',
        bgGradient: 'bg-gradient-to-br from-[#1E88E5] to-[#1565C0] border-blue-400/25'
    },
    { 
        id: '2', 
        name: 'Work', 
        holder: 'Remi Adebayo', 
        number: '5512', 
        spent: 2100, 
        limit: 2500, 
        currency: 'NGN', 
        status: 'frozen', 
        type: 'virtual',
        bgGradient: 'bg-gradient-to-br from-[#EF6C00] to-[#E65100] border-orange-400/25'
    }
];

export const useCardStore = create<CardState>()(
    persist(
        (set) => ({
            cards: INITIAL_CARDS,
            isFundOpen: false,
            isIssueOpen: false,
            activeCardId: null,
            addCard: (newCard) => set((state) => {
                const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
                const gradients = [
                    'bg-gradient-to-br from-[#1E88E5] to-[#1565C0] border-blue-400/25',
                    'bg-gradient-to-br from-[#7B1FA2] to-[#4A148C] border-purple-400/25',
                    'bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] border-emerald-400/25',
                    'bg-gradient-to-br from-[#E65100] to-[#C64000] border-orange-400/25'
                ];
                const bgGradient = gradients[state.cards.length % gradients.length];
                
                const card: VirtualCard = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: newCard.name,
                    holder: newCard.holder,
                    number: randomSuffix,
                    spent: 0,
                    limit: newCard.limit,
                    currency: newCard.currency,
                    status: 'active',
                    type: 'virtual',
                    bgGradient
                };
                return { cards: [...state.cards, card], isIssueOpen: false };
            }),
            toggleFreeze: (id) => set((state) => ({
                cards: state.cards.map((c) => 
                    c.id === id ? { ...c, status: c.status === 'active' ? 'frozen' : 'active' } : c
                )
            })),
            terminateCard: (id) => set((state) => ({
                cards: state.cards.filter((c) => c.id !== id)
            })),
            fundCard: (id, amount) => set((state) => ({
                cards: state.cards.map((c) => 
                    c.id === id ? { ...c, spent: c.spent + amount } : c
                )
            })),
            openFund: (id) => set({ isFundOpen: true, activeCardId: id }),
            closeFund: () => set({ isFundOpen: false, activeCardId: null }),
            openIssue: () => set({ isIssueOpen: true }),
            closeIssue: () => set({ isIssueOpen: false }),
        }),
        {
            name: 'cards-storage',
        }
    )
)
