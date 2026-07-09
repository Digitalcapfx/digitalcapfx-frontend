'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FaqItem {
    question: string;
    answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
    {
        question: 'Is my money safe with DigitalFx?',
        answer: 'Absolutely. All fiat funds are held in segregated accounts at partner banks. We use 256-bit encryption, biometric authentication, and cold storage for digital assets. Your account is protected to the highest industry standards.',
    },
    {
        question: 'Which currencies can I hold?',
        answer: 'We support USD, EUR, GBP, CAD, XAF, XOF, and multiple other global fiat currencies alongside stablecoins like USDT and USDC and major cryptocurrencies.',
    },
    {
        question: 'How fast are transfers?',
        answer: 'Locally, bank transfers settle instantly. Cross-border payments and currency conversions execute in seconds, ensuring real-time settlement.',
    },
    {
        question: 'Are there any hidden fees?',
        answer: 'No. All conversion rates and transaction fees are fully transparent and displayed on the interface before you click confirm.',
    },
    {
        question: 'Can I get a physical card?',
        answer: 'Yes. In addition to instant virtual cards, you can request a contactless physical debit card to spend from your multi-currency balances directly.',
    },
    {
        question: 'How do I get started?',
        answer: 'Simply click \'Get Started\' to verify your business details. Verification is entirely online and typically takes less than two minutes.',
    },
];

const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleOpen = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className='bg-[#0C1224]'>
            <div className="py-14 lg:py-24 text-center space-y-12">

                {/* Header */}
                <div className="space-y-4 max-w-3xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-full select-none">
                        <span className="text-[10px] font-bold tracking-wider text-primary-400 uppercase">
                            ❓ Questions & Answers
                        </span>
                    </div>
                    <h2 className="font-satoshi font-black text-3xl sm:text-4xl lg:text-[48px] leading-[1.15] text-white tracking-tight">
                        Frequently asked <span className="bg-brand-gradient bg-clip-text text-transparent">questions</span>
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-lg font-sans">
                        Everything you need to know about DigitalFx. Can't find an answer? Reach out to our support team.
                    </p>
                </div>

                {/* Accordion Lists */}
                <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-4 text-left">
                    {FAQ_ITEMS.map((item, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className="glass-panel border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300 shadow shadow-black/20"
                            >
                                <button
                                    onClick={() => toggleOpen(idx)}
                                    className="w-full px-6 py-5 flex items-center justify-between font-satoshi font-bold text-base text-white focus:outline-none select-none text-left"
                                >
                                    <span>{item.question}</span>
                                    <div className="p-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white flex items-center justify-center">
                                        {isOpen ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </div>
                                </button>

                                {/* Animated Answer height drawer */}
                                <div className={cn(
                                    "grid transition-all duration-300 ease-in-out",
                                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                )}>
                                    <div className="overflow-hidden">
                                        <p className="px-6 pb-6 text-sm text-slate-400 leading-relaxed font-sans border-t border-white/5 pt-4">
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

        </section>
    )
}

export default FaqSection
