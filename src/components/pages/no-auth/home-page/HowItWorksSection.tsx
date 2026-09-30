'use client'

import React from 'react'
import { UserCheck, Wallet, ArrowLeftRight, Building2, FileText, Send, Eye, Globe } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

const HowItWorksSection = () => {
    const { t } = useLanguageStore();

    // Change #2: China supplier payments step-by-step process
    const STEPS = [
        {
            number: 1,
            title: t('how.step1.title', { defaultValue: 'Créez votre compte entreprise' }),
            description: t('how.step1.desc', { defaultValue: 'Inscrivez-vous en ligne en moins de 2 minutes. Aucun déplacement nécessaire.' }),
            icon: UserCheck,
        },
        {
            number: 2,
            title: t('how.step2.title', { defaultValue: 'Complétez le KYC/KYB' }),
            description: t('how.step2.desc', { defaultValue: 'Vérification d\'identité et de votre entreprise entièrement en ligne.' }),
            icon: FileText,
        },
        {
            number: 3,
            title: t('how.step3.title', { defaultValue: 'Alimentez votre compte en XAF' }),
            description: t('how.step3.desc', { defaultValue: 'Par virement bancaire ou Mobile Money (Orange Money, MTN MoMo).' }),
            icon: Wallet,
        },
        {
            number: 4,
            title: t('how.step4.title', { defaultValue: 'Convertissez XAF → USD/CNY' }),
            description: t('how.step4.desc', { defaultValue: 'Taux de change compétitifs, conversion instantanée.' }),
            icon: ArrowLeftRight,
        },
        {
            number: 5,
            title: t('how.step5.title', { defaultValue: 'Ajoutez votre fournisseur' }),
            description: t('how.step5.desc', { defaultValue: 'Chine, Europe ou tout autre marché international.' }),
            icon: Building2,
        },
        {
            number: 6,
            title: t('how.step6.title', { defaultValue: 'Envoyez le paiement' }),
            description: t('how.step6.desc', { defaultValue: 'Téléchargez la facture ou le bon de commande et confirmez.' }),
            icon: Send,
        },
    ];

    return (
        <section id="how-it-works" >
            <div className="py-14 lg:py-24 text-center space-y-16 max-md:space-y-10">

                {/* Header */}
                <div className="space-y-4 max-w-3xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-full select-none">
                        <span className="text-[11px] font-bold tracking-wider text-primary-500 uppercase">
                            {t('how.badge', { defaultValue: '⚡ Comment ça marche' })}
                        </span>
                    </div>
                    <h2 className="font-satoshi font-black text-3xl sm:text-4xl lg:text-[48px] leading-[1.15] text-white tracking-tight">
                        {t('how.title', { defaultValue: 'Payez vos fournisseurs en' })} <span className="bg-brand-gradient bg-clip-text text-transparent">{t('how.titleHighlight', { defaultValue: '6 étapes' })}</span>
                    </h2>
                    <p className="text-[#6D778A] text-sm sm:text-base max-w-lg">
                        {t('how.subtitle', { defaultValue: 'De l\'ouverture de compte au paiement confirmé. Simple, rapide, transparent.' })}
                    </p>
                </div>

                {/* Steps Container — 2x3 grid for 6 steps */}
                <div className="relative max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {STEPS.map((step) => {
                        const IconComponent = step.icon;
                        return (
                            <div
                                key={step.number}
                                className="flex flex-col items-center text-center space-y-4 z-10 select-none group glass-panel p-6 border border-white/5 hover:border-white/10 transition-all duration-300"
                            >
                                {/* Icon Container with Step Badge */}
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center shadow-xl shadow-primary-500/10 group-hover:scale-105 transition-transform duration-300">
                                        <IconComponent className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#050816] border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow">
                                        {step.number}
                                    </div>
                                </div>

                                {/* Text Details */}
                                <div className="space-y-2 max-w-xs">
                                    <h3 className="font-satoshi font-bold text-lg text-[#F8FAFC] group-hover:text-primary-400 transition-colors duration-200">
                                        {step.title}
                                    </h3>
                                    <p className="text-[#6D778A] text-sm leading-relaxed font-sans">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Visual flow summary */}
                <div className="max-w-3xl mx-auto px-4">
                    <div className="glass-panel p-6 border border-white/10 rounded-2xl">
                        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-bold">
                            <span className="bg-primary-500/10 text-primary-400 px-4 py-2 rounded-lg border border-primary-500/20">XAF</span>
                            <span className="text-slate-500">→</span>
                            <span className="bg-white/5 text-white px-4 py-2 rounded-lg border border-white/10">USD / CNY</span>
                            <span className="text-slate-500">→</span>
                            <span className="bg-white/5 text-white px-4 py-2 rounded-lg border border-white/10">Fournisseur Chinois</span>
                            <span className="text-slate-500">→</span>
                            <span className="bg-[#22C55E]/10 text-[#22C55E] px-4 py-2 rounded-lg border border-[#22C55E]/20">✓ Confirmation</span>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}

export default HowItWorksSection
