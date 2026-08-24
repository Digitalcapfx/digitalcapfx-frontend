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
import TransactionDetailSheet from '../components/TransactionDetailSheet'
import WalletInfoPanel from '../components/WalletInfoPanel'
import WalletCurrencyPanel from '../components/WalletCurrencyPanel'
import WalletActivityList from '../components/WalletActivityList'

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
                    <WalletActivityList
                        filteredTxs={displayedTxs}
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
