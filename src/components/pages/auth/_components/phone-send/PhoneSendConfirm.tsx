'use client'

import React from 'react'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrencyByLocale } from '@/lib/utils'

interface PhoneSendConfirmProps {
    amount: string;
    phoneNumber: string;
    note: string;
    isPending: boolean;
    onBack: () => void;
    onConfirm: () => void;
}

export const PhoneSendConfirm: React.FC<PhoneSendConfirmProps> = ({
    amount,
    phoneNumber,
    note,
    isPending,
    onBack,
    onConfirm,
}) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 mb-2 border-b border-white/5 select-none">
                <button type="button" onClick={onBack} className="text-slate-400 hover:text-white p-1 rounded transition">
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-slate-350">Confirm Transfer</span>
            </div>

            <div className="bg-gradient-to-br from-[#0F172A] to-[#0A0F1D] border border-white/5 rounded-2xl p-5 text-center shadow-xl select-none">
                <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block">You are sending</span>
                <span className="text-2.5xl font-black text-white block mt-1 font-satoshi">
                    {formatCurrencyByLocale(amount, 'iUSD')}
                </span>
            </div>

            <div className="bg-black/20 border border-white/5 rounded-2xl p-4 space-y-3 select-none text-xs font-sans">
                <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Recipient</span>
                    <span className="font-bold text-white block">{phoneNumber}</span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Recipient gets</span>
                    <span className="font-bold text-emerald-400 font-mono">
                        {formatCurrencyByLocale(amount, 'iUSD')}
                    </span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Transfer fee</span>
                    <span className="font-bold text-white font-mono">$0.00</span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Settlement time</span>
                    <span className="font-bold text-white">Instant</span>
                </div>

                {note && (
                    <div className="flex justify-between items-start py-0.5">
                        <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px] pt-0.5">Reference</span>
                        <span className="font-bold text-slate-350 max-w-[150px] truncate">{note}</span>
                    </div>
                )}
            </div>

            <div className="pt-2 space-y-2">
                <Button
                    onClick={onConfirm}
                    disabled={isPending}
                    className="w-full rounded-xl h-[48px] font-semibold text-sm shadow-md"
                    leftIcon={isPending && <RefreshCw className="h-4 w-4 animate-spin" />}
                >
                    {isPending ? 'Processing Send...' : 'Confirm & Send'}
                </Button>
            </div>
        </div>
    );
};
