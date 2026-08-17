'use client'

import React from 'react'
import { RefreshCw } from 'lucide-react'
import { Sheet } from '@/components/ui/Sheet'
import { QuoteData } from '@/services/exchange.service'
import { Wallet } from '../types'
import { useLanguageStore } from '@/store/languageStore'

interface ExchangeConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    isCaasSwap: boolean;
    confirmQuote: QuoteData | null;
    fromWallet: Wallet;
    toWallet: Wallet;
    fromAmount: string;
    toAmount: string;
    activeRate: number;
    confirmTimer: number;
    isPending: boolean;
    onConfirm: () => void;
}

export const ExchangeConfirmationModal: React.FC<ExchangeConfirmationModalProps> = ({
    isOpen,
    onClose,
    isCaasSwap,
    confirmQuote,
    fromWallet,
    toWallet,
    fromAmount,
    toAmount,
    activeRate,
    confirmTimer,
    isPending,
    onConfirm,
}) => {
    const { t } = useLanguageStore();

    return (
        <Sheet isOpen={isOpen} onClose={onClose}>
            <div className="space-y-6 flex flex-col justify-between h-full text-center">
                <div className="space-y-6 select-none pt-8 text-left">
                    <div className="space-y-2">
                        <h3 className="font-satoshi font-black text-2xl text-white tracking-tight">
                            {isCaasSwap ? 'Confirm Stablecoin Swap' : t('exchange.confirm.title')}
                        </h3>
                        <p className="text-[#6D778A] text-xs font-sans">
                            {isCaasSwap 
                                ? 'Review your USDC ⇄ USDT swap details.' 
                                : t('exchange.confirm.subtitle')}
                        </p>
                    </div>

                    {confirmQuote && (
                        <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-5 space-y-4 font-sans text-xs">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-semibold">{t('exchange.confirm.youSell')}</span>
                                <span className="font-extrabold text-white font-mono text-sm">
                                    {fromAmount} {fromWallet.code}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-semibold">{t('exchange.confirm.youReceive')}</span>
                                <span className="font-extrabold text-emerald-400 font-mono text-sm">
                                    {toAmount || fromAmount} {toWallet.code}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-semibold">{t('exchange.confirm.rate')}</span>
                                <span className="font-bold text-white font-mono">
                                    1 {fromWallet.code} = {activeRate.toFixed(2)} {toWallet.code}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex items-center justify-between text-xs select-none">
                        <span className="text-amber-400 font-bold font-sans">{t('exchange.confirm.lockExpiration')}</span>
                        <div className="bg-[#0C1224] border border-white/5 font-mono text-amber-400 px-3 py-1 rounded-xl flex items-center space-x-1 shrink-0">
                            <RefreshCw className="h-3 w-3 text-amber-500 animate-spin" />
                            <span>00:{confirmTimer.toString().padStart(2, '0')}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mt-auto">
                    <button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="w-full bg-emerald-500 hover:bg-emerald-450 text-white font-bold text-sm py-4 rounded-xl shadow-lg transition duration-200 cursor-pointer active:scale-[0.98]"
                    >
                        {isPending ? 'Executing Swap...' : t('exchange.confirm.btn.confirm')}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-[#0C1224] border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white font-bold text-sm py-4 rounded-xl transition duration-200 cursor-pointer active:scale-[0.98]"
                    >
                        {t('exchange.confirm.btn.cancel')}
                    </button>
                </div>
            </div>
        </Sheet>
    );
};

export default ExchangeConfirmationModal;
