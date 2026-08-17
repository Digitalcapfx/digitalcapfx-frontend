'use client'

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'

export interface LiveRateItem {
    pair: string;
    rate: string;
    change: number;
}

interface LiveRatesCardProps {
    rates?: LiveRateItem[];
}

export const LiveRatesCard: React.FC<LiveRatesCardProps> = ({ rates }) => {
    const { t } = useLanguageStore();

    const displayRates = rates && rates.length > 0 ? rates : [
        { pair: 'USDT/USDC', rate: '1.0000', change: 0.00 },
        { pair: 'EUR/USD', rate: '1.0825', change: 0.42 },
        { pair: 'GBP/USD', rate: '1.2710', change: 0.12 },
        { pair: 'GBP/EUR', rate: '1.1636', change: 0.31 },
    ];

    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl space-y-4 text-left">
            <div className="flex justify-between items-center select-none pb-1 border-b border-white/[0.03]">
                <h3 className="font-satoshi font-bold text-sm text-white">{t('live.rates')}</h3>
                <span className="text-[10px] font-bold text-emerald-400 font-mono flex items-center space-x-1 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                    <span>{t('exchange.live')}</span>
                </span>
            </div>
            <div className="space-y-3.5">
                {displayRates.map((rate) => (
                    <div key={rate.pair} className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-355">{rate.pair}</span>
                        <div className="text-right flex items-center space-x-2 font-mono">
                            <span className="font-bold text-white">{rate.rate}</span>
                            <span className={cn(
                                "text-[10px] font-bold flex items-center space-x-0.5",
                                rate.change >= 0 ? "text-emerald-400" : "text-rose-455"
                            )}>
                                {rate.change > 0 ? <TrendingUp className="h-3 w-3" /> : rate.change < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                                <span>{rate.change > 0 ? '+' : ''}{rate.change}%</span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveRatesCard;
