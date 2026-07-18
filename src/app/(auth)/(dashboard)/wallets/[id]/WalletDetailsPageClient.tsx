'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import WalletDetails from '@/components/pages/auth/wallet/WalletDetails'
import { useNavigationStore } from '@/store/navigationStore'
import { useQuery } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'
import { Wallet } from '@/components/pages/auth/wallet/WalletsPage'
import { formatCurrencyByLocale } from '@/lib/utils'

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
    iUSD: 'Instant USD',
    IUSD: 'Instant USD',
};

const formatBalance = (amount: string | number, currency: string) => {
    return formatCurrencyByLocale(amount, currency);
};

export default function WalletDetailsPageClient({ id }: WalletDetailsPageClientProps) {
    const router = useRouter();
    const searchId = id.toUpperCase();
    const isCrypto = searchId === 'USDC' || searchId === 'IUSD';
    const apiSymbol = searchId === 'IUSD' ? 'iUSD' : searchId;

    // Fetch live wallet header details from abstracted endpoint router
    const detailQuery = useQuery({
        queryKey: ['walletDetail', searchId],
        queryFn: () => accountService.getWalletDetail(searchId),
    });

    // Fetch live transactions for specific fiat/stablecoin endpoint
    const txQuery = useQuery({
        queryKey: ['walletTransactions', searchId],
        queryFn: () => accountService.getWalletTransactions(searchId),
    });

    const isLoading = detailQuery.isLoading || txQuery.isLoading;

    let activeWallet: Wallet | null = null;
    if (detailQuery.data?.success && detailQuery.data.data) {
        const d = detailQuery.data.data;
        const curCode = (isCrypto ? apiSymbol : d.currency) || searchId;
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
