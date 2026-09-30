'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Check, Building2, Banknote } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

const HeroSection = () => {
    const { t } = useLanguageStore();

    const BENEFITS = [
        t('hero.benefit1', { defaultValue: "Zéro frais cachés" }),
        t('hero.benefit2', { defaultValue: "Inscription en 2 minutes" }),
        t('hero.benefit3', { defaultValue: "Fonds sécurisés et ségrégués" })
    ];

    return (
        <section className="w-full max-w-full overflow-hidden">
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center py-12 pt-24 lg:py-32">
                {/* Left Content Column */}
                <div className="col-span-1 lg:col-span-7 space-y-6 text-left min-w-0">

                    {/* Support Badge */}
                    <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-full select-none">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                        <span className="text-[10px] font-bold tracking-wider text-primary-500 uppercase">
                            {t('hero.badge', { defaultValue: "Paiements Transfrontaliers & Change" })}
                        </span>
                    </div>

                    {/* Heading — Clear positioning per Change #1 & #7 */}
                    <div className="space-y-4">
                        <h1 className="font-satoshi font-black text-4xl sm:text-5xl lg:text-[56px] leading-[1.1] text-white tracking-tight">
                            {t('hero.titlePrefix', { defaultValue: "Paiements Internationaux" })} <br className="hidden sm:inline" />
                            <span className="bg-brand-gradient bg-clip-text text-transparent">{t('hero.titleHighlight', { defaultValue: "pour les Entreprises Africaines." })}</span>
                        </h1>
                        <p className="text-[#6D778A] text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl font-sans">
                            {t('hero.subtitle', { defaultValue: "Collections & Payouts automatisés : encaissez en monnaie locale et payez vos fournisseurs internationaux en Euro, USD, CNY et Naira — le tout depuis une seule plateforme sécurisée." })}
                        </p>
                    </div>

                    {/* Corridor indicator — Collections and Payouts & Multi-currency supplier payments */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <span className="bg-primary-500/15 border border-primary-500/30 px-3 py-1.5 rounded-lg text-primary-400 font-bold">Collections & Payouts</span>
                        <span className="text-slate-500">|</span>
                        <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-white font-bold">Payez vos fournisseurs : Euro, USD & Naira</span>
                        <span className="text-slate-500">|</span>
                        <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300">Afrique ↔ Monde</span>
                    </div>

                    {/* Buttons Row — Change #2 CTAs */}
                    <div className="flex flex-wrap items-center gap-4">
                        <Link href="/get-started">
                            <Button
                                variant="primary"
                                size="large"
                                className="rounded-full px-7 shadow-lg shadow-primary-500/20 text-sm font-bold"
                                rightIcon={<Building2 className="h-5 w-5" />}
                            >
                                {t('hero.openAccount', { defaultValue: "Ouvrir un Compte Entreprise" })}
                            </Button>
                        </Link>
                        <Link href="/get-started">
                            <button className="h-[52px] cursor-pointer px-8 rounded-2xl border border-white/15 text-white hover:bg-white/5 hover:border-white/20 transition duration-200 text-sm font-semibold focus:outline-none select-none active:scale-[0.98] flex items-center gap-2">
                                <Banknote className="h-5 w-5 text-primary-400" />
                                {t('hero.paySupplier', { defaultValue: "Payer un Fournisseur" })}
                            </button>
                        </Link>
                    </div>

                    {/* Checklist Benefits — Change #4: removed FDIC, replaced with safe phrasing */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-500 select-none">
                        {BENEFITS.map((benefit) => (
                            <div key={benefit} className="flex items-center space-x-2">
                                <Check className="h-4 w-4 text-[#22C55E] stroke-[3]" />
                                <span className="font-semibold font-sans text-slate-400">{benefit}</span>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Right Illustration Column — Change #2: XAF→CNY flow instead of EUR→GBP */}
                <div className="col-span-1 lg:col-span-5 flex justify-center lg:justify-end relative mt-8 lg:mt-0 min-w-0 w-full">
                    <div className="relative w-full max-w-[340px] sm:max-w-[450px] lg:max-w-none h-auto mx-auto lg:mx-0">
                        <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

                        {/* Payment Flow Visual Card */}
                        <div className="glass-panel p-6 sm:p-8 space-y-6 border border-white/10 rounded-[24px] shadow-2xl shadow-black/60">
                            {/* Flow header */}
                            <div className="text-center">
                                <span className="text-[10px] font-bold tracking-[0.2em] text-primary-400 uppercase font-mono">Collections & Payouts Fournisseurs</span>
                            </div>

                            {/* Step flow */}
                            <div className="space-y-3">
                                {[
                                    { step: '1', label: 'Collections (Encaissements)', detail: 'Dépôt XAF / XOF via Banque & MoMo', color: 'text-white' },
                                    { step: '2', label: 'Conversion FX en Temps Réel', detail: 'Vers Euro, USD, CNY ou Naira', color: 'text-primary-400' },
                                    { step: '3', label: 'Payouts Fournisseurs', detail: 'Règlement direct : Euro, USD, CNY & Naira', color: 'text-cyan-400' },
                                    { step: '4', label: 'Confirmation & Traçabilité', detail: 'Justificatif & suivi en temps réel', color: 'text-[#22C55E]' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-300 group">
                                        <div className={`w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-xs font-bold ${item.color} shrink-0`}>
                                            {item.step}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-sm font-bold ${item.color} font-satoshi`}>{item.label}</p>
                                            <p className="text-[11px] text-slate-500 font-sans">{item.detail}</p>
                                        </div>
                                        {i < 3 && <ArrowRight className="h-3.5 w-3.5 text-slate-600 ml-auto shrink-0 group-hover:text-primary-400 transition-colors" />}
                                        {i === 3 && <Check className="h-4 w-4 text-[#22C55E] ml-auto shrink-0 stroke-[3]" />}
                                    </div>
                                ))}
                            </div>

                            {/* Live rate preview */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Taux indicatif</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-lg font-extrabold text-primary-400 font-satoshi">1,000,000 XAF</span>
                                        <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                                        <span className="text-lg font-extrabold text-white font-satoshi">¥10,980</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Animation style hook for subtle float */}
                <style jsx global>{`
                @keyframes float-card {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>
            </main>
        </section>

    )
}

export default HeroSection