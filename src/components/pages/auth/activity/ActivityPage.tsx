'use client'

import React, { useState } from 'react'
import {
    Clock,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCw,
    Search,
    AlertCircle,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Copy,
    Check,
    Lock
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { activityService, extractActivityGroupsAndItems, ActivityItem } from '@/services/activity.service'
import { useLanguageStore } from '@/store/languageStore'
import { Sheet } from '@/components/ui/Sheet'

const getIconAndStyle = (type: string, iconType?: string) => {
    const t = (type || '').toLowerCase();
    const it = (iconType || '').toLowerCase();

    if (it === 'sent_crypto' || it === 'sent_fiat' || t === 'sent' || t === 'send' || t === 'transfer' || t === 'withdraw' || t === 'withdrawn') {
        return {
            icon: <ArrowUpRight className="h-4 w-4 text-rose-400" />,
            badge: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
            bg: 'bg-rose-500/10 border-rose-500/20',
            amountColor: 'text-rose-400'
        };
    }
    if (it === 'received_crypto' || it === 'received_fiat' || t === 'received' || t === 'receive' || t === 'deposit' || t === 'deposited' || t === 'fund') {
        return {
            icon: <ArrowDownLeft className="h-4 w-4 text-emerald-400" />,
            badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
            amountColor: 'text-emerald-400'
        };
    }
    if (it === 'exchanged' || t === 'exchanged' || t === 'exchange' || t === 'swap') {
        return {
            icon: <RefreshCw className="h-4 w-4 text-blue-400" />,
            badge: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
            bg: 'bg-blue-500/10 border-blue-500/20',
            amountColor: 'text-blue-400'
        };
    }
    return {
        icon: <Clock className="h-4 w-4 text-slate-400" />,
        badge: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
        bg: 'bg-slate-500/10 border-slate-500/20',
        amountColor: 'text-slate-300'
    };
};

const getStatusBadgeStyles = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed' || s === 'success' || s === 'active') {
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    }
    if (s === 'pending' || s === 'processing') {
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    }
    if (s === 'failed' || s === 'rejected') {
        return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
    }
    return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
};

const matchTypeFilter = (item: ActivityItem, filter: string) => {
    if (filter === 'all') return true;
    const typeStr = (item.type || '').toLowerCase();
    const iconTypeStr = (item.icon_type || '').toLowerCase();

    if (filter === 'sent') {
        return typeStr === 'sent' || typeStr === 'send' || typeStr === 'transfer' || iconTypeStr.startsWith('sent');
    }
    if (filter === 'received') {
        return typeStr === 'received' || typeStr === 'receive' || typeStr === 'fund' || iconTypeStr.startsWith('received');
    }
    if (filter === 'exchanged') {
        return typeStr === 'exchanged' || typeStr === 'exchange' || typeStr === 'swap';
    }
    if (filter === 'deposited') {
        return typeStr === 'deposited' || typeStr === 'deposit' || typeStr === 'received';
    }
    if (filter === 'withdrawn') {
        return typeStr === 'withdrawn' || typeStr === 'withdraw' || typeStr === 'sent';
    }
    return typeStr === filter.toLowerCase();
};

const matchSearch = (item: ActivityItem, query: string) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
        (item.title || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.subtitle || '').toLowerCase().includes(q) ||
        (item.reference || '').toLowerCase().includes(q) ||
        (item.type || '').toLowerCase().includes(q) ||
        (item.asset || item.currency || '').toLowerCase().includes(q) ||
        (item.amount_formatted || '').toLowerCase().includes(q)
    );
};

interface ActivityDetailSheetProps {
    item: ActivityItem | null;
    onClose: () => void;
}

const ActivityDetailSheet: React.FC<ActivityDetailSheetProps> = ({ item, onClose }) => {
    const { t } = useLanguageStore();
    const [copiedField, setCopiedField] = useState<string | null>(null);

    if (!item) return null;

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const style = getIconAndStyle(item.type, item.icon_type || item.iconType);
    const displayTitle = item.title || item.description || item.type;
    const displaySubtitle = item.subtitle || item.reference;
    const amountFormatted = item.amount_formatted || item.amountFormatted || (item.amount ? `${item.amount_sign || item.amountSign || ''}${item.amount} ${item.asset || item.currency || ''}`.trim() : '');

    return (
        <Sheet
            isOpen={!!item}
            onClose={onClose}
            title={t('activity.sheet.title', { defaultValue: 'Activity Details' })}
            description={t('activity.sheet.desc', { defaultValue: 'Detailed overview and operation breakdown' })}
        >
            <div className="space-y-6 text-left pt-2 pb-6">
                
                {/* Banner Summary Header */}
                <div className="bg-[#0C1224] border border-white/5 rounded-3xl p-6 text-center space-y-3 relative overflow-hidden">
                    <div className="flex justify-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${style.bg}`}>
                            {style.icon}
                        </div>
                    </div>

                    <div>
                        <span className={`font-mono text-2xl font-black tracking-tight block ${style.amountColor}`}>
                            {amountFormatted || displayTitle}
                        </span>
                        {amountFormatted && (
                            <span className="text-xs text-white font-sans font-bold block mt-1">
                                {displayTitle}
                            </span>
                        )}
                        {displaySubtitle && (
                            <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                                {displaySubtitle}
                            </span>
                        )}
                    </div>

                    <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <span className={`w-2 h-2 rounded-full ${item.status === 'completed' ? 'bg-emerald-400' : (item.status === 'pending' ? 'bg-amber-400 animate-pulse' : 'bg-rose-400')}`} />
                        <span className={item.status === 'completed' ? 'text-emerald-400' : (item.status === 'pending' ? 'text-amber-400' : 'text-rose-400')}>
                            {item.status}
                        </span>
                    </div>
                </div>

                {/* Details List */}
                <div className="bg-[#0C1224] border border-white/5 rounded-2xl p-4 space-y-3.5 text-xs font-sans">
                    
                    {/* Activity ID */}
                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400 font-medium">Activity ID</span>
                        <div className="flex items-center space-x-2 font-mono text-white font-bold">
                            <span className="text-[11px] truncate max-w-[200px]">{item.id}</span>
                            <button
                                type="button"
                                onClick={() => handleCopy(item.id, 'id')}
                                className="text-slate-400 hover:text-white transition cursor-pointer"
                            >
                                {copiedField === 'id' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                        </div>
                    </div>

                    {/* Counterparty / Subtitle */}
                    {item.subtitle && (
                        <div className="flex items-center justify-between py-1 border-b border-white/5">
                            <span className="text-slate-400 font-medium">Description / Ref</span>
                            <div className="flex items-center space-x-2 font-mono text-slate-200 font-bold truncate max-w-[220px]">
                                <span className="truncate">{item.subtitle}</span>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(item.subtitle!, 'sub')}
                                    className="text-slate-400 hover:text-white transition cursor-pointer shrink-0"
                                >
                                    {copiedField === 'sub' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Operation Type */}
                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400 font-medium">Operation Type</span>
                        <span className="font-mono text-white font-bold uppercase tracking-wider text-[11px]">
                            {item.type}
                        </span>
                    </div>

                    {/* Amount */}
                    {amountFormatted && (
                        <div className="flex items-center justify-between py-1 border-b border-white/5">
                            <span className="text-slate-400 font-medium">Amount</span>
                            <span className={`font-mono font-black text-xs ${style.amountColor}`}>
                                {amountFormatted}
                            </span>
                        </div>
                    )}

                    {/* Asset */}
                    {item.asset && (
                        <div className="flex items-center justify-between py-1 border-b border-white/5">
                            <span className="text-slate-400 font-medium">Asset / Currency</span>
                            <span className="font-mono text-primary-400 font-extrabold uppercase text-[11px]">
                                {item.asset}
                            </span>
                        </div>
                    )}
                    {/* Timestamp */}
                    <div className="flex items-center justify-between py-1">
                        <span className="text-slate-400 font-medium">Date & Time</span>
                        <span className="font-mono text-slate-300 font-medium">
                            {new Date(item.created_at || item.createdAt || Date.now()).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })}
                        </span>
                    </div>
                </div>

                {/* Footer Security Badge */}
                <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500 font-bold tracking-wide select-none pt-2 font-mono">
                    <Lock className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Recorded on DigitalFX Audit Ledger</span>
                </div>
            </div>
        </Sheet>
    );
};

export const ActivityPage: React.FC = () => {
    const { t } = useLanguageStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [page, setPage] = useState(1);
    const [selectedItem, setSelectedItem] = useState<ActivityItem | null>(null);

    const handleCategoryChange = (cat: string) => {
        setSelectedType(cat);
        setPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['activityFeed', selectedType, searchQuery, page],
        queryFn: () => activityService.getActivityFeed({
            type: selectedType === 'all' ? undefined : selectedType,
            search: searchQuery || undefined,
            page,
            limit: 20
        })
    });

    const { groups, total, totalPages } = extractActivityGroupsAndItems(data?.data);

    // Filter groups and items
    const filteredGroups = groups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => matchTypeFilter(item, selectedType) && matchSearch(item, searchQuery)),
        }))
        .filter((group) => group.items.length > 0);

    // Backend supported filter types for GET /activity endpoint
    const categories = ['all', 'sent', 'received', 'exchanged', 'deposited', 'withdrawn'];

    return (
        <div className="space-y-6 mx-auto text-left">
            <div>
                <h1 className="font-satoshi font-black text-2xl text-white tracking-tight">
                    {t('activity.logs.title')}
                </h1>
                <p className="text-slate-400 text-xs font-semibold mt-1">
                    {t('activity.logs.subtitle')}
                </p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-550" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder={t('activity.logs.searchPlaceholder')}
                        className="bg-[#0C1224] border border-[#131B30] rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 w-full"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider select-none cursor-pointer transition duration-200 border border-white/5 ${selectedType === cat
                                ? 'bg-primary-500 text-white shadow-md shadow-primary-500/10'
                                : 'bg-[#0C1224] text-slate-400 hover:text-white'
                                }`}
                        >
                            {cat === 'all' ? t('activity.categories.all') : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Activity Groups List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-12 flex flex-col items-center justify-center space-y-3 text-xs text-slate-500">
                        <RefreshCw className="h-6 w-6 animate-spin text-primary-400" />
                        <span>{t('activity.logs.loading')}</span>
                    </div>
                ) : error ? (
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-12 flex flex-col items-center justify-center space-y-3 text-center">
                        <AlertCircle className="h-8 w-8 text-rose-500" />
                        <span className="text-xs text-rose-400 font-bold">{t('activity.logs.loadFailed')}</span>
                        <button
                            onClick={() => refetch()}
                            className="text-xs font-bold text-primary-400 hover:underline cursor-pointer"
                        >
                            {t('activity.logs.retry')}
                        </button>
                    </div>
                ) : filteredGroups.length === 0 ? (
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-16 text-center select-none space-y-2">
                        <p className="text-xs text-slate-500">{t('activity.logs.empty')}</p>
                    </div>
                ) : (
                    filteredGroups.map((group) => {
                        const dayLabel = group.day_label || group.dayLabel;
                        return (
                            <div key={dayLabel || group.date} className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-5 shadow-xl space-y-4">
                                {/* Day Header */}
                                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-3.5 w-3.5 text-primary-400" />
                                        {dayLabel && <h3 className="font-satoshi font-bold text-xs text-white tracking-wide">{dayLabel}</h3>}
                                        {group.date && <span className="text-[10px] text-slate-500 font-mono">({group.date})</span>}
                                    </div>
                                    <span className="text-[9.5px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                                        {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                                    </span>
                                </div>

                                {/* Items in Day */}
                                <div className="space-y-3">
                                    {group.items.map((item) => {
                                        const style = getIconAndStyle(item.type, item.icon_type || item.iconType);
                                        const displayTitle = item.title || item.description || item.type;
                                        const displaySubtitle = item.subtitle || item.reference;
                                        const amountFormatted = item.amount_formatted || item.amountFormatted || (item.amount ? `${item.amount_sign || item.amountSign || ''}${item.amount} ${item.asset || item.currency || ''}`.trim() : '');

                                        return (
                                            <div 
                                                key={item.id} 
                                                onClick={() => setSelectedItem(item)}
                                                className="group flex items-center justify-between py-2 px-3 rounded-2xl bg-white/[0.015] hover:bg-white/[0.04] transition-all cursor-pointer border border-white/[0.02] hover:border-white/10 active:scale-[0.99]"
                                            >
                                                <div className="flex items-center space-x-3.5 min-w-0 flex-1 mr-3">
                                                    {/* Icon container */}
                                                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${style.bg}`}>
                                                        {style.icon}
                                                    </div>

                                                    <div className="space-y-0.5 min-w-0 flex-1">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-bold text-white text-xs truncate group-hover:text-primary-300 transition-colors">
                                                                {displayTitle}
                                                            </span>
                                                            <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.25 rounded border ${getStatusBadgeStyles(item.status)} shrink-0`}>
                                                                {item.status}
                                                            </span>
                                                        </div>
                                                        {displaySubtitle && (
                                                            <span className="text-[10.5px] text-slate-400 block font-sans truncate">
                                                                {displaySubtitle}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3 pl-2 shrink-0">
                                                    {amountFormatted ? (
                                                        <div className="text-right shrink-0">
                                                            <span className={`font-mono text-xs font-black block whitespace-nowrap ${style.amountColor}`}>
                                                                {amountFormatted}
                                                            </span>
                                                        </div>
                                                    ) : null}
                                                    <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors shrink-0" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5 select-none">
                    <div className="text-xs text-slate-400 font-medium">
                        Page <span className="font-mono font-bold text-white">{page}</span> of <span className="font-mono font-bold text-white">{totalPages}</span>
                        {total > 0 && <span className="text-slate-500 ml-1">({total} total transactions)</span>}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            disabled={page <= 1 || isLoading}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="px-3.5 py-2 rounded-xl bg-[#0C1224] border border-[#131B30] text-xs font-bold text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1.5 transition cursor-pointer"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Previous</span>
                        </button>
                        <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 font-mono text-xs text-white font-bold">
                            <span>{page}</span>
                            <span className="text-slate-500">/</span>
                            <span className="text-slate-400">{totalPages}</span>
                        </div>
                        <button
                            disabled={page >= totalPages || isLoading}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="px-3.5 py-2 rounded-xl bg-[#0C1224] border border-[#131B30] text-xs font-bold text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1.5 transition cursor-pointer"
                        >
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Slide-over Transaction Details Sheet */}
            <ActivityDetailSheet
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </div>
    );
};

export default ActivityPage;



