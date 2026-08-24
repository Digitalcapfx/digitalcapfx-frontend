'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import NavBar from '../layout/NavBar'
import Footer from '../layout/Footer'
import NewsletterSection from '../shared/NewsletterSection'
import {
    ArrowRight,
    Globe,
    TrendingUp,
    Shield,
    Check,
    Send,
    Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { useLanguageStore } from '@/store/languageStore'

export default function AboutUsPage() {
    const { t } = useLanguageStore()
    const [newsletterEmail, setNewsletterEmail] = useState('')

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newsletterEmail || !newsletterEmail.includes('@')) {
            toast.error('Please enter a valid email address.')
            return
        }
        toast.success('Thank you for subscribing to DigitalCap FX updates!')
        setNewsletterEmail('')
    }

    return (
        <div className="w-full text-white flex flex-col font-sans relative overflow-x-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute top-[600px] right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <main className="flex-grow">
                {/* 1. HERO SECTION */}
                <div className="relative py-10 md:py-16 lg:py-20 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
                        {/* Left Column Text */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
                                <Sparkles className="h-3 w-3 text-primary-400" />
                                <span className="text-[11px] font-bold text-primary-400 uppercase tracking-widest">
                                    {t('about.badge', { defaultValue: 'ABOUT DIGITALCAP FX' })}
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                                {t('about.title', { defaultValue: "Building Africa's Financial Infrastructure for the Next Generation." })}
                            </h1>

                            <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg font-sans">
                                {t('about.subtitle', { defaultValue: "Instead of simply moving money, we're building the infrastructure that powers cross-border commerce, treasury management, foreign exchange and global business banking." })}
                            </p>

                            <div className="flex flex-wrap items-center gap-3.5 pt-2">
                                <Link
                                    href="/get-started"
                                    className="bg-gradient-to-r from-primary-500 to-cyan-500 hover:from-primary-600 hover:to-cyan-600 text-white font-bold text-xs sm:text-sm px-6 py-2.5 sm:py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-primary-500/20 transition duration-200"
                                >
                                    <span>{t('nav.getStarted', { defaultValue: 'Get Started' })}</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>

                                <Link
                                    href="/contact"
                                    className="bg-[#0C1224] hover:bg-white/5 border border-white/10 text-white font-bold text-xs sm:text-sm px-6 py-2.5 sm:py-3 rounded-xl transition duration-200"
                                >
                                    {t('footer.contact', { defaultValue: 'Contact Us' })}
                                </Link>
                            </div>
                        </div>

                        {/* Right Column Graphic */}
                        <div className="lg:col-span-5 relative flex items-center justify-center">
                            <div className="w-full max-w-[360px] aspect-square relative flex items-center justify-center">
                                {/* Globe Orbital Rings Graphic */}
                                <div className="absolute inset-0 border border-primary-500/20 rounded-full animate-spin-slow"></div>
                                <div className="absolute inset-6 border border-cyan-500/15 rounded-full"></div>
                                <div className="absolute inset-12 border border-white/10 rounded-full"></div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 via-cyan-500/5 to-transparent rounded-full blur-xl"></div>

                                {/* Network Mesh Center */}
                                <div className="w-52 h-52 rounded-full border border-cyan-500/30 flex items-center justify-center relative bg-[#090E1E]/70 backdrop-blur-sm">
                                    <div className="w-36 h-36 rounded-full border border-primary-400/40 flex items-center justify-center">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-500/30 to-cyan-400/20 flex items-center justify-center">
                                            <Globe className="h-10 w-10 text-primary-400 animate-pulse" />
                                        </div>
                                    </div>

                                    {/* Floating Symbols */}
                                    <span className="absolute top-3 left-5 text-emerald-400 font-bold text-xs">₦</span>
                                    <span className="absolute bottom-5 left-6 text-cyan-400 font-bold text-xs">€</span>
                                    <span className="absolute top-6 right-5 text-purple-400 font-bold text-xs">£</span>
                                    <span className="absolute bottom-6 right-8 text-amber-400 font-bold text-xs">¥</span>
                                </div>

                                {/* Floating Card 1 (USD Wallet) */}
                                <div className="absolute -top-1 left-0 bg-[#0C1428]/95 border border-white/10 rounded-xl p-2.5 shadow-2xl backdrop-blur-md flex items-center space-x-2.5 text-xs z-10 min-w-[170px]">
                                    <div className="w-7 h-7 rounded-lg bg-primary-500/15 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold text-xs">
                                        $
                                    </div>
                                    <div>
                                        <div className="text-[9px] text-slate-400 font-mono">USD Wallet •••• 4921</div>
                                        <div className="font-bold text-white text-xs flex items-center space-x-1">
                                            <span>$42,600</span>
                                            <span className="text-[9px] text-emerald-400 font-mono">↑ 8.2%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Card 2 (Payment Received) */}
                                <div className="absolute top-1/4 -right-2 bg-[#0C1428]/95 border border-white/10 rounded-xl p-2.5 shadow-2xl backdrop-blur-md flex items-center space-x-2.5 text-xs z-10 min-w-[180px]">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs">
                                        ↓
                                    </div>
                                    <div>
                                        <div className="text-[9px] text-emerald-400 font-bold">Payment received</div>
                                        <div className="font-bold text-white text-xs">+$142,500</div>
                                        <div className="text-[8px] text-slate-400 font-mono">Stripe Inc. • Wire</div>
                                    </div>
                                    <span className="text-purple-400 font-bold text-xs ml-auto">£</span>
                                </div>

                                {/* Floating Card 3 (Live Rates) */}
                                <div className="absolute bottom-2 right-1 bg-[#0C1428]/95 border border-white/10 rounded-xl p-2.5 shadow-2xl backdrop-blur-md flex items-center space-x-2.5 text-xs z-10">
                                    <div>
                                        <div className="text-[9px] text-slate-400 font-mono">EUR/USD Live</div>
                                        <div className="font-bold text-white text-xs flex items-center space-x-1">
                                            <span>1.0842</span>
                                            <span className="text-[8px] text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded font-mono">+0.4%</span>
                                        </div>
                                    </div>
                                    <span className="text-amber-400 font-bold text-xs">¥</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. MISSION, VISION & VALUES SECTION */}
                <div className="py-14 md:py-18 px-4 md:px-8 border-t border-white/5 bg-[#050816]">
                    <div className="max-w-7xl mx-auto space-y-10">
                        <div className="text-center space-y-3 max-w-xl mx-auto">
                            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
                                <Sparkles className="h-3 w-3 text-primary-400" />
                                <span className="text-[11px] font-bold text-primary-400 uppercase tracking-widest">
                                    WHAT WE STAND FOR
                                </span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                                Mission, vision & values
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Card 1: MISSION */}
                            <div className="bg-[#0C1224] border border-white/10 rounded-2xl p-6 space-y-5 hover:border-primary-500/40 transition duration-300 shadow-xl group">
                                <div className="w-10 h-10 rounded-xl bg-primary-500/15 border border-primary-500/30 flex items-center justify-center text-primary-400 group-hover:scale-105 transition duration-300">
                                    <Globe className="h-5 w-5" />
                                </div>

                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest block font-mono">
                                        MISSION
                                    </span>
                                    <h3 className="text-base md:text-lg font-bold text-white">
                                        Empower businesses with borderless finance.
                                    </h3>
                                </div>

                                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                                    Every business, regardless of geography, should have access to world-class financial infrastructure.
                                </p>
                            </div>

                            {/* Card 2: VISION */}
                            <div className="bg-[#0C1224] border border-white/10 rounded-2xl p-6 space-y-5 hover:border-cyan-500/40 transition duration-300 shadow-xl group">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition duration-300">
                                    <TrendingUp className="h-5 w-5" />
                                </div>

                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block font-mono">
                                        VISION
                                    </span>
                                    <h3 className="text-base md:text-lg font-bold text-white">
                                        Become Africa's leading financial infrastructure platform.
                                    </h3>
                                </div>

                                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                                    The rails on which African and global businesses build their financial future.
                                </p>
                            </div>

                            {/* Card 3: VALUES */}
                            <div className="bg-[#0C1224] border border-white/10 rounded-2xl p-6 space-y-5 hover:border-emerald-500/40 transition duration-300 shadow-xl group">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition duration-300">
                                    <Shield className="h-5 w-5" />
                                </div>

                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block font-mono">
                                        VALUES
                                    </span>
                                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                                        {['Innovation', 'Trust', 'Security', 'Transparency'].map((val) => (
                                            <div key={val} className="flex items-center space-x-2 text-xs font-semibold text-white">
                                                <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                                                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                                                </div>
                                                <span>{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. PLATFORM IMPACT / NUMBERS SECTION */}
                <div className="py-14 md:py-18 px-4 md:px-8 border-t border-white/5 bg-[#030612]">
                    <div className="max-w-7xl mx-auto space-y-10">
                        <div className="text-center space-y-3 max-w-xl mx-auto">
                            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
                                <Sparkles className="h-3 w-3 text-primary-400" />
                                <span className="text-[11px] font-bold text-primary-400 uppercase tracking-widest">
                                    PLATFORM IMPACT
                                </span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                                Numbers that speak{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">
                                    for themselves
                                </span>
                            </h2>
                        </div>

                        {/* 8 Stats Cards (4x2 Grid on desktop, 2x4 on mobile) */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
                            {[
                                { stat: '$2B+', label: 'Transaction Volume' },
                                { stat: '40+', label: 'Countries Served' },
                                { stat: '120+', label: 'Currencies Supported' },
                                { stat: '99.99%', label: 'Platform Uptime' },
                                { stat: '500+', label: 'Business Customers' },
                                { stat: '$4,800M+', label: 'Monthly Volume' },
                                { stat: '3s', label: 'Average Settlement' },
                                { stat: '85+', label: 'Team Members' },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-[#090E1E] border border-white/10 rounded-xl p-5 text-center space-y-1.5 hover:border-primary-500/30 transition duration-300 shadow-md"
                                >
                                    <div className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-cyan-400 to-blue-400 font-mono">
                                        {item.stat}
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-medium font-sans">
                                        {item.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. LEADERSHIP SECTION */}
                <div className="py-14 md:py-18 px-4 md:px-8 border-t border-white/5 bg-[#050816]">
                    <div className="max-w-7xl mx-auto space-y-10">
                        <div className="text-center space-y-3 max-w-xl mx-auto">
                            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
                                <Sparkles className="h-3 w-3 text-primary-400" />
                                <span className="text-[11px] font-bold text-primary-400 uppercase tracking-widest">
                                    LEADERSHIP
                                </span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                                Built by operators,{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">
                                    not theorists
                                </span>
                            </h2>
                        </div>

                        {/* 3 Leadership Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                {
                                    initials: 'DM',
                                    bg: 'from-cyan-500 to-blue-600',
                                    name: 'David Mensah',
                                    role: 'Co-founder & CEO',
                                    bio: 'Former VP at Flutterwave. 15 years building financial infrastructure across Sub-Saharan Africa.',
                                },
                                {
                                    initials: 'SO',
                                    bg: 'from-purple-500 to-indigo-600',
                                    name: 'Sarah Okonkwo',
                                    role: 'Co-founder & CTO',
                                    bio: 'ex-Google, ex-Stripe. Led payment API infrastructure serving 40M+ merchants across EMEA.',
                                },
                                {
                                    initials: 'AR',
                                    bg: 'from-emerald-500 to-teal-600',
                                    name: 'Ahmed Al-Rashid',
                                    role: 'Chief Operating Officer',
                                    bio: 'Former Goldman Sachs FX trader. 12 years at the intersection of institutional finance and emerging markets.',
                                },
                            ].map((person) => (
                                <div
                                    key={person.name}
                                    className="bg-[#0C1224] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-primary-500/40 transition duration-300 shadow-xl"
                                >
                                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${person.bg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                        {person.initials}
                                    </div>

                                    <div className="space-y-0.5">
                                        <h3 className="text-base font-bold text-white">{person.name}</h3>
                                        <p className="text-xs font-bold text-primary-400">{person.role}</p>
                                    </div>

                                    <p className="text-slate-400 text-xs leading-relaxed">
                                        {person.bio}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 5. CTA BANNER CARD */}
                <div className="py-12 md:py-16 px-4 md:px-8 border-t border-white/5 bg-[#030612]">
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/50 via-primary-900/30 to-cyan-900/50 border border-primary-500/30 rounded-2xl p-8 md:p-12 text-center space-y-5 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary-500/10 blur-2xl pointer-events-none"></div>

                        <div className="relative z-10 space-y-2.5">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                Join the financial revolution.
                            </h2>
                            <p className="text-slate-300 text-xs sm:text-sm font-sans max-w-md mx-auto">
                                Start building with DigitalCap FX today. No setup fees.
                            </p>
                        </div>

                        <div className="relative z-10 pt-1">
                            <Link
                                href="/get-started"
                                className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-400 via-primary-500 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-xl shadow-lg shadow-primary-500/20 transition duration-200"
                            >
                                <span>Create Account</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 6. STAY IN THE LOOP (NEWSLETTER) SECTION */}
                <NewsletterSection />
            </main>
        </div>
    )
}
