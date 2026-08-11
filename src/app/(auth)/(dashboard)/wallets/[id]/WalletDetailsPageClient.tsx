'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import WalletDetails from '@/components/pages/auth/wallet/WalletDetails'
import { useNavigationStore } from '@/store/navigationStore'
import { useQuery } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'
import { Wallet } from '@/components/pages/auth/wallet/WalletsPage'
import { formatCurrencyByLocale } from '@/lib/utils'

import { momoService } from '@/services/momo.service'

interface WalletDetailsPageClientProps {
    id: string;
    provider?: string;
    network?: string;
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

export default function WalletDetailsPageClient({ id, provider, network }: WalletDetailsPageClientProps) {
    const router = useRouter();
    const searchId = id.toUpperCase();
    const isWaaS = provider === 'waas';
    const STABLECOIN_SYMBOLS = ['USDC', 'USDT', 'IUSD', 'BUSD', 'DAI'];
    const isCrypto = STABLECOIN_SYMBOLS.includes(searchId) || isWaaS;
    const isMomoWallet = searchId === 'XAF' || searchId === 'XOF';
    const apiSymbol = searchId === 'IUSD' ? 'iUSD' : searchId;

    const [momoTab, setMomoTab] = React.useState<'deposits' | 'withdrawals'>('deposits');
    const [page, setPage] = React.useState<number>(1);
    const perPage = 20;

    const queryNetwork = network ? network.toUpperCase() : searchId;

    // Fetch live wallet header details from abstracted endpoint router or WaaS details
    const detailQuery = useQuery({
        queryKey: ['walletDetail', searchId, provider, queryNetwork],
        queryFn: () => isWaaS 
            ? accountService.getWaaSWalletDetail(queryNetwork) 
            : accountService.getWalletDetail(searchId),
    });

    // Fetch live transactions for specific fiat/stablecoin endpoint
    const txQuery = useQuery({
        queryKey: ['walletTransactions', searchId, provider, queryNetwork, page],
        queryFn: () => isWaaS
            ? accountService.getWaaSWalletTransactions(queryNetwork)
            : accountService.getWalletTransactions(searchId, page),
        enabled: !isMomoWallet,
    });

    // Fetch MoMo deposits and cash-out withdrawals for XAF & XOF wallets
    const momoDepositsQuery = useQuery({
        queryKey: ['momoDeposits', searchId, page],
        queryFn: () => momoService.getMyDeposits(page, perPage),
        enabled: isMomoWallet && momoTab === 'deposits',
    });

    const momoWithdrawalsQuery = useQuery({
        queryKey: ['momoWithdrawals', searchId, page],
        queryFn: () => momoService.getMyWithdrawals(page, perPage),
        enabled: isMomoWallet && momoTab === 'withdrawals',
    });

    const isLoading = detailQuery.isLoading || (isMomoWallet ? (momoTab === 'deposits' ? momoDepositsQuery.isLoading : momoWithdrawalsQuery.isLoading) : txQuery.isLoading);

    let activeWallet: Wallet | null = null;
    if (detailQuery.data?.success && detailQuery.data.data) {
        const d = detailQuery.data.data;
        const actions = d.actions || { can_send: true, can_receive: true, can_exchange: true, can_withdraw: true };

        if (isWaaS) {
            const balObj = searchId === queryNetwork
                ? (d.wallet || d)
                : (d.tokens?.find((t: any) => t.symbol?.toUpperCase() === searchId) || { balance: '0', symbol: searchId });

            const balSymbol = balObj?.symbol || searchId;
            const balVal = balObj?.balance !== undefined ? parseFloat(balObj.balance.toString()) : 0;
            activeWallet = {
                id: searchId.toLowerCase(),
                name: `${searchId} Wallet`,
                code: balSymbol,
                type: 'stablecoin',
                balance: balObj?.formatted_balance || balObj?.formattedBalance || `${balVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${balSymbol}`,
                rawBalance: balVal,
                walletAddress: d.wallet?.address || d.address || '',
                provider: 'waas',
                actions,
            };
        } else {
            // Check if response contains a nested `wallet` object (e.g. GET /wallets/stablecoin/USDC)
            const w = d.wallet || d;
            const curCode = (isCrypto ? (w.symbol || apiSymbol) : (w.currency || d.currency)) || searchId;

            const rawBal = w.balance_raw !== undefined
                ? (typeof w.balance_raw === 'number' ? w.balance_raw : parseFloat(w.balance_raw))
                : parseFloat(w.balance || w.balanceUsdc || d.balance || d.balanceUsdc || '0');

            const formattedBal = w.formatted_balance || w.formattedBalance
                || formatBalance(w.balance || w.balanceUsdc || d.balance || d.balanceUsdc || '0', curCode);

            const walletAddr = w.address || w.walletAddress || w.wallet_address || d.walletAddress || d.address || '';

            activeWallet = {
                id: (w.id && w.id.length > 0) ? w.id : curCode.toLowerCase(),
                name: (w.name && w.name !== 'Stablecoin' ? w.name : (CURRENCY_NAMES[curCode] || curCode)),
                code: curCode,
                type: isCrypto ? 'stablecoin' : 'fiat',
                balance: formattedBal,
                rawBalance: rawBal,
                walletAddress: walletAddr,
                accountNumber: w.accountNumber || d.accountNumber,
                iban: w.iban || d.iban,
                bic: w.bic || d.bic,
                routingNumber: w.routingNumber || d.routingNumber,
                swiftCode: w.swiftCode || w.bic || d.swiftCode || d.bic,
                bankName: w.bankName || d.bankName,
                provider: w.provider || 'caas',
                has_wallet: w.has_wallet !== undefined ? w.has_wallet : true,
                actions,
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

    let transactionsList: any[] = [];
    let hasNextPage = false;

    if (isMomoWallet) {
        if (momoTab === 'deposits') {
            const rawDeposits = momoDepositsQuery.data?.data;
            const depositsArr = Array.isArray(rawDeposits) ? rawDeposits : [];
            hasNextPage = depositsArr.length >= perPage;

            transactionsList = depositsArr
                .filter((d: any) => !d.currency || d.currency.toUpperCase() === searchId)
                .map((d: any) => ({
                    id: d.id,
                    type: 'Mobile Money Deposit',
                    description: `MoMo Deposit (${d.momoAccount?.displayName || d.momo_account?.display_name || d.provider || 'Wave/Orange'})`,
                    amount: String(d.creditedAmount ?? d.credited_amount ?? d.amount ?? 0),
                    createdAt: d.createdAt || d.created_at,
                    status: d.status === 'confirmed' ? 'completed' : (d.status === 'rejected' ? 'failed' : d.status || 'pending'),
                    isIncoming: true,
                }));
        } else {
            const rawWithdrawals = momoWithdrawalsQuery.data?.data;
            const withdrawalsArr = Array.isArray(rawWithdrawals) ? rawWithdrawals : [];
            hasNextPage = withdrawalsArr.length >= perPage;

            transactionsList = withdrawalsArr
                .filter((w: any) => !w.currency || w.currency.toUpperCase() === searchId)
                .map((w: any) => ({
                    id: w.id,
                    type: 'Mobile Money Payout',
                    description: `MoMo Cash-out (${(w.provider || 'MoMo').toUpperCase()})`,
                    amount: String(w.amount || 0),
                    createdAt: w.createdAt || w.created_at,
                    status: w.status === 'completed' ? 'completed' : (w.status === 'rejected' ? 'failed' : w.status || 'pending'),
                    isIncoming: false,
                }));
        }
    } else {
        let rawTx: any[] = [];
        const rawRes: any = txQuery.data;
        const resData: any = rawRes?.data;
        if (rawRes?.success) {
            if (Array.isArray(resData)) {
                rawTx = resData;
            } else if (resData?.transactions && Array.isArray(resData.transactions)) {
                rawTx = resData.transactions;
            } else if (Array.isArray(rawRes?.transactions)) {
                rawTx = rawRes.transactions;
            }
        }
        const limitVal = resData?.limit || perPage;
        hasNextPage = rawTx.length >= limitVal && rawTx.length > 0;
        transactionsList = rawTx;
    }

    return (
        <WalletDetails
            wallet={activeWallet}
            initialTransactions={transactionsList}
            onBack={onBack}
            momoTab={momoTab}
            setMomoTab={setMomoTab}
            currentPage={page}
            onPageChange={setPage}
            hasNextPage={hasNextPage}
        />
    );
}
