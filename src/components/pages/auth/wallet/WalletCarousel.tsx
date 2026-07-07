'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { useNavigationStore } from '@/store/navigationStore'

const CURRENCY_CARDS = [
    {
        currency: 'USD',
        cardNum: '4921',
        amount: '$42,600.00',
        bg: 'bg-gradient-to-br from-[#1E88E5] to-[#1565C0] border-blue-400/20',
    },
    {
        currency: 'EUR',
        cardNum: '8833',
        amount: '€18,320.00',
        bg: 'bg-gradient-to-br from-[#7B1FA2] to-[#4A148C] border-purple-400/20',
    },
    {
        currency: 'GBP',
        cardNum: '2271',
        amount: '£7,550.00',
        bg: 'bg-gradient-to-br from-[#1565C0] to-[#0D47A1] border-indigo-400/20',
    },
    {
        currency: 'NGN',
        cardNum: '5512',
        amount: '₦120,400,000',
        bg: 'bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] border-emerald-400/20',
    },
    {
        currency: 'XOF',
        cardNum: '7743',
        amount: 'CFA8,200,000',
        bg: 'bg-gradient-to-br from-[#EF6C00] to-[#E65100] border-orange-400/20',
    },
];

const WalletCarousel: React.FC = () => {
    const router = useRouter();
    const setBackPath = useNavigationStore((state) => state.setBackPath);

    return (
        <div className="space-y-3 text-left">
            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block select-none">
                My Wallets
            </span>
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-none select-none">
                {CURRENCY_CARDS.map((card) => (
                    <div 
                        key={card.currency}
                        onClick={() => {
                            setBackPath('/dashboard');
                            router.push(`/wallets/${card.currency.toLowerCase()}`);
                        }}
                        className={cn(
                            "w-[200px] h-[130px] rounded-2xl p-5 border flex flex-col justify-between shrink-0 hover:scale-[1.02] transition duration-200 cursor-pointer shadow-lg group",
                            card.bg
                        )}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-2">
                                <CurrencyIcon code={card.currency} size="sm" className="border-none shadow-none bg-white/10" />
                                <span className="text-sm font-bold tracking-wider text-white group-hover:text-white/95">{card.currency}</span>
                            </div>
                            <span className="text-[10px] opacity-60 font-mono text-white pt-1">**** {card.cardNum}</span>
                        </div>
                        <div className="text-xl font-extrabold font-satoshi text-white tracking-tight">
                            {card.amount}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WalletCarousel;
