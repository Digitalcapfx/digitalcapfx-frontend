'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Wallet } from '../WalletsPage'
import { cn, formatCurrencyByLocale } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'
import { useQuery } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'

import WalletHeader from '../components/WalletHeader'
import WalletBalanceCard from '../components/WalletBalanceCard'
import WalletQuickActions from '../components/WalletQuickActions'
import TransactionItem from '../components/TransactionItem'
import TransactionDetailSheet from '../components/TransactionDetailSheet'
import WalletInfoPanel from '../components/WalletInfoPanel'
import WalletCurrencyPanel from '../components/WalletCurrencyPanel'

const formatBalance = (amount: string | number, currency: string) => {
    return formatCurrencyByLocale(amount, currency);
};

export interface WalletViewProps {
    wallet: Wallet;
    initialTransactions?: any[];
    onBack: () => void;
    currentPage?: number;
    onPageChange?: (newPage: number) => void;
    hasNextPage?: boolean;
    momoTab?: 'deposits' | 'withdrawals';
    setMomoTab?: (tab: 'deposits' | 'withdrawals') => void;
}

export const StablecoinWalletView: React.FC<WalletViewProps> = ({
    wallet,
    initialTransactions = [],
    onBack,
    currentPage = 1,
    onPageChange,
    hasNextPage = false
}) => {
    const { t } = useLanguageStore();
    const [revealDetails, setRevealDetails] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [selectedTx, setSelectedTx] = useState<any | null>(null);
    const [tokenFilter, setTokenFilter] = useState<'ALL' | 'USDT' | 'USDC'>('ALL');

    const cryptoWalletQuery = useQuery({
        queryKey: ['cryptoWallet'],
        queryFn: () => accountService.getCryptoWallet(),
        enabled: wallet.type === 'stablecoin',
    });

    const caasWalletData = cryptoWalletQuery.data?.data;
    const fetchedCaasAddress = caasWalletData?.abstraction_address || caasWalletData?.abstractionAddress || caasWalletData?.walletAddress || '';

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 1800);
    };

    const cryptoAddressValue = wallet.walletAddress || fetchedCaasAddress || '';
    const cryptoAddressMasked = cryptoAddressValue
        ? `${cryptoAddressValue.slice(0, 6)}...${cryptoAddressValue.slice(-5)}`
        : t('details.info.notAvailable');

    // Map and filter stablecoin transactions
    const filteredTxs = Array.isArray(initialTransactions) && initialTransactions.length > 0
        ? initialTransactions.map((tx) => {
            const walletAddr = (wallet.walletAddress || '').toLowerCase();
            const recvAddress = tx.receiver_address || tx.receiverAddress || tx.receiver_phone || '';
            const recvAddrLower = recvAddress.toLowerCase();

            let isIncoming = false;
            if (tx.isIncoming !== undefined) {
                isIncoming = Boolean(tx.isIncoming);
            } else if (tx.is_incoming !== undefined) {
                isIncoming = Boolean(tx.is_incoming);
            } else if (tx.direction) {
                const dir = String(tx.direction).toLowerCase();
                isIncoming = dir === 'in' || dir === 'incoming' || dir === 'credit' || dir === 'deposit';
            } else if (tx.type) {
                const tStr = String(tx.type).toLowerCase();
                isIncoming = tStr.includes('deposit') || tStr.includes('receive') || tStr.includes('credit') || tStr.includes('fund') || (tStr === 'exchange' && parseFloat(tx.amount || '0') > 0);
            } else if (walletAddr && recvAddrLower && walletAddr === recvAddrLower) {
                isIncoming = true;
            } else if (tx.receiver_user_id && !tx.sender_user_id) {
                isIncoming = true;
            } else {
                isIncoming = false;
            }

            const txToken = tx.token || wallet.code;
            const amtFormatted = (isIncoming ? '+' : '-') + formatBalance(Math.abs(parseFloat(tx.amount || '0')), txToken);
            const st = (tx.status || '').toLowerCase();
            const mappedStatus = (st === 'completed' || st === 'confirmed' || st === 'success' || st === 'sandbox_simulated')
                ? 'completed'
                : (st === 'queued' || st === 'pending' || st === 'processing' ? 'pending' : 'failed');

            const maskedRecv = recvAddress && recvAddress.startsWith('0x')
                ? `${recvAddress.slice(0, 6)}...${recvAddress.slice(-4)}`
                : recvAddress;

            const typeLabel = isIncoming
                ? (tx.type || (tx.token ? `${tx.token} Deposit` : 'Deposit'))
                : (tx.type || (tx.token ? `${tx.token} Transfer` : 'Withdrawal'));

            const displayTitle = tx.title || tx.description || tx.reference || typeLabel;
            const dateStr = new Date(tx.createdAt || tx.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const displaySubtitle = `${typeLabel} • ${dateStr}${maskedRecv ? ` • ${isIncoming ? 'From' : 'To'}: ${maskedRecv}` : ''}`;

            return {
                id: tx.id,
                title: displayTitle,
                subtitle: displaySubtitle,
                receiverAddress: recvAddress,
                token: tx.token || wallet.code,
                amount: amtFormatted,
                isIncoming,
                status: mappedStatus,
                rawTx: tx,
            };
        })
        : [];

    const displayedTxs = filteredTxs.filter((tx) => {
        if (tokenFilter === 'ALL') return true;
        const itemToken = (tx.token || tx.rawTx?.token || wallet.code).toUpperCase();
        return itemToken === tokenFilter;
    });

    return (
        <div className="space-y-6 text-left">
            <WalletHeader wallet={wallet} onBack={onBack} badgeLabel="STABLECOIN (CAAS)" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <WalletBalanceCard wallet={wallet} />
                    <WalletQuickActions wallet={wallet} />

                    {/* Stablecoin Activity list & Token Filter */}
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 text-left shadow-xl space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
                            <h3 className="font-satoshi font-bold text-base text-white">
                                {t('section.recent')}
                            </h3>

                            <div className="flex items-center space-x-1 bg-black/40 border border-white/10 p-1 rounded-xl">
                                {(['ALL', 'USDT', 'USDC'] as const).map((filterOpt) => (
                                    <button
                                        key={filterOpt}
                                        type="button"
                                        onClick={() => setTokenFilter(filterOpt)}
                                        className={cn(
                                            "px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg uppercase tracking-wider transition cursor-pointer select-none",
                                            tokenFilter === filterOpt 
                                                ? (filterOpt === 'USDT'
                                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                    : filterOpt === 'USDC'
                                                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                        : "bg-white/10 text-white border border-white/15")
                                                : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        {filterOpt === 'ALL' ? 'All Tokens' : filterOpt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* List items */}
                        <div className="space-y-3.5 min-h-[300px] max-h-[540px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {displayedTxs.length > 0 ? (
                                displayedTxs.map((tx) => (
                                    <TransactionItem
                                        key={tx.id}
                                        tx={tx}
                                        walletCode={wallet.code}
                                        onSelect={setSelectedTx}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 text-xs text-slate-500 font-sans select-none space-y-1">
                                    <p className="font-bold text-slate-400">No transactions match filter ({tokenFilter})</p>
                                    <p className="text-[11px] opacity-75">Switch the token filter tab to "All Tokens" to view all records</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls */}
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
                        cryptoAddressValue={cryptoAddressValue}
                        cryptoAddressMasked={cryptoAddressMasked}
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

export default StablecoinWalletView;
