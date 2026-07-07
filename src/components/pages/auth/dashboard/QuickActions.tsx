'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Send, ArrowDownLeft, RefreshCw, Zap } from 'lucide-react'
import { useTransactionStore } from '@/store/transactionStore'

const QuickActions: React.FC = () => {
    const router = useRouter();
    const openSend = useTransactionStore((state) => state.openSend);
    const openReceive = useTransactionStore((state) => state.openReceive);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
            <button 
                onClick={() => openSend(null)}
                className="bg-[#0C1224] border border-white/5 rounded-2xl p-4 flex items-center justify-center space-x-3 text-slate-300 hover:text-white hover:border-white/10 hover:bg-white/[0.02] transition duration-200 font-semibold text-sm cursor-pointer"
            >
                <div className="w-8 h-8 rounded-xl bg-primary-500/15 flex items-center justify-center text-primary-400">
                    <Send className="h-4 w-4" />
                </div>
                <span>Send Money</span>
            </button>
            <button 
                onClick={() => openReceive(null)}
                className="bg-[#0C1224] border border-white/5 rounded-2xl p-4 flex items-center justify-center space-x-3 text-slate-300 hover:text-white hover:border-white/10 hover:bg-white/[0.02] transition duration-200 font-semibold text-sm cursor-pointer"
            >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                    <ArrowDownLeft className="h-5 w-5" />
                </div>
                <span>Receive</span>
            </button>
            <button 
                onClick={() => router.push('/dashboard/exchange')}
                className="bg-[#0C1224] border border-white/5 rounded-2xl p-4 flex items-center justify-center space-x-3 text-slate-300 hover:text-white hover:border-white/10 hover:bg-white/[0.02] transition duration-200 font-semibold text-sm cursor-pointer"
            >
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400">
                    <RefreshCw className="h-4 w-4" />
                </div>
                <span>Exchange</span>
            </button>
            <button className="bg-[#0C1224] border border-white/5 rounded-2xl p-4 flex items-center justify-center space-x-3 text-slate-300 hover:text-white hover:border-white/10 hover:bg-white/[0.02] transition duration-200 font-semibold text-sm cursor-pointer">
                <div className="w-8 h-8 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-400">
                    <Zap className="h-4 w-4" />
                </div>
                <span>Instant</span>
            </button>
        </div>
    );
};

export default QuickActions;
