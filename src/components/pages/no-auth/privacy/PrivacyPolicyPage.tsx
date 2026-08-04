'use client'

import React from 'react'
import Link from 'next/link'
import { Shield, Mail, ArrowUpRight } from 'lucide-react'

const SECTIONS = [
    {
        id: 'section-1',
        title: '1. Introduction',
        content: (
            <div className="space-y-4">
                <p>
                    This Privacy Policy describes how <strong>DigitalCap FX</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), a limited liability company incorporated under the laws of Cameroon, licensed as an electronic money institution, with its registered office at Douala, République du Cameroun, collects, uses, stores, shares and protects the personal data of users of its financial services platform (the &quot;Service&quot;), accessible in particular through its website and applications (the &quot;Platform&quot;).
                </p>
                <p>
                    By creating an account or using the Platform, you acknowledge that you have read this Policy and consent to the processing of your personal data as described below.
                </p>
            </div>
        )
    },
    {
        id: 'section-2',
        title: '2. Data Controller',
        content: (
            <div className="space-y-3">
                <p>
                    The controller responsible for the processing of personal data collected through the Platform is DigitalCap FX, whose registered office is located at Douala, République du Cameroun, reachable at:
                </p>
                <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1 max-w-lg">
                    <p className="text-white font-semibold text-base">DigitalCap FX SARL</p>
                    <p className="text-slate-400 text-sm">Douala, République du Cameroun</p>
                    <p className="text-cyan-400 text-sm font-mono mt-1">
                        <a href="mailto:digitalcapfx@dgcap.com" className="hover:underline">digitalcapfx@dgcap.com</a>
                    </p>
                </div>
            </div>
        )
    },
    {
        id: 'section-3',
        title: '3. Personal Data We Collect',
        content: (
            <div className="space-y-4">
                <p>
                    In connection with the provision of our services, and in particular to comply with our Know Your Customer (KYC) and Anti-Money Laundering / Counter-Terrorism Financing (AML/CTF) obligations, we collect the following categories of data:
                </p>
                <ul className="list-disc list-inside space-y-3 pl-3 text-slate-300">
                    <li><strong>Identification data:</strong> name, surname(s), date and place of birth, nationality, copy of official identity document, verification photograph or selfie;</li>
                    <li><strong>Contact details:</strong> postal address, email address, phone number;</li>
                    <li><strong>Financial data:</strong> bank account or digital wallet information, transaction history, declared income, source of funds;</li>
                    <li><strong>Digital asset data:</strong> cryptocurrency and stablecoin wallet addresses (including USDT/USDC) used in connection with the Service;</li>
                    <li><strong>Connection and usage data:</strong> IP address, device identifiers, log data, approximate geolocation data, cookies;</li>
                    <li>Any other data voluntarily provided, including through communications with our customer support.</li>
                </ul>
            </div>
        )
    },
    {
        id: 'section-4',
        title: '4. Purposes of Processing',
        content: (
            <div className="space-y-3">
                <p>Your personal data is processed for the following purposes:</p>
                <ul className="list-disc list-inside space-y-3 pl-3 text-slate-300">
                    <li>Opening, managing and securing your account;</li>
                    <li>Executing foreign exchange transactions, transfers, fiat-crypto conversions and issuing virtual cards;</li>
                    <li>Complying with our legal and regulatory obligations, including KYC, AML/CTF requirements and supervision by the competent authorities of the CEMAC and WAEMU regions;</li>
                    <li>Preventing fraud and managing risk;</li>
                    <li>Improving and personalizing the Service;</li>
                    <li>Marketing communications, subject to your consent where required;</li>
                    <li>Responding to your requests through our customer support.</li>
                </ul>
            </div>
        )
    },
    {
        id: 'section-5',
        title: '5. Legal Basis for Processing',
        content: (
            <p>
                Depending on the circumstances, the processing of your data is based on the performance of the service agreement between us, compliance with legal and regulatory obligations to which we are subject as a licensed electronic money institution, our legitimate interest in ensuring the security of the Platform and preventing fraud, or your consent where required, in particular for certain marketing communications.
            </p>
        )
    },
    {
        id: 'section-6',
        title: '6. Recipients and Data Sharing',
        content: (
            <div className="space-y-4">
                <p>
                    Your data may be shared, strictly to the extent necessary, with the following categories of recipients:
                </p>
                <ul className="list-disc list-inside space-y-3 pl-3 text-slate-300">
                    <li>Our technical service providers and partners for payments, digital asset custody and infrastructure, acting as processors and bound by confidentiality and security obligations equivalent to our own;</li>
                    <li>Regulatory, supervisory authorities and competent public bodies, in connection with our legal obligations (monetary and supervisory authorities in the CEMAC and WAEMU regions, judicial authorities);</li>
                    <li>Partner banking and financial institutions involved in executing transactions;</li>
                    <li>Where applicable, our legal advisors and auditors, in the course of their engagements.</li>
                </ul>
                <p className="text-emerald-400 font-medium pt-1">
                    We do not sell your personal data to third parties for commercial purposes.
                </p>
            </div>
        )
    },
    {
        id: 'section-7',
        title: '7. International Data Transfers',
        content: (
            <p>
                Given the cross-border nature of our services within the CEMAC and WAEMU regions, and our use of technical service providers that may be located outside these regions, certain data may be subject to international transfers. In such cases, we ensure that these transfers are governed by appropriate contractual or technical safeguards for security and confidentiality, consistent with applicable requirements.
            </p>
        )
    },
    {
        id: 'section-8',
        title: '8. Data Retention',
        content: (
            <p>
                Your data is retained for the duration of our contractual relationship, and thereafter for the periods required by applicable legal and regulatory obligations, in particular anti-money laundering requirements, which may exceed the duration of the business relationship. At the end of these periods, your data is deleted or anonymized.
            </p>
        )
    },
    {
        id: 'section-9',
        title: '9. Data Security',
        content: (
            <p>
                We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss, alteration or disclosure, including data encryption, strong authentication and strict access controls. We also encourage you to adopt good security practices, such as using a strong password, enabling two-factor authentication, and remaining vigilant against phishing attempts.
            </p>
        )
    },
    {
        id: 'section-10',
        title: '10. Cookies and Similar Technologies',
        content: (
            <p>
                The Platform uses cookies and similar technologies to ensure its proper functioning, analyze usage, and improve the user experience. You may configure your browser to refuse certain cookies, noting that this may affect certain features of the Service.
            </p>
        )
    },
    {
        id: 'section-11',
        title: '11. Your Rights',
        content: (
            <p>
                Subject to the limitations set out under applicable law, including our AML/CTF-related retention obligations, you have the right to access, rectify, erase, restrict and object to the processing of your data, as well as a right to data portability where technically feasible. These rights may be exercised by contacting us at the address provided in Section 14.
            </p>
        )
    },
    {
        id: 'section-12',
        title: '12. Protection of Minors',
        content: (
            <p>
                The Service is reserved for adults with full legal capacity. We do not knowingly collect data relating to minors.
            </p>
        )
    },
    {
        id: 'section-13',
        title: '13. Changes to this Policy',
        content: (
            <p>
                We may update this Privacy Policy from time to time, in particular to reflect legal, regulatory or technical developments. Any material change will be notified to you through appropriate means prior to taking effect.
            </p>
        )
    },
    {
        id: 'section-14',
        title: '14. Contact',
        content: (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-white font-semibold text-lg">Questions about this Policy?</h4>
                <p className="text-slate-400 text-sm sm:text-base">
                    For any question regarding this Policy or to exercise your rights, please contact us at:
                </p>
                <a
                    href="mailto:digitalcapfx@dgcap.com"
                    className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 font-mono text-base font-semibold transition"
                >
                    <Mail className="w-5 h-5" />
                    <span>digitalcapfx@dgcap.com</span>
                </a>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Registered Office: Douala, République du Cameroun
                </p>
            </div>
        )
    }
]

export default function PrivacyPolicyPage() {
    return (
        <div className="w-full text-white min-h-screen font-sans bg-[#050816] pb-32">
            <main className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 pt-16">

                {/* Header */}
                <div className="mb-14 border-b border-slate-800/80 pb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-400 text-base mt-3">
                        DigitalCap FX • Douala, République du Cameroun
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

                    {/* Navigation link to Terms */}
                    <div className="pt-8 border-t border-slate-800/80">
                        <Link
                            href="/terms"
                            className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 text-base font-semibold transition"
                        >
                            <span>Read Terms of Service</span>
                            <ArrowUpRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

            </main>
        </div>
    )
}
