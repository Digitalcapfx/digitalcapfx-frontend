'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Wallet } from '../WalletsPage'
import { formatCurrencyByLocale } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'

import WalletHeader from '../components/WalletHeader'
import WalletBalanceCard from '../components/WalletBalanceCard'
import WalletQuickActions from '../components/WalletQuickActions'
import TransactionDetailSheet from '../components/TransactionDetailSheet'
import WalletInfoPanel from '../components/WalletInfoPanel'
import WalletCurrencyPanel from '../components/WalletCurrencyPanel'
import WalletActivityList from '../components/WalletActivityList'

import { WalletViewProps } from './StablecoinWalletView'

const formatBalance = (amount: string | number, currency: string) => {
    return formatCurrencyByLocale(amount, currency);
};

export const FiatWalletView: React.FC<WalletViewProps> = ({
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

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 1800);
    };

    // Map Fiat transactions
    const filteredTxs = Array.isArray(initialTransactions) && initialTransactions.length > 0
        ? initialTransactions.map((tx) => {
            let isIncoming = false;
            if (tx.isIncoming !== undefined) {
                isIncoming = Boolean(tx.isIncoming);
            } else if (tx.type) {
                const tStr = String(tx.type).toLowerCase();
                isIncoming = tStr.includes('deposit') || tStr.includes('receive') || tStr.includes('credit') || tStr.includes('fund');
            }

            const amtFormatted = (isIncoming ? '+' : '-') + formatBalance(Math.abs(parseFloat(tx.amount || '0')), wallet.code);
            const st = (tx.status || '').toLowerCase();
            const mappedStatus = (st === 'completed' || st === 'confirmed' || st === 'success')
                ? 'completed'
                : (st === 'pending' || st === 'processing' ? 'pending' : 'failed');

            const dateStr = new Date(tx.createdAt || tx.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const displayTitle = tx.title || tx.description || tx.reference || (isIncoming ? 'Bank Deposit' : 'Bank Transfer');
            const displaySubtitle = `${isIncoming ? 'Incoming' : 'Outgoing'} • ${dateStr}`;

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
            <WalletHeader wallet={wallet} onBack={onBack} badgeLabel="FIAT BANK ACCOUNT" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <WalletBalanceCard wallet={wallet} />
                    <WalletQuickActions wallet={wallet} />

                    {/* Fiat Activity List */}
                    <WalletActivityList
                        filteredTxs={filteredTxs}
                        walletCode={wallet.code}
                        onSelectTx={setSelectedTx}
                        currentPage={currentPage}
                        onPageChange={onPageChange}
                        hasNextPage={hasNextPage}
                    />
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

export default FiatWalletView;
