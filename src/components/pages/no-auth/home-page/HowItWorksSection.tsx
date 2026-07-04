'use client'

import React from 'react'
import { Wallet, Globe, Zap } from 'lucide-react'

interface Step {
    number: number;
    title: string;
    description: string;
    icon: React.ElementType;
}

const STEPS: Step[] = [
    {
        number: 1,
        title: 'Create your account',
        description: 'Sign up in under 2 minutes. No paperwork, no branches.',
        icon: Wallet,
    },
    {
        number: 2,
        title: 'Add your currencies',
        description: 'Fund your wallets with fiat, stablecoins, or crypto.',
        icon: Globe,
    },
    {
        number: 3,
        title: 'Send, exchange & spend',
        description: 'Manage everything from one beautiful dashboard.',
        icon: Zap,
    },
];

const HowItWorksSection = () => {
    return (
        <section id="how-it-works" className="py-20 lg:py-28 text-center space-y-16">
            
            {/* Header */}
            <div className="space-y-4 max-w-3xl mx-auto flex flex-col items-center">
                <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-full select-none">
                    <span className="text-[10px] font-bold tracking-wider text-primary-400 uppercase">
                        ⚙️ How It Works
                    </span>
                </div>
                <h2 className="font-satoshi font-black text-3xl sm:text-4xl lg:text-[48px] leading-[1.15] text-white tracking-tight">
                    Get started in <span className="bg-brand-gradient bg-clip-text text-transparent">3 steps</span>
                </h2>
                <p className="text-slate-400 text-sm sm:text-base max-w-lg font-sans">
                    No paperwork, no waiting. Your new financial life is minutes away.
                </p>
            </div>

            {/* Steps Container */}
            <div className="relative max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-[52px] left-[15%] right-[15%] h-[1px] border-t border-dashed border-white/10 z-0"></div>

                {STEPS.map((step) => {
                    const IconComponent = step.icon;
                    return (
                        <div 
                            key={step.number}
                            className="flex flex-col items-center text-center space-y-5 z-10 select-none group"
                        >
                            {/* Icon Container with Step Badge */}
                            <div className="relative">
                                <div className="w-[104px] h-[104px] rounded-3xl bg-brand-gradient flex items-center justify-center shadow-xl shadow-primary-500/10 group-hover:scale-105 transition-transform duration-300">
                                    <IconComponent className="h-10 w-10 text-white" />
                                </div>
                                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#050816] border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow">
                                    {step.number}
                                </div>
                            </div>

                            {/* Text Details */}
                            <div className="space-y-2 max-w-xs">
                                <h3 className="font-satoshi font-bold text-lg text-white group-hover:text-primary-400 transition-colors duration-200">
                                    {step.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed font-sans">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

        </section>
    )
}

export default HowItWorksSection
