'use client'

import React from 'react'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'
import { Wallet } from '../WalletsPage'
import { useLanguageStore } from '@/store/languageStore'

interface WalletInfoPanelProps {
    wallet: Wallet;
    cryptoAddressValue: string;
    cryptoAddressMasked: string;
    revealDetails: boolean;
    setRevealDetails: React.Dispatch<React.SetStateAction<boolean>>;
    handleCopy: (text: string, field: string) => void;
    copiedField: string | null;
}

export const WalletInfoPanel: React.FC<WalletInfoPanelProps> = ({
    wallet,
    cryptoAddressValue,
    cryptoAddressMasked,
    revealDetails,
    setRevealDetails,
    handleCopy,
    copiedField
}) => {
    const { t } = useLanguageStore();

    const rawIban = wallet.iban || wallet.accountNumber || '';
    const ibanValue = rawIban || t('details.info.notAvailable');
    const ibanMasked = rawIban
        ? `${rawIban.slice(0, 4)} **** **** **** **`
        : t('details.info.notAvailable');
    const swiftValue = wallet.swiftCode || wallet.bic || t('details.info.notAvailable');
    const routingValue = wallet.routingNumber || t('details.info.notAvailable');

    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex justify-between items-center select-none">
                <h3 className="font-satoshi font-bold text-sm text-white">
                    {t('details.info.title')}
                </h3>
                <button
                    type="button"
                    onClick={() => setRevealDetails((prev) => !prev)}
                    className="text-[11px] font-bold text-primary-400 hover:text-primary-350 flex items-center space-x-1 transition cursor-pointer"
                >
                    {revealDetails ? (
                        <>
                            <EyeOff className="h-3.5 w-3.5" />
                            <span>{t('details.info.hide')}</span>
                        </>
                    ) : (
                        <>
                            <Eye className="h-3.5 w-3.5" />
                            <span>{t('details.info.show')}</span>
                        </>
                    )}
                </button>
            </div>

            {wallet.type === 'stablecoin' ? (
                <div className="space-y-4 text-xs font-sans">
                    <div className="flex flex-col space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider select-none">
                            Crypto Wallet Address
                        </span>
                        <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-3 py-2">
                            <span className="font-mono text-slate-300 font-semibold text-[11px] truncate mr-2">
                                {revealDetails ? (cryptoAddressValue || t('details.info.notAvailable')) : cryptoAddressMasked}
                            </span>
                            {cryptoAddressValue && (
                                <button
                                    type="button"
                                    onClick={() => handleCopy(cryptoAddressValue, 'cryptoAddr')}
                                    className="text-slate-500 hover:text-white transition cursor-pointer shrink-0"
                                >
                                    {copiedField === 'cryptoAddr' ? (
                                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                                    ) : (
                                        <Copy className="h-3.5 w-3.5" />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 text-xs font-sans">
                    <div className="flex flex-col space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider select-none">
                            {t('details.info.iban')}
                        </span>
                        <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-3 py-2">
                            <span className="font-mono text-slate-300 font-semibold text-[11px] truncate mr-2">
                                {revealDetails ? ibanValue : ibanMasked}
                            </span>
                            {rawIban && (
                                <button
                                    type="button"
                                    onClick={() => handleCopy(rawIban, 'iban')}
                                    className="text-slate-500 hover:text-white transition cursor-pointer shrink-0"
                                >
                                    {copiedField === 'iban' ? (
                                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                                    ) : (
                                        <Copy className="h-3.5 w-3.5" />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider select-none">
                                {t('details.info.swift')}
                            </span>
                            <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-3 py-2">
                                <span className="font-mono text-slate-300 font-semibold text-[11px] truncate">
                                    {swiftValue}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider select-none">
                                {t('details.info.routing')}
                            </span>
                            <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-3 py-2">
                                <span className="font-mono text-slate-300 font-semibold text-[11px] truncate">
                                    {routingValue}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="pt-2 text-[10px] text-slate-550 leading-relaxed font-sans font-semibold border-t border-white/5 select-none text-left">
                {t('details.info.disclaimer')}
            </div>
        </div>
    );
};

export default WalletInfoPanel;
