'use client'

import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'
import { Wallet } from '../WalletsPage'

interface WalletHeaderProps {
    wallet: Wallet;
    onBack: () => void;
    badgeLabel?: string;
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({ wallet, onBack, badgeLabel }) => {
    const { t } = useLanguageStore();

    const displayBadge = badgeLabel || wallet.type || (['USDC', 'USDT', 'IUSD'].includes(wallet.code.toUpperCase()) ? 'stablecoin' : 'fiat');

    return (
        <div className="flex items-center justify-between select-none">
            <div className="flex items-center space-x-3.5">
                <button
                    type="button"
                    onClick={onBack}
                    className="w-10 h-10 rounded-2xl bg-[#0C1224] border border-[#131B30] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/10 transition duration-200 cursor-pointer shadow-md active:scale-95"
                    aria-label="Go Back"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div>
                    <div className="flex items-center space-x-2">
                        <h1 className="font-satoshi font-black text-2xl text-white tracking-tight leading-tight">
                            {wallet.name}
                        </h1>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-slate-400">
                            {displayBadge}
                        </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {t('details.header.subtitle')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WalletHeader;
