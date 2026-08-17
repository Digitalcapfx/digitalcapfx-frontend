'use client'

import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { Sheet } from '@/components/ui/Sheet'
import { CaasSwapResponseItem } from '@/services/exchange.service'
import { Wallet } from '../types'
import { useLanguageStore } from '@/store/languageStore'

interface ExchangeSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    isCaasSwap: boolean;
    fromWallet: Wallet;
    toWallet: Wallet;
    fromAmount: string;
    toAmount: string;
    activeRate: number;
    successCaasData: CaasSwapResponseItem | null;
}

export const ExchangeSuccessModal: React.FC<ExchangeSuccessModalProps> = ({
    isOpen,
    onClose,
    isCaasSwap,
    fromWallet,
    toWallet,
    fromAmount,
    toAmount,
    activeRate,
    successCaasData,
}) => {
    const { t } = useLanguageStore();

    return (
        <Sheet isOpen={isOpen} onClose={onClose}>
            <div className="space-y-6 flex flex-col justify-between h-full text-center">
                <div className="space-y-6 select-none pt-8">
                    <div className="relative inline-flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-[20px]"></div>
                        <div className="relative w-18 h-18 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="h-9 w-9" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <span className="text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase font-mono block">
                            {isCaasSwap ? 'Stablecoin Swap Submitted' : t('exchange.success.title')}
                        </span>

                        <div className="flex items-center justify-center space-x-2 text-2xl font-black text-white font-satoshi">
                            <CurrencyIcon code={fromWallet.code} size="sm" />
                            <span>{parseFloat(fromAmount || '0').toLocaleString()} {fromWallet.code}</span>
                        </div>

                        <span className="text-[9px] font-bold text-slate-555 uppercase tracking-widest block py-0.5 select-none">
                            {t('exchange.success.exchangedTo')}
                        </span>

                        <div className="flex items-center justify-center space-x-2 text-2.5xl font-black text-emerald-400 font-satoshi">
                            <CurrencyIcon code={toWallet.code} size="sm" />
                            <span>{(parseFloat(toAmount) || parseFloat(fromAmount || '0')).toLocaleString()} {toWallet.code}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-5 text-left space-y-3.5 select-none font-sans text-xs max-w-md mx-auto w-full">
                    <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">{t('exchange.confirm.rate')}</span>
                        <span className="font-mono text-slate-350">1 {fromWallet.code} = {activeRate.toFixed(2)} {toWallet.code}</span>
                    </div>

                    <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">{t('exchange.settlement')}</span>
                        <span className="text-white">{isCaasSwap ? 'Instant Processing' : t('exchange.success.instantSameDay')}</span>
                    </div>

                    <div className="flex justify-between items-center py-0.5 border-t border-white/5 pt-3">
                        <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Reference</span>
                        <span className="font-mono text-slate-350">
                            {successCaasData?.reference || successCaasData?.id || 'SWAP-EXEC-OK'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-primary-500 hover:bg-primary-450 text-white font-bold text-sm py-4 rounded-xl shadow-lg transition duration-200 cursor-pointer active:scale-[0.98] mt-auto select-none"
                >
                    {t('exchange.success.btn.done')}
                </button>
            </div>
        </Sheet>
    );
};

export default ExchangeSuccessModal;
