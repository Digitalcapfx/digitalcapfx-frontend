'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    ArrowRight,
    Globe,
    Code,
    Sparkles,
    CheckCircle2,
    Send,
    MapPin,
    Clock,
    Briefcase,
    HeartHandshake,
    BookOpen,
    Shield,
    Zap,
    TrendingUp,
    Award
} from 'lucide-react'
import { toast } from 'sonner'
import { useLanguageStore } from '@/store/languageStore'

interface JobRole {
    id: string
    title: string
    department: 'Engineering' | 'Product' | 'Finance' | 'Operations' | 'Sales'
    departmentBg: string
    departmentColor: string
    location: string
    type: string
}

const OPEN_ROLES: JobRole[] = [
    {
        id: '1',
        title: 'Senior Backend Engineer — Payments',
        department: 'Engineering',
        departmentBg: 'bg-blue-500/10 border-blue-500/20',
        departmentColor: 'text-blue-400',
        location: 'Remote',
        type: 'Full-time',
    },
    {
        id: '2',
        title: 'Staff Platform Engineer — FX APIs',
        department: 'Engineering',
        departmentBg: 'bg-blue-500/10 border-blue-500/20',
        departmentColor: 'text-blue-400',
        location: 'Lagos / Remote',
        type: 'Full-time',
    },
    {
        id: '3',
        title: 'Frontend Engineer — Dashboard',
        department: 'Engineering',
        departmentBg: 'bg-blue-500/10 border-blue-500/20',
        departmentColor: 'text-blue-400',
        location: 'Remote',
        type: 'Full-time',
    },
    {
        id: '4',
        title: 'Senior Product Manager — Wallets',
        department: 'Product',
        departmentBg: 'bg-purple-500/10 border-purple-500/20',
        departmentColor: 'text-purple-400',
        location: 'London / Remote',
        type: 'Full-time',
    },
    {
        id: '5',
        title: 'Product Designer — Enterprise UX',
        department: 'Product',
        departmentBg: 'bg-purple-500/10 border-purple-500/20',
        departmentColor: 'text-purple-400',
        location: 'Remote',
        type: 'Full-time',
    },
    {
        id: '6',
        title: 'FX Trader / Dealer',
        department: 'Finance',
        departmentBg: 'bg-emerald-500/10 border-emerald-500/20',
        departmentColor: 'text-emerald-400',
        location: 'Lagos',
        type: 'Full-time',
    },
    {
        id: '7',
        title: 'Compliance Analyst — KYB/AML',
        department: 'Operations',
        departmentBg: 'bg-cyan-500/10 border-cyan-500/20',
        departmentColor: 'text-cyan-400',
        location: 'London',
        type: 'Full-time',
    },
    {
        id: '8',
        title: 'Enterprise Account Executive',
        department: 'Sales',
        departmentBg: 'bg-rose-500/10 border-rose-500/20',
        departmentColor: 'text-rose-400',
        location: 'Lagos / Dubai',
        type: 'Full-time',
    },
]

const DEPARTMENTS = ['All', 'Engineering', 'Product', 'Finance', 'Operations', 'Sales']

export default function CareersPage() {
    const { t } = useLanguageStore()
    const [selectedDepartment, setSelectedDepartment] = useState('All')
    const [newsletterEmail, setNewsletterEmail] = useState('')

    const filteredRoles = useMemo(() => {
        if (selectedDepartment === 'All') return OPEN_ROLES
        return OPEN_ROLES.filter((role) => role.department.toLowerCase() === selectedDepartment.toLowerCase())
    }, [selectedDepartment])

    const handleApplyRole = (roleTitle: string) => {
        toast.info(`Opening application form for: ${roleTitle}`)
    }

    const handleNewsletterSubscribe = (e: React.FormEvent) => {
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
                        {/* Left Text */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
                                <Sparkles className="h-3 w-3 text-primary-400" />
                                <span className="text-[11px] font-bold text-primary-400 uppercase tracking-widest">
                                    {t('careers.badge', { defaultValue: 'CAREERS AT DIGITALCAP FX' })}
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                                {t('careers.title', { defaultValue: 'Build the Future of Global Finance.' })}
                            </h1>

                            <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg font-sans">
                                {t('careers.subtitle', { defaultValue: 'Join a team of engineers, designers, and operators rebuilding financial infrastructure for the next billion businesses. Remote-first. Mission-driven. Equity for all.' })}
                            </p>

                            <div className="pt-2">
                                <a
                                    href="#open-positions"
                                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-400 via-primary-500 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-primary-500/20 transition duration-200"
                                >
                                    <span>{t('careers.viewRoles', { defaultValue: 'View Open Roles' })}</span>
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>

                            {/* Stat Highlights */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
                                <div>
                                    <div className="text-xl md:text-2xl font-extrabold text-white font-mono">85+</div>
                                    <div className="text-[11px] text-slate-400">Team members</div>
                                </div>
                                <div>
                                    <div className="text-xl md:text-2xl font-extrabold text-white font-mono">20+</div>
                                    <div className="text-[11px] text-slate-400">Countries represented</div>
                                </div>
                                <div>
                                    <div className="text-xl md:text-2xl font-extrabold text-white font-mono">100%</div>
                                    <div className="text-[11px] text-slate-400">Remote-eligible</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Graphic: Code Window + Team Avatars */}
                        <div className="lg:col-span-5 relative flex items-center justify-center">
                            <div className="w-full max-w-[400px] relative">
                                {/* Code IDE Mockup */}
                                <div className="bg-[#0A1022] border border-white/10 rounded-2xl p-4 shadow-2xl space-y-3 font-mono text-[11px]">
                                    {/* Window Header */}
                                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                                        <div className="flex items-center space-x-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                                        </div>
                                        <span className="text-[10px] text-slate-500">payment-api - src/routes/fx.ts</span>
                                    </div>

                                    {/* Code Content */}
                                    <div className="space-y-1 leading-relaxed text-slate-300">
                                        <div><span className="text-purple-400">import</span> &#123; <span className="text-cyan-400">FXRouter</span> &#125; <span className="text-purple-400">from</span></div>
                                        <div><span className="text-emerald-400">'@digitalcapfx/core'</span>;</div>
                                        <div className="pt-2 text-slate-500">// Initialize multi-currency lock rate</div>
                                        <div><span className="text-blue-400">const</span> <span className="text-amber-400">rate</span> = <span className="text-blue-400">await</span> <span className="text-cyan-400">fx</span>.<span className="text-blue-400">convert</span>(&#123;</div>
                                        <div className="pl-4">from: <span className="text-emerald-400">'USD'</span>, to: <span className="text-emerald-400">'NGN'</span>,</div>
                                        <div className="pl-4">amount: <span className="text-amber-400">50000</span>,</div>
                                        <div className="pl-4">lock_rate: <span className="text-purple-400">true</span></div>
                                        <div>&#125;);</div>
                                        <div className="pt-1 text-slate-500">// → &#123; rate: 1621.45, fee: 75 &#125;</div>
                                        <div className="pt-2"><span className="text-purple-400">export default</span> FXRouter;</div>
                                    </div>
                                </div>

                                {/* Floating Team Avatars */}
                                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-600 border-2 border-[#050816] flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                                    AO
                                </div>
                                <div className="absolute -top-2 -right-3 w-8 h-8 rounded-full bg-purple-600 border-2 border-[#050816] flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                                    DM
                                </div>
                                <div className="absolute -bottom-3 -left-3 w-8 h-8 rounded-full bg-emerald-600 border-2 border-[#050816] flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                                    SA
                                </div>
                                <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-amber-600 border-2 border-[#050816] flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                                    PK
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. LIFE AT DIGITALCAP FX (PERKS) */}
                <div className="py-14 md:py-18 px-4 md:px-8 border-t border-white/5 bg-[#050816]">
                    <div className="max-w-7xl mx-auto space-y-10">
                        <div className="text-center space-y-3 max-w-xl mx-auto">
                            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
                                <Sparkles className="h-3 w-3 text-primary-400" />
                                <span className="text-[11px] font-bold text-primary-400 uppercase tracking-widest">
                                    LIFE AT DIGITALCAP FX
                                </span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                                A place where great{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">
                                    work gets done
                                </span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                {
                                    emoji: '🌎',
                                    title: 'Remote-First',
                                    desc: 'Work from anywhere in the world. We judge you by output, not hours in a seat.',
                                },
                                {
                                    emoji: '📚',
                                    title: 'Learning Budget',
                                    desc: '$2,000 annual budget for courses, conferences, and books. We invest in your growth.',
                                },
                                {
                                    emoji: '💊',
                                    title: 'Medical Cover',
                                    desc: 'Comprehensive medical and dental coverage for you and your dependants.',
                                },
                                {
                                    emoji: '🧘',
                                    title: 'Wellness',
                                    desc: 'Monthly wellness stipend. Gym, therapy, meditation — whatever keeps you sharp.',
                                },
                                {
                                    emoji: '🚀',
                                    title: 'Career Growth',
                                    desc: 'Structured growth frameworks. Clear paths from IC to leadership at every level.',
                                },
                                {
                                    emoji: '💰',
                                    title: 'Equity',
                                    desc: 'Meaningful equity stake for all employees. When we win, you win.',
                                },
                            ].map((perk) => (
                                <div
                                    key={perk.title}
                                    className="bg-[#0C1224] border border-white/10 rounded-2xl p-6 space-y-3 hover:border-primary-500/40 transition duration-300 shadow-xl"
                                >
                                    <div className="text-2xl">{perk.emoji}</div>
                                    <h3 className="text-base font-bold text-white">{perk.title}</h3>
                                    <p className="text-slate-400 text-xs leading-relaxed">{perk.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. OUR CULTURE QUOTE CARD */}
                <div className="py-14 md:py-18 px-4 md:px-8 border-t border-white/5 bg-[#030612]">
                    <div className="max-w-4xl mx-auto bg-[#090E1E] border border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
                            <Sparkles className="h-3 w-3 text-primary-400" />
                            <span className="text-[11px] font-bold text-primary-400 uppercase tracking-widest">
                                OUR CULTURE
                            </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug">
                            "We believe great products are <br className="hidden sm:inline" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">
                                great teams
                            </span>{' '}
                            built by who care."
                        </h2>

                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-sans">
                            We ship fast, we own our mistakes, we lift each other up. Every voice matters — from day one engineering intern to co-founder. We're building something that will outlast all of us.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                            {['Move fast', 'Own it', 'Be direct', 'Think global', 'Build for scale'].map((value) => (
                                <span
                                    key={value}
                                    className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300"
                                >
                                    {value}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. OPEN POSITIONS TABLE */}
                <div id="open-positions" className="py-14 md:py-18 px-4 md:px-8 border-t border-white/5 bg-[#050816]">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div className="space-y-2">
                                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
                                    <Sparkles className="h-3 w-3 text-primary-400" />
                                    <span className="text-[11px] font-bold text-primary-400 uppercase tracking-widest">
                                        OPEN POSITIONS
                                    </span>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                                    8 roles open now
                                </h2>
                            </div>

                            {/* Department Filter Tabs */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                                {DEPARTMENTS.map((dept) => {
                                    const isActive = selectedDepartment === dept
                                    return (
                                        <button
                                            key={dept}
                                            onClick={() => setSelectedDepartment(dept)}
                                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition shrink-0 border ${
                                                isActive
                                                    ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20'
                                                    : 'bg-[#080E1E] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                                            }`}
                                        >
                                            {dept}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Roles Table */}
                        <div className="bg-[#090E1E] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/10 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                                <div className="col-span-6">Role</div>
                                <div className="col-span-2">Department</div>
                                <div className="col-span-2">Location</div>
                                <div className="col-span-2 text-right sm:text-left">Type</div>
                            </div>

                            {/* Table Rows */}
                            <div className="divide-y divide-white/5">
                                {filteredRoles.map((role) => (
                                    <div
                                        key={role.id}
                                        onClick={() => handleApplyRole(role.title)}
                                        className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition cursor-pointer group"
                                    >
                                        <div className="col-span-6 font-bold text-xs sm:text-sm text-white group-hover:text-cyan-400 transition">
                                            {role.title}
                                        </div>
                                        <div className="col-span-2">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-md border text-[10px] font-bold font-mono ${role.departmentBg} ${role.departmentColor}`}>
                                                {role.department}
                                            </span>
                                        </div>
                                        <div className="col-span-2 text-xs text-slate-400 flex items-center space-x-1">
                                            <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                                            <span className="truncate">{role.location}</span>
                                        </div>
                                        <div className="col-span-2 text-xs text-slate-400 text-right sm:text-left flex items-center space-x-1">
                                            <Clock className="h-3 w-3 text-slate-500 shrink-0 hidden sm:inline" />
                                            <span>{role.type}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. HIRING PROCESS */}
                <div className="py-14 md:py-18 px-4 md:px-8 border-t border-white/5 bg-[#030612]">
                    <div className="max-w-7xl mx-auto space-y-12">
                        <div className="text-center space-y-3 max-w-xl mx-auto">
                            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
                                <Sparkles className="h-3 w-3 text-primary-400" />
                                <span className="text-[11px] font-bold text-primary-400 uppercase tracking-widest">
                                    HIRING PROCESS
                                </span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                                Simple, fast,{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">
                                    respectful
                                </span>
                            </h2>

                            <p className="text-slate-400 text-xs sm:text-sm">
                                We move quickly. From application to offer typically takes 2–3 weeks, not 6 months.
                            </p>
                        </div>

                        {/* 5 Steps Timeline */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
                            {[
                                {
                                    step: '01',
                                    title: 'Apply',
                                    desc: 'Submit your application online. We read every one.',
                                },
                                {
                                    step: '02',
                                    title: 'Intro Call',
                                    desc: '30-min call with our talent team to learn about you.',
                                },
                                {
                                    step: '03',
                                    title: 'Assessment',
                                    desc: 'A practical take-home relevant to the role. ~2-3 hours.',
                                },
                                {
                                    step: '04',
                                    title: 'Final Interview',
                                    desc: 'Meet the team, 2-3 interviews with stakeholders.',
                                },
                                {
                                    step: '05',
                                    title: 'Offer',
                                    desc: 'Fast decisions. Offers within 48 hours of final interview.',
                                },
                            ].map((stepItem, idx) => (
                                <div
                                    key={stepItem.step}
                                    className="bg-[#090E1E] border border-white/10 rounded-2xl p-6 text-center space-y-3 relative hover:border-primary-500/40 transition duration-300 shadow-lg"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center mx-auto shadow-md">
                                        {stepItem.step}
                                    </div>
                                    <h3 className="text-sm font-bold text-white">{stepItem.title}</h3>
                                    <p className="text-slate-400 text-xs leading-relaxed">{stepItem.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 6. DON'T SEE YOUR ROLE BANNER CARD */}
                <div className="py-12 md:py-16 px-4 md:px-8 border-t border-white/5 bg-[#030612]">
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/50 via-primary-900/30 to-cyan-900/50 border border-primary-500/30 rounded-2xl p-8 md:p-12 text-center space-y-5 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary-500/10 blur-2xl pointer-events-none"></div>

                        <div className="relative z-10 space-y-2.5">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                Don't see your role?
                            </h2>
                            <p className="text-slate-300 text-xs sm:text-sm font-sans max-w-md mx-auto">
                                We're always looking for exceptional people. Send us your CV and tell us how you'd contribute.
                            </p>
                        </div>

                        <div className="relative z-10 pt-1">
                            <a
                                href="mailto:careers@digitalcapfx.com"
                                className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-400 via-primary-500 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-xl shadow-lg shadow-primary-500/20 transition duration-200"
                            >
                                <span>Contact Talent</span>
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* 7. STAY IN THE LOOP (NEWSLETTER) SECTION */}
                <div className="py-10 px-4 md:px-8 bg-[#030612]">
                    <div className="max-w-7xl mx-auto bg-[#090E1E] border border-white/10 rounded-2xl p-6 md:p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            <div className="lg:col-span-6 space-y-1">
                                <h3 className="text-xl font-bold text-white">Stay in the loop</h3>
                                <p className="text-slate-400 text-xs">
                                    Get product updates, market insights, and exclusive offers. No spam, ever.
                                </p>
                            </div>

                            <form onSubmit={handleNewsletterSubscribe} className="lg:col-span-6 flex flex-col sm:flex-row gap-2.5">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-primary-500 transition placeholder-slate-500 font-sans"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition shrink-0"
                                >
                                    <span>Subscribe</span>
                                    <Send className="h-3.5 w-3.5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
