'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Check } from 'lucide-react'

const BENEFITS = [
    "No hidden fees",
    "Instant setup",
    "FDIC insured"
];

const HeroSection = () => {
    return (
        <section className="w-full max-w-full overflow-hidden">
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center  py-12 pt-24 lg:py-32">
                {/* Left Content Column */}
                <div className="col-span-1 lg:col-span-6 space-y-6 text-left min-w-0">

                    {/* Support Badge */}
                    <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-full select-none">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                        <span className="text-[10px] font-bold tracking-wider text-primary-500 uppercase">
                            Now Supporting 13+ Currencies
                        </span>
                    </div>

                    {/* Heading */}
                    <div className="space-y-4">
                        <h1 className="font-satoshi font-black text-4xl sm:text-5xl lg:text-[60px] leading-[1.1] text-white tracking-tight">
                            Banking, <br className="hidden sm:inline" />
                            <span className="bg-brand-gradient bg-clip-text text-transparent">reimagined.</span>
                        </h1>
                        <p className="text-[#6D778A] text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl font-sans">
                            One account for fiat, stablecoins. Send, receive, exchange, and spend – all from a single, beautifully designed platform.
                        </p>
                    </div>

                    {/* Buttons Row */}
                    <div className="flex flex-wrap items-center gap-4">
                        <Link href="/get-started">
                            <Button
                                variant="primary"
                                size="large"
                                className="rounded-full px-7 shadow-lg shadow-primary-500/20 text-sm font-bold"
                                rightIcon={<ArrowRight className="h-5 w-5" />}
                            >
                                Open Account
                            </Button>
                        </Link>
                        <Link href="/login">
                            <button className="h-[52px] cursor-pointer px-8 rounded-2xl border border-white/15 text-white hover:bg-white/5 hover:border-white/20 transition duration-200 text-sm font-semibold focus:outline-none select-none active:scale-[0.98]">
                                Log in
                            </button>
                        </Link>
                    </div>

                    {/* Checklist Benefits */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-500 select-none">
                        {BENEFITS.map((benefit) => (
                            <div key={benefit} className="flex items-center space-x-2">
                                <Check className="h-4 w-4 text-[#22C55E] stroke-[3]" />
                                <span className="font-semibold font-sans text-slate-400">{benefit}</span>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Right Illustration Column */}
                <div className="col-span-1 lg:col-span-6 flex justify-center lg:justify-end relative mt-8 lg:mt-0 min-w-0 w-full">
                    <div className="relative w-full max-w-[340px] sm:max-w-[450px] lg:max-w-none h-auto mx-auto lg:mx-0">
                        <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

                        <Image
                            src="/HeroImage.svg"
                            alt="DigitalCap FX Dashboard Platform Preview"
                            width={600}
                            height={450}
                            priority
                            className="w-full h-auto object-contain select-none"
                        />

                        <div
                            className="absolute bottom-[5%] sm:-left-8 lg:-left-12 bg-[#0C1224] border border-white/10 rounded-[20px] p-5 shadow-2xl shadow-black/80 max-w-[260px] w-full select-none hover:scale-[1.02] transition-transform duration-300 hidden sm:block"
                            style={{ animation: 'float-card 6s ease-in-out infinite' }}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-full bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-primary-400">
                                    <span className="font-bold text-sm">€</span>
                                </div>
                                <span className="font-bold text-sm text-white tracking-tight">Instant Exchange</span>
                            </div>
                            <div className="flex items-center space-x-2.5 mt-4">
                                <span className="text-xl font-extrabold text-primary-400 font-satoshi">€2,000</span>
                                <ArrowRight className="h-4 w-4 text-slate-500" />
                                <span className="text-xl font-extrabold text-white font-satoshi">£1,715</span>
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 font-mono tracking-wider mt-1.5 uppercase">
                                EUR → GBP • Live rate
                            </div>
                        </div>
                    </div>
                </div>

                {/* Animation style hook for subtle float */}
                <style jsx global>{`
                @keyframes float-card {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>
            </main>
        </section>

    )
}

export default HeroSection