'use client'

import React from 'react'
import { Globe, Zap, Shield, CreditCard, TrendingUp, Building2, ArrowLeftRight } from 'lucide-react'

import { useLanguageStore } from '@/store/languageStore'

const FeaturesSection = () => {
    const { t } = useLanguageStore();

    // B2B & Global FX features: Collections & Payouts, Multi-currency supplier payments
    const FEATURES = [
        {
            title: t('features.collectionsPayouts.title', { defaultValue: 'Collections & Payouts' }),
            description: t('features.collectionsPayouts.desc', { defaultValue: 'Encaissez facilement les règlements de vos clients et automatisez vos décaissements (payouts) locaux et transfrontaliers sans friction.' }),
            icon: ArrowLeftRight,
            iconColor: 'text-primary-500',
            iconBg: 'bg-primary-500/10',
        },
        {
            title: t('features.supplierPayments.title', { defaultValue: 'Payez vos Fournisseurs : Euro, USD & Naira' }),
            description: t('features.supplierPayments.desc', { defaultValue: 'Réglez directement vos factures fournisseurs et partenaires en Europe, aux États-Unis, en Chine et au Nigéria en Euro, USD, CNY et Naira.' }),
            icon: Building2,
            iconColor: 'text-[#F59E0B]',
            iconBg: 'bg-[#F59E0B]/10',
        },
        {
            title: t('features.multiCurrency.title', { defaultValue: 'Comptes Multi-Devises' }),
            description: t('features.multiCurrency.desc', { defaultValue: 'Détenez et échangez XAF, XOF, USD, EUR, GBP, NGN, CNY et bien plus — depuis une interface trésorerie unique.' }),
            icon: Globe,
            iconColor: 'text-[#7C3AED]',
            iconBg: 'bg-[#7C3AED]/10',
        },
        {
            title: t('features.transfers.title', { defaultValue: 'Transferts Rapides' }),
            description: t('features.transfers.desc', { defaultValue: 'Envoyez et recevez des paiements en quelques secondes. Sans frontières, sans délais et en toute conformité.' }),
            icon: Zap,
            iconColor: 'text-[#22C55E]',
            iconBg: 'bg-[#22C55E]/10',
        },
        {
            title: t('features.security.title', { defaultValue: 'Sécurité & Ségrégation' }),
            description: t('features.security.desc', { defaultValue: 'Chiffrement 256-bit, authentification biométrique et ségrégation stricte des fonds clients.' }),
            icon: Shield,
            iconColor: 'text-[#19C2FF]',
            iconBg: 'bg-[#19C2FF]/10',
        },
        {
            title: t('features.exchange.title', { defaultValue: 'Change aux Taux Réels' }),
            description: t('features.exchange.desc', { defaultValue: 'Convertissez instantanément vos devises aux cours du marché interbancaire en temps réel.' }),
            icon: TrendingUp,
            iconColor: 'text-[#FB7185]',
            iconBg: 'bg-[#FB7185]/10',
        },
    ];

    return (
        <section id="features">
            <div className="py-14 lg:py-24 text-center space-y-8 md:space-y-16">
                {/* Header */}
                <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-full select-none text-balance">
                        <span className="text-[10px] font-bold tracking-wider text-primary-500 uppercase text-balance">
                            {t('features.badge', { defaultValue: '⚡ Plateforme Complète' })}
                        </span>
                    </div>
                    <h2 className="font-satoshi font-black text-3xl sm:text-4xl lg:text-[48px] leading-[1.15] text-white tracking-tight text-pretty">
                        {t('features.title', { defaultValue: 'Tout ce dont votre entreprise a besoin' })} <br />
                        <span className="bg-brand-gradient bg-clip-text text-transparent">{t('features.titleHighlight', { defaultValue: 'pour payer à l\'international' })}</span>
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left mx-auto">
                    {FEATURES.map((feature) => {
                        const IconComponent = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="glass-panel p-6 space-y-4 select-none border-white/7 transition-all duration-300 group"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.iconBg}`}>
                                    <IconComponent className={`h-5 w-5 ${feature.iconColor}`} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-satoshi font-bold text-lg text-[#F8FAFC] group-hover:text-primary-400 transition-colors duration-200">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[#7588A3] text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

        </section>
    )
}

export default FeaturesSection
