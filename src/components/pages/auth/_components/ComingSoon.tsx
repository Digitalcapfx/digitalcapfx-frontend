'use client'

import React from 'react'
import { Hourglass, Lock } from 'lucide-react'

interface ComingSoonProps {
    title: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ title }) => {
    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-12 text-center shadow-xl space-y-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[460px]">
            {/* Glowing background orbs */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 to-transparent blur-[60px] pointer-events-none"></div>

            {/* Glowing icon container */}
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary-500/20 blur-[20px]"></div>
                <div className="relative w-16 h-16 rounded-full bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-primary-400">
                    <Hourglass className="h-7 w-7 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
            </div>

            {/* Title & info text */}
            <div className="max-w-md space-y-3">
                <span className="text-[10px] font-bold text-primary-400 tracking-[0.2em] uppercase font-mono block select-none">
                    Under Construction
                </span>
                <h1 className="font-satoshi font-black text-3xl text-white tracking-tight">
                    {title} is coming soon
                </h1>
                <p className="text-slate-400 text-sm font-sans leading-relaxed">
                    We're currently building the <strong className="text-white font-bold">{title}</strong> panel of your portal. Check back soon for cross-border conversions, multi-currency wallets, virtual cards, and billing settlements.
                </p>
            </div>

            {/* Encryption badge indicator */}
            <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500 font-bold tracking-wide select-none pt-4 border-t border-white/5 w-full max-w-xs font-sans">
                <Lock className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Secured with 256-bit AES encryption</span>
            </div>
        </div>
    )
}

export default ComingSoon
