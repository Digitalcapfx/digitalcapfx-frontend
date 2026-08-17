'use client'

import React from 'react'
import { Zap } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

interface ExchangeHeaderProps {
    isCaasSwap: boolean;
}

export const ExchangeHeader: React.FC<ExchangeHeaderProps> = ({ isCaasSwap }) => {
    const { t } = useLanguageStore();

    return (
        <div className="space-y-1 select-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
            <div>
                <h2 className="text-2xl font-black text-white font-satoshi flex items-center space-x-2">
                    <span>{t('nav.exchange')}</span>
                    {isCaasSwap && (
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                            <Zap className="h-3 w-3 text-emerald-400" />
                            <span>Stablecoin Swap</span>
                        </span>
                    )}
                </h2>
                <p className="text-xs font-semibold text-slate-555 font-sans">
                    {isCaasSwap
                        ? 'Swap instantly between USDT and USDC stablecoins.'
                        : t('exchange.subtitle')}
                </p>
            </div>
        </div>
    );
};

export default ExchangeHeader;
