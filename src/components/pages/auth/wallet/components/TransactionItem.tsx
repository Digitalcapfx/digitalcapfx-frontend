'use client'

import React from 'react'
import { ArrowDownLeft, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

export const getTokenStyles = (token?: string, walletCode?: string) => {
    const sym = (token || walletCode || '').toUpperCase();
    if (sym === 'USDC') {
        return {
            sym: 'USDC',
            badgeBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
            iconBg: 'bg-blue-500/10 border-blue-500/25 text-blue-400',
        };
    }
    if (sym === 'USDT') {
        return {
            sym: 'USDT',
            badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
            iconBg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
        };
    }
    if (sym === 'IUSD') {
        return {
            sym: 'iUSD',
            badgeBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
            iconBg: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400',
        };
    }
    if (sym === 'BUSD') {
        return {
            sym: 'BUSD',
            badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
            iconBg: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
        };
    }
    return {
        sym: sym || 'CRYPTO',
        badgeBg: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
        iconBg: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
    };
};

interface TransactionItemProps {
    tx: any;
    walletCode: string;
    onSelect: (tx: any) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ tx, walletCode, onSelect }) => {
    const tokenStyle = getTokenStyles(tx.token, walletCode);

    return (
        <div
            onClick={() => onSelect(tx)}
            className="flex items-center justify-between py-2 px-2.5 rounded-2xl hover:bg-white/[0.04] active:scale-[0.99] transition duration-150 cursor-pointer border-b border-white/[0.03] last:border-b-0 group select-none"
        >
            <div className="flex items-center space-x-3.5 min-w-0">
                <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 border",
                    tx.isIncoming
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                )}>
                    {tx.isIncoming ? <ArrowDownLeft className="h-4.5 w-4.5" /> : <Send className="h-3.5 w-3.5" />}
                </div>
                <div className="text-left min-w-0">
                    <div className="flex items-center space-x-2">
                        <h4 className="font-sans font-bold text-xs text-white truncate">
                            {tx.title}
                        </h4>
                        <span className={cn(
                            "px-1.5 py-0.25 rounded text-[9px] font-black tracking-wider uppercase border shrink-0 select-none font-mono",
                            tokenStyle.badgeBg
                        )}>
                            {tokenStyle.sym}
                        </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5 select-none">
                        {tx.subtitle}
                    </span>
                </div>
            </div>

            {/* Amount and Status details */}
            <div className="text-right select-none">
                <div className={cn(
                    "font-mono text-xs font-extrabold",
                    tx.isIncoming ? "text-emerald-400" : "text-white"
                )}>
                    {tx.amount}
                </div>
                <span className={cn(
                    "text-[9px] font-bold block mt-1 uppercase tracking-wider",
                    tx.status === 'completed' ? "text-emerald-500" : (tx.status === 'pending' ? "text-amber-400" : "text-rose-500")
                )}>
                    {tx.status}
                </span>
            </div>
        </div>
    );
};

export default TransactionItem;
