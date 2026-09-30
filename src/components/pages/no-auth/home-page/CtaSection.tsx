'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Check, Building2, Banknote } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

const CtaSection = () => {
    const { t } = useLanguageStore();

    return (
        <section id="cta">
            <div className="py-20 lg:py-24 max-w-7xl mx-auto">

                <div className="relative overflow-hidden bg-gradient-to-br from-[#080E21] to-[#12224A] border border-white/10 rounded-[32px] py-16 px-6 sm:px-12 text-center shadow-2xl">

                    {/* Glowing decorative blobs */}
                    <div className="absolute top-[-150px] right-[-150px] w-[350px] h-[350px] rounded-full bg-primary-500/20 blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-[-150px] left-[-150px] w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none"></div>

                    {/* Content */}
                    <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                        <span className="text-[10px] font-bold tracking-[0.25em] text-cyan-400 uppercase block font-mono">
                            {t('cta.badge', { defaultValue: 'Commencez Aujourd\'hui' })}
                        </span>
                        <h2 className="font-satoshi font-black text-3xl sm:text-4xl lg:text-[44px] leading-tight text-white tracking-tight">
                            {t('cta.title', { defaultValue: 'Prêt à simplifier vos paiements internationaux ?' })}
                        </h2>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans max-w-lg mx-auto">
                            {t('cta.subtitle', { defaultValue: 'Créez votre compte entreprise en quelques minutes. Payez vos fournisseurs dans le monde entier depuis une seule plateforme.' })}
                        </p>

                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/get-started">
                                <Button
                                    variant="primary"
                                    size="large"
                                    className="rounded-full px-8 font-semibold shadow-xl shadow-primary-500/20"
                                    rightIcon={<Building2 className="h-5 w-5" />}
                                >
                                    {t('cta.button', { defaultValue: 'Ouvrir un Compte Entreprise' })}
                                </Button>
                            </Link>
                            <Link href="/get-started">
                                <button className="h-[52px] cursor-pointer px-8 rounded-2xl border border-white/15 text-white hover:bg-white/5 hover:border-white/20 transition duration-200 text-sm font-semibold focus:outline-none select-none active:scale-[0.98] flex items-center gap-2">
                                    <Banknote className="h-5 w-5 text-primary-400" />
                                    {t('cta.paySupplier', { defaultValue: 'Payer un Fournisseur' })}
                                </button>
                            </Link>
                        </div>

                        {/* Checklist */}
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 select-none pt-2">
                            <div className="flex items-center">
                                <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3] mr-1.5" />
                                <span className="font-semibold text-slate-400 font-sans">{t('cta.noCard', { defaultValue: 'Inscription gratuite' })}</span>
                            </div>
                            <div className="flex items-center">
                                <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3] mr-1.5" />
                                <span className="font-semibold text-slate-400 font-sans">{t('cta.transparent', { defaultValue: 'Frais transparents' })}</span>
                            </div>
                            <div className="flex items-center">
                                <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3] mr-1.5" />
                                <span className="font-semibold text-slate-400 font-sans">{t('cta.kyc', { defaultValue: 'KYC/KYB 100% en ligne' })}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default CtaSection
