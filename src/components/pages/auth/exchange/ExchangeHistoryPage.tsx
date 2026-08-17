'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    ChevronLeft,
    Search,
    RefreshCw,
    Zap,
    Check,
    Clock,
    XCircle,
    Copy,
    CheckCircle2,
    ExternalLink,
    Filter,
    ArrowUpRight,
    ArrowDownLeft,
    ArrowUpDown,
    ShieldCheck,
    FileText
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { exchangeService, CaasSwapResponseItem } from '@/services/exchange.service'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { Sheet } from '@/components/ui/Sheet'
import { cn, formatCurrencyByLocale } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'
import { toast } from 'sonner'

export interface UnifiedSwapItem {
    id: string;
    type: 'caas_swap' | 'fiat_exchange';
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    amountOut: string;
    formattedIn: string;
    formattedOut: string;
    status: string;
    reference: string;
    txHash?: string;
    caasSwapId?: string;
    rate?: string;
    createdAt: string;
    provider: string;
    rawItem?: any;
}

export const ExchangeHistoryPage: React.FC = () => {
    const { t } = useLanguageStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState<'ALL' | 'CAAS_SWAPS' | 'FIAT_EXCHANGES'>('ALL');
    const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
    const [selectedItem, setSelectedItem] = useState<UnifiedSwapItem | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Queries
    const caasSwapsQuery = useQuery({
        queryKey: ['caasSwapsAll'],
        queryFn: () => exchangeService.getCaasSwaps(1, 100).catch(() => ({ success: false, data: [] })),
        refetchInterval: 15000,
    });

    const fiatHistoryQuery = useQuery({
        queryKey: ['fiatExchangeHistoryAll'],
        queryFn: () => exchangeService.getExchangeHistory().catch(() => ({ success: false, data: [] })),
    });

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        toast.success(`Copied ${field} to clipboard`);
        setTimeout(() => setCopiedField(null), 2000);
    };

    // Process and unify datasets
    const unifiedList = useMemo(() => {
        const list: UnifiedSwapItem[] = [];

        // 1. Stablecoin Swaps
        if (caasSwapsQuery.data?.success && Array.isArray(caasSwapsQuery.data.data)) {
            caasSwapsQuery.data.data.forEach((s: CaasSwapResponseItem) => {
                const tokenIn = (s.tokenIn || s.token_in || 'USDT').toUpperCase();
                const tokenOut = (s.tokenOut || s.token_out || 'USDC').toUpperCase();
                const rawAmtIn = s.amountIn || s.amount_in || '0';
                const rawAmtOut = s.amountOut != null ? s.amountOut : (s.amount_out != null ? s.amount_out : rawAmtIn);

                const amtInVal = parseFloat(rawAmtIn);
                const amtOutVal = parseFloat(rawAmtOut);

                const formattedIn = `${isNaN(amtInVal) ? rawAmtIn : amtInVal.toFixed(2)} ${tokenIn}`;
                const formattedOut = `${isNaN(amtOutVal) ? rawAmtOut : amtOutVal.toFixed(2)} ${tokenOut}`;

                const ref = s.reference || s.caasSwapId || s.caas_swap_id || s.id;
                const txHash = s.txHash || s.tx_hash;

                list.push({
                    id: s.id || ref,
                    type: 'caas_swap',
                    tokenIn,
                    tokenOut,
                    amountIn: rawAmtIn,
                    amountOut: rawAmtOut,
                    formattedIn,
                    formattedOut,
                    status: s.status || 'settled',
                    reference: ref,
                    txHash,
                    caasSwapId: s.caasSwapId || s.caas_swap_id,
                    rate: '1.0000',
                    createdAt: s.createdAt || s.created_at || new Date().toISOString(),
                    provider: 'Stablecoin Swap',
                    rawItem: s,
                });
            });
        }

        // 2. Fiat Exchanges
        if (fiatHistoryQuery.data?.success && Array.isArray(fiatHistoryQuery.data.data)) {
            fiatHistoryQuery.data.data.forEach((f: any) => {
                const tokenIn = (f.fromCode || f.sourceCurrency || 'USD').toUpperCase();
                const tokenOut = (f.toCode || f.targetCurrency || 'EUR').toUpperCase();
                const rawAmtIn = String(f.sourceAmount || '0');
                const rawAmtOut = String(f.targetAmount || '0');

                const amtInVal = parseFloat(rawAmtIn);
                const amtOutVal = parseFloat(rawAmtOut);

                const formattedIn = `${isNaN(amtInVal) ? rawAmtIn : amtInVal.toFixed(2)} ${tokenIn}`;
                const formattedOut = `${isNaN(amtOutVal) ? rawAmtOut : amtOutVal.toFixed(2)} ${tokenOut}`;

                list.push({
                    id: f.id || f.transactionId || `fiat-${Date.now()}`,
                    type: 'fiat_exchange',
                    tokenIn,
                    tokenOut,
                    amountIn: rawAmtIn,
                    amountOut: rawAmtOut,
                    formattedIn,
                    formattedOut,
                    status: f.status || 'completed',
                    reference: f.reference || f.transactionId || f.id || 'FX-EXCHANGE',
                    rate: f.rate ? String(f.rate) : undefined,
                    createdAt: f.createdAt || f.date || new Date().toISOString(),
                    provider: 'Fiat Exchange',
                    rawItem: f,
                });
            });
        }

        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [caasSwapsQuery.data, fiatHistoryQuery.data]);

    // Filter List
    const filteredList = useMemo(() => {
        return unifiedList.filter((item) => {
            // Search Query
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q ||
                item.reference.toLowerCase().includes(q) ||
                item.tokenIn.toLowerCase().includes(q) ||
                item.tokenOut.toLowerCase().includes(q) ||
                (item.txHash && item.txHash.toLowerCase().includes(q)) ||
                (item.caasSwapId && item.caasSwapId.toLowerCase().includes(q));

            // Tab filter
            const matchesTab = selectedTab === 'ALL' ||
                (selectedTab === 'CAAS_SWAPS' && item.type === 'caas_swap') ||
                (selectedTab === 'FIAT_EXCHANGES' && item.type === 'fiat_exchange');

            // Status filter
            const st = item.status?.toLowerCase();
            const matchesStatus = selectedStatus === 'ALL' ||
                (selectedStatus === 'COMPLETED' && (st === 'settled' || st === 'completed' || st === 'success')) ||
                (selectedStatus === 'PENDING' && (st === 'processing' || st === 'pending' || st === 'queued')) ||
                (selectedStatus === 'FAILED' && (st === 'failed' || st === 'rejected'));

            return matchesSearch && matchesTab && matchesStatus;
        });
    }, [unifiedList, searchQuery, selectedTab, selectedStatus]);

    // Stats Computation
    const stats = useMemo(() => {
        const totalCount = unifiedList.length;
        const caasCount = unifiedList.filter(i => i.type === 'caas_swap').length;
        const fiatCount = unifiedList.filter(i => i.type === 'fiat_exchange').length;
        const completedCount = unifiedList.filter(i => ['settled', 'completed', 'success'].includes(i.status?.toLowerCase())).length;

        return { totalCount, caasCount, fiatCount, completedCount };
    }, [unifiedList]);

    const isLoading = caasSwapsQuery.isLoading || fiatHistoryQuery.isLoading;

    const renderStatusBadge = (status: string) => {
        const s = status?.toLowerCase();
        if (s === 'settled' || s === 'completed' || s === 'success') {
            return (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                    <span>Settled</span>
                </span>
            );
        }
        if (s === 'processing' || s === 'pending' || s === 'queued') {
            return (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase animate-pulse">
                    <RefreshCw className="h-3 w-3 text-amber-400 animate-spin shrink-0" />
                    <span>Processing</span>
                </span>
            );
        }
        return (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-mono font-bold uppercase">
                <XCircle className="h-3 w-3 text-rose-400 shrink-0" />
                <span>Failed</span>
            </span>
        );
    };

    return (
        <div className="space-y-6 text-left max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-4">
                <Link
                    href="/exchange"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-white transition duration-150 group"
                >
                    <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition duration-150" />
                    <span>Back to Exchange</span>
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
                    <div className="space-y-1">
                        <h1 className="text-2.5xl font-black text-white font-satoshi flex items-center space-x-3">
                            <span>Swap & Exchange History</span>
                            <span className="bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-mono font-bold px-3 py-1 rounded-full">
                                {stats.totalCount} Total
                            </span>
                        </h1>
                        <p className="text-xs font-semibold text-slate-400 font-sans">
                            Complete log of all stablecoin swaps (USDT ⇄ USDC) and fiat currency conversions.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            caasSwapsQuery.refetch();
                            fiatHistoryQuery.refetch();
                        }}
                        className="inline-flex items-center space-x-2 px-3.5 py-2 bg-[#0C1224] border border-white/10 hover:border-white/20 rounded-xl text-xs font-mono font-bold text-slate-300 hover:text-white transition cursor-pointer self-start sm:self-auto shadow-md"
                    >
                        <RefreshCw className={cn("h-3.5 w-3.5 text-primary-400", (caasSwapsQuery.isFetching || fiatHistoryQuery.isFetching) ? "animate-spin" : "")} />
                        <span>Refresh History</span>
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-4.5 space-y-1 shadow-lg">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Swapped</span>
                    <span className="text-xl font-mono font-black text-white block">{stats.totalCount}</span>
                </div>
                <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-4.5 space-y-1 shadow-lg">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                        <Zap className="h-3 w-3 text-emerald-400" />
                        <span>Stablecoin Swaps (USDT/USDC)</span>
                    </span>
                    <span className="text-xl font-mono font-black text-emerald-400 block">{stats.caasCount}</span>
                </div>
                <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-4.5 space-y-1 shadow-lg">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Fiat Exchanges</span>
                    <span className="text-xl font-mono font-black text-blue-400 block">{stats.fiatCount}</span>
                </div>
                <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-4.5 space-y-1 shadow-lg">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Completed</span>
                    <span className="text-xl font-mono font-black text-purple-400 block">{stats.completedCount}</span>
                </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="bg-[#080D1E] border border-white/5 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Filter Tabs */}
                    <div className="flex items-center space-x-1.5 bg-[#0C1224] border border-white/10 p-1.5 rounded-2xl overflow-x-auto scrollbar-none">
                        <button
                            type="button"
                            onClick={() => setSelectedTab('ALL')}
                            className={cn(
                                "px-3.5 py-1.5 text-xs font-bold font-mono rounded-xl transition cursor-pointer select-none whitespace-nowrap",
                                selectedTab === 'ALL'
                                    ? "bg-white/10 text-white border border-white/15 shadow-sm"
                                    : "text-slate-400 hover:text-white"
                            )}
                        >
                            All ({stats.totalCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedTab('CAAS_SWAPS')}
                            className={cn(
                                "px-3.5 py-1.5 text-xs font-bold font-mono rounded-xl transition cursor-pointer select-none whitespace-nowrap flex items-center space-x-1.5",
                                selectedTab === 'CAAS_SWAPS'
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm"
                                    : "text-slate-400 hover:text-white"
                            )}
                        >
                            <Zap className="h-3 w-3 text-emerald-400" />
                            <span>Stablecoin Swaps ({stats.caasCount})</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedTab('FIAT_EXCHANGES')}
                            className={cn(
                                "px-3.5 py-1.5 text-xs font-bold font-mono rounded-xl transition cursor-pointer select-none whitespace-nowrap",
                                selectedTab === 'FIAT_EXCHANGES'
                                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm"
                                    : "text-slate-400 hover:text-white"
                            )}
                        >
                            Fiat FX ({stats.fiatCount})
                        </button>
                    </div>

                    {/* Right Toolbar: Search Input & Status Selector */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2.5 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
                        {/* Search Input */}
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search ref, token, hash..."
                                className="w-full bg-[#0C1224] border border-white/10 focus:border-primary-500/50 rounded-2xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none transition"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                >
                                    <XCircle className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Status Select Filter */}
                        <div className="relative">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="bg-[#0C1224] border border-white/10 text-slate-300 text-xs font-mono font-bold rounded-2xl px-3.5 py-2 focus:outline-none focus:border-primary-500/50 cursor-pointer uppercase tracking-wider"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="COMPLETED">Settled / Completed</option>
                                <option value="PENDING">Processing / Pending</option>
                                <option value="FAILED">Failed</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table Content */}
            <div className="bg-[#080D1E] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-4">
                {isLoading && unifiedList.length === 0 ? (
                    <div className="text-center py-20 min-h-[300px] flex flex-col items-center justify-center space-y-3">
                        <div className="w-9 h-9 border-4 border-t-primary-500 border-white/10 rounded-full animate-spin"></div>
                        <p className="text-xs text-slate-500 font-mono">Loading swap & exchange transactions...</p>
                    </div>
                ) : filteredList.length > 0 ? (
                    <div className="divide-y divide-white/[0.04] overflow-x-auto">
                        {filteredList.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedItem(item)}
                                className="py-4 px-2 hover:bg-white/[0.02] rounded-2xl transition duration-150 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                            >
                                {/* Left Side: Tokens & Date */}
                                <div className="flex items-center space-x-3.5 min-w-0">
                                    <div className="flex items-center -space-x-2 shrink-0">
                                        <CurrencyIcon code={item.tokenIn} size="md" />
                                        <CurrencyIcon code={item.tokenOut} size="md" />
                                    </div>

                                    <div className="text-left space-y-1 min-w-0">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-mono font-black text-sm text-white group-hover:text-primary-300 transition">
                                                {item.formattedIn} → {item.formattedOut}
                                            </span>
                                            {item.type === 'caas_swap' && (
                                                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center space-x-1 shrink-0">
                                                    <Zap className="h-2.5 w-2.5" />
                                                    <span>Stablecoin Swap</span>
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 font-mono font-semibold">
                                            <span className="text-slate-400">Ref: {item.reference}</span>
                                            <span>•</span>
                                            <span>{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                            <span>•</span>
                                            <span className="text-slate-400">{item.provider}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Status & Action Arrow */}
                                <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0">
                                    {renderStatusBadge(item.status)}
                                    <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-white transition">
                                        Details →
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 space-y-3">
                        <FileText className="h-10 w-10 text-slate-600 mx-auto" />
                        <p className="text-sm font-bold text-slate-300">No swap transactions found</p>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            No records match your active search filter ({searchQuery || selectedTab || 'All'}). Try clearing search filters or initiate a new swap.
                        </p>
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedTab('ALL');
                                    setSelectedStatus('ALL');
                                }}
                                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-bold rounded-xl transition cursor-pointer"
                            >
                                Reset All Filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Detailed Transaction Drawer Sheet */}
            <Sheet
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
            >
                {selectedItem && (
                    <div className="space-y-6 flex flex-col justify-between h-full text-center">
                        <div className="space-y-6 select-none pt-8 text-left">

                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div className="space-y-1">
                                    <h3 className="font-satoshi font-black text-xl text-white tracking-tight flex items-center space-x-2">
                                        <span>Swap Details</span>
                                        {selectedItem.type === 'caas_swap' && (
                                            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                                                <Zap className="h-3 w-3" />
                                                <span>Stablecoin</span>
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-[#6D778A] text-xs font-sans">
                                        {selectedItem.provider}
                                    </p>
                                </div>
                                {renderStatusBadge(selectedItem.status)}
                            </div>

                            {/* Amount Summary Box */}
                            <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-5 space-y-4 font-sans text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 font-semibold">You Sent (Input)</span>
                                    <span className="font-extrabold text-white font-mono text-sm flex items-center space-x-1.5">
                                        <CurrencyIcon code={selectedItem.tokenIn} size="sm" />
                                        <span>{selectedItem.formattedIn}</span>
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 font-semibold">You Received (Output)</span>
                                    <span className="font-extrabold text-emerald-400 font-mono text-sm flex items-center space-x-1.5">
                                        <CurrencyIcon code={selectedItem.tokenOut} size="sm" />
                                        <span>{selectedItem.formattedOut}</span>
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                    <span className="text-slate-400 font-semibold">Exchange Rate</span>
                                    <span className="font-bold text-white font-mono">
                                        1 {selectedItem.tokenIn} = {selectedItem.rate || '1.0000'} {selectedItem.tokenOut}
                                    </span>
                                </div>
                            </div>

                            {/* Metadata Details Card */}
                            <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-5 space-y-3.5 font-sans text-xs">
                                <div className="flex justify-between items-center py-0.5">
                                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[9.5px]">Reference ID</span>
                                    <div className="flex items-center space-x-1.5">
                                        <span className="font-mono text-white font-bold">{selectedItem.reference}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(selectedItem.reference, 'Reference')}
                                            className="text-slate-500 hover:text-white transition"
                                        >
                                            <Copy className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {selectedItem.caasSwapId && (
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[9.5px]">Swap ID</span>
                                        <div className="flex items-center space-x-1.5">
                                            <span className="font-mono text-slate-300">{selectedItem.caasSwapId}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(selectedItem.caasSwapId!, 'Swap ID')}
                                                className="text-slate-500 hover:text-white transition"
                                            >
                                                <Copy className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {selectedItem.txHash && (
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[9.5px]">On-Chain Tx Hash</span>
                                        <div className="flex items-center space-x-1.5">
                                            <span className="font-mono text-emerald-400 font-bold">
                                                {`${selectedItem.txHash.slice(0, 8)}...${selectedItem.txHash.slice(-6)}`}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(selectedItem.txHash!, 'Tx Hash')}
                                                className="text-slate-500 hover:text-white transition"
                                            >
                                                <Copy className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center py-0.5">
                                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[9.5px]">Date & Time</span>
                                    <span className="font-mono text-slate-300">
                                        {new Date(selectedItem.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'medium' })}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-0.5">
                                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[9.5px]">Type</span>
                                    <span className="text-slate-300 font-semibold">{selectedItem.provider}</span>
                                </div>
                            </div>
                        </div>

                        {/* Close CTA */}
                        <button
                            type="button"
                            onClick={() => setSelectedItem(null)}
                            className="w-full bg-[#0C1224] border border-white/10 hover:bg-white/5 text-white font-bold text-sm py-4 rounded-xl transition duration-200 cursor-pointer active:scale-[0.98] mt-auto select-none"
                        >
                            Close Details
                        </button>
                    </div>
                )}
            </Sheet>
        </div>
    );
};

export default ExchangeHistoryPage;
