'use client'

import React from 'react'
import { Star } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

interface Review {
    name: string;
    role: string;
    avatar: string;
    quote: string;
    rating: number;
}

const ReviewsSection = () => {
    const { t } = useLanguageStore();

    const REVIEWS: Review[] = [
        {
            name: 'Amara Okonkwo',
            role: t('reviews.role1', { defaultValue: 'CFO, Flutterwave' }),
            avatar: 'AO',
            quote: t('reviews.q1', { defaultValue: '"DigitalCap FX transformed our cross-border treasury. Institutional-grade FX rates and an incredibly intuitive platform. We wouldn\'t go back."' }),
            rating: 5,
        },
        {
            name: 'David Mensah',
            role: t('reviews.role2', { defaultValue: 'Head of Finance, Jumia' }),
            avatar: 'DM',
            quote: t('reviews.q2', { defaultValue: '"We cut international payment costs by 40%. Settling in 12 countries now happens without any of the friction we had with traditional banking."' }),
            rating: 5,
        },
        {
            name: 'Sarah Adeyemi',
            role: t('reviews.role3', { defaultValue: 'Treasury Manager, MTN' }),
            avatar: 'SA',
            quote: t('reviews.q3', { defaultValue: '"The OTC desk gives us liquidity depth we simply could not find anywhere else on the continent. Their response time is exceptional."' }),
            rating: 5,
        },
    ];

    return (
        <section id="reviews" className='bg-[#0C1224]'>
            <div className="py-14 lg:py-20 text-center space-y-16">

                {/* Header */}
                <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-full select-none">
                        <span className="text-[11px] font-bold tracking-wider text-primary-500 uppercase">
                            {t('reviews.badge', { defaultValue: '⚡ Customer Stories' })}
                        </span>
                    </div>
                    <h2 className="font-satoshi font-black text-3xl sm:text-4xl lg:text-[48px] leading-[1.15] text-white tracking-tight">
                        {t('reviews.title', { defaultValue: 'Loved by' })} <span className="bg-brand-gradient bg-clip-text text-transparent">{t('reviews.titleHighlight', { defaultValue: 'users' })}</span>
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-7xl mx-auto px-4 md:px-8">
                    {REVIEWS.map((review) => (
                        <div
                            key={review.name}
                            className="glass-panel p-8 space-y-6 select-none flex flex-col justify-between hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 group"
                        >
                            <div className="space-y-4">
                                {/* Stars */}
                                <div className="flex space-x-1">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-5 w-5 fill-amber-500 text-amber-500 stroke-[1.5]"
                                        />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-slate-350 text-sm leading-relaxed font-sans italic">
                                    {review.quote}
                                </p>
                            </div>

                            {/* User Profile */}
                            <div className="flex items-center space-x-3 pt-4 border-t border-white/5">
                                <div className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center text-xs font-bold text-white shadow shadow-primary-500/10">
                                    {review.avatar}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors duration-200 font-satoshi">
                                        {review.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 font-semibold font-sans uppercase">
                                        {review.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}

export default ReviewsSection
