'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
    ChevronLeft, 
    MoreHorizontal, 
    Send, 
    ArrowDownLeft, 
    RefreshCw, 
    FileText, 
    Eye, 
    EyeOff, 
    Copy, 
    Check,
    TrendingUp
} from 'lucide-react'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { Wallet } from './WalletsPage'
import { useTransactionStore } from '@/store/transactionStore'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { transferService } from '@/services/transfer.service'

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

// 30-Day Activity Chart Component
const ActivityChart: React.FC = () => {
    return (
        <div className="relative h-[160px] w-full pt-4">
            {/* Y Axis Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-slate-500 select-none pointer-events-none pb-6 font-mono">
                <div className="flex items-center justify-between border-b border-white/[0.02] pb-0.5 w-full"><span>160</span><div className="flex-grow ml-2 border-t border-white/[0.03] border-dashed"></div></div>
                <div className="flex items-center justify-between border-b border-white/[0.02] pb-0.5 w-full"><span>120</span><div className="flex-grow ml-2 border-t border-white/[0.03] border-dashed"></div></div>
                <div className="flex items-center justify-between border-b border-white/[0.02] pb-0.5 w-full"><span>80</span><div className="flex-grow ml-2 border-t border-white/[0.03] border-dashed"></div></div>
                <div className="flex items-center justify-between border-b border-white/[0.02] pb-0.5 w-full"><span>40</span><div className="flex-grow ml-2 border-t border-white/[0.03] border-dashed"></div></div>
                <div className="flex items-center justify-between w-full"><span>0</span><div className="flex-grow ml-2 border-t border-white/[0.03] border-dashed"></div></div>
            </div>

            {/* Path Drawing */}
            <div className="absolute inset-0 pl-8 pb-6 pt-1">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="wave-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>
                    <path 
                        d="M 0,80 C 15,75 25,82 40,65 C 55,48 70,55 85,38 C 93,30 97,18 100,10 L 100,100 L 0,100 Z" 
                        fill="url(#wave-grad)"
                    />
                    <path 
                        d="M 0,80 C 15,75 25,82 40,65 C 55,48 70,55 85,38 C 93,30 97,18 100,10" 
                        fill="none" 
                        stroke="#3B82F6" 
                        strokeWidth="2.5" 
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {/* X Axis Labels */}
            <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[8px] text-slate-500 font-bold font-sans select-none pt-1">
                <span>Jun 1</span>
                <span>Jun 5</span>
                <span>Jun 9</span>
                <span>Jun 13</span>
                <span>Jun 17</span>
                <span>Jun 25</span>
            </div>
        </div>
    );
};

interface WalletDetailsProps {
    wallet: Wallet;
    onBack: () => void;
}

// Transaction data models
interface Transaction {
    id: string;
    title: string;
    subtitle: string;
    amount: string;
    isIncoming: boolean;
    status: 'completed' | 'failed';
}

const WalletDetails: React.FC<WalletDetailsProps> = ({ wallet, onBack }) => {
    const router = useRouter();
    const [revealDetails, setRevealDetails] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const openSend = useTransactionStore((state) => state.openSend);
    const openReceive = useTransactionStore((state) => state.openReceive);

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 1800);
    };

    // Bank Account details strings
    const ibanValue = wallet.accountNumber || 'GB29 NMBK 8832 9012 3442 12';
    const ibanMasked = wallet.accountNumber 
        ? `${wallet.accountNumber.slice(0, 4)} **** **** **** **`
        : 'GB29 NMBK **** **** **** **';
    const swiftValue = 'NWBKGB2L';
    const routingValue = '021000021';
    const cryptoAddressValue = wallet.walletAddress || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
    const cryptoAddressMasked = wallet.walletAddress
        ? `${wallet.walletAddress.slice(0, 6)}...${wallet.walletAddress.slice(-5)}`
        : '0x71C7...8976F';

    // React Query Activity Log
    const activityQuery = useQuery({
        queryKey: ['activity'],
        queryFn: () => transferService.getActivity(),
    });

    // Map and filter transactions for this wallet
    const filteredTxs = (activityQuery.data?.success && Array.isArray(activityQuery.data.data))
        ? activityQuery.data.data
            .filter((tx) => tx.currency.toUpperCase() === wallet.code.toUpperCase())
            .map((tx) => {
                const isIncoming = tx.type.toLowerCase().includes('deposit') || 
                                   tx.type.toLowerCase().includes('receive') || 
                                   tx.type.toLowerCase().includes('fund') || 
                                   (tx.type.toLowerCase() === 'exchange' && parseFloat(tx.amount) > 0);
                
                const amtFormatted = (isIncoming ? '+' : '-') + formatBalance(Math.abs(parseFloat(tx.amount)), wallet.code);
                
                return {
                    id: tx.id,
                    title: tx.description || `${tx.type} transaction`,
                    subtitle: `${tx.type} • ${new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
                    amount: amtFormatted,
                    isIncoming,
                    status: tx.status.toLowerCase() === 'completed' ? 'completed' as const : 'failed' as const,
                };
            })
            .slice(0, 10)
        : [];

    const displayBalance = wallet.balance;

    return (
        <div className="space-y-6 text-left">
            
            {/* Header controls bar */}
            <div className="flex items-center justify-between select-none">
                <div className="flex items-center space-x-3.5">
                    <button
                        onClick={onBack}
                        className="w-9 h-9 rounded-full bg-[#0C1224] border border-white/5 hover:border-white/15 flex items-center justify-center text-slate-400 hover:text-white transition duration-200 cursor-pointer active:scale-95 shrink-0"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h2 className="font-satoshi font-black text-xl text-white">
                        {wallet.name}
                    </h2>
                </div>
                <button className="w-9 h-9 rounded-full bg-[#0C1224] border border-white/5 hover:border-white/15 flex items-center justify-center text-slate-400 hover:text-white transition duration-200 cursor-pointer">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            {/* Layout Grid columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Left side details (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Large Wallet Balance details Card */}
                    <div className="bg-gradient-to-br from-[#0F172A] to-[#0A0F1D] border border-white/5 rounded-3xl p-8 flex flex-col justify-between min-h-[190px] shadow-2xl relative overflow-hidden select-none">
                        {/* Glow backings */}
                        <div className="absolute right-[-40px] bottom-[-40px] w-[180px] h-[180px] rounded-full bg-white/[0.02] border border-white/[0.04] pointer-events-none"></div>
                        <div className="absolute right-[50px] top-[-50px] w-[150px] h-[150px] rounded-full bg-primary-500/5 blur-[50px] pointer-events-none"></div>

                        {/* Card Top section */}
                        <div className="flex justify-between items-start z-10">
                            {/* Logo */}
                            <CurrencyIcon code={wallet.code} name={wallet.name} size="lg" />

                            {/* Label code */}
                            <div className="text-right">
                                <h3 className="font-satoshi font-black text-lg text-white leading-none">
                                    {wallet.code}
                                </h3>
                                <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mt-1 block">
                                    {wallet.type}
                                </span>
                            </div>
                        </div>

                        {/* Card Bottom section */}
                        <div className="z-10 pt-6">
                            <span className="text-2xl md:text-3.5xl font-black text-white font-satoshi tracking-tight">
                                {displayBalance}
                            </span>
                        </div>
                    </div>

                    {/* Quick actions Hub */}
                    <div className="grid grid-cols-4 gap-3 select-none">
                        <button 
                            onClick={() => openSend(wallet.id)}
                            className="bg-[#0C1224] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center space-y-2 text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.01] transition duration-200 font-semibold cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 shrink-0">
                                <Send className="h-4 w-4" />
                            </div>
                            <span className="text-[11px]">Send</span>
                        </button>
                        <button 
                            onClick={() => openReceive(wallet.id)}
                            className="bg-[#0C1224] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center space-y-2 text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.01] transition duration-200 font-semibold cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                                <ArrowDownLeft className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-[11px]">Receive</span>
                        </button>
                        <button 
                            onClick={() => router.push('/exchange')}
                            className="bg-[#0C1224] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center space-y-2 text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.01] transition duration-200 font-semibold cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                                <RefreshCw className="h-4 w-4" />
                            </div>
                            <span className="text-[11px]">Exchange</span>
                        </button>
                        <button className="bg-[#0C1224] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center space-y-2 text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.01] transition duration-200 font-semibold cursor-pointer">
                            <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
                                <FileText className="h-4 w-4" />
                            </div>
                            <span className="text-[11px]">Statement</span>
                        </button>
                    </div>

                    {/* Transaction History list */}
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 text-left shadow-xl space-y-5">
                        <div className="flex justify-between items-center select-none">
                            <h3 className="font-satoshi font-bold text-base text-white">Transaction History</h3>
                            <button className="text-xs font-semibold text-primary-400 hover:text-primary-350 hover:underline">
                                View all
                            </button>
                        </div>

                        {/* List items */}
                        <div className="space-y-4">
                            {activityQuery.isLoading ? (
                                <div className="text-center py-6 text-xs text-slate-500 font-sans">
                                    Loading history...
                                </div>
                            ) : filteredTxs.length > 0 ? (
                                filteredTxs.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between py-1 border-b border-white/[0.03] last:border-b-0">
                                        <div className="flex items-center space-x-3.5 min-w-0">
                                            <div className={cn(
                                                "w-9 h-9 rounded-full flex items-center justify-center shrink-0 border",
                                                tx.isIncoming 
                                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                                                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                            )}>
                                                {tx.isIncoming ? <ArrowDownLeft className="h-4.5 w-4.5" /> : <Send className="h-3.5 w-3.5" />}
                                            </div>
                                            <div className="text-left min-w-0">
                                                <h4 className="font-sans font-bold text-xs text-white truncate">
                                                    {tx.title}
                                                </h4>
                                                <span className="text-[10px] text-slate-500 font-medium block mt-0.5 select-none">
                                                    {tx.subtitle}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Amount and Status details */}
                                        <div className="text-right select-none">
                                            <div className={cn(
                                                "font-mono text-xs font-extrabold",
                                                tx.isIncoming ? "text-emerald-400" : "text-white"
                                            )}>
                                                {tx.amount}
                                            </div>
                                            <span className={cn(
                                                "text-[9px] font-bold block mt-1 uppercase tracking-wider",
                                                tx.status === 'completed' ? "text-emerald-500" : "text-rose-500"
                                            )}>
                                                {tx.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-xs text-slate-500 font-sans select-none">
                                    No recent transactions for this wallet.
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Right side charts/info (1/3 width) */}
                <div className="space-y-6">
                    
                    {/* 30-Day Activity wave chart */}
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl">
                        <div className="flex justify-between items-center select-none mb-3">
                            <h3 className="font-satoshi font-bold text-sm text-white">30-Day Activity</h3>
                            <span className="text-[10px] font-bold text-emerald-400 font-mono flex items-center space-x-1">
                                <TrendingUp className="h-3 w-3 inline" />
                                <span>+8.2%</span>
                            </span>
                        </div>
                        <ActivityChart />
                    </div>

                    {/* Wallet Bank Account Information panel */}
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl space-y-4">
                        <h3 className="font-satoshi font-bold text-sm text-white select-none">
                            Wallet Information
                        </h3>

                        {wallet.type === 'fiat' ? (
                            <div className="space-y-3.5 text-xs">
                                {/* IBAN */}
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-slate-550 uppercase tracking-wider block select-none">IBAN</span>
                                    <div className="flex items-center justify-between bg-black/25 border border-white/5 rounded-lg px-2.5 py-1.5 font-mono text-slate-300">
                                        <span className="truncate mr-2">
                                            {revealDetails ? ibanValue : ibanMasked}
                                        </span>
                                        <div className="flex items-center space-x-2 shrink-0">
                                            <button 
                                                onClick={() => setRevealDetails(!revealDetails)}
                                                className="text-slate-500 hover:text-white transition duration-200 cursor-pointer"
                                            >
                                                {revealDetails ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                            </button>
                                            <button 
                                                onClick={() => handleCopy(ibanValue, 'iban')}
                                                className="text-slate-500 hover:text-white transition duration-200 cursor-pointer"
                                            >
                                                {copiedField === 'iban' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* SWIFT */}
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-slate-550 uppercase tracking-wider block select-none">SWIFT</span>
                                    <div className="flex items-center justify-between bg-black/25 border border-white/5 rounded-lg px-2.5 py-1.5 font-mono text-slate-300">
                                        <span>{swiftValue}</span>
                                        <button 
                                            onClick={() => handleCopy(swiftValue, 'swift')}
                                            className="text-slate-500 hover:text-white transition duration-200 cursor-pointer"
                                        >
                                            {copiedField === 'swift' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* ROUTING */}
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-slate-550 uppercase tracking-wider block select-none">ROUTING</span>
                                    <div className="flex items-center justify-between bg-black/25 border border-white/5 rounded-lg px-2.5 py-1.5 font-mono text-slate-300">
                                        <span>{routingValue}</span>
                                        <button 
                                            onClick={() => handleCopy(routingValue, 'routing')}
                                            className="text-slate-500 hover:text-white transition duration-200 cursor-pointer"
                                        >
                                            {copiedField === 'routing' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3.5 text-xs">
                                {/* Crypto Address */}
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-slate-550 uppercase tracking-wider block select-none">ADDRESS</span>
                                    <div className="flex items-center justify-between bg-black/25 border border-white/5 rounded-lg px-2.5 py-1.5 font-mono text-slate-300">
                                        <span className="truncate mr-2">
                                            {revealDetails ? cryptoAddressValue : cryptoAddressMasked}
                                        </span>
                                        <div className="flex items-center space-x-2 shrink-0">
                                            <button 
                                                onClick={() => setRevealDetails(!revealDetails)}
                                                className="text-slate-500 hover:text-white transition duration-200 cursor-pointer"
                                            >
                                                {revealDetails ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                            </button>
                                            <button 
                                                onClick={() => handleCopy(cryptoAddressValue, 'crypto')}
                                                className="text-slate-500 hover:text-white transition duration-200 cursor-pointer"
                                            >
                                                {copiedField === 'crypto' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-2 text-[10px] text-slate-550 leading-relaxed font-sans font-semibold border-t border-white/5 select-none text-left">
                            This account is held at DigitalCap FX Ltd - FCA registered - Protected under FSCS up to £85,000
                        </div>
                    </div>

                    {/* Currency Details panel */}
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl space-y-4 text-xs font-sans">
                        <h3 className="font-satoshi font-bold text-sm text-white select-none">
                            Currency
                        </h3>

                        {/* Currency name/code details */}
                        <div className="flex items-center space-x-3 select-none">
                            <CurrencyIcon code={wallet.code} name={wallet.name} size="sm" />
                            <div className="text-left">
                                <h4 className="font-bold text-white leading-none">
                                    {wallet.code}
                                </h4>
                                <span className="text-[10px] text-slate-500 font-bold block mt-1">
                                    {wallet.name}
                                </span>
                            </div>
                        </div>

                        {/* Monthly trend selector */}
                        <div className="w-full flex items-center justify-center bg-emerald-500/5 border border-emerald-500/10 rounded-xl py-2 px-3 text-[11px] text-emerald-400 font-semibold select-none">
                            <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                            <span>+8.2% vs last month</span>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default WalletDetails;
