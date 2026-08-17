'use client'

import React from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { NumberInput } from '@/components/ui/NumberInput'
import { formatValueByLocale, cn } from '@/lib/utils'
import { Wallet } from '../types'
import { useLanguageStore } from '@/store/languageStore'

interface WalletSelectorProps {
    label: string;
    selectedWallet: Wallet;
    walletsList: Wallet[];
    isOpen: boolean;
    onToggleOpen: () => void;
    onCloseDropdown: () => void;
    onSelectWallet: (id: string) => void;
    amount?: string;
    onAmountChange?: (val: string) => void;
    isReadOnly?: boolean;
    showMaxButton?: boolean;
    onMaxClick?: () => void;
}

export const WalletSelector: React.FC<WalletSelectorProps> = ({
    label,
    selectedWallet,
    walletsList,
    isOpen,
    onToggleOpen,
    onCloseDropdown,
    onSelectWallet,
    amount = '',
    onAmountChange,
    isReadOnly = false,
    showMaxButton = false,
    onMaxClick
}) => {
    const { t } = useLanguageStore();

    return (
        <div className="space-y-2 text-left">
            <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">{label}</span>
            <div className="relative">
                <div className="bg-[#0C1224] border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between transition focus-within:border-primary-500/50">
                    <div
                        onClick={onToggleOpen}
                        className="flex items-center space-x-2.5 cursor-pointer select-none"
                    >
                        <CurrencyIcon code={selectedWallet.code} size="md" />
                        <div className="text-left">
                            <span className="font-bold text-white text-sm block leading-tight">{selectedWallet.code}</span>
                            <span className="text-[9px] font-bold text-slate-500 block leading-none mt-0.5">{selectedWallet.name}</span>
                            <ChevronDown className="h-3 w-3 text-slate-500 inline mt-0.5" />
                        </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                        {!isReadOnly && onAmountChange ? (
                            <NumberInput
                                value={amount}
                                onChange={onAmountChange}
                                placeholder="0.00"
                                className="bg-transparent border-none focus:outline-none focus:ring-0 text-right text-white font-mono font-black text-xl placeholder-slate-700 leading-none"
                            />
                        ) : (
                            <span className="font-mono font-black text-xl text-emerald-400 mr-1 select-all">
                                {formatValueByLocale(amount, selectedWallet.code, selectedWallet.type === 'fiat')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Dropdown Overlay */}
                {isOpen && (
                    <div
                        className="fixed inset-0 z-20"
                        onClick={onCloseDropdown}
                    />
                )}

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1528] border border-white/10 rounded-2xl shadow-2xl z-30 max-h-[260px] overflow-y-auto scrollbar-none py-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                        {walletsList.map((w) => (
                            <div
                                key={w.id}
                                onClick={() => {
                                    onSelectWallet(w.id);
                                    onCloseDropdown();
                                }}
                                className={cn(
                                    "px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition",
                                    selectedWallet.id === w.id ? "bg-white/[0.03]" : ""
                                )}
                            >
                                <div className="flex items-center space-x-3">
                                    <CurrencyIcon code={w.code} size="md" />
                                    <div className="text-left">
                                        <span className="font-bold text-white text-xs block leading-tight">{w.name}</span>
                                        <span className="text-[9px] text-slate-500 font-bold">{w.code} • {w.balance}</span>
                                    </div>
                                </div>
                                {selectedWallet.id === w.id && <Check className="h-4 w-4 text-primary-400" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showMaxButton && onMaxClick && (
                <div className="flex justify-between items-center text-[10px] text-slate-555 font-bold select-none px-1">
                    <span>{t('exchange.walletBalance')} {selectedWallet.balance}</span>
                    <button
                        type="button"
                        onClick={onMaxClick}
                        className="text-primary-400 hover:text-primary-355 hover:underline cursor-pointer"
                    >
                        {t('exchange.useMax')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default WalletSelector;
