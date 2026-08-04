'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    FileText,
    Shield,
    Search,
    Printer,
    Mail,
    ChevronRight,
    AlertTriangle,
    Copy,
    Building2,
    Globe,
    Scale,
    CheckCircle2,
    UserCheck,
    CreditCard,
    DollarSign,
    Lock,
    AlertCircle,
    XCircle,
    BookOpen,
    HelpCircle,
    Gavel,
    RefreshCw,
    Zap,
    HelpCircle as InfoIcon
} from 'lucide-react'
import { toast } from 'sonner'

interface SectionItem {
    id: string
    number: number
    title: string
    icon: React.ElementType
    isWarning?: boolean
    content: React.ReactNode
    keywords: string[]
}

export default function TermsOfServicePage() {
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
            title: 'Purpose and Scope',
            icon: Building2,
            keywords: ['purpose', 'scope', 'cameroon', 'multi-currency', 'foreign exchange', 'transfers', 'virtual cards'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        These Terms of Service (the &quot;Terms&quot;) govern access to and use of the financial services platform operated by <strong className="text-white">DigitalCap FX SARL</strong>, a company licensed as an electronic money institution in the Republic of Cameroon, providing in particular multi-currency accounts, foreign exchange transactions, cross-border transfers, virtual card issuance, and access to digital asset-related services (the &quot;Service&quot;).
                    </p>
                    <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl text-primary-300 text-sm font-medium">
                        Any use of the Service constitutes full and unconditional acceptance of these Terms.
                    </div>
                </div>
            )
        },
        {
            id: 'section-2',
            number: 2,
            title: 'Definitions',
            icon: BookOpen,
            keywords: ['definitions', 'user', 'account', 'digital assets', 'funds', 'usdt', 'usdc'],
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                        <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">&quot;User&quot;</span>
                        <p className="text-slate-300 text-xs leading-relaxed">Any individual or legal entity who has created an account on the Platform.</p>
                    </div>
                    <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                        <span className="text-primary-400 text-xs font-bold uppercase tracking-wider">&quot;Account&quot;</span>
                        <p className="text-slate-300 text-xs leading-relaxed">The secure personal space allowing the User to access the Service.</p>
                    </div>
                    <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                        <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">&quot;Digital Assets&quot;</span>
                        <p className="text-slate-300 text-xs leading-relaxed">Cryptocurrencies and stablecoins (including USDT and USDC) accessible through the Platform.</p>
                    </div>
                    <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                        <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">&quot;Funds&quot;</span>
                        <p className="text-slate-300 text-xs leading-relaxed">Amounts of money in fiat currency or electronic money held in the Account.</p>
                    </div>
                </div>
            )
        },
        {
            id: 'section-3',
            number: 3,
            title: 'Acceptance of these Terms',
            icon: CheckCircle2,
            keywords: ['acceptance', 'privacy policy', 'aml', 'capacity', 'agreement'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        Opening an Account and using the Service require unreserved acceptance of these Terms, the Privacy Policy, and any applicable supplementary policy (including our anti-money laundering policy).
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        The User represents that they have the legal capacity required to enter into this agreement.
                    </p>
                </div>
            )
        },
        {
            id: 'section-4',
            number: 4,
            title: 'Eligibility and Account Opening',
            icon: UserCheck,
            keywords: ['eligibility', 'adults', 'cemac', 'waemu', 'residing', 'kyc'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        Access to the Service is reserved for adult individuals and duly incorporated legal entities residing or operating in the <strong className="text-white">CEMAC and WAEMU regions</strong>, or any other region we may determine.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        Opening an Account requires providing accurate and up-to-date information and successfully completing the identity verification process described in Section 5.
                    </p>
                </div>
            )
        },
        {
            id: 'section-5',
            number: 5,
            title: 'Know Your Customer (KYC) and Anti-Money Laundering (AML/CTF)',
            icon: Shield,
            keywords: ['kyc', 'aml', 'ctf', 'verification', 'source of funds', 'refuse', 'suspend', 'closure'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        In accordance with our status as a licensed institution and applicable anti-money laundering and counter-terrorism financing regulations, the User agrees to provide any document or information required to verify their identity, the source of their funds, and the nature of their transactions.
                    </p>
                    <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> Reserved Regulatory Rights
                        </span>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            We reserve the right to refuse to open an Account, suspend a transaction, or close an Account in the event of suspected irregularity, User non-cooperation, or non-compliance with regulatory requirements.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'section-6',
            number: 6,
            title: 'Description of Services',
            icon: CreditCard,
            keywords: ['services', 'currencies', 'xaf', 'xof', 'usd', 'eur', 'gbp', 'foreign exchange', 'transfers', 'virtual cards', 'digital assets'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        The Service enables, among other things:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold">
                                <DollarSign className="w-4 h-4" />
                                <span>Multi-Currency Balances</span>
                            </div>
                            <p className="text-slate-400 text-xs">Holding balances in multiple currencies including XAF, XOF, USD, EUR, GBP.</p>
                        </div>
                        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                            <div className="flex items-center space-x-2 text-primary-400 text-xs font-bold">
                                <RefreshCw className="w-4 h-4" />
                                <span>Foreign Exchange (FX)</span>
                            </div>
                            <p className="text-slate-400 text-xs">Executing foreign exchange transactions at rates disclosed prior to confirmation.</p>
                        </div>
                        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                                <Globe className="w-4 h-4" />
                                <span>Cross-Border Transfers</span>
                            </div>
                            <p className="text-slate-400 text-xs">Executing local and cross-border transfers across regional networks.</p>
                        </div>
                        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                            <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold">
                                <CreditCard className="w-4 h-4" />
                                <span>Card Issuance</span>
                            </div>
                            <p className="text-slate-400 text-xs">Issuing and managing virtual cards, and where applicable physical cards.</p>
                        </div>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                        The availability of certain features may vary depending on country, Account verification status, or regulatory constraints.
                    </p>
                </div>
            )
        },
        {
            id: 'section-7',
            number: 7,
            title: 'Digital Assets and Stablecoins — Risk Disclosure',
            icon: AlertTriangle,
            isWarning: true,
            keywords: ['risk', 'volatility', 'stablecoins', 'usdt', 'usdc', 'cemac', 'waemu', 'cryptocurrency', 'advice'],
            content: (
                <div className="space-y-4">
                    <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-3">
                        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <span>MANDATORY RISK ACKNOWLEDGMENT</span>
                        </div>
                        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                            The User acknowledges that Digital Assets are subject to significant value volatility and carry specific risks, including risk of loss of value, technology risk, counterparty risk relating to stablecoin issuers, and regulatory risk associated with the evolving legal framework applicable to digital assets within the <strong className="text-amber-300">CEMAC and WAEMU regions</strong>.
                        </p>
                    </div>

                    <p className="text-slate-300 leading-relaxed text-sm">
                        The User represents that they understand these risks and act with full knowledge of them.
                    </p>

                    <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-400 text-xs space-y-1">
                        <strong className="text-white font-semibold">No Investment Advice Disclaimer:</strong>
                        <p>DigitalCap FX does not provide investment advice and assumes no liability for fluctuations in the value of Digital Assets.</p>
                    </div>
                </div>
            )
        },
        {
            id: 'section-8',
            number: 8,
            title: 'Fees and Pricing',
            icon: DollarSign,
            keywords: ['fees', 'pricing', 'rates', 'schedule', 'transparency'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        Fees applicable to the various transactions (exchange, transfer, card issuance, etc.) are disclosed to the User prior to confirming each transaction, in line with our commitment to fee transparency.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        We reserve the right to modify our fee schedule upon reasonable prior notice.
                    </p>
                </div>
            )
        },
        {
            id: 'section-9',
            number: 9,
            title: 'User Obligations and Undertakings',
            icon: Scale,
            keywords: ['obligations', 'undertakings', 'lawful', 'credentials', 'confidential', 'fraud'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        The User agrees to:
                    </p>
                    <ul className="space-y-3">
                        {[
                            'Provide accurate, complete and up-to-date information when opening and throughout the life of the Account;',
                            'Use the Service for lawful purposes only, excluding any fraudulent activity, money laundering, terrorism financing, or any other unlawful activity;',
                            'Keep their login credentials and authentication methods confidential;',
                            'Immediately notify DigitalCap FX of any unauthorized use of their Account.',
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-start space-x-3 text-slate-300 text-sm leading-relaxed">
                                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        {
            id: 'section-10',
            number: 10,
            title: 'Account Security and User Responsibility',
            icon: Lock,
            keywords: ['security', 'credentials', 'responsibility', 'deemed authorization', 'negligence'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        The User is solely responsible for keeping their login credentials and authentication methods confidential.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        Any transaction carried out from the Account using the User&apos;s valid credentials shall be deemed to have been carried out by the User, unless proven otherwise due to negligence attributable to DigitalCap FX.
                    </p>
                </div>
            )
        },
        {
            id: 'section-11',
            number: 11,
            title: 'Limitation of DigitalCap FX\'s Liability',
            icon: XCircle,
            keywords: ['limitation', 'liability', 'force majeure', 'network', 'damages', 'fluctuations'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        DigitalCap FX implements reasonable measures to ensure the availability, reliability and security of the Service.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        However, we shall not be held liable for any interruption of the Service resulting from an event of force majeure, network or third-party provider failures, non-compliant use of the Service by the User, or fluctuations in the value of Digital Assets.
                    </p>
                    <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300 text-xs">
                        To the extent permitted by applicable law, our liability is limited to direct and foreseeable damages resulting from our proven fault.
                    </div>
                </div>
            )
        },
        {
            id: 'section-12',
            number: 12,
            title: 'Suspension, Restriction and Closure of Account',
            icon: Zap,
            keywords: ['suspension', 'restriction', 'closure', 'fraud', 'aml', 'instruction'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        We may suspend, restrict or close an Account, in particular in the event of non-compliance with these Terms, suspected fraudulent or unlawful activity, non-compliance with KYC/AML requirements, or upon instruction from a competent authority.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        The User may also request closure of their Account at any time, subject to settlement of any pending transactions.
                    </p>
                </div>
            )
        },
        {
            id: 'section-13',
            number: 13,
            title: 'Intellectual Property',
            icon: Shield,
            keywords: ['intellectual property', 'trademarks', 'logos', 'software', 'copyright'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        All elements of the Platform (trademarks, logos, content, interfaces, software) are protected by the intellectual property rights of DigitalCap FX or its licensors.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        Nothing in these Terms grants the User any right over such elements, other than the right of use strictly necessary to use the Service.
                    </p>
                </div>
            )
        },
        {
            id: 'section-14',
            number: 14,
            title: 'Complaints and Dispute Resolution',
            icon: HelpCircle,
            keywords: ['complaints', 'dispute', 'resolution', 'email', 'amicable'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        Any complaint regarding the Service may be submitted to <span className="text-cyan-300 font-mono">digitalcapfx@dgcap.com</span>. We endeavor to address any complaint within a reasonable time.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        In the absence of an amicable resolution, the dispute may be brought before the competent courts in accordance with Section 15.
                    </p>
                </div>
            )
        },
        {
            id: 'section-15',
            number: 15,
            title: 'Governing Law and Jurisdiction',
            icon: Gavel,
            keywords: ['governing law', 'jurisdiction', 'cameroon', 'ohada', 'cemac', 'waemu', 'douala', 'courts'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        These Terms are governed by the laws of <strong className="text-white">Cameroon</strong> and, where applicable, the provisions of the Organization for the Harmonization of Business Law in Africa (<strong className="text-white">OHADA</strong>), as well as the regulations applicable within the <strong className="text-white">CEMAC and WAEMU regions</strong>.
                    </p>
                    <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Exclusive Jurisdiction</span>
                        <p className="text-slate-300 text-xs leading-relaxed">
                            Any dispute relating to the validity, interpretation or performance of these Terms shall fall within the exclusive jurisdiction of the competent courts of Douala, subject to applicable mandatory rules.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'section-16',
            number: 16,
            title: 'Amendments to these Terms',
            icon: RefreshCw,
            keywords: ['amendments', 'modifications', 'notice', 'acceptance'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        We reserve the right to amend these Terms at any time, in particular to reflect legal, regulatory or operational developments. Users will be informed of any material change prior to it taking effect.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        Continued use of the Service after notification constitutes acceptance of the amended Terms.
                    </p>
                </div>
            )
        },
        {
            id: 'section-17',
            number: 17,
            title: 'Force Majeure',
            icon: Zap,
            keywords: ['force majeure', 'telecommunications', 'banking infrastructure', 'third party'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        DigitalCap FX shall not be held liable for any failure to perform its obligations resulting from an event of force majeure, including any failure of telecommunications networks, banking infrastructure, or independent third-party service providers.
                    </p>
                </div>
            )
        },
        {
            id: 'section-18',
            number: 18,
            title: 'Miscellaneous',
            icon: InfoIcon,
            keywords: ['miscellaneous', 'severability', 'waiver', 'provisions'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        The failure of DigitalCap FX to exercise any right under these Terms shall not be construed as a waiver of that right.
                    </p>
                </div>
            )
        },
        {
            id: 'section-19',
            number: 19,
            title: 'Contact',
            icon: Mail,
            keywords: ['contact', 'email', 'douala', 'address', 'mail'],
            content: (
                <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">
                        For any question regarding these Terms, please contact us at:
                    </p>
                    <div className="p-5 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-primary-950/30 border border-cyan-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Official Legal Contact</span>
                                <p className="text-lg font-mono text-cyan-300 font-bold">digitalcapfx@dgcap.com</p>
                                <p className="text-xs text-slate-400">Registered Office: Douala, République du Cameroun</p>
                            </div>
                        </div>
                        <button
                            onClick={copyEmail}
                            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition duration-200 shrink-0"
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
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute top-[800px] right-1/3 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[140px] pointer-events-none"></div>

            <main className="max-w-7xl mx-auto px-4 md:px-8 pt-10 sm:pt-14">

                {/* HEADER / BREADCRUMB */}
                <div className="space-y-6 text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                        <FileText className="h-3.5 w-3.5 text-cyan-400" />
                        <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
                            TERMS & CONDITIONS
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Terms of Service <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-primary-400 to-blue-500">
                            DigitalCap FX SARL
                        </span>
                    </h1>

                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        These Terms govern your access to multi-currency accounts, foreign exchange, cross-border transfers, virtual cards, and digital assets under the laws of Cameroon, OHADA, CEMAC & WAEMU regulations.
                    </p>

                    {/* Metadata pill bar */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2">
                        <span className="px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full">
                            Last Updated: <strong className="text-slate-200">August 2026</strong>
                        </span>
                        <span className="px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full">
                            Jurisdiction: <strong className="text-slate-200">Douala, Cameroon (OHADA / CEMAC / WAEMU)</strong>
                        </span>
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition cursor-pointer print:hidden"
                        >
                            <Printer className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Print Terms</span>
                        </button>
                    </div>
                </div>

                {/* SEARCH BAR */}
                <div className="max-w-xl mx-auto mb-10 print:hidden">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search terms (e.g. USDT, fees, liability, Douala, closure...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition shadow-lg"
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
                                <span className="text-[10px] text-cyan-400 font-mono">19 Sections</span>
                            </h3>

                            <nav className="space-y-1">
                                {sections.map((sec) => (
                                    <a
                                        key={sec.id}
                                        href={`#${sec.id}`}
                                        onClick={() => setActiveSection(sec.id)}
                                        className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs transition duration-150 ${activeSection === sec.id
                                                ? 'bg-cyan-500/20 text-white font-semibold border border-cyan-500/30'
                                                : sec.isWarning
                                                    ? 'text-amber-400 hover:bg-amber-500/10'
                                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                            }`}
                                    >
                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${sec.isWarning ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                                            }`}>
                                            {sec.number}
                                        </span>
                                        <span className="truncate">{sec.title}</span>
                                    </a>
                                ))}
                            </nav>

                            <div className="pt-4 border-t border-slate-800/80 px-2 space-y-2">
                                <p className="text-[11px] text-slate-500">Legal questions?</p>
                                <button
                                    onClick={copyEmail}
                                    className="w-full flex items-center justify-center space-x-2 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 rounded-xl transition"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    <span>Contact Legal Team</span>
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* CONTENT COLUMN */}
                    <div className="lg:col-span-8 space-y-6">

                        {filteredSections.length === 0 ? (
                            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
                                <Search className="w-8 h-8 text-slate-500 mx-auto" />
                                <h3 className="text-base font-semibold text-white">No matching terms found</h3>
                                <p className="text-slate-400 text-xs">Try searching for keywords like &quot;fees&quot;, &quot;digital assets&quot;, &quot;jurisdiction&quot;, or &quot;security&quot;.</p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="px-4 py-2 bg-cyan-500 text-slate-950 text-xs font-bold rounded-xl"
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
                                        className={`bg-slate-900/50 backdrop-blur-md border rounded-2xl p-6 sm:p-8 space-y-4 scroll-mt-24 transition ${sec.isWarning
                                                ? 'border-amber-500/40 bg-gradient-to-b from-slate-900/80 to-amber-950/20'
                                                : 'border-slate-800/80 hover:border-slate-700/80'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3 pb-3 border-b border-slate-800/80">
                                            <div className={`p-2.5 rounded-xl border shrink-0 ${sec.isWarning
                                                    ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                                                    : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                                                }`}>
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${sec.isWarning ? 'text-amber-400' : 'text-cyan-400'
                                                    }`}>
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

                        {/* Privacy policy link banner */}
                        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-primary-950/40 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                            <div className="space-y-1">
                                <h4 className="text-white font-semibold text-sm">Need Privacy Policy Information?</h4>
                                <p className="text-slate-400 text-xs">Learn how we process your personal data, compliance details for KYC/AML, and your data protection rights.</p>
                            </div>
                            <Link
                                href="/privacy"
                                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs rounded-xl shadow-lg transition shrink-0"
                            >
                                <span>Read Privacy Policy</span>
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    )
}
