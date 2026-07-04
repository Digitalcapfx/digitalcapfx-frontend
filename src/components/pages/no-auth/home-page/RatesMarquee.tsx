'use client'

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface TickerItem {
    pair: string;
    price: string;
    change: string;
    isPositive: boolean;
}

const TICKER_ITEMS: TickerItem[] = [
    { pair: 'USD/XAF', price: '610.50', change: '+0.2%', isPositive: true },
    { pair: 'EUR/USD', price: '1.0850', change: '+0.3%', isPositive: true },
    { pair: 'GBP/USD', price: '1.2710', change: '-0.1%', isPositive: false },
    { pair: 'USD/XOF', price: '598.20', change: '+0.1%', isPositive: true },
    { pair: 'EUR/XAF', price: '655.95', change: '+0.4%', isPositive: true },
    { pair: 'GBP/EUR', price: '1.1715', change: '-0.2%', isPositive: false },
    { pair: 'USD/EUR', price: '0.9220', change: '+0.15%', isPositive: true },
    { pair: 'USDT/XAF', price: '612.10', change: '+0.05%', isPositive: true },
];

const RatesMarquee = () => {
    // Duplicate items to ensure smooth infinite loop
    const doubleItems = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

    return (
        <div className="w-full bg-[#050816] border-y border-white/5 py-4 overflow-hidden relative select-none">
            {/* Fade masks at edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#050816] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#050816] to-transparent z-10 pointer-events-none"></div>

            <div className="flex whitespace-nowrap min-w-full">
                <div className="flex space-x-12 animate-marquee shrink-0 hover:[animation-play-state:paused] cursor-pointer">
                    {doubleItems.map((item, idx) => (
                        <div 
                            key={`${item.pair}-${idx}`} 
                            className="flex items-center space-x-3 text-xs font-semibold"
                        >
                            <span className="text-slate-400 font-mono tracking-wider">{item.pair}</span>
                            <span className="text-white font-mono font-bold">${item.price}</span>
                            <div className={`flex items-center space-x-1 font-mono text-[10px] ${
                                item.isPositive ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                                {item.isPositive ? (
                                    <TrendingUp className="h-3 w-3" />
                                ) : (
                                    <TrendingDown className="h-3 w-3" />
                                )}
                                <span>{item.change}</span>
                            </div>
                            <span className="text-white/10 select-none px-2">|</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Injected custom CSS keyframes for infinite linear scroll */}
            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-marquee {
                    animation: marquee 35s linear infinite;
                }
            `}</style>
        </div>
    )
}

export default RatesMarquee
