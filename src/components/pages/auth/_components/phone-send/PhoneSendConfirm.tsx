'use client'

import React from 'react'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrencyByLocale, formatValueByLocale } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'
import { CAAS_FEE_PERCENTAGE, CAAS_MAX_FEE, calculateCaasFee, calculateCaasRecipientReceives } from '@/constants/fees'

interface PhoneSendConfirmProps {
    amount: string;
    phoneNumber: string;
    note: string;
    isPending: boolean;
    onBack: () => void;
    onConfirm: () => void;
    selectedToken?: string;
}

export const PhoneSendConfirm: React.FC<PhoneSendConfirmProps> = ({
    amount,
    phoneNumber,
    note,
    isPending,
    onBack,
    onConfirm,
    selectedToken = 'USDC',
}) => {
    const { t } = useLanguageStore();
    const numAmt = parseFloat(amount || '0');
    const fee = calculateCaasFee(numAmt);
    const recipientGets = calculateCaasRecipientReceives(numAmt);

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 mb-2 border-b border-white/5 select-none">
                <button type="button" onClick={onBack} className="text-slate-400 hover:text-white p-1 rounded transition">
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-slate-350">{t('phone.send.confirm.title')}</span>
            </div>

            <div className="bg-gradient-to-br from-[#0F172A] to-[#0A0F1D] border border-white/5 rounded-2xl p-5 text-center shadow-xl select-none">
                <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block">{t('phone.send.confirm.sendingLabel')}</span>
                <span className="text-2.5xl font-black text-white block mt-1 font-satoshi font-mono">
                    {formatCurrencyByLocale(amount, selectedToken)}
                </span>
                <span className="text-[9.5px] text-slate-400 font-bold block mt-1 uppercase font-mono">
                    Recipient Gets: <span className="text-emerald-400 font-bold">{formatCurrencyByLocale(recipientGets, selectedToken)}</span> (Includes {CAAS_FEE_PERCENTAGE}% Fee, Max {CAAS_MAX_FEE} {selectedToken})
                </span>
            </div>

            <div className="bg-black/20 border border-white/5 rounded-2xl p-4 space-y-3 select-none text-xs font-sans">
                <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">{t('phone.send.confirm.recipient')}</span>
                    <span className="font-bold text-white block font-mono">{phoneNumber}</span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">{t('phone.send.confirm.recipientGets')}</span>
                    <span className="font-bold text-emerald-400 font-mono">
                        {formatCurrencyByLocale(recipientGets, selectedToken)}
                    </span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Transfer Fee ({CAAS_FEE_PERCENTAGE}%, Max {CAAS_MAX_FEE} {selectedToken})</span>
                    <span className="font-bold text-amber-400 font-mono">
                        -{formatValueByLocale(fee, selectedToken)} {selectedToken}
                    </span>
                </div>

                <div className="flex justify-between items-center py-0.5 border-t border-white/5 pt-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Total Deducted from Balance</span>
                    <span className="font-bold text-white font-mono">
                        {formatCurrencyByLocale(amount, selectedToken)}
                    </span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">{t('phone.send.confirm.settlement')}</span>
                    <span className="font-bold text-white">{t('phone.send.confirm.settlementInstant')}</span>
                </div>

                {note && (
                    <div className="flex justify-between items-start py-0.5">
                        <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px] pt-0.5">{t('phone.send.confirm.reference')}</span>
                        <span className="font-bold text-slate-350 max-w-[150px] truncate">{note}</span>
                    </div>
                )}
            </div>

            <div className="pt-2 space-y-2">
                <Button
                    onClick={onConfirm}
                    isLoading={isPending}
                    className="w-full rounded-xl h-[48px] font-semibold text-sm shadow-md"
                >
                    {t('phone.send.confirm.btn.send')}
                </Button>
            </div>
        </div>
    );
};
