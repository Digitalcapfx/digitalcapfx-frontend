'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import WalletDetails from '@/components/pages/auth/wallet/WalletDetails'
import { useNavigationStore } from '@/store/navigationStore'
import { useQuery } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'
import { Wallet } from '@/components/pages/auth/wallet/WalletsPage'

interface WalletDetailsPageClientProps {
    id: string;
}

const CURRENCY_NAMES: Record<string, string> = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    XOF: 'CFA Franc BCEAO',
    XAF: 'CFA Franc BEAC',
    USDC: 'USD Coin',
    NGN: 'Nigerian Naira',
};

const formatBalance = (amount: string | number, currency: string) => {
    const val = typeof amount === 'number' ? amount : parseFloat(amount || '0');
    if (isNaN(val)) return '0.00';
    if (currency === 'XAF' || currency === 'XOF') {
        return val.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ` ${currency}`;
    }
    const symbols: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
    };
    const prefix = symbols[currency] || '';
    return prefix + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (prefix ? '' : ` ${currency}`);
};

export default function WalletDetailsPageClient({ id }: WalletDetailsPageClientProps) {
    const router = useRouter();
    const searchId = id.toUpperCase();
    const isCrypto = searchId === 'USDC';

    // Fetch live wallet header details from specific fiat/stablecoin endpoint
    const detailQuery = useQuery({
        queryKey: ['walletDetail', searchId],
        queryFn: () => isCrypto
            ? accountService.getStablecoinWalletDetail('USDC')
            : accountService.getFiatWalletDetail(searchId),
    });

    // Fetch live transactions for specific fiat/stablecoin endpoint
    const txQuery = useQuery({
        queryKey: ['walletTransactions', searchId],
        queryFn: () => isCrypto
            ? accountService.getStablecoinWalletTransactions('USDC')
            : accountService.getFiatWalletTransactions(searchId),
    });

    const isLoading = detailQuery.isLoading || txQuery.isLoading;

    let activeWallet: Wallet | null = null;
    if (detailQuery.data?.success && detailQuery.data.data) {
        const d = detailQuery.data.data;
        const curCode = (isCrypto ? 'USDC' : d.currency) || searchId;
        activeWallet = {
            id: curCode.toLowerCase(),
            name: CURRENCY_NAMES[curCode] || curCode,
            code: curCode,
            type: isCrypto ? 'stablecoin' : 'fiat',
            balance: formatBalance(d.balance || d.balanceUsdc || '0', curCode),
            rawBalance: parseFloat(d.balance || d.balanceUsdc || '0'),
            walletAddress: d.walletAddress,
            accountNumber: d.accountNumber,
            iban: d.iban,
            bic: d.bic,
            routingNumber: d.routingNumber,
            swiftCode: d.swiftCode || d.bic,
            bankName: d.bankName,
        };
    }

    const onBack = () => {
        const path = useNavigationStore.getState().backPath;
        router.push(path || '/wallets');
    };

    if (isLoading) {
        return (
            <div className="text-center py-16 min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-t-primary-500 border-white/10 rounded-full animate-spin"></div>
                <p className="text-xs text-slate-500 font-sans">Retrieving wallet details...</p>
            </div>
        );
    }

    if (!activeWallet) {
        return (
            <div className="text-center py-16 min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <h3 className="text-lg font-bold text-white font-satoshi">Wallet not found</h3>
                <p className="text-xs text-slate-550 font-sans">The wallet currency code you requested could not be loaded.</p>
                <button
                    onClick={() => router.push('/wallets')}
                    className="text-xs font-bold text-primary-400 hover:text-primary-350 hover:underline bg-[#0C1224] border border-white/5 px-4 py-2 rounded-xl cursor-pointer"
                >
                    Back to Wallets
                </button>
            </div>
        );
    }

    const transactionsList = txQuery.data?.success && Array.isArray(txQuery.data.data)
        ? txQuery.data.data
        : [];

    return (
        <WalletDetails
            wallet={activeWallet}
            initialTransactions={transactionsList}
            onBack={onBack}
        />
    );
}
