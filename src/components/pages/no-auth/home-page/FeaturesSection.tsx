'use client'

import React from 'react'
import { Globe, Coins, Zap, Shield, CreditCard, TrendingUp } from 'lucide-react'

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
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
        title: 'Crypto Built-In',
        description: 'BTC, ETH, SOL, USDT, USDC and more. Your crypto wallet, fully integrated.',
        icon: Coins,
        iconColor: 'text-amber-400',
        iconBg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
        title: 'Instant Transfers',
        description: 'Send and receive money in seconds. No borders, no waiting, no hidden fees.',
        icon: Zap,
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
        title: 'Bank-Grade Security',
        description: '256-bit encryption, biometric auth, and cold storage for digital assets.',
        icon: Shield,
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
        title: 'Virtual Cards',
        description: 'Create disposable virtual cards instantly. Freeze or cancel with one tap.',
        icon: CreditCard,
        iconColor: 'text-cyan-400',
        iconBg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
        title: 'Real-Time Exchange',
        description: 'Swap between fiat, stablecoins, and crypto at live market rates.',
        icon: TrendingUp,
        iconColor: 'text-rose-400',
        iconBg: 'bg-rose-500/10 border-rose-500/20',
    },
];

const FeaturesSection = () => {
    return (
        <section id="features" className="py-20 lg:py-28 text-center space-y-12">
            
            {/* Header */}
            <div className="space-y-4 max-w-3xl mx-auto flex flex-col items-center">
                <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-full select-none">
                    <span className="text-[10px] font-bold tracking-wider text-primary-400 uppercase">
                        ⚡ Full-Featured Platform
                    </span>
                </div>
                <h2 className="font-satoshi font-black text-3xl sm:text-4xl lg:text-[48px] leading-[1.15] text-white tracking-tight">
                    Everything your business needs <br />
                    <span className="bg-brand-gradient bg-clip-text text-transparent">to move money globally</span>
                </h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left max-w-7xl mx-auto px-4 md:px-8">
                {FEATURES.map((feature) => {
                    const IconComponent = feature.icon;
                    return (
                        <div 
                            key={feature.title}
                            className="glass-panel p-8 space-y-5 select-none hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 group"
                        >
                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${feature.iconBg}`}>
                                <IconComponent className={`h-5 w-5 ${feature.iconColor}`} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-satoshi font-bold text-lg text-white group-hover:text-primary-400 transition-colors duration-200">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed font-sans">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

        </section>
    )
}

export default FeaturesSection
