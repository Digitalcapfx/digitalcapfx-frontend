'use client'

import React from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'

interface RecentConversionsCardProps {
    recentExchanges: any[];
}

export const RecentConversionsCard: React.FC<RecentConversionsCardProps> = ({ recentExchanges }) => {
    const { t } = useLanguageStore();

    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl space-y-4 text-left">
            <div className="flex justify-between items-center select-none pb-1 border-b border-white/[0.03]">
                <h3 className="font-satoshi font-bold text-sm text-white text-left">
                    {t('exchange.recentConversions')}
                </h3>
                <Link
                    href="/exchange/history"
                    className="text-[11px] font-mono font-bold text-primary-400 hover:text-primary-300 hover:underline flex items-center space-x-1"
                >
                    <span>View All History</span>
                    <span>→</span>
                </Link>
            </div>
            <div className="space-y-4">
                {recentExchanges.length > 0 ? (
                    recentExchanges.map((conv: any) => (
                        <div key={conv.id} className="flex justify-between items-center text-xs">
                            <div className="flex items-center space-x-2.5 min-w-0">
                                <div className="flex items-center -space-x-1.5 shrink-0">
                                    <CurrencyIcon code={conv.fromCode || conv.sourceCurrency || 'USD'} size="sm" />
                                    <CurrencyIcon code={conv.toCode || conv.targetCurrency || 'EUR'} size="sm" />
                                </div>
                                <div className="text-left">
                                    <span className="font-bold text-white block leading-tight">
                                        {conv.fromVal || `${conv.sourceAmount || '0'} ${conv.sourceCurrency || 'USD'}`} → {conv.toVal || `${conv.targetAmount || '0'} ${conv.targetCurrency || 'EUR'}`}
                                    </span>
                                    <span className="text-[9px] text-slate-500 font-bold block mt-0.5 select-none">
                                        {conv.isCaas ? 'Stablecoin Swap • ' : ''}
                                        {conv.createdAt ? new Date(conv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div className={cn(
                                "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-[10px]",
                                conv.status === 'processing' || conv.status === 'pending'
                                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse"
                                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            )}>
                                <Check className="h-3 w-3" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 text-xs text-slate-500 font-sans select-none">
                        {t('exchange.noRecentConversions')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentConversionsCard;
