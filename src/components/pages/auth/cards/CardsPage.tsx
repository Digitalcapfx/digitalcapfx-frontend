'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Snowflake, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCardStore } from '@/store/cardStore'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'

export const CardsPage: React.FC = () => {
    const { t } = useLanguageStore();
    const router = useRouter();
    const { cards, openIssue } = useCardStore();

    // Summary calculations
    const totalCards = cards.length;
    const totalSpend = cards.reduce((acc, c) => acc + c.spent, 0);
    const avgSpent = totalCards > 0 ? totalSpend / totalCards : 0;
    const frozenCount = cards.filter(c => c.status === 'frozen').length;

    const formatCurrency = (val: number, code: string) => {
        const symbol = code === 'USD' ? '$' : code === 'EUR' ? '€' : code === 'GBP' ? '£' : '₦';
        return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    return (
        <div className="space-y-8 text-left">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white font-satoshi">{t('nav.cards')}</h2>
                    <p className="text-xs font-semibold text-slate-550 font-sans">{t('cards.subtitle')}</p>
                </div>
                <div>
                    <Button
                        onClick={openIssue}
                        variant="primary"
                        className="rounded-full h-[40px] px-5 text-xs font-bold font-sans shadow-lg shadow-primary-500/10 active:scale-95 transition-all"
                        leftIcon={<Plus className="h-4.5 w-4.5" />}
                    >
                        {t('cards.btn.newCard')}
                    </Button>
                </div>
            </div>

            {/* Summary Statistics cards grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
                
                <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-5 shadow-md">
                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">{t('cards.stat.totalCards')}</span>
                    <span className="text-xl font-black text-white block mt-1 font-satoshi">{totalCards}</span>
                    <span className="text-[9px] font-semibold text-slate-500 block mt-1">{t('cards.stat.activeThisMonth')}</span>
                </div>

                <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-5 shadow-md">
                    <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">{t('cards.stat.totalSpend')}</span>
                    <span className="text-xl font-black text-white block mt-1 font-mono">{formatCurrency(totalSpend, 'USD')}</span>
                    <span className="text-[9px] font-semibold text-slate-500 block mt-1">Jun 2026</span>
                </div>

                <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-5 shadow-md">
                    <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">{t('cards.stat.avgPerCard')}</span>
                    <span className="text-xl font-black text-white block mt-1 font-mono">{formatCurrency(avgSpent, 'USD')}</span>
                    <span className="text-[9px] font-semibold text-slate-500 block mt-1">{t('cards.stat.monthlyAverage')}</span>
                </div>

                <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-5 shadow-md">
                    <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">{t('cards.stat.frozen')}</span>
                    <span className="text-xl font-black text-white block mt-1 font-satoshi">{frozenCount}</span>
                    <span className="text-[9px] font-semibold text-slate-500 block mt-1">{t('cards.stat.cardsPaused')}</span>
                </div>

            </div>

            {/* Virtual Card list grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {cards.map((c) => {
                    const isFrozen = c.status === 'frozen';
                    const progressPercent = Math.min((c.spent / c.limit) * 100, 100);
                    
                    return (
                        <div 
                            key={c.id}
                            className="bg-[#080E1E] border border-white/5 hover:border-white/10 rounded-3xl p-5.5 space-y-5 transition duration-250 cursor-pointer shadow-lg group flex flex-col justify-between"
                            onClick={() => router.push(`/cards/${c.id}`)}
                        >
                            {/* Graphic Card Preview Container */}
                            <div className={cn(
                                "relative h-[160px] rounded-2xl p-5.5 flex flex-col justify-between overflow-hidden shadow-2xl transition duration-300 border select-none group-hover:scale-[1.015]",
                                c.bgGradient
                            )}>
                                {/* Glow Spheres overlay graphic */}
                                <div className="absolute right-[-20px] top-[-20px] w-28 h-28 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-xs"></div>
                                <div className="absolute left-[30%] bottom-[-50px] w-24 h-24 rounded-full bg-white/[0.02] border border-white/[0.04]"></div>

                                {/* Top card line */}
                                <div className="flex justify-between items-start z-10">
                                    <span className="text-[10px] font-black tracking-widest text-white/90 uppercase font-satoshi">{t('cards.badge.virtual')}</span>
                                    <span className="text-xs font-black italic text-white/95 tracking-tight font-satoshi">DigitalCap FX</span>
                                </div>

                                {/* Middle account number or frozen lock overlay */}
                                <div className="z-10 text-left">
                                    {isFrozen ? (
                                        <div className="flex flex-col items-center justify-center space-y-1 py-1 bg-black/25 backdrop-blur-xs rounded-xl border border-white/5 w-fit px-4 mx-auto select-none">
                                            <Snowflake className="h-4 w-4 text-white animate-pulse" />
                                            <span className="text-[9px] font-bold text-white uppercase tracking-widest">{t('cards.stat.frozen')}</span>
                                        </div>
                                    ) : (
                                        <span className="font-mono text-base font-bold text-white tracking-widest block select-all">
                                            •••• •••• •••• {c.number}
                                        </span>
                                    )}
                                </div>

                                {/* Bottom holder / currency */}
                                <div className="flex justify-between items-end z-10 text-xs">
                                    <span className="font-bold text-white/80 truncate max-w-[130px]">{c.holder}</span>
                                    <span className="font-mono font-black text-white/90 uppercase">{c.currency}</span>
                                </div>
                            </div>

                            {/* Card Metadata beneath preview */}
                            <div className="space-y-4.5 text-left">
                                
                                {/* Header and Status badge */}
                                <div className="flex justify-between items-center select-none">
                                    <div>
                                        <h4 className="font-satoshi font-black text-sm text-white">{c.name}</h4>
                                        <span className="text-[10px] font-medium text-slate-500 block mt-0.5">{c.holder}</span>
                                    </div>
                                    <span className={cn(
                                        "text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border tracking-wide",
                                        isFrozen 
                                            ? "bg-slate-500/10 border-slate-500/20 text-slate-400" 
                                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                    )}>
                                        {isFrozen ? t('cards.stat.frozen') : c.status}
                                    </span>
                                </div>

                                {/* Spent Limit progress bar */}
                                <div className="space-y-2">
                                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className={cn(
                                                "h-full rounded-full transition-all duration-300",
                                                isFrozen ? "bg-slate-400" : "bg-primary-500"
                                            )} 
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] text-slate-500 select-none font-bold">
                                        <span>{t('cards.spent')} <strong className="text-white font-mono">{formatCurrency(c.spent, c.currency)}</strong></span>
                                        <span>{t('cards.limit')} <strong className="text-slate-400 font-mono">{formatCurrency(c.limit, c.currency)}</strong></span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    );
                })}

                {/* Issue Card Dotted Placeholder card */}
                <div 
                    onClick={openIssue}
                    className="border-2 border-dashed border-white/5 hover:border-white/15 bg-white/[0.005] hover:bg-white/[0.015] rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center space-y-3 cursor-pointer select-none transition duration-200"
                >
                    <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
                        <Plus className="h-5 w-5" />
                    </div>
                    <span className="font-satoshi font-bold text-sm text-slate-350 block">{t('cards.placeholder.issueNew')}</span>
                </div>

            </div>

        </div>
    );
};

export default CardsPage;
