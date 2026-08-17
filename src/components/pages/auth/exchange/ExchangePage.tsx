'use client'

import React, { useState, useEffect } from 'react'
import { ArrowUpDown, RefreshCw, ShieldCheck } from 'lucide-react'
import { cn, formatCurrencyByLocale } from '@/lib/utils'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountService, extractCryptoTokenList } from '@/services/account.service'
import { exchangeService, QuoteData, CaasSwapResponseItem } from '@/services/exchange.service'
import { toast } from 'sonner'
import { useLanguageStore } from '@/store/languageStore'
import { FEATURE_FLAGS } from '@/config/featureFlags'

import { Wallet } from './types'
import { ExchangeHeader } from './components/ExchangeHeader'
import { WalletSelector } from './components/WalletSelector'
import { LiveRatesCard } from './components/LiveRatesCard'
import { RecentConversionsCard } from './components/RecentConversionsCard'
import { ExchangeConfirmationModal } from './components/ExchangeConfirmationModal'
import { ExchangeSuccessModal } from './components/ExchangeSuccessModal'

const CURRENCY_NAMES: Record<string, string> = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    XOF: 'CFA Franc BCEAO',
    XAF: 'CFA Franc BEAC',
    USDC: 'USD Coin',
    USDT: 'Tether USD',
    IUSD: 'Instant USD',
    NGN: 'Nigerian Naira',
};

const formatBalance = (amount: string | number, currency: string) => {
    return formatCurrencyByLocale(amount, currency);
};

const getDecimals = (network: string): number => {
    const net = network.toUpperCase();
    if (net === 'BTC' || net === 'BCH' || net === 'LTC') return 8;
    if (net === 'SOL') return 9;
    if (net === 'TRX' || net === 'XRP' || net === 'USDC' || net === 'USDT') return 6;
    return 18;
};

const amountInBase = (amount: string, network: string): string => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return '0';
    return `${val}`;
};

const amountFromBase = (amountBase: string, network: string): string => {
    const val = parseFloat(amountBase);
    if (isNaN(val) || val <= 0) return '0.00';
    const decimals = getDecimals(network);
    return (val / Math.pow(10, decimals)).toString();
};

export const ExchangePage: React.FC = () => {
    const { t } = useLanguageStore();
    const queryClient = useQueryClient();
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    // Core selection states
    const [fromWalletId, setFromWalletId] = useState<string>('caas-usdt');
    const [toWalletId, setToWalletId] = useState<string>('caas-usdc');

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
    const [successCaasData, setSuccessCaasData] = useState<CaasSwapResponseItem | null>(null);

    // Dynamic queries
    const fiatQuery = useQuery({
        queryKey: ['accounts'],
        queryFn: () => accountService.getAccounts(),
    });

    const cryptoQuery = useQuery({
        queryKey: ['cryptoBalances'],
        queryFn: () => accountService.getCryptoBalances(),
    });

    const caasSwapsQuery = useQuery({
        queryKey: ['caasSwaps'],
        queryFn: () => exchangeService.getCaasSwaps().catch(() => ({ success: false, data: [] })),
        refetchInterval: 15000,
    });

    const exchangeHistoryQuery = useQuery({
        queryKey: ['exchangeHistory'],
        queryFn: () => exchangeService.getExchangeHistory().catch(() => ({ success: false, data: [] })),
    });

    const waasWalletsQuery = useQuery({
        queryKey: ['waasWallets'],
        queryFn: () => accountService.getWaaSWallets(),
        enabled: FEATURE_FLAGS.ALLOW_CRYPTO,
    });

    const liveRatesQuery = useQuery({
        queryKey: ['liveExchangeRates'],
        queryFn: async () => {
            const pairs = [
                { from: 'USDT', to: 'USDC' },
                { from: 'USDC', to: 'USDT' },
                { from: 'EUR', to: 'USD' },
                { from: 'GBP', to: 'USD' },
                { from: 'GBP', to: 'EUR' },
                { from: 'EUR', to: 'GBP' },
            ];

            const results = await Promise.all(
                pairs.map(async (p) => {
                    try {
                        if ((p.from === 'USDT' && p.to === 'USDC') || (p.from === 'USDC' && p.to === 'USDT')) {
                            return { pair: `${p.from}/${p.to}`, rate: '1.0000', change: 0.00 };
                        }
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

    // Map stablecoin wallets
    const rawCryptoData = cryptoQuery.data?.success && cryptoQuery.data.data ? cryptoQuery.data.data : null;
    const caasTokenList = extractCryptoTokenList(rawCryptoData);

    const usdcItem = caasTokenList.find((t: any) => (t.symbol || '').toUpperCase() === 'USDC');
    const usdtItem = caasTokenList.find((t: any) => (t.symbol || '').toUpperCase() === 'USDT');

    const usdcBalVal = usdcItem && typeof usdcItem.balance === 'number' ? usdcItem.balance : parseFloat(usdcItem?.balance_raw || usdcItem?.balance_usdc || '0');
    const usdtBalVal = usdtItem && typeof usdtItem.balance === 'number' ? usdtItem.balance : parseFloat(usdtItem?.balance_raw || usdtItem?.balance_usdt || '0');

    walletsList.push({
        id: 'caas-usdt',
        name: 'USDT Wallet',
        code: 'USDT',
        type: 'stablecoin',
        balance: `${usdtBalVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`,
        rawBalance: usdtBalVal,
        provider: 'caas'
    });

    walletsList.push({
        id: 'caas-usdc',
        name: 'USDC Wallet',
        code: 'USDC',
        type: 'stablecoin',
        balance: `${usdcBalVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`,
        rawBalance: usdcBalVal,
        provider: 'caas'
    });

    // Map fiat wallets
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

    // Selected Wallet Fallbacks
    const fromWallet = walletsList.find(w => w.id === fromWalletId) || walletsList[0] || {
        id: 'caas-usdt',
        name: 'USDT Wallet',
        code: 'USDT',
        type: 'stablecoin' as const,
        balance: '0.00 USDT',
        rawBalance: 0,
        provider: 'caas' as const
    };

    const filteredToWallets = walletsList.filter(w => w.id !== fromWallet.id && w.type === fromWallet.type);

    const toWallet = walletsList.find(w => w.id === toWalletId) || filteredToWallets[0] || walletsList[1] || {
        id: 'caas-usdc',
        name: 'USDC Wallet',
        code: 'USDC',
        type: 'stablecoin' as const,
        balance: '0.00 USDC',
        rawBalance: 0,
        provider: 'caas' as const
    };

    // Auto fix selection if invalid
    useEffect(() => {
        if (walletsList.length > 0) {
            if (fromWallet.id === toWallet.id || fromWallet.type !== toWallet.type) {
                const firstValid = filteredToWallets[0];
                if (firstValid) {
                    setToWalletId(firstValid.id);
                }
            }
        }
    }, [fromWalletId, walletsList.length, fromWallet.type, toWallet.type]);

    const isCaasSwap = fromWallet.provider === 'caas' || 
        (fromWallet.type === 'stablecoin' && ['USDT', 'USDC'].includes(fromWallet.code.toUpperCase()) && ['USDT', 'USDC'].includes(toWallet.code.toUpperCase()));

    const isCryptoSwap = fromWallet.type === 'stablecoin';

    const rateQuery = useQuery({
        queryKey: ['exchangeRate', fromWallet.code, toWallet.code],
        queryFn: () => exchangeService.getRate(fromWallet.code, toWallet.code),
        enabled: !isCryptoSwap && !!fromWallet.code && !!toWallet.code && fromWallet.code !== toWallet.code && walletsList.length > 0,
    });

    const cryptoRateQuery = useQuery({
        queryKey: ['cryptoExchangeRate', fromWallet.code, toWallet.code, fromAmount],
        queryFn: () => exchangeService.getWaaSSwapQuote({
            fromChain: fromWallet.code,
            toChain: toWallet.code,
            fromToken: fromWallet.code,
            toToken: toWallet.code,
            amountIn: amountInBase(fromAmount || '1', fromWallet.code)
        }),
        enabled: isCryptoSwap && !isCaasSwap && !!fromWallet.code && !!toWallet.code && fromWallet.code !== toWallet.code && walletsList.length > 0 && parseFloat(fromAmount || '0') > 0,
        refetchInterval: 15000,
    });

    const activeRate = isCaasSwap
        ? 1.0
        : isCryptoSwap
            ? (cryptoRateQuery.data?.success && cryptoRateQuery.data.data && parseFloat(cryptoRateQuery.data.data.fromAmount) > 0
                ? (parseFloat(cryptoRateQuery.data.data.toAmountExpected) / parseFloat(cryptoRateQuery.data.data.fromAmount)) * (Math.pow(10, getDecimals(fromWallet.code)) / Math.pow(10, getDecimals(toWallet.code)))
                : 1.0)
            : (rateQuery.data?.success ? rateQuery.data.data.rate * rateMultiplier : 1.0 * rateMultiplier);

    useEffect(() => {
        if (fromAmount === '') {
            setToAmount('');
            return;
        }
        if (isCaasSwap) {
            const val = parseFloat(fromAmount || '0');
            setToAmount(isNaN(val) ? '' : val.toFixed(2));
        } else if (isCryptoSwap) {
            if (cryptoRateQuery.data?.success && cryptoRateQuery.data.data) {
                const amtExpectedBase = cryptoRateQuery.data.data.toAmountExpected || '0';
                const humanReadable = amountFromBase(amtExpectedBase, toWallet.code);
                setToAmount(parseFloat(humanReadable).toFixed(6));
            } else {
                setToAmount('');
            }
        } else {
            const val = parseFloat(fromAmount) * activeRate;
            setToAmount(val.toFixed(2));
        }
    }, [fromAmount, fromWallet.code, toWallet.code, activeRate, isCaasSwap, isCryptoSwap, cryptoRateQuery.data]);

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

    const executeCaasSwapMutation = useMutation({
        mutationFn: () => exchangeService.executeCaasSwap({
            amount: fromAmount,
            token_in: fromWallet.code.toUpperCase(),
            token_out: toWallet.code.toUpperCase(),
        }),
        onSuccess: (data) => {
            if (data?.success && data.data) {
                const item = data.data;
                const tokenIn = item.tokenIn || item.token_in || fromWallet.code;
                const tokenOut = item.tokenOut || item.token_out || toWallet.code;
                const amtIn = item.amountIn || item.amount_in || fromAmount;
                const amtOut = item.amountOut || item.amount_out || amtIn;

                setIsConfirmOpen(false);
                setSuccessCaasData(item);
                setIsSuccessOpen(true);
                queryClient.invalidateQueries({ queryKey: ['cryptoBalances'] });
                queryClient.invalidateQueries({ queryKey: ['caasSwaps'] });
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
                queryClient.invalidateQueries({ queryKey: ['activity'] });
                queryClient.invalidateQueries({ queryKey: ['exchangeHistory'] });
                toast.success(`Swapped ${amtIn} ${tokenIn} to ${amtOut} ${tokenOut}`);
            } else {
                toast.error(data?.error?.message || 'Failed to execute CaaS swap.');
            }
        },
        onError: (err: any) => {
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object' ? rawError.message : (rawError || 'Failed to execute CaaS swap.');
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
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
                queryClient.invalidateQueries({ queryKey: ['waasWallets'] });
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

    const executeWaaSSwapMutation = useMutation({
        mutationFn: () => exchangeService.executeWaaSSwap({
            fromChain: fromWallet.code,
            toChain: toWallet.code,
            fromToken: fromWallet.code,
            toToken: toWallet.code,
            amountIn: amountInBase(fromAmount, fromWallet.code),
            amountOutMin: cryptoRateQuery.data?.data?.toAmountMin || amountInBase((parseFloat(toAmount) * 0.99).toString(), toWallet.code)
        }),
        onSuccess: (data) => {
            if (data?.success) {
                setIsConfirmOpen(false);
                setIsSuccessOpen(true);
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
                queryClient.invalidateQueries({ queryKey: ['waasWallets'] });
                queryClient.invalidateQueries({ queryKey: ['activity'] });
                queryClient.invalidateQueries({ queryKey: ['exchangeHistory'] });
            } else {
                toast.error(data?.error?.message || 'Failed to execute swap.');
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
        
        if (isCaasSwap) {
            setConfirmQuote({
                quoteId: 'caas-swap-quote',
                rate: 1.0,
                sourceAmount: parseFloat(fromAmount),
                targetAmount: parseFloat(fromAmount),
                fee: 0,
                expiresAt: new Date(Date.now() + 30000).toISOString()
            });
            setConfirmTimer(30);
            setIsConfirmOpen(true);
        } else if (isCryptoSwap) {
            if (!cryptoRateQuery.data?.success || !cryptoRateQuery.data.data) {
                toast.error('No crypto swap rate quote available. Please wait a moment.');
                return;
            }
            const q = cryptoRateQuery.data.data;
            const feeVal = parseFloat(amountFromBase(q.platformFee || '0', fromWallet.code));
            const targetVal = parseFloat(amountFromBase(q.toAmountExpected || '0', toWallet.code));
            setConfirmQuote({
                quoteId: 'waas-swap-quote',
                rate: activeRate,
                sourceAmount: parseFloat(fromAmount),
                targetAmount: targetVal,
                fee: feeVal,
                expiresAt: new Date(Date.now() + 30000).toISOString()
            });
            setConfirmTimer(30);
            setIsConfirmOpen(true);
        } else {
            createQuoteMutation.mutate();
        }
    };

    const handleConfirmExchange = () => {
        if (isCaasSwap) {
            executeCaasSwapMutation.mutate();
        } else if (isCryptoSwap) {
            executeWaaSSwapMutation.mutate();
        } else if (confirmQuote?.quoteId) {
            executeExchangeMutation.mutate(confirmQuote.quoteId);
        }
    };

    const handleCloseSuccess = () => {
        setIsSuccessOpen(false);
        setSuccessCaasData(null);
        setFromAmount('100');
    };

    // Load recent conversions
    const rawCaasHistory = caasSwapsQuery.data?.success && Array.isArray(caasSwapsQuery.data.data)
        ? caasSwapsQuery.data.data.map((s: CaasSwapResponseItem) => {
            const tokenIn = s.tokenIn || s.token_in || 'USDT';
            const tokenOut = s.tokenOut || s.token_out || 'USDC';
            const rawAmtIn = s.amountIn || s.amount_in || '0';
            const rawAmtOut = s.amountOut != null ? s.amountOut : (s.amount_out != null ? s.amount_out : rawAmtIn);

            const amtInVal = parseFloat(rawAmtIn);
            const amtOutVal = parseFloat(rawAmtOut);

            const formattedIn = isNaN(amtInVal) ? rawAmtIn : amtInVal.toFixed(2);
            const formattedOut = isNaN(amtOutVal) ? rawAmtOut : amtOutVal.toFixed(2);

            const dateStr = s.createdAt || s.created_at || new Date().toISOString();
            const ref = s.reference || s.caasSwapId || s.caas_swap_id || s.id;

            return {
                id: s.id || ref,
                fromCode: tokenIn,
                toCode: tokenOut,
                sourceAmount: rawAmtIn,
                targetAmount: rawAmtOut,
                fromVal: `${formattedIn} ${tokenIn}`,
                toVal: `${formattedOut} ${tokenOut}`,
                rate: '1.0000',
                createdAt: dateStr,
                status: s.status,
                reference: ref,
                isCaas: true,
            };
        })
        : [];

    const rawFiatHistory = exchangeHistoryQuery.data?.success && Array.isArray(exchangeHistoryQuery.data.data)
        ? exchangeHistoryQuery.data.data
        : [];

    const combinedHistory = [...rawCaasHistory, ...rawFiatHistory].sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
        const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
        return dateB - dateA;
    });

    const recentExchanges = combinedHistory.slice(0, 6);

    const isLoading = fiatQuery.isLoading && cryptoQuery.isLoading;

    if (isLoading && walletsList.length === 0) {
        return (
            <div className="text-center py-16 min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-t-primary-500 border-white/10 rounded-full animate-spin"></div>
                <p className="text-xs text-slate-555 font-sans">{t('exchange.loading')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-6 text-left">
                {/* Header Area Component */}
                <ExchangeHeader isCaasSwap={isCaasSwap} />

                {/* Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

                    {/* Left Column Form (3/5 width) */}
                    <form onSubmit={handleConvert} className="lg:col-span-3 space-y-5">
                        <div className="bg-[#080D1E] border border-white/5 rounded-3xl p-6.5 relative space-y-5 shadow-2xl">

                            {/* Banner Notification */}
                            {isCaasSwap && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 flex items-center justify-between text-xs select-none">
                                    <div className="flex items-center space-x-2 text-emerald-400">
                                        <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
                                        <span className="font-bold text-[11px]">
                                            Instant Stablecoin Swap • 1:1 Rate
                                        </span>
                                    </div>
                                    <span className="text-[9.5px] font-mono bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-lg uppercase">
                                        Active
                                    </span>
                                </div>
                            )}

                            {/* FROM Wallet Selector Component */}
                            <WalletSelector
                                label={t('exchange.from')}
                                selectedWallet={fromWallet}
                                walletsList={walletsList}
                                isOpen={isFromDropdownOpen}
                                onToggleOpen={() => setIsFromDropdownOpen(!isFromDropdownOpen)}
                                onCloseDropdown={() => setIsFromDropdownOpen(false)}
                                onSelectWallet={(id) => setFromWalletId(id)}
                                amount={fromAmount}
                                onAmountChange={setFromAmount}
                                showMaxButton={true}
                                onMaxClick={() => setFromAmount(fromWallet.rawBalance > 0 ? fromWallet.rawBalance.toString() : '0')}
                            />

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

                            {/* TO Wallet Selector Component */}
                            <WalletSelector
                                label={t('exchange.to')}
                                selectedWallet={toWallet}
                                walletsList={filteredToWallets}
                                isOpen={isToDropdownOpen}
                                onToggleOpen={() => setIsToDropdownOpen(!isToDropdownOpen)}
                                onCloseDropdown={() => setIsToDropdownOpen(false)}
                                onSelectWallet={(id) => setToWalletId(id)}
                                amount={toAmount}
                                isReadOnly={true}
                            />

                            {/* Exchange Rate Status Block */}
                            <div className="bg-black/25 border border-white/5 rounded-2xl p-4.5 flex justify-between items-center text-xs font-semibold select-none">
                                <div className="text-left space-y-0.5">
                                    <span className="text-white block font-bold font-mono">
                                        1 {fromWallet.code} = {activeRate.toFixed(2)} {toWallet.code}
                                    </span>
                                    <span className="text-[10px] text-slate-555 block">
                                        {isCaasSwap ? '1:1 Stablecoin Rate' : t('exchange.midMarketRate')}
                                    </span>
                                </div>
                                <div className="bg-[#0C1224] border border-white/5 text-[10px] text-slate-400 font-mono px-3 py-1.5 rounded-xl flex items-center space-x-1">
                                    <RefreshCw className="h-3 w-3 text-slate-500 animate-spin" />
                                    <span>00:{timer.toString().padStart(2, '0')}</span>
                                </div>
                            </div>

                            {/* Convert CTA */}
                            <button
                                type="submit"
                                disabled={!fromAmount || parseFloat(fromAmount) <= 0 || createQuoteMutation.isPending || executeCaasSwapMutation.isPending}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold text-sm tracking-wide shadow-lg transition duration-200 cursor-pointer active:scale-[0.98]",
                                    (fromAmount && parseFloat(fromAmount) > 0)
                                        ? "bg-primary-500 hover:bg-primary-450 text-white"
                                        : "bg-slate-800 text-slate-550 cursor-not-allowed"
                                )}
                            >
                                {executeCaasSwapMutation.isPending 
                                    ? 'Swapping Stablecoins...' 
                                    : isCryptoSwap && cryptoRateQuery.isFetching 
                                        ? t('exchange.cta.fetchingRate') 
                                        : createQuoteMutation.isPending 
                                            ? t('exchange.cta.requestingQuote') 
                                            : isCaasSwap 
                                                ? `Swap ${fromWallet.code} to ${toWallet.code} Now` 
                                                : t('exchange.cta.exchangeNow')}
                            </button>
                        </div>
                    </form>

                    {/* Right Column Rates/Conversions (2/5 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Live Rates Card Component */}
                        <LiveRatesCard rates={liveRatesQuery.data} />

                        {/* Recent Conversions Card Component */}
                        <RecentConversionsCard recentExchanges={recentExchanges} />
                    </div>

                </div>
            </div>

            {/* Exchange Quote Confirmation Modal Component */}
            <ExchangeConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                isCaasSwap={isCaasSwap}
                confirmQuote={confirmQuote}
                fromWallet={fromWallet}
                toWallet={toWallet}
                fromAmount={fromAmount}
                toAmount={toAmount}
                activeRate={activeRate}
                confirmTimer={confirmTimer}
                isPending={executeExchangeMutation.isPending || executeWaaSSwapMutation.isPending || executeCaasSwapMutation.isPending}
                onConfirm={handleConfirmExchange}
            />

            {/* Exchange Success Modal Component */}
            <ExchangeSuccessModal
                isOpen={isSuccessOpen}
                onClose={handleCloseSuccess}
                isCaasSwap={isCaasSwap}
                fromWallet={fromWallet}
                toWallet={toWallet}
                fromAmount={fromAmount}
                toAmount={toAmount}
                activeRate={activeRate}
                successCaasData={successCaasData}
            />
        </div>
    );
};

export default ExchangePage;
