'use client'

import React, { useState, useEffect } from 'react'
import {
    ArrowUpDown,
    TrendingUp,
    TrendingDown,
    Check,
    ChevronDown,
    Info,
    X,
    CheckCircle2,
    RefreshCw
} from 'lucide-react'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { Sheet } from '@/components/ui/Sheet'
import { cn, formatCurrencyByLocale, formatValueByLocale } from '@/lib/utils'
import { NumberInput } from '@/components/ui/NumberInput'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'
import { exchangeService, QuoteData } from '@/services/exchange.service'
import { toast } from 'sonner'

export interface Wallet {
    id: string;
    name: string;
    code: string;
    type: 'fiat' | 'stablecoin';
    balance: string;
    rawBalance: number;
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



const LIVE_RATES = [
    { pair: 'EUR/USD', rate: '1.0825', change: 0.42 },
    { pair: 'GBP/USD', rate: '1.2710', change: 0.12 },
    { pair: 'USD/XAF', rate: '608.4', change: -0.20 },
    { pair: 'EUR/XOF', rate: '655.9', change: -0.05 },
    { pair: 'GBP/EUR', rate: '1.1636', change: 0.31 },
];

export const ExchangePage: React.FC = () => {
    const queryClient = useQueryClient();
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    // Core selection states
    const [fromWalletId, setFromWalletId] = useState<string>('usd');
    const [toWalletId, setToWalletId] = useState<string>('eur');

    // Dropdown open control
    const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
    const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);

    // Amount values
    const [fromAmount, setFromAmount] = useState('100');
    const [toAmount, setToAmount] = useState('');

    // Live countdown timer for preview quote
    const [timer, setTimer] = useState(30);
    const [rateMultiplier, setRateMultiplier] = useState(1.0);

    // Confirm step
    const [confirmQuote, setConfirmQuote] = useState<QuoteData | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmTimer, setConfirmTimer] = useState(30);

    // Load Wallets Dynamically
    const fiatQuery = useQuery({
        queryKey: ['accounts'],
        queryFn: () => accountService.getAccounts(),
    });

    const exchangeHistoryQuery = useQuery({
        queryKey: ['exchangeHistory'],
        queryFn: () => exchangeService.getExchangeHistory().catch(() => ({ success: false, data: [] })),
    });

    const liveRatesQuery = useQuery({
        queryKey: ['liveExchangeRates'],
        queryFn: async () => {
            const pairs = [
                { from: 'EUR', to: 'USD' },
                { from: 'GBP', to: 'USD' },
                { from: 'GBP', to: 'EUR' },
                { from: 'EUR', to: 'GBP' }
            ];
            
            const results = await Promise.all(
                pairs.map(async (p) => {
                    try {
                        const res = await exchangeService.getRate(p.from, p.to);
                        return {
                            pair: `${p.from}/${p.to}`,
                            rate: res.data.rate.toFixed(4),
                            change: p.from === 'GBP' ? 0.12 : -0.08
                        };
                    } catch (e) {
                        return null;
                    }
                })
            );
            return results.filter(Boolean) as { pair: string; rate: string; change: number }[];
        },
        refetchInterval: 30000,
    });

    const walletsList: Wallet[] = [];

    // Map fiat wallets (EUR, USD, GBP are supported by Nilos Exchange)
    if (fiatQuery.data?.success && Array.isArray(fiatQuery.data.data)) {
        fiatQuery.data.data
            .filter((acc) => acc.currency === 'EUR' || acc.currency === 'USD' || acc.currency === 'GBP')
            .forEach((acc) => {
                walletsList.push({
                    id: acc.currency.toLowerCase(),
                    name: CURRENCY_NAMES[acc.currency] || acc.currency,
                    code: acc.currency,
                    type: 'fiat',
                    balance: formatBalance(acc.balance, acc.currency),
                    rawBalance: parseFloat(acc.balance || '0'),
                });
            });
    }

    // Default configuration fallbacks
    const fromWallet = walletsList.find(w => w.id === fromWalletId) || walletsList[0] || {
        id: 'usd',
        name: 'US Dollar',
        code: 'USD',
        type: 'fiat' as const,
        balance: '$0.00',
        rawBalance: 0,
    };

    const isFromFiat = fromWallet.type === 'fiat';

    // Target wallets matching constraints: EUR, USD, GBP (excluding the selected From wallet)
    const filteredToWallets = walletsList.filter(w => w.id !== fromWallet.id);

    const toWallet = walletsList.find(w => w.id === toWalletId) || filteredToWallets[0] || walletsList[1] || {
        id: 'eur',
        name: 'Euro',
        code: 'EUR',
        type: 'fiat' as const,
        balance: '€0.00',
        rawBalance: 0,
    };

    // Auto update selection if violated
    useEffect(() => {
        if (walletsList.length > 0) {
            if (fromWallet.id === toWallet.id) {
                const firstValid = filteredToWallets[0];
                if (firstValid) {
                    setToWalletId(firstValid.id);
                }
            }
        }
    }, [fromWalletId, walletsList.length]);

    // Live rates query
    const rateQuery = useQuery({
        queryKey: ['exchangeRate', fromWallet.code, toWallet.code],
        queryFn: () => exchangeService.getRate(fromWallet.code, toWallet.code),
        enabled: !!fromWallet.code && !!toWallet.code && fromWallet.code !== toWallet.code && walletsList.length > 0,
    });

    const activeRate = rateQuery.data?.success ? rateQuery.data.data.rate * rateMultiplier : 1.0 * rateMultiplier;

    // Estimate conversions
    useEffect(() => {
        if (fromAmount === '') {
            setToAmount('');
            return;
        }
        const val = parseFloat(fromAmount) * activeRate;
        setToAmount(val.toFixed(toWallet.type === 'fiat' ? 2 : 6));
    }, [fromAmount, fromWallet.code, toWallet.code, activeRate]);

    // simulated live ticks
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    setRateMultiplier(1 + (Math.random() * 0.0006 - 0.0003));
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Countdown for confirmation quote
    useEffect(() => {
        if (!isConfirmOpen) return;
        const interval = setInterval(() => {
            setConfirmTimer((prev) => {
                if (prev <= 1) {
                    toast.error('Quote expired. Please request a new quote.');
                    setIsConfirmOpen(false);
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isConfirmOpen]);

    // Mutations
    const createQuoteMutation = useMutation({
        mutationFn: () => exchangeService.createQuote({
            from: fromWallet.code,
            to: toWallet.code,
            amount: parseFloat(fromAmount),
            side: 'SELL',
        }),
        onSuccess: (data) => {
            if (data?.success && data.data) {
                setConfirmQuote(data.data);
                setConfirmTimer(30);
                setIsConfirmOpen(true);
            } else {
                toast.error(data?.error?.message || 'Failed to request lock quote.');
            }
        },
        onError: (err: any) => {
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object' ? rawError.message : (rawError || 'Failed to generate quote.');
            toast.error(msg);
        }
    });

    const executeExchangeMutation = useMutation({
        mutationFn: (quoteId: string) => exchangeService.executeExchange({
            from: fromWallet.code,
            to: toWallet.code,
            amount: parseFloat(fromAmount),
            side: 'SELL',
            quoteId: quoteId,
        }),
        onSuccess: (data) => {
            if (data?.success) {
                setIsConfirmOpen(false);
                setIsSuccessOpen(true);
                // invalidate accounts
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
                queryClient.invalidateQueries({ queryKey: ['cryptoBalances'] });
                queryClient.invalidateQueries({ queryKey: ['activity'] });
                queryClient.invalidateQueries({ queryKey: ['exchangeHistory'] });
            } else {
                toast.error(data?.error?.message || 'Failed to execute conversion.');
            }
        },
        onError: (err: any) => {
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object' ? rawError.message : (rawError || 'Failed to convert.');
            toast.error(msg);
        }
    });

    const handleSwap = () => {
        const tempId = fromWalletId;
        setFromWalletId(toWalletId);
        setToWalletId(tempId);
    };

    const handleConvert = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fromAmount || parseFloat(fromAmount) <= 0) return;
        createQuoteMutation.mutate();
    };

    const handleConfirmExchange = () => {
        if (confirmQuote?.quoteId) {
            executeExchangeMutation.mutate(confirmQuote.quoteId);
        }
    };

    const handleCloseSuccess = () => {
        setIsSuccessOpen(false);
        setFromAmount('100');
    };

    const estimatedFee = parseFloat(fromAmount || '0') * 0.0015;

    // Load recent conversions
    const rawHistory = exchangeHistoryQuery.data?.success && Array.isArray(exchangeHistoryQuery.data.data)
        ? exchangeHistoryQuery.data.data
        : [];

    const recentExchanges = rawHistory.length > 0
        ? rawHistory.slice(0, 5)
        : [
            { id: 'mock-1', fromCode: 'USD', toCode: 'EUR', fromVal: '$100', toVal: '€92.40', date: 'Just now', rate: '0.9240' },
            { id: 'mock-2', fromCode: 'EUR', toCode: 'GBP', fromVal: '€500', toVal: '£420.50', date: 'Yesterday', rate: '0.8410' },
        ];

    const isLoading = fiatQuery.isLoading;

    if (isLoading && walletsList.length === 0) {
        return (
            <div className="text-center py-16 min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-t-primary-500 border-white/10 rounded-full animate-spin"></div>
                <p className="text-xs text-slate-550 font-sans">Connecting conversion rates...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div className="space-y-6 text-left">
                {/* Header Area */}
                <div className="space-y-1 select-none">
                    <h2 className="text-2xl font-black text-white font-satoshi">
                        Exchange
                    </h2>
                    <p className="text-xs font-semibold text-slate-550 font-sans">
                        Swap currencies instantly
                    </p>
                </div>

                {/* Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

                    {/* Left Column Form (3/5 width) */}
                    <form onSubmit={handleConvert} className="lg:col-span-3 space-y-5">

                        <div className="bg-[#080D1E] border border-white/5 rounded-3xl p-6.5 relative space-y-5 shadow-2xl">

                            {/* FROM Input Card */}
                            <div className="space-y-2 text-left">
                                <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">From</span>
                                <div className="relative">
                                    <div
                                        className="bg-[#0C1224] border border-white/10 rounded-2xl p-4 flex-wrap flex items-center justify-between transition focus-within:border-primary-500/50"
                                    >
                                        <div
                                            onClick={() => setIsFromDropdownOpen(!isFromDropdownOpen)}
                                            className="flex items-center space-x-2.5 cursor-pointer select-none"
                                        >
                                            <CurrencyIcon code={fromWallet.code} size="md" />
                                            <div className="text-left">
                                                <span className="font-bold text-white text-sm block leading-tight">{fromWallet.code}</span>
                                                <ChevronDown className="h-3 w-3 text-slate-500 inline mt-0.5" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end shrink-0">
                                            <NumberInput
                                                value={fromAmount}
                                                onChange={setFromAmount}
                                                placeholder="0.00"
                                                className="bg-transparent border-none focus:outline-none focus:ring-0 text-right text-white font-mono font-black text-xl placeholder-slate-700 leading-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Overlay to close dropdown when clicking outside */}
                                    {isFromDropdownOpen && (
                                        <div
                                            className="fixed inset-0 z-20"
                                            onClick={() => setIsFromDropdownOpen(false)}
                                        />
                                    )}

                                    {/* Dropdown Menu FROM */}
                                    {isFromDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1528] border border-white/10 rounded-2xl shadow-2xl z-30 max-h-[220px] overflow-y-auto scrollbar-none py-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                            {walletsList.map((w) => (
                                                <div
                                                    key={w.id}
                                                    onClick={() => {
                                                        setFromWalletId(w.id);
                                                        setIsFromDropdownOpen(false);
                                                    }}
                                                    className={cn(
                                                        "px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition",
                                                        fromWalletId === w.id ? "bg-white/[0.01]" : ""
                                                    )}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <CurrencyIcon code={w.code} size="md" />
                                                        <div className="text-left">
                                                            <span className="font-bold text-white text-xs block leading-tight">{w.name}</span>
                                                            <span className="text-[9px] text-slate-500 font-bold">{w.code} • {w.balance}</span>
                                                        </div>
                                                    </div>
                                                    {fromWalletId === w.id && <Check className="h-4 w-4 text-primary-400" />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-slate-555 font-bold select-none px-1">
                                    <span>Wallet balance: {fromWallet.balance}</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const num = fromWallet.rawBalance;
                                            setFromAmount(num > 0 ? num.toString() : '0');
                                        }}
                                        className="text-primary-400 hover:text-primary-350 hover:underline cursor-pointer"
                                    >
                                        Use max
                                    </button>
                                </div>
                            </div>

                            {/* Center Swap Button */}
                            <div className="relative h-2 flex items-center justify-center z-10 select-none">
                                <button
                                    type="button"
                                    onClick={handleSwap}
                                    className="w-9 h-9 rounded-full bg-[#0C1224] border border-white/10 hover:border-white/20 text-slate-400 hover:text-white flex items-center justify-center transition duration-200 cursor-pointer shadow-lg active:scale-90"
                                >
                                    <ArrowUpDown className="h-4.5 w-4.5" />
                                </button>
                            </div>

                            {/* TO Input Card */}
                            <div className="space-y-2 text-left">
                                <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">To</span>
                                <div className="relative">
                                    <div
                                        className="bg-[#0C1224] border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between transition focus-within:border-primary-500/50"
                                    >
                                        <div
                                            onClick={() => setIsToDropdownOpen(!isToDropdownOpen)}
                                            className="flex items-center space-x-2.5 cursor-pointer select-none"
                                        >
                                            <CurrencyIcon code={toWallet.code} size="md" />
                                            <div className="text-left">
                                                <span className="font-bold text-white text-sm block leading-tight">{toWallet.code}</span>
                                                <ChevronDown className="h-3 w-3 text-slate-500 inline mt-0.5" />
                                            </div>
                                        </div>

                                        <div className="flex items-center shrink-0">
                                            <span className="font-mono font-black text-xl text-emerald-400 mr-1 select-all">
                                                {formatValueByLocale(toAmount, toWallet.code, toWallet.type === 'fiat')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Overlay to close dropdown when clicking outside */}
                                    {isToDropdownOpen && (
                                        <div
                                            className="fixed inset-0 z-20"
                                            onClick={() => setIsToDropdownOpen(false)}
                                        />
                                    )}

                                    {/* Dropdown Menu TO */}
                                    {isToDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1528] border border-white/10 rounded-2xl shadow-2xl z-30 max-h-[220px] overflow-y-auto scrollbar-none py-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                            {filteredToWallets.map((w) => (
                                                <div
                                                    key={w.id}
                                                    onClick={() => {
                                                        setToWalletId(w.id);
                                                        setIsToDropdownOpen(false);
                                                    }}
                                                    className={cn(
                                                        "px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition",
                                                        toWalletId === w.id ? "bg-white/[0.01]" : ""
                                                    )}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <CurrencyIcon code={w.code} size="md" />
                                                        <div className="text-left">
                                                            <span className="font-bold text-white text-xs block leading-tight">{w.name}</span>
                                                            <span className="text-[9px] text-slate-500 font-bold">{w.code} • {w.balance}</span>
                                                        </div>
                                                    </div>
                                                    {toWalletId === w.id && <Check className="h-4 w-4 text-primary-400" />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Exchange rate status block */}
                            <div className="bg-black/25 border border-white/5 rounded-2xl p-4.5 flex justify-between items-center text-xs font-semibold select-none">
                                <div className="text-left space-y-0.5">
                                    <span className="text-white block font-bold font-mono">1 {fromWallet.code} = {activeRate.toFixed(4)} {toWallet.code}</span>
                                    <span className="text-[10px] text-slate-555 block">Mid-market rate • Updated live</span>
                                </div>
                                <div className="bg-[#0C1224] border border-white/5 text-[10px] text-slate-400 font-mono px-3 py-1.5 rounded-xl flex items-center space-x-1">
                                    <RefreshCw className="h-3 w-3 text-slate-500 animate-spin" />
                                    <span>00:{timer.toString().padStart(2, '0')}</span>
                                </div>
                            </div>

                            {/* Fee Breakdown Block */}
                            <div className="bg-black/20 border border-white/5 rounded-2.5xl p-5 space-y-3.5 select-none font-sans text-xs">
                                <div className="flex justify-between items-center pb-1 border-b border-white/[0.03]">
                                    <span className="text-slate-400 font-bold">Fee breakdown</span>
                                    <span className="font-bold text-emerald-400 font-mono">
                                        {formatBalance(estimatedFee, fromWallet.code)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-0.5">
                                    <span className="text-slate-555 font-semibold">Exchange fee</span>
                                    <span className="font-bold text-white font-mono flex items-center space-x-1">
                                        <CurrencyIcon code={fromWallet.code} size="sm" />
                                        <span>{estimatedFee.toFixed(fromWallet.type === 'fiat' ? 2 : 4)} {fromWallet.code} (0.15%)</span>
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-0.5">
                                    <span className="text-slate-555 font-semibold">Network fee</span>
                                    <span className="font-bold text-emerald-500">Free</span>
                                </div>

                                <div className="flex justify-between items-center py-0.5">
                                    <span className="text-slate-555 font-semibold">Settlement</span>
                                    <span className="font-bold text-white">Instant</span>
                                </div>
                            </div>

                            {/* Convert CTA */}
                            <button
                                type="submit"
                                disabled={!fromAmount || parseFloat(fromAmount) <= 0 || createQuoteMutation.isPending}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold text-sm tracking-wide shadow-lg transition duration-200 cursor-pointer active:scale-[0.98]",
                                    (fromAmount && parseFloat(fromAmount) > 0)
                                        ? "bg-primary-500 hover:bg-primary-450 text-white"
                                        : "bg-slate-800 text-slate-550 cursor-not-allowed"
                                )}
                            >
                                {createQuoteMutation.isPending ? 'Requesting quote...' : 'Exchange Now'}
                            </button>

                        </div>

                    </form>

                    {/* Right Column Rates/Conversions (2/5 width) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Live Rates panel */}
                        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl space-y-4">
                            <div className="flex justify-between items-center select-none pb-1 border-b border-white/[0.03]">
                                <h3 className="font-satoshi font-bold text-sm text-white">Live Rates</h3>
                                <span className="text-[10px] font-bold text-emerald-400 font-mono flex items-center space-x-1 select-none">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                                    <span>Live</span>
                                </span>
                            </div>
                            <div className="space-y-3.5">
                                {(liveRatesQuery.data && liveRatesQuery.data.length > 0 ? liveRatesQuery.data : [
                                    { pair: 'EUR/USD', rate: '1.0825', change: 0.42 },
                                    { pair: 'GBP/USD', rate: '1.2710', change: 0.12 },
                                    { pair: 'GBP/EUR', rate: '1.1636', change: 0.31 },
                                    { pair: 'EUR/GBP', rate: '0.8594', change: -0.15 },
                                ]).map((rate) => (
                                    <div key={rate.pair} className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-slate-355">{rate.pair}</span>
                                        <div className="text-right flex items-center space-x-2 font-mono">
                                            <span className="font-bold text-white">{rate.rate}</span>
                                            <span className={cn(
                                                "text-[10px] font-bold flex items-center space-x-0.5",
                                                rate.change > 0 ? "text-emerald-400" : "text-rose-455"
                                            )}>
                                                {rate.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                                <span>{rate.change > 0 ? '+' : ''}{rate.change}%</span>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Conversions panel */}
                        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl space-y-4">
                            <h3 className="font-satoshi font-bold text-sm text-white select-none pb-1 border-b border-white/[0.03] text-left">
                                Recent Conversions
                            </h3>
                            <div className="space-y-4">
                                {recentExchanges.map((conv: any) => (
                                    <div key={conv.id} className="flex justify-between items-center text-xs">
                                        <div className="flex items-center space-x-2.5 min-w-0">
                                            <div className="flex items-center -space-x-1.5 shrink-0">
                                                <CurrencyIcon code={conv.fromCode || conv.sourceCurrency || 'USD'} size="sm" />
                                                <CurrencyIcon code={conv.toCode || conv.targetCurrency || 'EUR'} size="sm" />
                                            </div>
                                            <div className="text-left">
                                                <span className="font-bold text-white block leading-tight">
                                                    {conv.fromVal || formatBalance(conv.sourceAmount || '0', conv.sourceCurrency || 'USD')} → {conv.toVal || formatBalance(conv.targetAmount || '0', conv.targetCurrency || 'EUR')}
                                                </span>
                                                <span className="text-[9px] text-slate-500 font-bold block mt-0.5 select-none">
                                                    {conv.date || (conv.createdAt ? new Date(conv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A')} • Rate {conv.rate}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                            <Check className="h-3 w-3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Institutional Rates Box */}
                        <div className="bg-primary-500/5 border border-primary-500/10 rounded-2.5xl p-5 flex items-start space-x-3 text-left">
                            <Info className="h-4.5 w-4.5 text-primary-400 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h4 className="text-xs font-bold text-white">Institutional Rates</h4>
                                <p className="text-[10.5px] leading-relaxed text-slate-400">
                                    DigitalCap FX offers interbank-equivalent rates with a flat 0.15% margin. No hidden spreads. No markup on mid-market rates.
                                </p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* Exchange Quote Confirmation Modal Sheet */}
            <Sheet
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
            >
                <div className="space-y-6 flex flex-col justify-between h-full text-center">
                    <div className="space-y-6 select-none pt-8 text-left">
                        <div className="space-y-2">
                            <h3 className="font-satoshi font-black text-2xl text-white tracking-tight">Confirm Exchange</h3>
                            <p className="text-[#6D778A] text-xs font-sans">
                                Please review your conversion parameters before accepting. Quotes expire dynamically to protect against volatility.
                            </p>
                        </div>

                        {confirmQuote && (
                            <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-5 space-y-4 font-sans text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 font-semibold">You Sell</span>
                                    <span className="font-extrabold text-white font-mono text-sm">
                                        {formatBalance(confirmQuote.sourceAmount, fromWallet.code)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 font-semibold">You Receive</span>
                                    <span className="font-extrabold text-emerald-400 font-mono text-sm">
                                        {formatBalance(confirmQuote.targetAmount, toWallet.code)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 font-semibold">Exchange Rate</span>
                                    <span className="font-bold text-white font-mono">
                                        1 {fromWallet.code} = {confirmQuote.rate.toFixed(4)} {toWallet.code}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 font-semibold">Margin Fee (0.15%)</span>
                                    <span className="font-bold text-slate-300 font-mono">
                                        {formatBalance(confirmQuote.fee, fromWallet.code)}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex items-center justify-between text-xs select-none">
                            <span className="text-amber-400 font-bold font-sans">Quote Lock Expiration</span>
                            <div className="bg-[#0C1224] border border-white/5 font-mono text-amber-400 px-3 py-1 rounded-xl flex items-center space-x-1 shrink-0">
                                <RefreshCw className="h-3 w-3 text-amber-500 animate-spin" />
                                <span>00:{confirmTimer.toString().padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mt-auto">
                        <button
                            onClick={handleConfirmExchange}
                            disabled={executeExchangeMutation.isPending}
                            className="w-full bg-emerald-500 hover:bg-emerald-450 text-white font-bold text-sm py-4 rounded-xl shadow-lg transition duration-200 cursor-pointer active:scale-[0.98]"
                        >
                            {executeExchangeMutation.isPending ? 'Executing Exchange...' : 'Confirm & Convert'}
                        </button>
                        <button
                            onClick={() => setIsConfirmOpen(false)}
                            className="w-full bg-[#0C1224] border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white font-bold text-sm py-4 rounded-xl transition duration-200 cursor-pointer active:scale-[0.98]"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Sheet>

            {/* Exchange Success Sheet Drawer */}
            <Sheet
                isOpen={isSuccessOpen}
                onClose={handleCloseSuccess}
            >
                <div className="space-y-6 flex flex-col justify-between h-full text-center">

                    {/* Success Header */}
                    <div className="space-y-6 select-none pt-8">
                        <div className="relative inline-flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-[20px]"></div>
                            <div className="relative w-18 h-18 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                                <CheckCircle2 className="h-9 w-9" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <span className="text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase font-mono block">
                                Exchange Successful
                            </span>

                            <div className="flex items-center justify-center space-x-2 text-2xl font-black text-white font-satoshi">
                                <CurrencyIcon code={fromWallet.code} size="sm" />
                                <span>{parseFloat(fromAmount).toLocaleString()} {fromWallet.code}</span>
                            </div>

                            <span className="text-[9px] font-bold text-slate-555 uppercase tracking-widest block py-0.5 select-none">
                                Exchanged to
                            </span>

                            <div className="flex items-center justify-center space-x-2 text-2.5xl font-black text-emerald-400 font-satoshi">
                                <CurrencyIcon code={toWallet.code} size="sm" />
                                <span>{parseFloat(toAmount).toLocaleString()} {toWallet.code}</span>
                            </div>
                        </div>
                    </div>

                    {/* Receipt Details Card */}
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-5 text-left space-y-3.5 select-none font-sans text-xs max-w-md mx-auto w-full">
                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Exchange rate</span>
                            <span className="font-mono text-slate-350">1 {fromWallet.code} = {activeRate.toFixed(4)} {toWallet.code}</span>
                        </div>

                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Exchange fee</span>
                            <span className="font-bold text-white font-mono flex items-center space-x-1.5">
                                <CurrencyIcon code={fromWallet.code} size="sm" />
                                <span>{estimatedFee.toFixed(fromWallet.type === 'fiat' ? 2 : 4)} {fromWallet.code}</span>
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Settlement</span>
                            <span className="text-white">Instant (same day)</span>
                        </div>

                        <div className="flex justify-between items-center py-0.5 border-t border-white/5 pt-3">
                            <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Transaction ID</span>
                            <span className="font-mono text-slate-350">CNV-EXEC-OK</span>
                        </div>
                    </div>

                    {/* CTA Done Button */}
                    <button
                        onClick={handleCloseSuccess}
                        className="w-full bg-primary-500 hover:bg-primary-450 text-white font-bold text-sm py-4 rounded-xl shadow-lg transition duration-200 cursor-pointer active:scale-[0.98] mt-auto select-none"
                    >
                        Done
                    </button>

                </div>
            </Sheet>

        </div>
    );
};

export default ExchangePage;
