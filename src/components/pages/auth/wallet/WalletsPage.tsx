'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Send, ArrowDownLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTransactionStore } from '@/store/transactionStore'
import PhoneSend from '../_components/PhoneSend'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { useNavigationStore } from '@/store/navigationStore'
import { cn, formatCurrencyByLocale } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'

export interface Wallet {
    id: string;
    name: string;
    code: string;
    type: 'fiat' | 'stablecoin';
    balance: string;
    rawBalance: number;
    accountNumber?: string;
    walletAddress?: string;
    iban?: string;
    bic?: string;
    routingNumber?: string;
    swiftCode?: string;
    bankName?: string;
}

const CURRENCY_NAMES: Record<string, string> = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    XOF: 'CFA Franc BCEAO',
    XAF: 'CFA Franc BEAC',
    USDC: 'USD Coin',
    IUSD: 'Instant USD',
    NGN: 'Nigerian Naira',
};

const formatBalance = (amount: string | number, currency: string) => {
    return formatCurrencyByLocale(amount, currency);
};

const WalletsPage: React.FC = () => {
    const router = useRouter();
    const setBackPath = useNavigationStore((state) => state.setBackPath);
    const openSend = useTransactionStore((state) => state.openSend);
    const openReceive = useTransactionStore((state) => state.openReceive);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'fiat' | 'stablecoins'>('all');

    // React Query Queries
    const fiatQuery = useQuery({
        queryKey: ['accounts'],
        queryFn: () => accountService.getAccounts(),
    });

    const cryptoQuery = useQuery({
        queryKey: ['cryptoBalances'],
        queryFn: () => accountService.getCryptoBalances(),
    });

    const walletsList: Wallet[] = [];

    // Map stablecoin wallet
    if (cryptoQuery.data?.success && cryptoQuery.data.data) {
        const d = cryptoQuery.data.data;
        const balNum = parseFloat(d.balanceUsdc || '0');
        const symbol = d.symbol || 'iUSD';
        walletsList.push({
            id: symbol.toLowerCase(),
            name: d.name || CURRENCY_NAMES[symbol.toUpperCase()] || 'Instant USD',
            code: symbol,
            type: 'stablecoin',
            balance: d.balanceFormatted || formatBalance(d.balanceUsdc, symbol),
            rawBalance: balNum,
        });
    }

    // Map fiat wallets
    if (fiatQuery.data?.success && Array.isArray(fiatQuery.data.data)) {
        fiatQuery.data.data.forEach((acc) => {
            const balNum = parseFloat(acc.balance || '0');
            walletsList.push({
                id: acc.currency.toLowerCase(),
                name: CURRENCY_NAMES[acc.currency] || acc.currency,
                code: acc.currency,
                type: 'fiat',
                balance: formatBalance(acc.balance, acc.currency),
                rawBalance: balNum,
            });
        });
    }

    const handleCreateWallet = () => {
        alert('Standard multi-currency accounts are auto-provisioned upon registration.');
    };

    // Filter wallets by active tab and search query
    const filteredWallets = walletsList.filter((wallet) => {
        // Tab check
        if (activeTab === 'fiat' && wallet.type !== 'fiat') return false;
        if (activeTab === 'stablecoins' && wallet.type !== 'stablecoin') return false;

        // Search check
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                wallet.name.toLowerCase().includes(query) ||
                wallet.code.toLowerCase().includes(query) ||
                wallet.type.toLowerCase().includes(query)
            );
        }

        return true;
    });

    const isLoading = fiatQuery.isLoading || cryptoQuery.isLoading;

    return (
        <div className="space-y-8">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between text-left gap-4 select-none">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white font-satoshi">
                        Wallets
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 font-sans">
                        Manage all your wallet currencies
                    </p>
                </div>
                <div className="flex items-center space-x-2.5">
                    <button
                        onClick={() => openSend(null)}
                        className="h-[40px] px-5 text-xs font-bold font-sans rounded-full bg-[#0C1224] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition duration-200 cursor-pointer active:scale-95 flex items-center space-x-1.5"
                    >
                        <Send className="h-4 w-4 text-primary-400" />
                        <span>Send</span>
                    </button>
                    <button
                        onClick={() => openReceive(null)}
                        className="h-[40px] px-5 text-xs font-bold font-sans rounded-full bg-[#0C1224] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition duration-200 cursor-pointer active:scale-95 flex items-center space-x-1.5"
                    >
                        <ArrowDownLeft className="h-4.5 w-4.5 text-emerald-400" />
                        <span>Receive</span>
                    </button>
                    {/* <Button
                        onClick={handleCreateWallet}
                        variant="primary"
                        className="rounded-full h-[40px] px-5 text-xs font-bold font-sans shadow-lg shadow-primary-500/10 active:scale-95 transition-all"
                        leftIcon={<Plus className="h-4.5 w-4.5" />}
                    >
                        Create Wallet
                    </Button> */}
                </div>
            </div>

            {/* Reusable Phone Send widget */}
            <PhoneSend />

            {/* Categories & Search Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
                {/* Tabs selection */}
                <div className="bg-[#0C1224] border border-[#131B30] rounded-xl p-1 flex items-center space-x-1 shrink-0">
                    {(['all', 'fiat', 'stablecoins'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-5 py-2 text-xs font-bold rounded-lg transition duration-200 capitalize cursor-pointer",
                                activeTab === tab
                                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/15"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Inline filter search input */}
                <div className="relative flex items-center max-w-xs w-full">
                    <Search className="absolute left-3 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter wallets..."
                        className="bg-black/30 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/50 w-full font-sans transition duration-200"
                    />
                </div>
            </div>

            {/* Wallets Grid List */}
            {isLoading && walletsList.length === 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[1, 2, 4].map((idx) => (
                        <div key={idx} className="h-[92px] rounded-2xl bg-white/5 border border-white/5 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredWallets.length > 0 ? (
                        filteredWallets.map((wallet) => {
                            return (
                                <div
                                    key={wallet.id}
                                    onClick={() => {
                                        setBackPath('/wallets');
                                        router.push(`/wallets/${wallet.code.toLowerCase()}`);
                                    }}
                                    className="p-5 rounded-2xl bg-[#080E1E] border border-white/5 hover:border-white/10 hover:bg-[#0C142A] transition duration-200 flex items-center justify-between cursor-pointer select-none group"
                                >
                                    <div className="flex items-center space-x-3.5 text-left">
                                        <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                                            <CurrencyIcon code={wallet.code} size="sm" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors duration-200">
                                                {wallet.name}
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-[10px] font-bold text-slate-500 tracking-wide">
                                                    {wallet.code}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                <span className="text-[10px] font-semibold text-slate-500 capitalize">
                                                    {wallet.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-0.5">
                                        <span className="text-base font-extrabold text-white font-satoshi">
                                            {wallet.balance}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="col-span-2 text-center p-8 bg-[#080E1E]/50 border border-dashed border-white/5 rounded-2xl">
                            <span className="text-xs font-semibold text-slate-500">No matching wallets found</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default WalletsPage
