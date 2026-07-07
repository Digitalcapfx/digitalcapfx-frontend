'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Send, ArrowDownLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTransactionStore } from '@/store/transactionStore'
import PhoneSend from '../_components/PhoneSend'
import WalletDetails from './WalletDetails'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { useNavigationStore } from '@/store/navigationStore'
import { cn } from '@/lib/utils'

export interface Wallet {
    id: string;
    name: string;
    code: string;
    type: 'fiat' | 'stablecoin' | 'crypto';
    balance: string;
}

export const WALLETS_DATA: Wallet[] = [
    { id: 'usdc', name: 'USD Coin', code: 'USDC', type: 'stablecoin', balance: '8,500.00 USDC' },
    { id: 'eth', name: 'Ethereum', code: 'ETH', type: 'crypto', balance: '3.847 ETH' },
    { id: 'pol', name: 'Polygon', code: 'POL', type: 'crypto', balance: '3,500.00 POL' },
    { id: 'xof', name: 'CFA Franc BCEAO', code: 'XOF', type: 'fiat', balance: '1,850,000 XOF' },
    { id: 'btc', name: 'Bitcoin', code: 'BTC', type: 'crypto', balance: '0.4523 BTC' },
    { id: 'gbp', name: 'British Pound', code: 'GBP', type: 'fiat', balance: '£5,680.90' },
    { id: 'usd', name: 'US Dollar', code: 'USD', type: 'fiat', balance: '$12,450.75' },
    { id: 'eur', name: 'Euro', code: 'EUR', type: 'fiat', balance: '€8,320.40' },
    { id: 'trx', name: 'TRON', code: 'TRX', type: 'crypto', balance: '25,000.00 TRX' },
    { id: 'ltc', name: 'Litecoin', code: 'LTC', type: 'crypto', balance: '12.50 LTC' },
    { id: 'xaf', name: 'CFA Franc BEAC', code: 'XAF', type: 'fiat', balance: '2,500,000 XAF' },
    { id: 'sol', name: 'Solana', code: 'SOL', type: 'crypto', balance: '45.23 SOL' },
    { id: 'ngn', name: 'Nigeria Naira', code: 'NGN', type: 'fiat', balance: '2,500,000 NGN' },
];

const WalletsPage: React.FC = () => {
    const router = useRouter();
    const setBackPath = useNavigationStore((state) => state.setBackPath);
    const openSend = useTransactionStore((state) => state.openSend);
    const openReceive = useTransactionStore((state) => state.openReceive);
    const [activeTab, setActiveTab] = useState<'all' | 'fiat' | 'stablecoins' | 'crypto'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const handleCreateWallet = () => {
        alert('Creating a new wallet...');
    };

    // Filter wallets by active tab and search query
    const filteredWallets = WALLETS_DATA.filter((wallet) => {
        // Tab check
        if (activeTab === 'fiat' && wallet.type !== 'fiat') return false;
        if (activeTab === 'stablecoins' && wallet.type !== 'stablecoin') return false;
        if (activeTab === 'crypto' && wallet.type !== 'crypto') return false;

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
                    <Button
                        onClick={handleCreateWallet}
                        variant="primary"
                        className="rounded-full h-[40px] px-5 text-xs font-bold font-sans shadow-lg shadow-primary-500/10 active:scale-95 transition-all"
                        leftIcon={<Plus className="h-4.5 w-4.5" />}
                    >
                        Create Wallet
                    </Button>
                </div>
            </div>

            {/* Reusable Phone Send widget */}
            <PhoneSend />

            {/* Categories & Search Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
                {/* Tabs selection */}
                <div className="bg-[#0C1224] border border-[#131B30] rounded-xl p-1 flex items-center space-x-1 shrink-0">
                    {(['all', 'fiat', 'stablecoins', 'crypto'] as const).map((tab) => (
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredWallets.length > 0 ? (
                    filteredWallets.map((wallet) => {
                        return (
                            <div
                                key={wallet.id}
                                onClick={() => {
                                    setBackPath('/dashboard/wallets');
                                    router.push(`/dashboard/wallets/${wallet.id}`);
                                }}
                                className="bg-[#0C1224]/80 border border-[#131B30] hover:border-white/10 hover:bg-[#0E162A]/90 rounded-2xl p-4.5 flex items-center justify-between transition duration-250 cursor-pointer shadow-md select-none group"
                            >
                                <div className="flex items-center space-x-3.5 min-w-0">
                                    {/* Reusable CurrencyIcon Component */}
                                    <CurrencyIcon 
                                        code={wallet.code} 
                                        name={wallet.name}
                                        size="md"
                                        className="group-hover:scale-105 transition-transform duration-250"
                                    />

                                    {/* Detail label */}
                                    <div className="text-left min-w-0">
                                        <h4 className="font-satoshi font-black text-sm text-white group-hover:text-primary-400 transition-colors duration-200 truncate">
                                            {wallet.name}
                                        </h4>
                                        <span className="text-[10px] text-slate-500 font-bold tracking-wide uppercase block mt-0.5 select-none">
                                            {wallet.code} <span className="opacity-40">•</span> {wallet.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Balance */}
                                <div className="font-mono text-sm font-extrabold text-white text-right">
                                    {wallet.balance}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="lg:col-span-2 py-16 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-3 select-none">
                        <div className="text-center space-y-0.5">
                            <h4 className="text-xs font-bold text-white font-satoshi">No wallets matching filter</h4>
                            <p className="text-[11px] text-slate-550 font-sans">Try searching for another currency or type</p>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default WalletsPage;
