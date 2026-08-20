'use client'

import React from 'react'
import Link from 'next/link'
import { FileText, Mail, ArrowUpRight, AlertTriangle } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

const SECTIONS = [
    {
        id: 'section-1',
        title: '1. Purpose and Scope',
        content: (
            <p>
                These Terms of Service (the &quot;Terms&quot;) govern access to and use of the financial services platform operated by <strong>DigitalCap FX SARL</strong>, a company licensed as an electronic money institution in the Republic of Cameroon, providing in particular multi-currency accounts, foreign exchange transactions, cross-border transfers, virtual card issuance, and access to digital asset-related services (the &quot;Service&quot;). Any use of the Service constitutes full and unconditional acceptance of these Terms.
            </p>
        )
    },
    {
        id: 'section-2',
        title: '2. Definitions',
        content: (
            <ul className="list-disc list-inside space-y-3 pl-3 text-slate-300">
                <li><strong>&quot;User&quot;:</strong> any individual or legal entity who has created an account on the Platform;</li>
                <li><strong>&quot;Account&quot;:</strong> the secure personal space allowing the User to access the Service;</li>
                <li><strong>&quot;Digital Assets&quot;:</strong> cryptocurrencies and stablecoins (including USDT and USDC) accessible through the Platform;</li>
                <li><strong>&quot;Funds&quot;:</strong> amounts of money in fiat currency or electronic money held in the Account.</li>
            </ul>
        )
    },
    {
        id: 'section-3',
        title: '3. Acceptance of these Terms',
        content: (
            <p>
                Opening an Account and using the Service require unreserved acceptance of these Terms, the Privacy Policy, and any applicable supplementary policy (including our anti-money laundering policy). The User represents that they have the legal capacity required to enter into this agreement.
            </p>
        )
    },
    {
        id: 'section-4',
        title: '4. Eligibility and Account Opening',
        content: (
            <p>
                Access to the Service is reserved for adult individuals and duly incorporated legal entities residing or operating in the CEMAC and WAEMU regions, or any other region we may determine. Opening an Account requires providing accurate and up-to-date information and successfully completing the identity verification process described in Section 5.
            </p>
        )
    },
    {
        id: 'section-5',
        title: '5. Know Your Customer (KYC) and Anti-Money Laundering (AML/CTF)',
        content: (
            <p>
                In accordance with our status as a licensed institution and applicable anti-money laundering and counter-terrorism financing regulations, the User agrees to provide any document or information required to verify their identity, the source of their funds, and the nature of their transactions. We reserve the right to refuse to open an Account, suspend a transaction, or close an Account in the event of suspected irregularity, User non-cooperation, or non-compliance with regulatory requirements.
            </p>
        )
    },
    {
        id: 'section-6',
        title: '6. Description of Services',
        content: (
            <div className="space-y-3">
                <p>The Service enables, among other things:</p>
                <ul className="list-disc list-inside space-y-3 pl-3 text-slate-300">
                    <li>Holding balances in multiple currencies (including XAF, XOF, USD, EUR, GBP);</li>
                    <li>Executing foreign exchange transactions at rates disclosed prior to confirmation;</li>
                    <li>Executing local and cross-border transfers;</li>
                    <li>Issuing and managing virtual cards, and where applicable physical cards;</li>
                    <li>Accessing services for exchanging and holding Digital Assets.</li>
                </ul>
                <p className="text-slate-400 text-sm">
                    The availability of certain features may vary depending on country, Account verification status, or regulatory constraints.
                </p>
            </div>
        )
    },
    {
        id: 'section-7',
        title: '7. Digital Assets and Stablecoins — Risk Disclosure',
        content: (
            <div className="space-y-3 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-200 text-base leading-relaxed">
                <div className="flex items-center space-x-2 font-bold text-amber-400 text-lg">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span>Risk Disclosure</span>
                </div>
                <p>
                    The User acknowledges that Digital Assets are subject to significant value volatility and carry specific risks, including risk of loss of value, technology risk, counterparty risk relating to stablecoin issuers, and regulatory risk associated with the evolving legal framework applicable to digital assets within the CEMAC and WAEMU regions. The User represents that they understand these risks and act with full knowledge of them. DigitalCap FX does not provide investment advice and assumes no liability for fluctuations in the value of Digital Assets.
                </p>
            </div>
        )
    },
    {
        id: 'section-8',
        title: '8. Fees and Pricing',
        content: (
            <p>
                Fees applicable to the various transactions (exchange, transfer, card issuance, etc.) are disclosed to the User prior to confirming each transaction, in line with our commitment to fee transparency. We reserve the right to modify our fee schedule upon reasonable prior notice.
            </p>
        )
    },
    {
        id: 'section-9',
        title: '9. User Obligations and Undertakings',
        content: (
            <div className="space-y-3">
                <p>The User agrees to:</p>
                <ul className="list-disc list-inside space-y-3 pl-3 text-slate-300">
                    <li>Provide accurate, complete and up-to-date information when opening and throughout the life of the Account;</li>
                    <li>Use the Service for lawful purposes only, excluding any fraudulent activity, money laundering, terrorism financing, or any other unlawful activity;</li>
                    <li>Keep their login credentials and authentication methods confidential;</li>
                    <li>Immediately notify DigitalCap FX of any unauthorized use of their Account.</li>
                </ul>
            </div>
        )
    },
    {
        id: 'section-10',
        title: '10. Account Security and User Responsibility',
        content: (
            <p>
                The User is solely responsible for keeping their login credentials and authentication methods confidential. Any transaction carried out from the Account using the User&apos;s valid credentials shall be deemed to have been carried out by the User, unless proven otherwise due to negligence attributable to DigitalCap FX.
            </p>
        )
    },
    {
        id: 'section-11',
        title: '11. Limitation of DigitalCap FX\'s Liability',
        content: (
            <p>
                DigitalCap FX implements reasonable measures to ensure the availability, reliability and security of the Service. However, we shall not be held liable for any interruption of the Service resulting from an event of force majeure, network or third-party provider failures, non-compliant use of the Service by the User, or fluctuations in the value of Digital Assets. To the extent permitted by applicable law, our liability is limited to direct and foreseeable damages resulting from our proven fault.
            </p>
        )
    },
    {
        id: 'section-12',
        title: '12. Suspension, Restriction and Closure of Account',
        content: (
            <p>
                We may suspend, restrict or close an Account, in particular in the event of non-compliance with these Terms, suspected fraudulent or unlawful activity, non-compliance with KYC/AML requirements, or upon instruction from a competent authority. The User may also request closure of their Account at any time, subject to settlement of any pending transactions.
            </p>
        )
    },
    {
        id: 'section-13',
        title: '13. Intellectual Property',
        content: (
            <p>
                All elements of the Platform (trademarks, logos, content, interfaces, software) are protected by the intellectual property rights of DigitalCap FX or its licensors. Nothing in these Terms grants the User any right over such elements, other than the right of use strictly necessary to use the Service.
            </p>
        )
    },
    {
        id: 'section-14',
        title: '14. Complaints and Dispute Resolution',
        content: (
            <p>
                Any complaint regarding the Service may be submitted to <a href="mailto:compliance@digitalcapfx.com" className="text-cyan-400 font-mono hover:underline">compliance@digitalcapfx.com</a>. We endeavor to address any complaint within a reasonable time. In the absence of an amicable resolution, the dispute may be brought before the competent courts in accordance with Section 15.
            </p>
        )
    },
    {
        id: 'section-15',
        title: '15. Governing Law and Jurisdiction',
        content: (
            <p>
                These Terms are governed by the laws of Cameroon and, where applicable, the provisions of the Organization for the Harmonization of Business Law in Africa (OHADA), as well as the regulations applicable within the CEMAC and WAEMU regions. Any dispute relating to the validity, interpretation or performance of these Terms shall fall within the exclusive jurisdiction of the competent courts of Douala, subject to applicable mandatory rules.
            </p>
        )
    },
    {
        id: 'section-16',
        title: '16. Amendments to these Terms',
        content: (
            <p>
                We reserve the right to amend these Terms at any time, in particular to reflect legal, regulatory or operational developments. Users will be informed of any material change prior to it taking effect. Continued use of the Service after notification constitutes acceptance of the amended Terms.
            </p>
        )
    },
    {
        id: 'section-17',
        title: '17. Force Majeure',
        content: (
            <p>
                DigitalCap FX shall not be held liable for any failure to perform its obligations resulting from an event of force majeure, including any failure of telecommunications networks, banking infrastructure, or independent third-party service providers.
            </p>
        )
    },
    {
        id: 'section-18',
        title: '18. Miscellaneous',
        content: (
            <p>
                If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect. The failure of DigitalCap FX to exercise any right under these Terms shall not be construed as a waiver of that right.
            </p>
        )
    },
    {
        id: 'section-19',
        title: '19. Contact',
        content: (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-white font-semibold text-lg">Contact Us</h4>
                <p className="text-slate-400 text-sm sm:text-base">
                    For any question regarding these Terms, please contact us at:
                </p>
                <a
                    href="mailto:compliance@digitalcapfx.com"
                    className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 font-mono text-base font-semibold transition"
                >
                    <Mail className="w-5 h-5" />
                    <span>compliance@digitalcapfx.com</span>
                </a>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Registered office: Douala, République du Cameroun
                </p>
            </div>
        )
    }
]

export default function TermsOfServicePage() {
    const { t } = useLanguageStore();
    return (
        <div className="w-full text-white min-h-screen font-sans bg-[#050816] pb-32">
            <main className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 pt-16">

                {/* Header */}
                <div className="mb-14 border-b border-slate-800/80 pb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                        Terms of Service
                    </h1>
                    <p className="text-slate-400 text-base mt-3">
                        DigitalCap FX SARL • Douala, République du Cameroun
                    </p>
                </div>

                {/* Wide Spacious Reading Layout */}
                <div className="space-y-12 text-slate-300 text-base sm:text-lg leading-relaxed">
                    {SECTIONS.map((sec) => (
                        <section key={sec.id} id={sec.id} className="space-y-4 border-b border-slate-800/40 pb-10 last:border-b-0">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                {sec.title}
                            </h2>
                            {sec.content}
                        </section>
                    ))}

                    {/* Navigation link to Privacy Policy */}
                    <div className="pt-8 border-t border-slate-800/80">
                        <Link
                            href="/privacy"
                            className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 text-base font-semibold transition"
                        >
                            <span>Read Privacy Policy</span>
                            <ArrowUpRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

            </main>
        </div>
    )
}
