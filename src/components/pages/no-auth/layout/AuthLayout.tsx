'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { TrendingUp, TrendingDown, ArrowUpRight, Star } from 'lucide-react'

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="grid grid-cols-12 min-h-screen bg-[#050816]">
            {/* Left Metrics Sidebar (Desktop only) */}
            <div className="hidden lg:flex lg:col-span-4 bg-gradient-to-b from-[#081C3A] to-[#050816] p-12 flex-col justify-between border-r border-white/5 min-h-screen sticky top-0 overflow-y-auto select-none">

                {/* Brand Logo */}
                <div className="flex flex-col items-start">
                    <Link href="/" className="inline-block">
                        <Image
                            src="/DFXLogo.svg"
                            alt="DigitalCap FX Logo"
                            width={142}
                            height={32}
                            priority
                            className="h-8 w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
                        />
                    </Link>
                    <p className="text-[10px] font-bold text-white/80 mt-1.5 font-sans tracking-wide select-none">
                        Your bridge to the world of payments
                    </p>
                </div>

                {/* Center Metrics Section */}
                <div className="my-8 space-y-6">
                    {/* Live Sessions Badge */}
                    <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                            84 active sessions • live
                        </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                        <div>
                            <div className="text-2xl font-black text-white font-satoshi flex items-center space-x-1.5">
                                <span>$2.8B</span>
                                <TrendingUp className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                                Monthly Volume
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-white font-satoshi">
                                40+
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                                Countries
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-white font-satoshi">
                                100+
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                                Currencies
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-white font-satoshi">
                                &lt; 3s
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                                Avg Settlement
                            </div>
                        </div>
                    </div>

                    {/* Live FX Rates panel */}
                    <div className="bg-[#07132B] border border-white/5 rounded-2xl p-6 space-y-4">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                            Live FX Rates
                        </span>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-semibold">
                                <span className="text-slate-400">USD/NGN</span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-white font-mono">1,621.45</span>
                                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-xs font-semibold">
                                <span className="text-slate-400">EUR/USD</span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-white font-mono">1.0842</span>
                                    <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-xs font-semibold">
                                <span className="text-slate-400">GBP/USD</span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-white font-mono">1.2710</span>
                                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today settled card */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center space-x-3.5">
                        <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <ArrowUpRight className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white">
                                $4.8M settled today
                            </div>
                            <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                                98 transactions • no failures
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Customer Story */}
                <div className="space-y-3.5">
                    <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className="h-4 w-4 fill-amber-500 text-amber-500 stroke-[1.5]"
                            />
                        ))}
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic font-sans max-w-sm">
                        "DigitalCap FX cut our cross-border FX costs by 40%. The platform is exceptional."
                    </p>
                    <div className="flex items-center space-x-3 pt-2">
                        <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-[10px] font-bold text-white">
                            AO
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-white font-satoshi">
                                Amara Okonkwo
                            </h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                                CFO, Flutterwave
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Column (Child forms) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col justify-center items-center p-6 sm:p-12 min-h-screen">
                <div className="w-full max-w-[440px] space-y-8 py-10">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AuthLayout
