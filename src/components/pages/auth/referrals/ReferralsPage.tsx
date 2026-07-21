'use client'

import React from 'react'
import {
    Gift,
    Users,
    Coins,
    Copy,
    Check,
    Share2,
    TrendingUp,
    RefreshCw,
    AlertCircle
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { referralService } from '@/services/referral.service'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'

export const ReferralsPage: React.FC = () => {
    const { t } = useLanguageStore();
    // Queries
    const referralQuery = useQuery({
        queryKey: ['referralsDetails'],
        queryFn: () => referralService.getReferralDetails()
    });

    const ledgerQuery = useQuery({
        queryKey: ['referralsLedger'],
        queryFn: () => referralService.getPointsLedger()
    });

    const details = referralQuery.data?.success && referralQuery.data.data
        ? referralQuery.data.data
        : null;

    const referralCode = details?.referralCode ?? 'DFX-2026';
    const rewardPoints = details?.rewardPoints ?? 0;
    const referredUsersCount = details?.referredUsersCount ?? 0;

    const ledgerItems = ledgerQuery.data?.success && Array.isArray(ledgerQuery.data.data)
        ? ledgerQuery.data.data
        : [];

    const handleCopy = () => {
        const shareLink = `${window.location.origin}/get-started?ref=${referralCode}`;
        navigator.clipboard.writeText(shareLink);
        toast.success(t('referrals.toast.copied'));
    };

    return (
        <div className="space-y-6 mx-auto text-left">
            <div>
                <h1 className="font-satoshi font-black text-2xl text-white tracking-tight">
                    {t('referrals.title')}
                </h1>
                <p className="text-slate-400 text-xs font-semibold mt-1">
                    {t('referrals.subtitle')}
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl flex items-center space-x-5 select-none relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-transparent pointer-events-none"></div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
                        <Coins className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block">{t('referrals.metric.availablePoints')}</span>
                        <span className="text-2xl font-black text-white block mt-1 font-mono">
                            {rewardPoints.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl flex items-center space-x-5 select-none relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.02] to-transparent pointer-events-none"></div>
                    <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/15 flex items-center justify-center text-primary-400 shrink-0">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">{t('referrals.metric.referredFriends')}</span>
                        <span className="text-2xl font-black text-white block mt-1 font-mono">
                            {referredUsersCount}
                        </span>
                    </div>
                </div>

                <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl flex items-center space-x-5 select-none relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-transparent pointer-events-none"></div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-blue-400 shrink-0">
                        <Gift className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{t('referrals.metric.estimatedValue')}</span>
                        <span className="text-2xl font-black text-white block mt-1 font-mono">
                            ${(rewardPoints * 0.01).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Invite Program Box */}
            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 md:p-8 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="space-y-3.5 max-w-lg text-left">
                    <h3 className="font-satoshi font-black text-lg text-white">{t('referrals.card.shareTitle')}</h3>
                    <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                        {t('referrals.card.shareDesc')}
                    </p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                        <div className="bg-black/35 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between font-mono text-xs text-white flex-1 select-all">
                            <span>DFX-REF-{referralCode}</span>
                        </div>
                        <Button
                            onClick={handleCopy}
                            className="rounded-xl h-[44px] text-xs font-bold px-6 shrink-0"
                            leftIcon={<Copy className="h-4 w-4" />}
                        >
                            {t('referrals.btn.copyLink')}
                        </Button>
                    </div>
                </div>

                <div className="w-full lg:max-w-xs space-y-3 bg-black/25 border border-white/5 p-5 rounded-2.5xl select-none">
                    <div className="flex items-center space-x-2 text-xs font-bold text-white mb-2">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        <span>{t('referrals.tiers.title')}</span>
                    </div>
                    <div className="space-y-2 text-[10px] text-slate-400 font-semibold leading-none">
                        <div className="flex justify-between py-1 border-b border-white/5">
                            <span>{t('referrals.tiers.tier1')}</span>
                            <span className="text-white font-bold font-mono">1.0x PTS</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                            <span>{t('referrals.tiers.tier2')}</span>
                            <span className="text-primary-400 font-bold font-mono">1.25x PTS</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span>{t('referrals.tiers.tier3')}</span>
                            <span className="text-emerald-400 font-bold font-mono">1.5x PTS</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Points Ledger List */}
            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 shadow-xl space-y-4">
                <h3 className="font-satoshi font-bold text-sm text-white select-none border-b border-white/[0.03] pb-3">
                    {t('referrals.ledger.title')}
                </h3>

                {ledgerQuery.isLoading ? (
                    <div className="py-16 flex items-center justify-center space-x-2 text-xs text-slate-500">
                        <RefreshCw className="h-4 w-4 animate-spin text-primary-400" />
                        <span>{t('referrals.ledger.loading')}</span>
                    </div>
                ) : ledgerItems.length === 0 ? (
                    <div className="py-20 text-center select-none space-y-1">
                        <p className="text-xs text-slate-600">{t('referrals.ledger.empty')}</p>
                    </div>
                ) : (
                    <div className="space-y-3.5">
                        {ledgerItems.map((item) => {
                            const isCredit = item.type === 'credit';
                            return (
                                <div key={item.id} className="flex justify-between items-center py-2.5 border-b border-white/[0.02] last:border-b-0 pb-3.5 last:pb-0">
                                    <div className="text-left space-y-0.5">
                                        <span className="font-bold text-white text-xs block">{item.description}</span>
                                        <span className="text-[9.5px] text-slate-555 block font-mono">
                                            {t('referrals.ledger.adjustedOn')} {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className={cn(
                                            "font-bold font-mono text-xs select-none",
                                            isCredit ? "text-emerald-400" : "text-rose-455"
                                        )}>
                                            {isCredit ? '+' : '-'}{item.points.toLocaleString()} PTS
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

        </div>
    );
};

export default ReferralsPage;
