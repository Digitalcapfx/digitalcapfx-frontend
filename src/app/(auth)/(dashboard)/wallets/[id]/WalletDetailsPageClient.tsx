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

    // React Query Queries
    const fiatQuery = useQuery({
        queryKey: ['accounts'],
        queryFn: () => accountService.getAccounts(),
    });

    const cryptoQuery = useQuery({
        queryKey: ['cryptoBalances'],
        queryFn: () => accountService.getCryptoBalances(),
    });

    const isLoading = fiatQuery.isLoading || cryptoQuery.isLoading;

    // Find dynamic wallet details
    let activeWallet: Wallet | null = null;
    const searchId = id.toUpperCase();

    if (searchId === 'USDC' && cryptoQuery.data?.success && cryptoQuery.data.data) {
        const d = cryptoQuery.data.data;
        activeWallet = {
            id: 'usdc',
            name: CURRENCY_NAMES.USDC,
            code: 'USDC',
            type: 'stablecoin',
            balance: formatBalance(d.balance_usdc, 'USDC'),
            rawBalance: parseFloat(d.balance_usdc || '0'),
            walletAddress: d.wallet_address,
        };
    } else if (fiatQuery.data?.success && Array.isArray(fiatQuery.data.data)) {
        const acc = fiatQuery.data.data.find(a => a.currency.toUpperCase() === searchId);
        if (acc) {
            activeWallet = {
                id: acc.currency.toLowerCase(),
                name: CURRENCY_NAMES[acc.currency] || acc.currency,
                code: acc.currency,
                type: 'fiat',
                balance: formatBalance(acc.balance, acc.currency),
                rawBalance: parseFloat(acc.balance || '0'),
                accountNumber: acc.account_number,
            };
        }
    }

    const onBack = () => {
        const path = useNavigationStore.getState().backPath;
        router.push(path || '/wallets');
    };

    if (isLoading) {
        return (
            <div className="text-center py-16 min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-t-primary-500 border-white/10 rounded-full animate-spin"></div>
                <p className="text-xs text-slate-500 font-sans">Retrieving wallet credentials...</p>
            </div>
        );
    }

    if (!activeWallet) {
        return (
            <div className="text-center py-16 min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <h3 className="text-lg font-bold text-white font-satoshi">Wallet not found</h3>
                <p className="text-xs text-slate-500 font-sans">The wallet currency code you requested could not be loaded.</p>
                <button
                    onClick={() => router.push('/wallets')}
                    className="text-xs font-bold text-primary-400 hover:text-primary-350 hover:underline bg-[#0C1224] border border-white/5 px-4 py-2 rounded-xl cursor-pointer"
                >
                    Back to Wallets
                </button>
            </div>
        );
    }

    return (
        <WalletDetails
            wallet={activeWallet}
            onBack={onBack}
        />
    );
}
