'use client'

import React from 'react'
import { RefreshCw, Wallet, ShieldAlert, Sparkles, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { insightsService } from '@/services/insights.service'
import { cn } from '@/lib/utils'

const formatCurrency = (val: number) => {
    const value = val ?? 0;
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

interface InsightsAllocationProps {
    period: '1w' | '1m' | '3m' | '6m';
}

const InsightsAllocation: React.FC<InsightsAllocationProps> = ({ period }) => {
    const insightsQuery = useQuery({
        queryKey: ['insights', period],
        queryFn: () => insightsService.getInsights(period),
    });

    if (insightsQuery.isLoading) {
        return (
            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 flex flex-col items-center justify-center min-h-[280px]">
                <RefreshCw className="h-6 w-6 text-primary-400 animate-spin" />
                <span className="text-[10px] font-bold text-slate-550 mt-2 tracking-wider">Loading portfolio insights...</span>
            </div>
        );
    }

    const data = insightsQuery.data?.data;
    if (!data) {
        return (
            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 flex items-center space-x-3 text-xs text-rose-455">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <span>Could not load asset allocation data.</span>
            </div>
        );
    }

    const allocation = data.assetAllocation || {
        fiatUsd: 0,
        fiatPct: 0,
        cryptoUsd: 0,
        cryptoPct: 0,
        totalUsd: 0,
        fiatFormatted: '$0',
        cryptoFormatted: '$0',
        totalFormatted: '$0'
    };

    const trends = data.trendChange ?? 0;
    const isTrendPositive = trends >= 0;

    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 text-left flex flex-col justify-between shadow-xl min-h-[280px] space-y-6">
            <div className="space-y-4">
                <div className="flex justify-between items-center select-none">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400">
                            <Sparkles className="h-4.5 w-4.5" />
                        </div>
                        <div>
                            <h3 className="font-satoshi font-bold text-base text-white">Portfolio Allocation</h3>
                            <span className="text-[10px] font-semibold text-slate-500">Asset distribution</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-black/25 px-2.5 py-1 rounded-xl border border-white/5 font-mono text-[10px] font-bold">
                        {isTrendPositive ? (
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                            <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
                        )}
                        <span className={cn(isTrendPositive ? "text-emerald-400" : "text-rose-400")}>
                            {data.trendFormatted || `${isTrendPositive ? '+' : ''}${trends.toFixed(1)}%`}
                        </span>
                    </div>
                </div>

                {/* Progress bar split */}
                <div className="space-y-2 select-none">
                    <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex border border-white/5">
                        <div
                            style={{ width: `${Math.max(allocation.fiatPct || 0, 5)}%` }}
                            className="bg-gradient-to-r from-blue-600 to-blue-400 h-full transition-all duration-500"
                        />
                        <div
                            style={{ width: `${Math.max(allocation.cryptoPct || 0, 5)}%` }}
                            className="bg-gradient-to-r from-purple-600 to-purple-400 h-full transition-all duration-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-1 text-xs">
                        <div className="space-y-0.5">
                            <div className="flex items-center space-x-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Fiat Balance</span>
                            </div>
                            <div className="font-bold text-white font-mono text-sm pl-4">
                                {formatCurrency(allocation.fiatUsd)}
                                <span className="text-[10px] text-slate-500 font-medium font-sans ml-1">({allocation.fiatPct.toFixed(1)}%)</span>
                            </div>
                        </div>

                        <div className="space-y-0.5">
                            <div className="flex items-center space-x-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
                                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Crypto Balance</span>
                            </div>
                            <div className="font-bold text-white font-mono text-sm pl-4">
                                {formatCurrency(allocation.cryptoUsd)}
                                <span className="text-[10px] text-slate-500 font-medium font-sans ml-1">({allocation.cryptoPct.toFixed(1)}%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spending Breakdown by Type */}
            <div className="space-y-3 pt-3 border-t border-white/5 select-none">
                <span className="text-[9px] font-bold text-slate-550 uppercase tracking-widest block">Outflow Breakdown</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(data.spendingByType || []).map((item) => (
                        <div key={item.type} className="bg-black/20 border border-white/5 rounded-xl p-3.5 text-center flex flex-col justify-between">
                            <span className="text-[10px] font-bold text-slate-500 capitalize">{item.label}</span>
                            <span className="text-[11px] font-bold text-white font-mono mt-1 block">
                                {formatCurrency(item.totalAmount)}
                            </span>
                            <div className="flex justify-between text-[8px] text-slate-555 font-mono mt-1 pt-1 border-t border-white/[0.03]">
                                <span>F: {item.fiatAmount > 0 ? `$${item.fiatAmount}` : '0'}</span>
                                <span>C: {item.cryptoAmount > 0 ? `$${item.cryptoAmount}` : '0'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InsightsAllocation;
