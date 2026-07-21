'use client'

import React from 'react'
import { Download, CheckCircle2 } from 'lucide-react'
import { cn, formatCurrencyByLocale } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'
import { Button } from '@/components/ui/Button'

interface PhoneSendSuccessProps {
    amount: string;
    phoneNumber: string;
    txRef: string;
    txStatus: string;
    handleDownloadReceipt: () => void;
    handleReset: () => void;
}

export const PhoneSendSuccess: React.FC<PhoneSendSuccessProps> = ({
    amount,
    phoneNumber,
    txRef,
    txStatus,
    handleDownloadReceipt,
    handleReset,
}) => {
    const { t } = useLanguageStore();

    return (
        <div className="space-y-4 text-center">
            <div className="space-y-4 select-none pt-4">
                <div className="relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-[20px]"></div>
                    <div className="relative w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                </div>

                <div className="space-y-1 max-w-sm mx-auto">
                    <span className="text-[9px] font-bold text-emerald-400 tracking-[0.2em] uppercase font-mono block">
                        {t('phone.send.success.sentLabel')}
                    </span>
                    <h2 className="font-satoshi font-black text-2xl text-white tracking-tight">
                        {formatCurrencyByLocale(amount, 'iUSD')}
                    </h2>
                    <p className="text-slate-400 text-xs font-sans leading-relaxed">
                        {t('phone.send.success.sentTo', { recipient: phoneNumber })}
                    </p>
                </div>
            </div>

            <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-4.5 text-left space-y-3 select-none font-sans text-xs max-w-md mx-auto w-full">
                <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">{t('phone.send.success.txId')}</span>
                    <span className="font-mono text-slate-350">{txRef}</span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">{t('phone.send.success.recipient')}</span>
                    <span className="font-bold text-white">{phoneNumber}</span>
                </div>

                <div className="flex justify-between items-center py-0.5 border-t border-white/5 pt-2.5">
                    <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">{t('phone.send.success.status')}</span>
                    <div className="flex items-center space-x-1.5">
                        {(txStatus.toLowerCase() === 'pending' || txStatus.toLowerCase() === 'processing') && (
                            <span className="flex h-1.5 w-1.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                            </span>
                        )}
                        <span className={cn(
                            "font-bold",
                            (txStatus.toLowerCase() === 'completed' || txStatus.toLowerCase() === 'success')
                                ? "text-emerald-400"
                                : (txStatus.toLowerCase() === 'pending' || txStatus.toLowerCase() === 'processing')
                                    ? "text-blue-400"
                                    : "text-rose-500"
                        )}>
                            {txStatus}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                    onClick={handleDownloadReceipt}
                    variant="ghost"
                    leftIcon={<Download className="h-4 w-4 text-slate-400" />}
                    className="border border-white/15 h-[44px] rounded-xl text-xs"
                >
                    {t('phone.send.success.btn.receipt')}
                </Button>
                <Button
                    onClick={handleReset}
                    variant="primary"
                    className="h-[44px] rounded-xl text-xs"
                >
                    {t('phone.send.success.btn.done')}
                </Button>
            </div>
        </div>
    );
};
