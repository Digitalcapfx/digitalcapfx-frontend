'use client'

import React, { useState } from 'react'
import {
    Clock,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCw,
    LogIn,
    Shield,
    CreditCard,
    Search,
    AlertCircle
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { activityService, ActivityItem } from '@/services/activity.service'
import { useLanguageStore } from '@/store/languageStore'

const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
        case 'transfer':
        case 'send':
        case 'withdraw':
            return <ArrowUpRight className="h-4.5 w-4.5 text-rose-400" />;
        case 'deposit':
        case 'fund':
            return <ArrowDownLeft className="h-4.5 w-4.5 text-emerald-400" />;
        case 'exchange':
        case 'swap':
            return <RefreshCw className="h-4.5 w-4.5 text-blue-400" />;
        case 'login':
        case 'logout':
            return <LogIn className="h-4.5 w-4.5 text-amber-400" />;
        case 'security':
        case '2fa':
        case 'pin':
            return <Shield className="h-4.5 w-4.5 text-purple-400" />;
        case 'card':
            return <CreditCard className="h-4.5 w-4.5 text-fuchsia-400" />;
        default:
            return <Clock className="h-4.5 w-4.5 text-slate-400" />;
    }
};

const getBadgeStyles = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'completed' || s === 'success' || s === 'active') {
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    }
    if (s === 'pending' || s === 'processing') {
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    }
    if (s === 'failed' || s === 'rejected') {
        return 'bg-rose-500/10 border-rose-500/20 text-rose-455';
    }
    return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
};

export const ActivityPage: React.FC = () => {
    const { t } = useLanguageStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['activityFeed'],
        queryFn: () => activityService.getActivityFeed()
    });

    const feedList: ActivityItem[] = data?.success && Array.isArray(data.data) ? data.data : [];

    // Filter list
    const filteredFeed = feedList.filter((item) => {
        const matchesSearch =
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.type.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = selectedType === 'all' || item.type.toLowerCase() === selectedType.toLowerCase();

        return matchesSearch && matchesType;
    });

    const categories = ['all', 'transfer', 'deposit', 'exchange', 'login', 'security', 'card'];

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
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('activity.logs.searchPlaceholder')}
                        className="bg-[#0C1224] border border-[#131B30] rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 w-full"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedType(cat)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider select-none cursor-pointer transition duration-200 border border-white/5 ${selectedType === cat
                                ? 'bg-primary-500 text-white shadow-md shadow-primary-500/10'
                                : 'bg-[#0C1224] text-slate-400 hover:text-white'
                                }`}
                        >
                            {t('activity.categories.' + cat)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Activity Timeline List */}
            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 shadow-xl space-y-4">
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-3 text-xs text-slate-500">
                        <RefreshCw className="h-6 w-6 animate-spin text-primary-400" />
                        <span>{t('activity.logs.loading')}</span>
                    </div>
                ) : error ? (
                    <div className="py-16 flex flex-col items-center justify-center space-y-3 text-center">
                        <AlertCircle className="h-8 w-8 text-rose-500" />
                        <span className="text-xs text-rose-455 font-bold">{t('activity.logs.loadFailed')}</span>
                        <button
                            onClick={() => refetch()}
                            className="text-xs font-bold text-primary-400 hover:underline cursor-pointer"
                        >
                            {t('activity.logs.retry')}
                        </button>
                    </div>
                ) : filteredFeed.length === 0 ? (
                    <div className="py-24 text-center select-none space-y-2">
                        <p className="text-xs text-slate-500">{t('activity.logs.empty')}</p>
                    </div>
                ) : (
                    <div className="relative border-l border-white/5 ml-3.5 pl-6 space-y-6">
                        {filteredFeed.map((item) => (
                            <div key={item.id} className="relative group text-left">
                                {/* Timeline Bullet dot */}
                                <div className="absolute -left-[37px] top-0.5 w-6.5 h-6.5 rounded-lg bg-[#0E152A] border border-white/10 flex items-center justify-center">
                                    {getIcon(item.type)}
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold text-white text-xs block leading-snug">
                                                {item.description}
                                            </span>
                                            <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${getBadgeStyles(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-semibold space-x-2 block">
                                            <span className="font-mono">{t('activity.logs.ref')} {item.reference || 'N/A'}</span>
                                            <span>•</span>
                                            <span className="font-mono uppercase">{t('activity.categories.' + item.type.toLowerCase())}</span>
                                            {item.amount && parseFloat(item.amount) > 0 && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-slate-400 font-bold font-mono">
                                                        {item.amount} {item.currency}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <span className="text-[10px] text-slate-550 font-bold font-mono block">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="text-[9.5px] text-slate-600 block mt-0.5 font-mono">
                                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityPage;
