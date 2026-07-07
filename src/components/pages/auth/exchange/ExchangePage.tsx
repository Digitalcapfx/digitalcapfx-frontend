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
import { WALLETS_DATA, Wallet } from '../wallet/WalletsPage'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { Sheet } from '@/components/ui/Sheet'
import { cn } from '@/lib/utils'

// Mock conversion rates
const CONVERSION_RATES: Record<string, Record<string, number>> = {
    // Fiat rates
    USD: { EUR: 0.85, GBP: 0.78, NGN: 1621.4, XOF: 600.0, XAF: 600.0, USD: 1 },
    EUR: { USD: 1.1762, GBP: 0.91, NGN: 1907.0, XOF: 705.0, XAF: 705.0, EUR: 1 },
    GBP: { USD: 1.282, EUR: 1.1636, NGN: 2085.0, XOF: 770.0, XAF: 770.0, GBP: 1 },
    NGN: { USD: 0.000616, EUR: 0.000524, GBP: 0.00048, XOF: 0.37, XAF: 0.37, NGN: 1 },
    XOF: { USD: 0.00167, EUR: 0.00142, GBP: 0.0013, NGN: 2.7, XAF: 1.0, XOF: 1 },
    XAF: { USD: 0.00167, EUR: 0.00142, GBP: 0.0013, NGN: 2.7, XOF: 1.0, XAF: 1 },
    // Crypto rates (using USDT base)
    USDT: { USDC: 1.0, BTC: 0.0000156, ETH: 0.000294, SOL: 0.00714, POL: 1.8, TRX: 8.3, LTC: 0.013, USDT: 1 },
    USDC: { USDT: 1.0, BTC: 0.0000156, ETH: 0.000294, SOL: 0.00714, POL: 1.8, TRX: 8.3, LTC: 0.013, USDC: 1 },
    BTC: { USDT: 64100.0, USDC: 64100.0, ETH: 18.8, SOL: 457.0, POL: 115000.0, TRX: 530000.0, LTC: 830.0, BTC: 1 },
    ETH: { USDT: 3400.0, USDC: 3400.0, BTC: 0.053, SOL: 24.2, POL: 6100.0, TRX: 28000.0, LTC: 44.0, ETH: 1 },
    SOL: { USDT: 140.0, USDC: 140.0, BTC: 0.00218, ETH: 0.041, POL: 252.0, TRX: 1150.0, LTC: 1.8, SOL: 1 },
    POL: { USDT: 0.55, USDC: 0.55, BTC: 0.0000086, ETH: 0.00016, SOL: 0.0039, TRX: 4.5, LTC: 0.007, POL: 1 },
    TRX: { USDT: 0.12, USDC: 0.12, BTC: 0.0000018, ETH: 0.000035, SOL: 0.00085, POL: 0.22, LTC: 0.0015, TRX: 1 },
    LTC: { USDT: 77.0, USDC: 77.0, BTC: 0.0012, ETH: 0.022, SOL: 0.55, POL: 140.0, TRX: 640.0, LTC: 1 },
};

interface RateDisplay {
    pair: string;
    rate: string;
    change: number;
}

const LIVE_RATES: RateDisplay[] = [
    { pair: 'EUR/USD', rate: '1.1762', change: 0.42 },
    { pair: 'GBP/USD', rate: '1.2710', change: 0.12 },
    { pair: 'USD/NGN', rate: '1,621.4', change: -1.20 },
    { pair: 'EUR/NGN', rate: '1,907.0', change: -0.85 },
    { pair: 'GBP/EUR', rate: '1.1636', change: 0.31 },
    { pair: 'USD/GHS', rate: '15.42', change: 0.08 },
];

interface RecentConversion {
    id: string;
    fromCode: string;
    toCode: string;
    fromVal: string;
    toVal: string;
    date: string;
    rate: string;
}

const RECENT_CONVERSIONS: RecentConversion[] = [
    { id: '1', fromCode: 'EUR', toCode: 'USD', fromVal: '€10,000', toVal: '$11,762', date: 'Jun 25', rate: '1.1762' },
    { id: '2', fromCode: 'GBP', toCode: 'USD', fromVal: '£5,000', toVal: '$6,355', date: 'Jun 24', rate: '1.2710' },
    { id: '3', fromCode: 'USD', toCode: 'NGN', fromVal: '$2,000', toVal: '₦3.24M', date: 'Jun 23', rate: '1,621.4' },
];

export const ExchangePage: React.FC = () => {
    // success sheet open control
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    
    // Core selection states
    const [fromWalletId, setFromWalletId] = useState<string>('usd');
    const [toWalletId, setToWalletId] = useState<string>('eur');
    
    // Dropdown open control
    const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
    const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
    
    // Amount values
    const [fromAmount, setFromAmount] = useState('10000');
    const [toAmount, setToAmount] = useState('');
    
    // Rates & Timer states
    const [timer, setTimer] = useState(30);
    const [rateMultiplier, setRateMultiplier] = useState(1.0);

    const fromWallet = WALLETS_DATA.find(w => w.id === fromWalletId) || WALLETS_DATA[0];
    const isFromFiat = fromWallet.type === 'fiat';

    // Filter target 'TO' currencies based on constraint: Fiat to Fiat OR Crypto to Crypto
    const filteredToWallets = WALLETS_DATA.filter(w => {
        const isToFiat = w.type === 'fiat';
        // Categorical constraint check
        if (isFromFiat !== isToFiat) return false;
        // Cannot convert same currency
        if (fromWallet.id === w.id) return false;
        return true;
    });

    const toWallet = WALLETS_DATA.find(w => w.id === toWalletId) || filteredToWallets[0] || WALLETS_DATA[1];

    // Force update target selection if it violates category rule on source swap
    useEffect(() => {
        const isToFiat = toWallet.type === 'fiat';
        if (isFromFiat !== isToFiat || fromWallet.id === toWallet.id) {
            const firstValid = filteredToWallets[0];
            if (firstValid) {
                setToWalletId(firstValid.id);
            }
        }
    }, [fromWalletId]);

    // Live countdown timer simulated rates updates
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    // Reset timer and fluctuate exchange rates slightly (±0.04%)
                    setRateMultiplier(1 + (Math.random() * 0.0008 - 0.0004));
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Resolve current exchange rate
    const baseRate = CONVERSION_RATES[fromWallet.code]?.[toWallet.code] || 1.0;
    const activeRate = baseRate * rateMultiplier;

    // Sync input values bidirectionally
    useEffect(() => {
        if (fromAmount === '') {
            setToAmount('');
            return;
        }
        const val = parseFloat(fromAmount) * activeRate;
        // Format to sensible decimal places
        setToAmount(val.toFixed(toWallet.type === 'fiat' ? 2 : 6));
    }, [fromAmount, fromWalletId, toWalletId, activeRate]);

    const handleSwap = () => {
        const tempId = fromWalletId;
        setFromWalletId(toWalletId);
        setToWalletId(tempId);
        setFromAmount(toAmount);
    };

    const handleConvert = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fromAmount || parseFloat(fromAmount) <= 0) return;
        setIsSuccessOpen(true);
    };

    const handleCloseSuccess = () => {
        setIsSuccessOpen(false);
        setFromAmount('10000');
    };

    const fee = parseFloat(fromAmount || '0') * 0.0015;

    return (
        <div className="space-y-6">
            
            <div className="space-y-6 text-left">
                {/* Header Area */}
                <div className="space-y-1 select-none">
                    <h2 className="text-2xl font-black text-white font-satoshi">
                        Exchange
                    </h2>
                    <p className="text-xs font-semibold text-slate-555 font-sans">
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
                                        className="bg-[#0C1224] border border-white/10 rounded-2xl p-4 flex items-center justify-between transition focus-within:border-primary-500/50"
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
                                            <input 
                                                type="number"
                                                value={fromAmount}
                                                onChange={(e) => setFromAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-40 bg-transparent border-none focus:outline-none focus:ring-0 text-right text-white font-mono font-black text-xl placeholder-slate-700 leading-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Dropdown Menu FROM */}
                                    {isFromDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1528] border border-white/10 rounded-2xl shadow-2xl z-30 max-h-[220px] overflow-y-auto scrollbar-none py-1.5">
                                            {WALLETS_DATA.map((w) => (
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
                                                            <span className="text-[9px] text-slate-500 font-bold uppercase">{w.code} • {w.balance}</span>
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
                                        onClick={() => setFromAmount(fromWallet.balance.replace(/[^0-9.]/g, ''))}
                                        className="text-primary-400 hover:text-primary-350 hover:underline cursor-pointer"
                                    >
                                        Use max
                                    </button>
                                </div>
                            </div>

                            {/* Center Swap Buttons Indicator */}
                            <div className="absolute left-1/2 top-[108px] -translate-x-1/2 -translate-y-1/2 z-10">
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
                                        className="bg-[#0C1224] border border-white/10 rounded-2xl p-4 flex items-center justify-between transition focus-within:border-primary-500/50"
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
                                                {toAmount || '0.00'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Dropdown Menu TO */}
                                    {isToDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1528] border border-white/10 rounded-2xl shadow-2xl z-30 max-h-[220px] overflow-y-auto scrollbar-none py-1.5">
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
                                                            <span className="text-[9px] text-slate-500 font-bold uppercase">{w.code} • {w.balance}</span>
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
                                        {fromWallet.type === 'fiat' ? '$' : ''}{fee.toFixed(fromWallet.type === 'fiat' ? 2 : 4)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-0.5">
                                    <span className="text-slate-555 font-semibold">Exchange fee</span>
                                    <span className="font-bold text-white font-mono flex items-center space-x-1">
                                        <CurrencyIcon code={fromWallet.code} size="sm" />
                                        <span>{fee.toFixed(fromWallet.type === 'fiat' ? 2 : 4)} {fromWallet.code} (0.15%)</span>
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
                                disabled={!fromAmount || parseFloat(fromAmount) <= 0}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold text-sm tracking-wide shadow-lg transition duration-200 cursor-pointer active:scale-[0.98]",
                                    (fromAmount && parseFloat(fromAmount) > 0)
                                        ? "bg-primary-500 hover:bg-primary-450 text-white"
                                        : "bg-slate-800 text-slate-550 cursor-not-allowed"
                                )}
                            >
                                Exchange Now
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
                                {LIVE_RATES.map((rate) => (
                                    <div key={rate.pair} className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-slate-350">{rate.pair}</span>
                                        <div className="text-right flex items-center space-x-2 font-mono">
                                            <span className="font-bold text-white">{rate.rate}</span>
                                            <span className={cn(
                                                "text-[10px] font-bold flex items-center space-x-0.5",
                                                rate.change > 0 ? "text-emerald-400" : "text-rose-450"
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
                                {RECENT_CONVERSIONS.map((conv) => (
                                    <div key={conv.id} className="flex justify-between items-center text-xs">
                                        <div className="flex items-center space-x-2.5 min-w-0">
                                            <div className="flex items-center -space-x-1.5 shrink-0">
                                                <CurrencyIcon code={conv.fromCode} size="sm" />
                                                <CurrencyIcon code={conv.toCode} size="sm" />
                                            </div>
                                            <div className="text-left">
                                                <span className="font-bold text-white block leading-tight">{conv.fromVal} → {conv.toVal}</span>
                                                <span className="text-[9px] text-slate-500 font-bold block mt-0.5 select-none">{conv.date} • Rate {conv.rate}</span>
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
                            <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Exchange fee</span>
                            <span className="font-bold text-white font-mono flex items-center space-x-1.5">
                                <CurrencyIcon code={fromWallet.code} size="sm" />
                                <span>{fee.toFixed(fromWallet.type === 'fiat' ? 2 : 4)} {fromWallet.code}</span>
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Settlement</span>
                            <span className="text-white">Instant (same day)</span>
                        </div>

                        <div className="flex justify-between items-center py-0.5 border-t border-white/5 pt-3">
                            <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Transaction ID</span>
                            <span className="font-mono text-slate-350">CNV-2026-8842</span>
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
