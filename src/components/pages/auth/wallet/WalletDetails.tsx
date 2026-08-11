'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Send,
    ArrowDownLeft,
    RefreshCw,
    FileText,
    Eye,
    EyeOff,
    Copy,
    Check,
    TrendingUp,
    Lock
} from 'lucide-react'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { Wallet } from './WalletsPage'
import { useTransactionStore } from '@/store/transactionStore'
import { cn, formatCurrencyByLocale } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'
import { useQuery } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'
import Sheet from '@/components/ui/Sheet'
import { toast } from 'sonner'

const formatBalance = (amount: string | number, currency: string) => {
    return formatCurrencyByLocale(amount, currency);
};

const getTokenStyles = (token?: string, walletCode?: string) => {
    const sym = (token || walletCode || '').toUpperCase();
    if (sym === 'USDC') {
        return {
            sym: 'USDC',
            badgeBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
            iconBg: 'bg-blue-500/10 border-blue-500/25 text-blue-400',
        };
    }
    if (sym === 'USDT') {
        return {
            sym: 'USDT',
            badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
            iconBg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
        };
    }
    if (sym === 'IUSD') {
        return {
            sym: 'iUSD',
            badgeBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
            iconBg: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400',
        };
    }
    if (sym === 'BUSD') {
        return {
            sym: 'BUSD',
            badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
            iconBg: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
        };
    }
    return {
        sym: sym || 'CRYPTO',
        badgeBg: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
        iconBg: 'bg-slate-500/10 border-slate-500/25 text-slate-400',
    };
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
    initialTransactions?: any[];
    onBack: () => void;
    momoTab?: 'deposits' | 'withdrawals';
    setMomoTab?: (tab: 'deposits' | 'withdrawals') => void;
    currentPage?: number;
    onPageChange?: (newPage: number) => void;
    hasNextPage?: boolean;
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

const WalletDetails: React.FC<WalletDetailsProps> = ({
    wallet,
    initialTransactions = [],
    onBack,
    momoTab = 'deposits',
    setMomoTab,
    currentPage = 1,
    onPageChange,
    hasNextPage = false
}) => {
    const isMomoWallet = wallet.code === 'XAF' || wallet.code === 'XOF';
    const { t } = useLanguageStore();
    const router = useRouter();
    const [revealDetails, setRevealDetails] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [selectedTx, setSelectedTx] = useState<any | null>(null);
    const [tokenFilter, setTokenFilter] = useState<'ALL' | 'USDT' | 'USDC'>('ALL');
    const openSend = useTransactionStore((state) => state.openSend);
    const openReceive = useTransactionStore((state) => state.openReceive);

    const cryptoWalletQuery = useQuery({
        queryKey: ['cryptoWallet'],
        queryFn: () => accountService.getCryptoWallet(),
        enabled: wallet.type === 'stablecoin',
    });

    const caasWalletData = cryptoWalletQuery.data?.data;
    const fetchedCaasAddress = caasWalletData?.abstraction_address || caasWalletData?.abstractionAddress || caasWalletData?.walletAddress || '';

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 1800);
    };

    // Bank Account details strings
    const rawIban = wallet.iban || wallet.accountNumber || '';
    const ibanValue = rawIban || t('details.info.notAvailable');
    const ibanMasked = rawIban
        ? `${rawIban.slice(0, 4)} **** **** **** **`
        : t('details.info.notAvailable');
    const swiftValue = wallet.swiftCode || wallet.bic || t('details.info.notAvailable');
    const routingValue = wallet.routingNumber || t('details.info.notAvailable');
    const cryptoAddressValue = wallet.walletAddress || fetchedCaasAddress || '';
    const cryptoAddressMasked = cryptoAddressValue
        ? `${cryptoAddressValue.slice(0, 6)}...${cryptoAddressValue.slice(-5)}`
        : t('details.info.notAvailable');

    // Map and filter transactions for this wallet
    const filteredTxs = Array.isArray(initialTransactions) && initialTransactions.length > 0
        ? initialTransactions.map((tx) => {
            const walletAddr = (wallet.walletAddress || '').toLowerCase();
            const recvAddress = tx.receiver_address || tx.receiverAddress || tx.receiver_phone || '';
            const recvAddrLower = recvAddress.toLowerCase();

            let isIncoming = false;
            if (tx.isIncoming !== undefined) {
                isIncoming = Boolean(tx.isIncoming);
            } else if (tx.is_incoming !== undefined) {
                isIncoming = Boolean(tx.is_incoming);
            } else if (tx.direction) {
                const dir = String(tx.direction).toLowerCase();
                isIncoming = dir === 'in' || dir === 'incoming' || dir === 'credit' || dir === 'deposit';
            } else if (tx.type) {
                const t = String(tx.type).toLowerCase();
                isIncoming = t.includes('deposit') || t.includes('receive') || t.includes('credit') || t.includes('fund') || (t === 'exchange' && parseFloat(tx.amount || '0') > 0);
            } else if (walletAddr && recvAddrLower && walletAddr === recvAddrLower) {
                isIncoming = true;
            } else if (tx.receiver_user_id && !tx.sender_user_id) {
                isIncoming = true;
            } else {
                isIncoming = false;
            }

            const txToken = tx.token || wallet.code;
            const amtFormatted = (isIncoming ? '+' : '-') + formatBalance(Math.abs(parseFloat(tx.amount || '0')), txToken);
            const st = (tx.status || '').toLowerCase();
            const mappedStatus = (st === 'completed' || st === 'confirmed' || st === 'success' || st === 'sandbox_simulated')
                ? 'completed'
                : (st === 'queued' || st === 'pending' || st === 'processing' ? 'pending' : 'failed');

            const maskedRecv = recvAddress && recvAddress.startsWith('0x')
                ? `${recvAddress.slice(0, 6)}...${recvAddress.slice(-4)}`
                : recvAddress;

            const typeLabel = isIncoming
                ? (tx.type || (tx.token ? `${tx.token} Deposit` : 'Deposit'))
                : (tx.type || (tx.token ? `${tx.token} Transfer` : 'Withdrawal'));

            const displayTitle = tx.title || tx.description || tx.reference || typeLabel;
            const dateStr = new Date(tx.createdAt || tx.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const displaySubtitle = `${typeLabel} • ${dateStr}${maskedRecv ? ` • ${isIncoming ? 'From' : 'To'}: ${maskedRecv}` : ''}`;

            return {
                id: tx.id,
                title: displayTitle,
                subtitle: displaySubtitle,
                receiverAddress: recvAddress,
                token: tx.token || wallet.code,
                amount: amtFormatted,
                isIncoming,
                status: mappedStatus,
                rawTx: tx,
            };
        })
        : [];

    const displayedTxs = filteredTxs.filter((tx) => {
        if (tokenFilter === 'ALL') return true;
        const itemToken = (tx.token || tx.rawTx?.token || wallet.code).toUpperCase();
        return itemToken === tokenFilter;
    });

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
                    <div className="grid grid-cols-3 gap-3 select-none">
                        <button
                            onClick={() => {
                                if (wallet.actions?.can_send === false) {
                                    toast.error('Send feature is disabled for this wallet.');
                                    return;
                                }
                                openSend(wallet.id);
                            }}
                            disabled={wallet.actions?.can_send === false}
                            className={cn(
                                "bg-[#0C1224] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center space-y-2 transition duration-200 font-semibold cursor-pointer",
                                wallet.actions?.can_send === false
                                    ? "opacity-40 cursor-not-allowed"
                                    : "text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.01]"
                            )}
                        >
                            <div className="w-8 h-8 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 shrink-0">
                                <Send className="h-4 w-4" />
                            </div>
                            <span className="text-[11px]">{t('action.send')}</span>
                        </button>
                        <button
                            onClick={() => {
                                if (wallet.actions?.can_receive === false) {
                                    toast.error('Receive feature is disabled for this wallet.');
                                    return;
                                }
                                openReceive(wallet.id);
                            }}
                            disabled={wallet.actions?.can_receive === false}
                            className={cn(
                                "bg-[#0C1224] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center space-y-2 transition duration-200 font-semibold cursor-pointer",
                                wallet.actions?.can_receive === false
                                    ? "opacity-40 cursor-not-allowed"
                                    : "text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.01]"
                            )}
                        >
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                                <ArrowDownLeft className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-[11px]">{t('action.receive')}</span>
                        </button>
                        <button
                            onClick={() => {
                                if (wallet.actions?.can_exchange === false) {
                                    toast.error('Exchange feature is disabled for this wallet.');
                                    return;
                                }
                                router.push('/exchange');
                            }}
                            disabled={wallet.actions?.can_exchange === false}
                            className={cn(
                                "bg-[#0C1224] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center space-y-2 transition duration-200 font-semibold cursor-pointer",
                                wallet.actions?.can_exchange === false
                                    ? "opacity-40 cursor-not-allowed"
                                    : "text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.01]"
                            )}
                        >
                            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                                <RefreshCw className="h-4 w-4" />
                            </div>
                            <span className="text-[11px]">{t('nav.exchange')}</span>
                        </button>
                    </div>

                    {/* Transaction History list */}
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 text-left shadow-xl space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
                            <h3 className="font-satoshi font-bold text-base text-white">
                                {isMomoWallet ? 'Mobile Money Activity' : t('section.recent')}
                            </h3>

                            {/* Token Filter Pills for Stablecoins / Crypto */}
                            {!isMomoWallet && (
                                <div className="flex items-center space-x-1 bg-black/40 border border-white/10 p-1 rounded-xl">
                                    {(['ALL', 'USDT', 'USDC'] as const).map((filterOpt) => (
                                        <button
                                            key={filterOpt}
                                            type="button"
                                            onClick={() => setTokenFilter(filterOpt)}
                                            className={cn(
                                                "px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg uppercase tracking-wider transition cursor-pointer select-none",
                                                tokenFilter === filterOpt 
                                                    ? (filterOpt === 'USDT'
                                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                        : filterOpt === 'USDC'
                                                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                            : "bg-white/10 text-white border border-white/15")
                                                    : "text-slate-400 hover:text-white"
                                            )}
                                        >
                                            {filterOpt === 'ALL' ? 'All Tokens' : filterOpt}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {isMomoWallet && setMomoTab && (
                                <div className="flex space-x-1 bg-black/40 border border-white/10 p-1 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => { setMomoTab('deposits'); onPageChange?.(1); }}
                                        className={cn(
                                            "px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider transition cursor-pointer select-none",
                                            momoTab === 'deposits' ? "bg-white/10 text-white border border-white/15" : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        Deposits
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setMomoTab('withdrawals'); onPageChange?.(1); }}
                                        className={cn(
                                            "px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider transition cursor-pointer select-none",
                                            momoTab === 'withdrawals' ? "bg-white/10 text-white border border-white/15" : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        Cash-outs
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* List items */}
                        <div className="space-y-3.5 min-h-[300px] max-h-[540px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {displayedTxs.length > 0 ? (
                                displayedTxs.map((tx) => {
                                    const tokenStyle = getTokenStyles(tx.token, wallet.code);
                                    return (
                                        <div
                                            key={tx.id}
                                            onClick={() => setSelectedTx(tx)}
                                            className="flex items-center justify-between py-2 px-2.5 rounded-2xl hover:bg-white/[0.04] active:scale-[0.99] transition duration-150 cursor-pointer border-b border-white/[0.03] last:border-b-0 group select-none"
                                        >
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
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="font-sans font-bold text-xs text-white truncate">
                                                            {tx.title}
                                                        </h4>
                                                        <span className={cn(
                                                            "px-1.5 py-0.25 rounded text-[9px] font-black tracking-wider uppercase border shrink-0 select-none font-mono",
                                                            tokenStyle.badgeBg
                                                        )}>
                                                            {tokenStyle.sym}
                                                        </span>
                                                    </div>
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
                                                tx.status === 'completed' ? "text-emerald-500" : (tx.status === 'pending' ? "text-amber-400" : "text-rose-500")
                                            )}>
                                                {tx.status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                            ) : (
                                <div className="text-center py-12 text-xs text-slate-500 font-sans select-none space-y-1">
                                    <p className="font-bold text-slate-400">No transactions match filter ({tokenFilter})</p>
                                    <p className="text-[11px] opacity-75">Switch the token filter tab to "All Tokens" to view all records</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs font-mono select-none">
                            <button
                                type="button"
                                disabled={(currentPage || 1) <= 1}
                                onClick={() => onPageChange?.((currentPage || 1) - 1)}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span>Prev</span>
                            </button>
                            <span className="text-[11px] font-bold text-slate-400 font-sans">
                                Page {currentPage || 1}
                            </span>
                            <button
                                type="button"
                                disabled={!hasNextPage}
                                onClick={() => onPageChange?.((currentPage || 1) + 1)}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                            >
                                <span>Next</span>
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Right side charts/info (1/3 width) */}
                <div className="space-y-6">

                    {/* 30-Day Activity wave chart */}
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl">
                        <div className="flex justify-between items-center select-none mb-3">
                            <h3 className="font-satoshi font-bold text-sm text-white">{t('details.activity.title')}</h3>
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
                            {t('details.info.title')}
                        </h3>

                        {wallet.type === 'fiat' ? (
                            <div className="space-y-3.5 text-xs">
                                {/* IBAN */}
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-slate-550 uppercase tracking-wider block select-none">{t('details.info.iban')}</span>
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
                                    <span className="text-[9px] font-bold text-slate-550 uppercase tracking-wider block select-none">{t('details.info.swift')}</span>
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
                                    <span className="text-[9px] font-bold text-slate-550 uppercase tracking-wider block select-none">{t('details.info.routing')}</span>
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
                                    <span className="text-[9px] font-bold text-slate-555 uppercase tracking-wider block select-none">{t('details.info.address')}</span>
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
                            {t('details.info.disclaimer')}
                        </div>
                    </div>

                    {/* Currency Details panel */}
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl space-y-4 text-xs font-sans">
                        <h3 className="font-satoshi font-bold text-sm text-white select-none">
                            {t('details.currency.title')}
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
                            <span>{t('details.currency.trend')}</span>
                        </div>
                    </div>

                </div>

            </div>

            {/* Transaction Detail Sheet */}
            <Sheet
                isOpen={!!selectedTx}
                onClose={() => setSelectedTx(null)}
                title="Transaction Details"
                description="Detailed overview and cryptographic proof of transfer"
            >
                {selectedTx && (
                    <div className="space-y-6 text-left pt-2 pb-6">

                        {/* Top Balance / Status Summary Banner */}
                        <div className="bg-[#0C1224] border border-white/5 rounded-3xl p-6 text-center space-y-3 relative overflow-hidden">
                            <div className="flex justify-center">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg",
                                    selectedTx.isIncoming
                                        ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                                        : "bg-rose-500/10 border-rose-500/25 text-rose-400"
                                )}>
                                    {selectedTx.isIncoming ? <ArrowDownLeft className="h-6 w-6" /> : <Send className="h-5 w-5" />}
                                </div>
                            </div>

                            <div>
                                <span className={cn(
                                    "font-mono text-2xl font-black tracking-tight block",
                                    selectedTx.isIncoming ? "text-emerald-400" : "text-white"
                                )}>
                                    {selectedTx.amount}
                                </span>
                                <span className="text-xs text-slate-400 font-sans font-semibold block mt-1">
                                    {selectedTx.isIncoming ? 'Incoming Deposit' : 'Outgoing Transfer'}
                                </span>
                            </div>

                            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                <span className={cn(
                                    "w-2 h-2 rounded-full",
                                    selectedTx.status === 'completed' ? "bg-emerald-400" : (selectedTx.status === 'pending' ? "bg-amber-400 animate-pulse" : "bg-rose-500")
                                )} />
                                <span className={selectedTx.status === 'completed' ? "text-emerald-400" : (selectedTx.status === 'pending' ? "text-amber-400" : "text-rose-400")}>
                                    {selectedTx.rawTx?.status || selectedTx.status}
                                </span>
                            </div>
                        </div>

                        {/* Field breakdown list */}
                        <div className="bg-[#0C1224] border border-white/5 rounded-2xl p-4 space-y-3.5 text-xs font-sans">

                            {/* Reference */}
                            {(selectedTx.rawTx?.reference || selectedTx.rawTx?.idempotency_key) && (
                                <div className="flex items-center justify-between py-1 border-b border-white/5">
                                    <span className="text-slate-500 font-medium">Reference</span>
                                    <div className="flex items-center space-x-2 font-mono text-white font-bold">
                                        <span>{selectedTx.rawTx?.reference || selectedTx.rawTx?.idempotency_key}</span>
                                        <button
                                            onClick={() => handleCopy(selectedTx.rawTx?.reference || selectedTx.rawTx?.idempotency_key, 'ref')}
                                            className="text-slate-500 hover:text-white transition cursor-pointer"
                                        >
                                            {copiedField === 'ref' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Tx Hash / Transfer ID */}
                            {(selectedTx.rawTx?.tx_hash || selectedTx.rawTx?.caas_transfer_id) && (
                                <div className="flex flex-col space-y-1 py-1 border-b border-white/5">
                                    <span className="text-slate-500 font-medium">Transaction Hash</span>
                                    <div className="flex items-center justify-between bg-black/30 border border-white/5 rounded-xl px-2.5 py-1.5 font-mono text-[11px] text-slate-300">
                                        <span className="truncate mr-2">{selectedTx.rawTx?.tx_hash || selectedTx.rawTx?.caas_transfer_id}</span>
                                        <button
                                            onClick={() => handleCopy(selectedTx.rawTx?.tx_hash || selectedTx.rawTx?.caas_transfer_id, 'hash')}
                                            className="text-slate-500 hover:text-white transition cursor-pointer shrink-0"
                                        >
                                            {copiedField === 'hash' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Receiver Address */}
                            {selectedTx.receiverAddress && (
                                <div className="flex flex-col space-y-1 py-1 border-b border-white/5">
                                    <span className="text-slate-500 font-medium">{selectedTx.isIncoming ? 'Deposit Address' : 'Receiver Address'}</span>
                                    <div className="flex items-center justify-between bg-black/30 border border-white/5 rounded-xl px-2.5 py-1.5 font-mono text-[11px] text-slate-300">
                                        <span className="truncate mr-2">{selectedTx.receiverAddress}</span>
                                        <button
                                            onClick={() => handleCopy(selectedTx.receiverAddress, 'recv')}
                                            className="text-slate-500 hover:text-white transition cursor-pointer shrink-0"
                                        >
                                            {copiedField === 'recv' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Date & Time */}
                            <div className="flex items-center justify-between py-1 border-b border-white/5">
                                <span className="text-slate-500 font-medium">Date & Time</span>
                                <span className="font-mono text-slate-300 font-medium">
                                    {new Date(selectedTx.rawTx?.createdAt || selectedTx.rawTx?.created_at || Date.now()).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </span>
                            </div>

                            {/* Token / Currency */}
                            <div className="flex items-center justify-between py-1 border-b border-white/5">
                                <span className="text-slate-500 font-medium">Asset</span>
                                <div className="flex items-center space-x-2">
                                    <span className="font-mono text-white font-bold">{selectedTx.rawTx?.token || selectedTx.token || wallet.code}</span>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase border font-mono select-none",
                                        getTokenStyles(selectedTx.rawTx?.token || selectedTx.token, wallet.code).badgeBg
                                    )}>
                                        {getTokenStyles(selectedTx.rawTx?.token || selectedTx.token, wallet.code).sym}
                                    </span>
                                </div>
                            </div>

                            {/* Quote ID if present */}
                            {selectedTx.rawTx?.quote_id && (
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-500 font-medium">Quote ID</span>
                                    <span className="font-mono text-slate-400">{selectedTx.rawTx.quote_id}</span>
                                </div>
                            )}

                        </div>

                        {/* Footer encryption badge */}
                        <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500 font-bold tracking-wide select-none pt-2 font-mono">
                            <Lock className="h-3.5 w-3.5 stroke-[2.5]" />
                            <span>Verified by Rach CAAS Engine & 256-bit AES</span>
                        </div>

                    </div>
                )}
            </Sheet>

        </div>
    );
};

export default WalletDetails;
