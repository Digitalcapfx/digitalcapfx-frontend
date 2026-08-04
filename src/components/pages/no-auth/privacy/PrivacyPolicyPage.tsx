'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    Shield,
    Lock,
    Search,
    Printer,
    Mail,
    ChevronRight,
    FileText,
    CheckCircle2,
    Copy,
    Building2,
    Globe,
    Scale,
    AlertCircle,
    UserCheck,
    Database,
    Share2,
    Clock,
    Key,
    Cookie,
    Users,
    RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'

interface SectionItem {
    id: string
    number: number
    title: string
    icon: React.ElementType
    content: React.ReactNode
    keywords: string[]
}

export default function PrivacyPolicyPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeSection, setActiveSection] = useState('section-1')

    const copyEmail = () => {
        navigator.clipboard.writeText('digitalcapfx@dgcap.com')
        toast.success('Email address copied to clipboard!')
    }

    const handlePrint = () => {
        window.print()
    }

    const sections: SectionItem[] = useMemo(() => [
        {
            id: 'section-1',
            number: 1,
            title: 'Introduction',
            icon: Shield,
            keywords: ['introduction', 'cameroon', 'douala', 'electronic money institution', 'consent'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        This Privacy Policy describes how <strong className="text-white">DigitalCap FX</strong>, (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), a limited liability company incorporated under the laws of Cameroon, licensed as an electronic money institution, with its registered office at Douala, République du Cameroun, collects, uses, stores, shares and protects the personal data of users of its financial services platform (the &quot;Service&quot;), accessible in particular through its website and applications (the &quot;Platform&quot;).
                    </p>
                    <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl text-primary-300 text-sm leading-relaxed">
                        By creating an account or using the Platform, you acknowledge that you have read this Policy and consent to the processing of your personal data as described below.
                    </div>
                </div>
            )
        },
        {
            id: 'section-2',
            number: 2,
            title: 'Data Controller',
            icon: Building2,
            keywords: ['controller', 'address', 'douala', 'email', 'dgcap'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        The controller responsible for the processing of personal data collected through the Platform is:
                    </p>
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h4 className="text-white font-semibold text-base">DigitalCap FX SARL</h4>
                            <p className="text-slate-400 text-sm flex items-center gap-2">
                                <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                                Registered Office: Douala, République du Cameroun
                            </p>
                            <p className="text-slate-400 text-sm flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                                Reachable at: <span className="text-cyan-300 font-mono">digitalcapfx@dgcap.com</span>
                            </p>
                        </div>
                        <button
                            onClick={copyEmail}
                            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition shrink-0"
                        >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Email</span>
                        </button>
                    </div>
                </div>
            )
        },
        {
            id: 'section-3',
            number: 3,
            title: 'Personal Data We Collect',
            icon: Database,
            keywords: ['collect', 'kyc', 'aml', 'ctf', 'identification', 'usdt', 'usdc', 'cryptocurrency', 'stablecoins', 'financial'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        In connection with the provision of our services, and in particular to comply with our Know Your Customer (KYC) and Anti-Money Laundering / Counter-Terrorism Financing (AML/CTF) obligations, we collect the following categories of data:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                            <div className="flex items-center space-x-2 text-primary-400 font-semibold text-sm">
                                <UserCheck className="w-4 h-4" />
                                <span>Identification Data</span>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Name, surname(s), date and place of birth, nationality, copy of official identity document, verification photograph or selfie.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                            <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-sm">
                                <Mail className="w-4 h-4" />
                                <span>Contact Details</span>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Postal address, email address, phone number.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
                                <Scale className="w-4 h-4" />
                                <span>Financial Data</span>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Bank account or digital wallet information, transaction history, declared income, source of funds.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                            <div className="flex items-center space-x-2 text-purple-400 font-semibold text-sm">
                                <Globe className="w-4 h-4" />
                                <span>Digital Asset Data</span>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Cryptocurrency and stablecoin wallet addresses (including USDT/USDC) used in connection with the Service.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm">
                                <Lock className="w-4 h-4" />
                                <span>Connection & Usage Data</span>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                IP address, device identifiers, log data, approximate geolocation data, cookies.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                            <div className="flex items-center space-x-2 text-blue-400 font-semibold text-sm">
                                <FileText className="w-4 h-4" />
                                <span>Voluntary Data</span>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Any other data voluntarily provided, including through communications with our customer support.
                            </p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'section-4',
            number: 4,
            title: 'Purposes of Processing',
            icon: CheckCircle2,
            keywords: ['purposes', 'account', 'foreign exchange', 'cemac', 'waemu', 'transfers', 'virtual cards', 'fraud'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        Your personal data is processed for the following purposes:
                    </p>
                    <ul className="space-y-2.5">
                        {[
                            'Opening, managing and securing your account;',
                            'Executing foreign exchange transactions, transfers, fiat-crypto conversions and issuing virtual cards;',
                            'Complying with our legal and regulatory obligations, including KYC, AML/CTF requirements and supervision by the competent authorities of the CEMAC and WAEMU regions;',
                            'Preventing fraud and managing risk;',
                            'Improving and personalizing the Service;',
                            'Marketing communications, subject to your consent where required;',
                            'Responding to your requests through our customer support.',
                        ].map((purpose, idx) => (
                            <li key={idx} className="flex items-start space-x-3 text-slate-300 text-sm leading-relaxed">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold shrink-0 mt-0.5">
                                    {idx + 1}
                                </span>
                                <span>{purpose}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        {
            id: 'section-5',
            number: 5,
            title: 'Legal Basis for Processing',
            icon: Scale,
            keywords: ['legal basis', 'agreement', 'compliance', 'legitimate interest', 'consent'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        Depending on the circumstances, the processing of your data is based on:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                            <h5 className="text-white text-xs font-bold uppercase tracking-wider text-cyan-400">Contractual Necessity</h5>
                            <p className="text-slate-400 text-xs">Performance of the service agreement between us.</p>
                        </div>
                        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                            <h5 className="text-white text-xs font-bold uppercase tracking-wider text-primary-400">Legal Obligation</h5>
                            <p className="text-slate-400 text-xs">Compliance with regulatory obligations as a licensed EMI.</p>
                        </div>
                        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                            <h5 className="text-white text-xs font-bold uppercase tracking-wider text-emerald-400">Legitimate Interest</h5>
                            <p className="text-slate-400 text-xs">Ensuring Platform security and preventing fraud.</p>
                        </div>
                        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                            <h5 className="text-white text-xs font-bold uppercase tracking-wider text-amber-400">Consent</h5>
                            <p className="text-slate-400 text-xs">Where required, in particular for marketing communications.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'section-6',
            number: 6,
            title: 'Recipients and Data Sharing',
            icon: Share2,
            keywords: ['recipients', 'sharing', 'third parties', 'cemac', 'waemu', 'judicial', 'banks', 'auditors'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        Your data may be shared, strictly to the extent necessary, with the following categories of recipients:
                    </p>
                    <div className="space-y-3">
                        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                            <strong className="text-white text-sm">Technical Service Providers & Custody Partners:</strong>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Service providers for payments, digital asset custody and infrastructure, acting as processors bound by confidentiality and security obligations equivalent to our own.
                            </p>
                        </div>
                        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                            <strong className="text-white text-sm">Regulatory & Public Authorities:</strong>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Regulatory, supervisory authorities and competent public bodies in connection with our legal obligations (monetary and supervisory authorities in the CEMAC and WAEMU regions, judicial authorities).
                            </p>
                        </div>
                        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                            <strong className="text-white text-sm">Partner Financial Institutions:</strong>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Partner banking and financial institutions involved in executing transactions.
                            </p>
                        </div>
                        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                            <strong className="text-white text-sm">Advisors & Auditors:</strong>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Where applicable, our legal advisors and auditors, in the course of their engagements.
                            </p>
                        </div>
                    </div>
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-3 text-emerald-300 text-sm">
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                        <span><strong>Commercial Guarantee:</strong> We do not sell your personal data to third parties for commercial purposes.</span>
                    </div>
                </div>
            )
        },
        {
            id: 'section-7',
            number: 7,
            title: 'International Data Transfers',
            icon: Globe,
            keywords: ['international', 'transfers', 'cemac', 'waemu', 'safeguards', 'cross-border'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        Given the cross-border nature of our services within the <strong className="text-white">CEMAC and WAEMU regions</strong>, and our use of technical service providers that may be located outside these regions, certain data may be subject to international transfers.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        In such cases, we ensure that these transfers are governed by appropriate contractual or technical safeguards for security and confidentiality, consistent with applicable requirements.
                    </p>
                </div>
            )
        },
        {
            id: 'section-8',
            number: 8,
            title: 'Data Retention',
            icon: Clock,
            keywords: ['retention', 'duration', 'anti-money laundering', 'deletion', 'anonymization'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        Your data is retained for the duration of our contractual relationship, and thereafter for the periods required by applicable legal and regulatory obligations, in particular anti-money laundering requirements, which may exceed the duration of the business relationship.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        At the end of these periods, your data is deleted or anonymized.
                    </p>
                </div>
            )
        },
        {
            id: 'section-9',
            number: 9,
            title: 'Data Security',
            icon: Key,
            keywords: ['security', 'encryption', '2fa', 'authentication', 'phishing', 'passwords'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss, alteration or disclosure, including data encryption, strong authentication and strict access controls.
                    </p>
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
                        <div className="flex items-center space-x-2 text-amber-300 font-semibold text-sm">
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                            <span>Recommended Security Practices for Users</span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">
                            We encourage you to adopt good security practices, such as using a strong password, enabling two-factor authentication (2FA), and remaining vigilant against phishing attempts.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'section-10',
            number: 10,
            title: 'Cookies and Similar Technologies',
            icon: Cookie,
            keywords: ['cookies', 'browser', 'tracking', 'technologies'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        The Platform uses cookies and similar technologies to ensure its proper functioning, analyze usage, and improve the user experience.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        You may configure your browser to refuse certain cookies, noting that this may affect certain features of the Service.
                    </p>
                </div>
            )
        },
        {
            id: 'section-11',
            number: 11,
            title: 'Your Rights',
            icon: Users,
            keywords: ['rights', 'access', 'rectify', 'erase', 'restrict', 'object', 'portability', 'aml'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        Subject to the limitations set out under applicable law, including our AML/CTF-related retention obligations, you have the following rights:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {['Right to Access', 'Right to Rectify', 'Right to Erase', 'Right to Restrict', 'Right to Object', 'Data Portability'].map((right, idx) => (
                            <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-center">
                                <span className="text-cyan-300 font-medium text-xs">{right}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                        These rights may be exercised by contacting us at <span className="text-primary-300 font-mono">digitalcapfx@dgcap.com</span> as provided in Section 14.
                    </p>
                </div>
            )
        },
        {
            id: 'section-12',
            number: 12,
            title: 'Protection of Minors',
            icon: Shield,
            keywords: ['minors', 'adults', 'age', 'capacity'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        The Service is reserved for adults with full legal capacity. We do not knowingly collect data relating to minors.
                    </p>
                </div>
            )
        },
        {
            id: 'section-13',
            number: 13,
            title: 'Changes to this Policy',
            icon: RefreshCw,
            keywords: ['changes', 'updates', 'modifications', 'notification'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        We may update this Privacy Policy from time to time, in particular to reflect legal, regulatory or technical developments. Any material change will be notified to you through appropriate means prior to taking effect.
                    </p>
                </div>
            )
        },
        {
            id: 'section-14',
            number: 14,
            title: 'Contact',
            icon: Mail,
            keywords: ['contact', 'email', 'douala', 'support', 'questions'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        For any question regarding this Policy or to exercise your rights, please contact us at:
                    </p>
                    <div className="p-5 bg-gradient-to-r from-primary-900/30 via-slate-900 to-cyan-950/30 border border-primary-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-primary-500/20 rounded-xl text-primary-400">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Official Data Protection Contact</span>
                                <p className="text-lg font-mono text-cyan-300 font-bold">digitalcapfx@dgcap.com</p>
                                <p className="text-xs text-slate-400">Douala, République du Cameroun</p>
                            </div>
                        </div>
                        <button
                            onClick={copyEmail}
                            className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-xl shadow-lg transition duration-200 shrink-0"
                        >
                            Copy Email
                        </button>
                    </div>
                </div>
            )
        }
    ], [])

    const filteredSections = useMemo(() => {
        if (!searchQuery.trim()) return sections
        const query = searchQuery.toLowerCase().trim()
        return sections.filter((sec) =>
            sec.title.toLowerCase().includes(query) ||
            sec.keywords.some((k) => k.toLowerCase().includes(query))
        )
    }, [sections, searchQuery])

    return (
        <div className="w-full text-white min-h-screen font-sans relative overflow-x-hidden pb-20">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute top-[800px] right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none"></div>

            <main className="max-w-7xl mx-auto px-4 md:px-8 pt-10 sm:pt-14">

                {/* HEADER / BREADCRUMB */}
                <div className="space-y-6 text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
                        <Shield className="h-3.5 w-3.5 text-primary-400" />
                        <span className="text-[11px] font-bold text-primary-400 uppercase tracking-widest">
                            LEGAL & COMPLIANCE
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Privacy Policy <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-cyan-400 to-blue-500">
                            DigitalCap FX
                        </span>
                    </h1>

                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        Learn how DigitalCap FX SARL collects, protects, uses, and shares your personal data under applicable Cameroon, CEMAC, and WAEMU regulatory frameworks.
                    </p>

                    {/* Metadata pill bar */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2">
                        <span className="px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full">
                            Last Updated: <strong className="text-slate-200">August 2026</strong>
                        </span>
                        <span className="px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full">
                            Jurisdiction: <strong className="text-slate-200">Cameroon / CEMAC / WAEMU</strong>
                        </span>
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition cursor-pointer print:hidden"
                        >
                            <Printer className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Print Policy</span>
                        </button>
                    </div>
                </div>

                {/* SEARCH BAR */}
                <div className="max-w-xl mx-auto mb-10 print:hidden">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search privacy topics (e.g. KYC, USDT, retention, rights...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition shadow-lg"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* MAIN LAYOUT: SIDEBAR + CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* STICKY TOC SIDEBAR */}
                    <aside className="hidden lg:block lg:col-span-4 sticky top-24 print:hidden">
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 flex items-center justify-between">
                                <span>Table of Contents</span>
                                <span className="text-[10px] text-primary-400 font-mono">14 Sections</span>
                            </h3>

                            <nav className="space-y-1">
                                {sections.map((sec) => (
                                    <a
                                        key={sec.id}
                                        href={`#${sec.id}`}
                                        onClick={() => setActiveSection(sec.id)}
                                        className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs transition duration-150 ${activeSection === sec.id
                                                ? 'bg-primary-500/20 text-white font-semibold border border-primary-500/30'
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                            }`}
                                    >
                                        <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
                                            {sec.number}
                                        </span>
                                        <span className="truncate">{sec.title}</span>
                                    </a>
                                ))}
                            </nav>

                            <div className="pt-4 border-t border-slate-800/80 px-2 space-y-2">
                                <p className="text-[11px] text-slate-500">Need legal assistance?</p>
                                <button
                                    onClick={copyEmail}
                                    className="w-full flex items-center justify-center space-x-2 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 rounded-xl transition"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    <span>Contact Privacy Team</span>
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* CONTENT COLUMN */}
                    <div className="lg:col-span-8 space-y-6">

                        {filteredSections.length === 0 ? (
                            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
                                <Search className="w-8 h-8 text-slate-500 mx-auto" />
                                <h3 className="text-base font-semibold text-white">No matching privacy sections found</h3>
                                <p className="text-slate-400 text-xs">Try searching for key terms like &quot;KYC&quot;, &quot;USDT&quot;, &quot;controller&quot;, or &quot;retention&quot;.</p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="px-4 py-2 bg-primary-500 text-white text-xs font-bold rounded-xl"
                                >
                                    Reset Search
                                </button>
                            </div>
                        ) : (
                            filteredSections.map((sec) => {
                                const IconComponent = sec.icon
                                return (
                                    <section
                                        key={sec.id}
                                        id={sec.id}
                                        className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 scroll-mt-24 transition hover:border-slate-700/80"
                                    >
                                        <div className="flex items-center space-x-3 pb-3 border-b border-slate-800/80">
                                            <div className="p-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 shrink-0">
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-400">
                                                    Section {sec.number}
                                                </span>
                                                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                                                    {sec.title}
                                                </h2>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            {sec.content}
                                        </div>
                                    </section>
                                )
                            })
                        )}

                        {/* Terms link banner */}
                        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                            <div className="space-y-1">
                                <h4 className="text-white font-semibold text-sm">Looking for Terms of Service?</h4>
                                <p className="text-slate-400 text-xs">Review the general terms governing account opening, multi-currency wallets, and digital asset exchanges.</p>
                            </div>
                            <Link
                                href="/terms"
                                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition shrink-0"
                            >
                                <span>View Terms of Service</span>
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    )
}
