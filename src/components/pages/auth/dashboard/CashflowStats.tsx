'use client'

import React from 'react'
import { ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { insightsService } from '@/services/insights.service'
import { cn } from '@/lib/utils'

const formatCurrency = (val: number) => {
    const value = val ?? 0;
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

interface CashflowStatsProps {
    period: '1w' | '1m' | '3m' | '6m';
}

const PERIOD_LABELS = {
    '1w': 'This Week',
    '1m': 'This Month',
    '3m': 'Last 3 Months',
    '6m': 'Last 6 Months',
};

const CashflowStats: React.FC<CashflowStatsProps> = ({ period }) => {
    const insightsQuery = useQuery({
        queryKey: ['insights', period],
        queryFn: () => insightsService.getInsights(period),
    });

    if (insightsQuery.isLoading) {
        return (
            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 flex flex-col items-center justify-center min-h-[260px]">
                <RefreshCw className="h-6 w-6 text-primary-400 animate-spin" />
                <span className="text-[10px] font-bold text-slate-550 mt-2 tracking-wider">Loading cashflow insights...</span>
            </div>
        );
    }

    const rawSummary = insightsQuery.data?.data?.summary;
    const summary = {
        income: rawSummary?.incomeMonth ?? 0,
        spending: rawSummary?.spendingMonth ?? 0,
        netFlow: rawSummary?.netFlow ?? 0,
        transactionCount: insightsQuery.data?.data?.totalActivity ?? 0
    };

    const isNetPositive = summary.netFlow >= 0;

    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 text-left flex flex-col justify-between shadow-xl min-h-[260px]">
            <div>
                <div className="flex justify-between items-center select-none mb-4">
                    <div>
                        <h3 className="font-satoshi font-bold text-base text-white">{PERIOD_LABELS[period]}</h3>
                        <span className="text-[10px] font-semibold text-slate-500">Insights</span>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-555 uppercase tracking-widest block">Net Flow</span>
                        <span className={cn("text-xs font-bold font-mono mt-0.5 block", isNetPositive ? "text-emerald-400" : "text-rose-455")}>
                            {isNetPositive ? '+' : ''}{formatCurrency(summary.netFlow)}
                        </span>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <ArrowDownLeft className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-350">Income</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 font-mono">+{formatCurrency(summary.income)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-350">Spending</span>
                        </div>
                        <span className="text-xs font-bold text-rose-400 font-mono">-{formatCurrency(summary.spending)}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center select-none pt-4 border-t border-white/5 text-[10px] font-semibold text-slate-550">
                <span>Transactions</span>
                <span className="font-mono text-white">
                    {summary.transactionCount !== undefined ? `${summary.transactionCount} operations` : '0 operations'}
                </span>
            </div>
        </div>
    );
};

export default CashflowStats;
