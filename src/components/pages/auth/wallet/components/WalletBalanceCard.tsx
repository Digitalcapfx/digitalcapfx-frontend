'use client'

import React from 'react'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { Wallet } from '../WalletsPage'
import { useLanguageStore } from '@/store/languageStore'

interface WalletBalanceCardProps {
    wallet: Wallet;
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({ wallet }) => {
    const { t } = useLanguageStore();

    return (
        <div className="relative bg-gradient-to-br from-[#0D152A] via-[#090E1D] to-[#060913] border border-[#17223D] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary-500/10 transition duration-700"></div>

            <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start select-none">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2.5 shadow-inner backdrop-blur-xs">
                            <CurrencyIcon code={wallet.code} name={wallet.name} size="md" />
                        </div>
                        <div>
                            <h2 className="font-satoshi font-black text-lg text-white leading-snug">
                                {wallet.name}
                            </h2>
                            <span className="text-xs text-slate-500 font-bold tracking-wider uppercase">
                                {wallet.code} {wallet.type || 'ACCOUNT'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Balance digits */}
                <div className="space-y-1 text-left">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block select-none">
                        {t('details.balance.label')}
                    </span>
                    <div className="flex items-baseline space-x-3">
                        <span className="font-mono font-black text-3xl sm:text-4xl text-white tracking-tight">
                            {wallet.balance}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletBalanceCard;
