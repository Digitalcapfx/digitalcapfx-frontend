'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'

const FaqSection = () => {
    const { t } = useLanguageStore();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const FAQ_ITEMS = [
        {
            question: t('faq.q1', { defaultValue: 'Is my money safe with DigitalCapFx?' }),
            answer: t('faq.a1', { defaultValue: 'Absolutely. All fiat funds are held in segregated accounts at partner banks. We use 256-bit encryption, biometric authentication, and cold storage for digital assets. Your account is protected to the highest industry standards.' }),
        },
        {
            question: t('faq.q2', { defaultValue: 'Which currencies can I hold?' }),
            answer: t('faq.a2', { defaultValue: 'We support USD, EUR, GBP, CAD, XAF, XOF, and multiple other global fiat currencies alongside stablecoins like USDT and USDC and major cryptocurrencies.' }),
        },
        {
            question: t('faq.q3', { defaultValue: 'How fast are transfers?' }),
            answer: t('faq.a3', { defaultValue: 'Locally, bank transfers settle instantly. Cross-border payments and currency conversions execute in seconds, ensuring real-time settlement.' }),
        },
        {
            question: t('faq.q4', { defaultValue: 'Are there any hidden fees?' }),
            answer: t('faq.a4', { defaultValue: 'No. All conversion rates and transaction fees are fully transparent and displayed on the interface before you click confirm.' }),
        },
        {
            question: t('faq.q5', { defaultValue: 'Can I get a physical card?' }),
            answer: t('faq.a5', { defaultValue: 'Yes. In addition to instant virtual cards, you can request a contactless physical debit card to spend from your multi-currency balances directly.' }),
        },
        {
            question: t('faq.q6', { defaultValue: 'How do I get started?' }),
            answer: t('faq.a6', { defaultValue: "Simply click 'Get Started' to verify your business details. Verification is entirely online and typically takes less than two minutes." }),
        },
    ];

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
                            {t('faq.badge', { defaultValue: '❓ Questions & Answers' })}
                        </span>
                    </div>
                    <h2 className="font-satoshi font-black text-3xl sm:text-4xl lg:text-[48px] leading-[1.15] text-white tracking-tight">
                        {t('faq.title', { defaultValue: 'Frequently asked' })} <span className="bg-brand-gradient bg-clip-text text-transparent">{t('faq.titleHighlight', { defaultValue: 'questions' })}</span>
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-lg font-sans">
                        {t('faq.subtitle', { defaultValue: "Everything you need to know about DigitalCapFx. Can't find an answer? Reach out to our support team." })}
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
