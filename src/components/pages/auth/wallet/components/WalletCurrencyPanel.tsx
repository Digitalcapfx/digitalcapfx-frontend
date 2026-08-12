'use client'

import React from 'react'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { Wallet } from '../WalletsPage'
import { useLanguageStore } from '@/store/languageStore'

interface WalletCurrencyPanelProps {
    wallet: Wallet;
}

export const WalletCurrencyPanel: React.FC<WalletCurrencyPanelProps> = ({ wallet }) => {
    const { t } = useLanguageStore();

    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl space-y-4 text-xs font-sans">
            <h3 className="font-satoshi font-bold text-sm text-white select-none">
                {t('details.currency.title')}
            </h3>

            {/* Currency name/code details */}
            <div className="flex items-center space-x-3 select-none">
                <CurrencyIcon code={wallet.code} name={wallet.name} size="sm" />
                <div className="text-left">
                    <h4 className="font-bold text-white leading-none">
                        {wallet.code}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-bold block mt-1">
                        {wallet.name}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default WalletCurrencyPanel;
