'use client'

import React from 'react'
import { ArrowDownLeft, Send, RefreshCw, CheckCircle, XCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { transferService } from '@/services/transfer.service'
import { cn, formatCurrencyByLocale } from '@/lib/utils'

const formatBalance = (amount: string | number, currency: string) => {
    return formatCurrencyByLocale(amount, currency);
};

const RecentActivity: React.FC = () => {
    const activityQuery = useQuery({
        queryKey: ['activity'],
        queryFn: () => transferService.getActivity(),
    });

    const txList = activityQuery.data?.success && Array.isArray(activityQuery.data.data)
        ? activityQuery.data.data
        : [];

    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 text-left shadow-xl space-y-6">
            
            {/* Header split */}
            <div className="flex justify-between items-center select-none">
                <h3 className="font-satoshi font-bold text-base text-white">Recent Activity</h3>
                <button 
                    onClick={() => activityQuery.refetch()}
                    className="text-xs font-semibold text-primary-400 hover:text-primary-350 hover:underline flex items-center space-x-1"
                >
                    <RefreshCw className={cn("h-3.5 w-3.5", activityQuery.isFetching && "animate-spin")} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* List or Loading or Empty State */}
            {activityQuery.isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2 select-none">
                    <div className="w-8 h-8 border-4 border-t-primary-500 border-white/10 rounded-full animate-spin"></div>
                    <p className="text-[11px] text-slate-550 font-sans">Loading transaction logs...</p>
                </div>
            ) : txList.length > 0 ? (
                <div className="space-y-4">
                    {txList.slice(0, 5).map((tx) => {
                        const isIncoming = tx.type.toLowerCase().includes('deposit') || 
                                           tx.type.toLowerCase().includes('receive') || 
                                           tx.type.toLowerCase().includes('fund') ||
                                           (tx.type.toLowerCase() === 'exchange' && parseFloat(tx.amount) > 0);
                        
                        const valNum = Math.abs(parseFloat(tx.amount));
                        const amtFormatted = (isIncoming ? '+' : '-') + formatBalance(valNum, tx.currency);

                        return (
                            <div key={tx.id} className="flex items-center justify-between py-1 border-b border-white/[0.03] last:border-b-0">
                                <div className="flex items-center space-x-3.5 min-w-0">
                                    <div className={cn(
                                        "w-9 h-9 rounded-full flex items-center justify-center shrink-0 border",
                                        isIncoming 
                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                                            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                    )}>
                                        {isIncoming ? <ArrowDownLeft className="h-4.5 w-4.5" /> : <Send className="h-3.5 w-3.5" />}
                                    </div>
                                    <div className="text-left min-w-0">
                                        <h4 className="font-sans font-bold text-xs text-white truncate">
                                            {tx.description || `${tx.type} transaction`}
                                        </h4>
                                        <span className="text-[10px] text-slate-500 font-medium block mt-0.5 select-none">
                                            {tx.type} • {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right select-none flex items-center space-x-3">
                                    <div className="text-right">
                                        <div className={cn(
                                            "font-mono text-xs font-extrabold",
                                            isIncoming ? "text-emerald-400" : "text-white"
                                        )}>
                                            {amtFormatted}
                                        </div>
                                        <span className={cn(
                                            "text-[9px] font-bold block mt-0.5 uppercase tracking-wider",
                                            tx.status === 'completed' ? "text-emerald-500" : "text-rose-500"
                                        )}>
                                            {tx.status}
                                        </span>
                                    </div>
                                    {tx.status === 'completed' ? (
                                        <CheckCircle className="h-4 w-4 text-emerald-500/80 shrink-0" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-rose-500/80 shrink-0" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-12 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-3 select-none">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                        <RefreshCw className="h-5 w-5 opacity-40" />
                    </div>
                    <div className="text-center space-y-0.5">
                        <h4 className="text-xs font-bold text-white font-satoshi">No transactions yet</h4>
                        <p className="text-[11px] text-slate-550 font-sans">Your activity will appear here</p>
                    </div>
                </div>
            )}

        </div>
    );
};

export default RecentActivity;
