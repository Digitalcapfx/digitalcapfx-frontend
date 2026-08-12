'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Wallet } from '../WalletsPage'
import { cn, formatCurrencyByLocale } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'

import WalletHeader from '../components/WalletHeader'
import WalletBalanceCard from '../components/WalletBalanceCard'
import WalletQuickActions from '../components/WalletQuickActions'
import TransactionItem from '../components/TransactionItem'
import TransactionDetailSheet from '../components/TransactionDetailSheet'
import WalletInfoPanel from '../components/WalletInfoPanel'
import WalletCurrencyPanel from '../components/WalletCurrencyPanel'

import { WalletViewProps } from './StablecoinWalletView'

const formatBalance = (amount: string | number, currency: string) => {
    return formatCurrencyByLocale(amount, currency);
};

export const MomoWalletView: React.FC<WalletViewProps> = ({
    wallet,
    initialTransactions = [],
    onBack,
    currentPage = 1,
    onPageChange,
    hasNextPage = false,
    momoTab = 'deposits',
    setMomoTab
}) => {
    const { t } = useLanguageStore();
    const [revealDetails, setRevealDetails] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [selectedTx, setSelectedTx] = useState<any | null>(null);

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 1800);
    };

    // Map MoMo transactions based on selected momoTab ('deposits' or 'withdrawals')
    const filteredTxs = Array.isArray(initialTransactions) && initialTransactions.length > 0
        ? initialTransactions.map((tx) => {
            const isIncoming = momoTab === 'deposits';
            const amtFormatted = (isIncoming ? '+' : '-') + formatBalance(Math.abs(parseFloat(tx.amount || '0')), wallet.code);
            const st = (tx.status || '').toLowerCase();
            const mappedStatus = (st === 'completed' || st === 'confirmed' || st === 'success')
                ? 'completed'
                : (st === 'pending' || st === 'processing' ? 'pending' : 'failed');

            const dateStr = new Date(tx.createdAt || tx.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const phone = tx.phone || tx.receiver_phone || wallet.accountNumber || '';
            const displayTitle = isIncoming ? 'MoMo Cash-in Deposit' : 'MoMo Cash-out Withdrawal';
            const displaySubtitle = `${phone ? `${phone} • ` : ''}${dateStr}`;

            return {
                id: tx.id,
                title: displayTitle,
                subtitle: displaySubtitle,
                token: wallet.code,
                amount: amtFormatted,
                isIncoming,
                status: mappedStatus,
                rawTx: tx,
            };
        })
        : [];

    return (
        <div className="space-y-6 text-left">
            <WalletHeader wallet={wallet} onBack={onBack} badgeLabel="MOBILE MONEY (MOMO)" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <WalletBalanceCard wallet={wallet} />
                    <WalletQuickActions wallet={wallet} />

                    {/* MoMo Activity List with Tab Filters */}
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 text-left shadow-xl space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
                            <h3 className="font-satoshi font-bold text-base text-white">
                                Mobile Money Activity
                            </h3>

                            {setMomoTab && (
                                <div className="flex space-x-1 bg-black/40 border border-white/10 p-1 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => { setMomoTab('deposits'); onPageChange?.(1); }}
                                        className={cn(
                                            "px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider transition cursor-pointer select-none",
                                            momoTab === 'deposits' ? "bg-white/10 text-white border border-white/15" : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        Deposits
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setMomoTab('withdrawals'); onPageChange?.(1); }}
                                        className={cn(
                                            "px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider transition cursor-pointer select-none",
                                            momoTab === 'withdrawals' ? "bg-white/10 text-white border border-white/15" : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        Cash-outs
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3.5 min-h-[300px] max-h-[540px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {filteredTxs.length > 0 ? (
                                filteredTxs.map((tx) => (
                                    <TransactionItem
                                        key={tx.id}
                                        tx={tx}
                                        walletCode={wallet.code}
                                        onSelect={setSelectedTx}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 text-xs text-slate-500 font-sans select-none">
                                    No {momoTab} history found for this account.
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs font-mono select-none">
                            <button
                                type="button"
                                disabled={(currentPage || 1) <= 1}
                                onClick={() => onPageChange?.((currentPage || 1) - 1)}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span>Prev</span>
                            </button>
                            <span className="text-[11px] font-bold text-slate-400 font-sans">
                                Page {currentPage || 1}
                            </span>
                            <button
                                type="button"
                                disabled={!hasNextPage}
                                onClick={() => onPageChange?.((currentPage || 1) + 1)}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                            >
                                <span>Next</span>
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <WalletInfoPanel
                        wallet={wallet}
                        cryptoAddressValue=""
                        cryptoAddressMasked=""
                        revealDetails={revealDetails}
                        setRevealDetails={setRevealDetails}
                        handleCopy={handleCopy}
                        copiedField={copiedField}
                    />

                    <WalletCurrencyPanel wallet={wallet} />
                </div>
            </div>

            <TransactionDetailSheet
                selectedTx={selectedTx}
                onClose={() => setSelectedTx(null)}
                walletCode={wallet.code}
                handleCopy={handleCopy}
                copiedField={copiedField}
            />
        </div>
    );
};

export default MomoWalletView;
