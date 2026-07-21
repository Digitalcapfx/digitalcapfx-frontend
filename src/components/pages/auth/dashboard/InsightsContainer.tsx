'use client'

import React, { useState } from 'react'
import CashflowStats from './CashflowStats'
import InsightsAllocation from './InsightsAllocation'
import { cn } from '@/lib/utils'
import { Calendar } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

const InsightsContainer: React.FC = () => {
    const { t } = useLanguageStore();
    const [period, setPeriod] = useState<'1w' | '1m' | '3m' | '6m'>('1m');

    const periods: { id: '1w' | '1m' | '3m' | '6m'; label: string }[] = [
        { id: '1w', label: '1W' },
        { id: '1m', label: '1M' },
        { id: '3m', label: '3M' },
        { id: '6m', label: '6M' },
    ];

    return (
        <div className="space-y-4">
            {/* Unified Filter Header Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 select-none pb-2 border-b border-white/5">
                <div className="flex items-center space-x-2">
                    <Calendar className="h-4.5 w-4.5 text-primary-400 animate-pulse" />
                    <div>
                        <h3 className="font-satoshi font-black text-md text-white tracking-wide">{t('dashboard.insights.title')}</h3>
                        <span className="text-[10px] text-slate-500 font-semibold block">{t('dashboard.insights.subtitle')}</span>
                    </div>
                </div>
                
                <div className="flex items-center bg-black/40 border border-white/10 p-1 rounded-xl">
                    {periods.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => setPeriod(p.id)}
                            className={cn(
                                "px-3.5 py-1.5 text-[10px] font-bold rounded-lg transition duration-200 cursor-pointer select-none",
                                period === p.id
                                    ? "bg-primary-500 text-white shadow-md font-extrabold"
                                    : "text-slate-400 hover:text-white"
                            )}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Container for child sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CashflowStats period={period} />
                <InsightsAllocation period={period} />
            </div>
        </div>
    );
};

export default InsightsContainer;
