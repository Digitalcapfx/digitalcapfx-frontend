'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { CardDetails } from '@/components/pages/auth/cards/CardDetails'
import { useCardStore } from '@/store/cardStore'

interface CardDetailsPageClientProps {
    id: string;
}

export default function CardDetailsPageClient({ id }: CardDetailsPageClientProps) {
    const router = useRouter();
    const { cards } = useCardStore();
    
    // Find the card by matching ID
    const card = cards.find((c) => c.id === id);

    if (!card) {
        return (
            <div className="text-center py-16 min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <h3 className="text-lg font-bold text-white font-satoshi">Card not found</h3>
                <p className="text-xs text-slate-500 font-sans">The virtual card credentials could not be loaded.</p>
                <button 
                    onClick={() => router.push('/dashboard/cards')}
                    className="text-xs font-bold text-primary-400 hover:text-primary-350 hover:underline bg-[#0C1224] border border-white/5 px-4 py-2 rounded-xl cursor-pointer"
                >
                    Back to Cards
                </button>
            </div>
        );
    }

    return (
        <CardDetails 
            card={card} 
            onBack={() => router.push('/dashboard/cards')} 
        />
    );
}
