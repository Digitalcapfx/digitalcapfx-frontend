'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { useNavigationStore } from '@/store/navigationStore'
import { useQuery } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'

const getCardBg = (currency: string) => {
    switch (currency.toUpperCase()) {
        case 'USD':
            return 'bg-gradient-to-br from-[#1E88E5] to-[#1565C0] border-blue-400/20';
        case 'EUR':
            return 'bg-gradient-to-br from-[#7B1FA2] to-[#4A148C] border-purple-400/20';
        case 'GBP':
            return 'bg-gradient-to-br from-[#1565C0] to-[#0D47A1] border-indigo-400/20';
        case 'XOF':
            return 'bg-gradient-to-br from-[#EF6C00] to-[#E65100] border-orange-400/20';
        case 'XAF':
            return 'bg-gradient-to-br from-[#C62828] to-[#9E1A1A] border-rose-500/20';
        case 'USDC':
        case 'IUSD':
            return 'bg-gradient-to-br from-[#2775CA] to-[#1E5D9F] border-blue-300/20';
        default:
            return 'bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] border-emerald-500/20';
    }
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

const WalletCarousel: React.FC = () => {
    const router = useRouter();
    const setBackPath = useNavigationStore((state) => state.setBackPath);

    // Queries
    const fiatQuery = useQuery({
        queryKey: ['accounts'],
        queryFn: () => accountService.getAccounts(),
    });

    const cryptoQuery = useQuery({
        queryKey: ['cryptoBalances'],
        queryFn: () => accountService.getCryptoBalances(),
    });

    // Prepare live wallet list
    const wallets: Array<{ currency: string; amount: string; cardNum: string; bg: string }> = [];

    // Push crypto balance if loaded
    if (cryptoQuery.data?.success && cryptoQuery.data.data) {
        const d = cryptoQuery.data.data;
        const addr = d.walletAddress || '';
        const shortAddr = addr ? addr.slice(-4) : 'SCW';
        const symbol = d.symbol || 'iUSD';
        wallets.push({
            currency: symbol,
            cardNum: shortAddr,
            amount: d.balanceFormatted || formatBalance(d.balanceUsdc, symbol),
            bg: getCardBg(symbol),
        });
    }

    // Push fiat accounts
    if (fiatQuery.data?.success && Array.isArray(fiatQuery.data.data)) {
        fiatQuery.data.data.forEach((acc) => {
            const num = acc.accountNumber || '';
            const shortNum = num ? num.slice(-4) : 'DFX';
            wallets.push({
                currency: acc.currency,
                cardNum: shortNum,
                amount: formatBalance(acc.balance, acc.currency),
                bg: getCardBg(acc.currency),
            });
        });
    }

    // Standard fallback items if loading and empty
    const isLoading = fiatQuery.isLoading || cryptoQuery.isLoading;

    return (
        <div className="space-y-3 text-left">
            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block select-none">
                My Wallets
            </span>

            {isLoading && wallets.length === 0 ? (
                <div className="flex gap-4 pb-2 overflow-x-auto scrollbar-none">
                    {[1, 2, 3].map((idx) => (
                        <div key={idx} className="w-[200px] h-[130px] rounded-2xl bg-white/5 border border-white/5 animate-pulse shrink-0" />
                    ))}
                </div>
            ) : (
                <div className="flex overflow-x-auto pb-2 scrollbar-none select-none flex-wrap gap-4">
                    {wallets.map((card) => (
                        <div
                            key={card.currency}
                            onClick={() => {
                                setBackPath('/dashboard');
                                router.push(`/wallets/${card.currency.toLowerCase()}`);
                            }}
                            className={cn(
                                "w-[200px] h-[130px] rounded-2xl p-5 flex-1 border flex flex-col justify-between shrink-0 hover:scale-[1.02] transition duration-200 cursor-pointer shadow-lg group",
                                card.bg
                            )}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-2">
                                    <CurrencyIcon code={card.currency} size="sm" className="border-none shadow-none bg-white/10" />
                                    <span className="text-sm font-bold tracking-wider text-white group-hover:text-white/95">{card.currency}</span>
                                </div>
                                <span className="text-[10px] opacity-60 font-mono text-white pt-1 whitespace-nowrap">**** {card.cardNum}</span>
                            </div>
                            <div className="text-xl font-extrabold font-satoshi text-white tracking-tight">
                                {card.amount}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WalletCarousel;
