'use client'

import React from 'react'
import Image from 'next/image'
import { Check, X } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

const CheckIcon = () => (
    <div className="w-6 h-6 rounded-full bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E] select-none">
        <Check className="h-3.5 w-3.5 stroke-[3]" />
    </div>
);

const XIcon = () => (
    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[#7588A3]/50 select-none">
        <X className="h-3.5 w-3.5 stroke-[3]" />
    </div>
);

const ComparisonSection = () => {
    const { t } = useLanguageStore();

    const COMPARISON_ROWS = [
        { feature: t('compare.f1', { defaultValue: 'Multi-currency wallets' }), dfx: true, bank: false },
        { feature: t('compare.f2', { defaultValue: 'Instant cross-border transfers' }), dfx: true, bank: false },
        { feature: t('compare.f3', { defaultValue: 'Built-in crypto exchange' }), dfx: true, bank: false },
        { feature: t('compare.f4', { defaultValue: 'Virtual cards in seconds' }), dfx: true, bank: false },
        { feature: t('compare.f5', { defaultValue: 'No hidden fees' }), dfx: true, bank: false },
        { feature: t('compare.f6', { defaultValue: 'Real-time exchange rates' }), dfx: true, bank: false },
        { feature: t('compare.f7', { defaultValue: '24/7 support' }), dfx: true, bank: true },
        { feature: t('compare.f8', { defaultValue: 'Bank-grade security' }), dfx: true, bank: true },
    ];

    return (
        <section id="comparison">
            <div className="py-14 lg:py-24 text-center space-y-12">

                {/* Header */}
                <div className="space-y-4 max-w-3xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-full select-none">
                        <span className="text-[10px] font-bold tracking-wider text-primary-400 uppercase">
                            {t('compare.badge', { defaultValue: '❖ Why DigitalCap FX' })}
                        </span>
                    </div>
                    <h2 className="font-satoshi font-black text-3xl sm:text-4xl lg:text-[48px] leading-[1.15] text-white tracking-tight">
                        {t('compare.title', { defaultValue: 'Why switch to' })} <span className="bg-brand-gradient bg-clip-text text-transparent">DigitalCapFx?</span>
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-lg font-sans">
                        {t('compare.subtitle', { defaultValue: 'See how we compare to traditional banks. The difference speaks for itself.' })}
                    </p>
                </div>

                {/* Table Container */}
                <div className="max-w-4xl mx-auto px-4 md:px-8">
                    <div className="glass-panel overflow-hidden border border-white/5 rounded-2xl shadow-2xl">

                        {/* Header Row */}
                        <div className="grid grid-cols-12 items-center py-6 px-6 sm:px-8 border-b border-white/5 bg-white/[0.01] select-none">
                            <div className="col-span-6 text-left text-xs font-bold uppercase tracking-wider text-slate-550 font-satoshi">
                                {t('compare.tableHeaderFeature', { defaultValue: 'Features' })}
                            </div>
                            <div className="col-span-3 flex justify-center">
                                <div className="bg-[#0C1224] border border-white/10 px-4 py-1.5 rounded-full flex items-center justify-center shadow">
                                    <Image
                                        src="/DFXLogo.svg"
                                        alt="DigitalCap Logo"
                                        width={100}
                                        height={24}
                                        className="h-5 w-auto"
                                    />
                                </div>
                            </div>
                            <div className="col-span-3 text-center text-xs font-bold tracking-tight text-slate-400 font-satoshi">
                                {t('compare.tableHeaderBanks', { defaultValue: 'Traditional Banks' })}
                            </div>
                        </div>

                        {/* Comparison Rows */}
                        <div className="divide-y divide-white/5">
                            {COMPARISON_ROWS.map((row) => (
                                <div
                                    key={row.feature}
                                    className="grid grid-cols-12 items-center py-4 px-6 sm:px-8 hover:bg-white/[0.02] transition duration-200"
                                >
                                    <div className="col-span-6 text-left text-sm font-bold text-slate-300 font-satoshi">
                                        {row.feature}
                                    </div>
                                    <div className="col-span-3 flex justify-center">
                                        {row.dfx ? <CheckIcon /> : <XIcon />}
                                    </div>
                                    <div className="col-span-3 flex justify-center">
                                        {row.bank ? <CheckIcon /> : <XIcon />}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

        </section>
    )
}

export default ComparisonSection
