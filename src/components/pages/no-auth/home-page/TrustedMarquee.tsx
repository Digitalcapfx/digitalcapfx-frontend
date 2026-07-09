'use client'

import React from 'react'

const PARTNERS = [
    'Standard Bank',
    'Interswitch',
    'Paystack',
    'Andela',
    'Jumia',
    'Wave',
    'MFS Africa',
    'Chipper Cash',
    'Lipa Na M-PESA',
    'Stripe',
    'Flutterwave',
    'MTN Business',
];

const TrustedMarquee = () => {
    // Duplicate partners to fill screen and scroll continuously
    const doublePartners = [...PARTNERS, ...PARTNERS, ...PARTNERS];

    return (
        <div className="w-full bg-[#0C1224] py-12 border-b border-white/5 relative overflow-hidden select-none">
            {/* Centered Heading */}
            <div className="text-center text-[11px] font-bold tracking-[0.25em] text-[#3E4658] uppercase mb-8 select-none">
                Trusted Infrastructure & Networks
            </div>

            {/* Left and Right Fade overlays */}
            <div className="absolute left-0 top-16 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#050816] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-16 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#050816] to-transparent z-10 pointer-events-none"></div>

            <div className="flex whitespace-nowrap min-w-full">
                <div className="flex space-x-16 animate-marquee-slow shrink-0 hover:[animation-play-state:paused] cursor-pointer">
                    {doublePartners.map((partner, idx) => (
                        <div
                            key={`${partner}-${idx}`}
                            className="text-sm font-bold tracking-tight text-[#3E4658] hover:text-slate-400 transition duration-300 select-none"
                        >
                            {partner}
                        </div>
                    ))}
                </div>
            </div>

            {/* Injected slower marquee custom keyframes */}
            <style jsx global>{`
                @keyframes marquee-slow {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-marquee-slow {
                    animation: marquee-slow 40s linear infinite;
                }
            `}</style>
        </div>
    )
}

export default TrustedMarquee
