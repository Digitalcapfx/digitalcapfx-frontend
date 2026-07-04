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
        <div className="w-full bg-[#050816] py-16 border-b border-white/5 relative overflow-hidden select-none">
            {/* Centered Heading */}
            <div className="text-center text-[10px] font-bold tracking-[0.25em] text-slate-500 uppercase mb-10 select-none">
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
                            className="text-base sm:text-lg font-bold tracking-tight text-slate-600 hover:text-slate-400 transition duration-300 select-none font-sans"
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
