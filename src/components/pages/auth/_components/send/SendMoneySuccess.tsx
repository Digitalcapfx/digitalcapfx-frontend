'use client'

import React from 'react'
import { CheckCircle2, User, Download } from 'lucide-react'
import { cn, formatCurrencyByLocale } from '@/lib/utils'
import { Wallet } from '../SendMoneySheet'
import { useLanguageStore } from '@/store/languageStore'

interface SendMoneySuccessProps {
    amount: string;
    activeWallet: Wallet;
    isCrypto: boolean;
    isMobileMoney: boolean;
    displayRecipientName: string;
    txRef: string;
    txStatus: string;
    note: string;
    showSaveBeneficiaryPrompt: boolean;
    handleSaveBeneficiaryPostTx: () => void;
    handleDiscardBeneficiaryPostTx: () => void;
    handleDownloadReceipt: () => void;
    handleReset: () => void;
}

export const SendMoneySuccess: React.FC<SendMoneySuccessProps> = ({
    amount,
    activeWallet,
    isCrypto,
    isMobileMoney,
    displayRecipientName,
    txRef,
    txStatus,
    note,
    showSaveBeneficiaryPrompt,
    handleSaveBeneficiaryPostTx,
    handleDiscardBeneficiaryPostTx,
    handleDownloadReceipt,
    handleReset,
}) => {
    const { t } = useLanguageStore();

    return (
        <div className="space-y-6 flex flex-col justify-between h-full text-center">
            <div className="space-y-6 select-none pt-8">
                <div className="relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-[20px]"></div>
                    <div className="relative w-18 h-18 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="h-9 w-9" />
                    </div>
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                    <span className="text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase font-mono block">
                        {t('send.success.sentLabel')}
                    </span>
                    <h2 className="font-satoshi font-black text-2.5xl text-white tracking-tight">
                        {formatCurrencyByLocale(amount, activeWallet.code)}
                    </h2>
                    <p className="text-slate-400 text-xs font-sans leading-relaxed">
                        {t('send.success.sentTo', { recipient: displayRecipientName })}
                    </p>
                </div>
            </div>

            <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-5 text-left space-y-3.5 select-none font-sans text-xs max-w-md mx-auto w-full">
                <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">{t('send.success.txId')}</span>
                    <span className="font-mono text-slate-350">{txRef}</span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">{t('send.success.delivery')}</span>
                    <span className="text-white">
                        {isCrypto ? t('send.review.settlementInstant') : isMobileMoney ? t('send.review.settlementInstant') : t('send.review.settlementSameDay')}
                    </span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">{t('send.success.recipient')}</span>
                    <span className="font-bold text-white">{displayRecipientName}</span>
                </div>

                <div className="flex justify-between items-start py-0.5">
                    <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px] pt-0.5">{t('send.success.reference')}</span>
                    <span className="font-bold text-slate-350 max-w-[200px] truncate">{note || t('send.success.defaultReference')}</span>
                </div>

                <div className="flex justify-between items-center py-0.5 border-t border-white/5 pt-3">
                    <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">{t('send.success.status')}</span>
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

            {showSaveBeneficiaryPrompt && (
                <div className="bg-[#121A30]/90 border border-white/10 rounded-2.5xl p-5 mt-4 space-y-4 animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-start space-x-3 text-left">
                        <div className="p-2 bg-primary-500/10 rounded-xl text-primary-400 mt-0.5">
                            <User className="h-4.5 w-4.5" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-white text-xs">{t('send.success.savePrompt.title')}</h4>
                            <p className="text-[10px] text-slate-405 leading-relaxed">
                                {t('send.success.savePrompt.desc', { recipient: displayRecipientName })}
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            onClick={handleSaveBeneficiaryPostTx}
                            className="flex-1 bg-primary-500 hover:bg-primary-450 text-white font-bold text-[10px] py-2.5 rounded-lg transition duration-150 cursor-pointer text-center active:scale-[0.98]"
                        >
                            {t('send.success.savePrompt.btn.yes')}
                        </button>
                        <button
                            type="button"
                            onClick={handleDiscardBeneficiaryPostTx}
                            className="flex-1 bg-slate-800/60 hover:bg-slate-800 text-slate-400 font-bold text-[10px] py-2.5 rounded-lg transition duration-150 border border-white/5 cursor-pointer text-center active:scale-[0.98]"
                        >
                            {t('send.success.savePrompt.btn.no')}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-auto">
                <button
                    onClick={handleDownloadReceipt}
                    className="bg-transparent hover:bg-white/[0.02] border border-white/15 text-white font-bold text-xs py-3.5 rounded-xl transition duration-200 cursor-pointer flex items-center justify-center space-x-1.5"
                >
                    <Download className="h-4 w-4 text-slate-400" />
                    <span>{t('send.success.btn.receipt')}</span>
                </button>
                <button
                    onClick={handleReset}
                    className="bg-primary-500 hover:bg-primary-450 text-white font-bold text-xs py-3.5 rounded-xl transition duration-200 cursor-pointer flex items-center justify-center space-x-1.5 active:scale-[0.98]"
                >
                    <span>{t('send.success.btn.done')}</span>
                </button>
            </div>
        </div>
    );
};
