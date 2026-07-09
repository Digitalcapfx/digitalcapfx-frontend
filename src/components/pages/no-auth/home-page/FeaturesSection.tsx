'use client'

import React from 'react'
import { Globe, Bitcoin, Zap, Shield, CreditCard, TrendingUp } from 'lucide-react'

interface Feature {
    title: string;
    description: string;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
}

const FEATURES: Feature[] = [
    {
        title: 'Multi-Currency',
        description: 'Hold and exchange XAF, XOF, USD, GBP, EUR and more — all in one account.',
        icon: Globe,
        iconColor: 'text-primary-500',
        iconBg: 'bg-primary-500/10',
    },
    {
        title: 'Crypto Built-In',
        description: 'BTC, ETH, SOL, USDT, USDC and more. Your crypto wallet, fully integrated.',
        icon: Bitcoin,
        iconColor: 'text-[#F59E0B]',
        iconBg: 'bg-[#F59E0B]/10',
    },
    {
        title: 'Instant Transfers',
        description: 'Send and receive money in seconds. No borders, no waiting, no hidden fees.',
        icon: Zap,
        iconColor: 'text-[#7C3AED]',
        iconBg: 'bg-[#7C3AED]/10',
    },
    {
        title: 'Bank-Grade Security',
        description: '256-bit encryption, biometric auth, and cold storage for digital assets.',
        icon: Shield,
        iconColor: 'text-[#22C55E]',
        iconBg: 'bg-[#22C55E]/10',
    },
    {
        title: 'Virtual Cards',
        description: 'Create disposable virtual cards instantly. Freeze or cancel with one tap.',
        icon: CreditCard,
        iconColor: 'text-[#19C2FF]',
        iconBg: 'bg-[#19C2FF]/10',
    },
    {
        title: 'Real-Time Exchange',
        description: 'Swap between fiat, stablecoins, and crypto at live market rates.',
        icon: TrendingUp,
        iconColor: 'text-[#FB7185]',
        iconBg: 'bg-[#FB7185]/10',
    },
];

const FeaturesSection = () => {
    return (
        <section id="features">
            <div className="py-14 lg:py-24 text-center space-y-8 md:space-y-16">
                {/* Header */}
                <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-full select-none text-balance">
                        <span className="text-[10px] font-bold tracking-wider text-primary-500 uppercase text-balance">
                            ⚡ Full-Featured Platform
                        </span>
                    </div>
                    <h2 className="font-satoshi font-black text-3xl sm:text-4xl lg:text-[48px] leading-[1.15] text-white tracking-tight text-pretty">
                        Everything your business needs <br />
                        <span className="bg-brand-gradient bg-clip-text text-transparent">to move money globally</span>
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
