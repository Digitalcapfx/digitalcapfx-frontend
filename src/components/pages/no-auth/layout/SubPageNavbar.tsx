'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SubPageNavbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050816]/90 backdrop-blur-md transition-all duration-200">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex flex-col justify-center group">
                    <Image
                        src="/DFXLogo.svg"
                        alt="DigitalCap FX"
                        width={140}
                        height={26}
                        priority
                        className="h-6 w-auto object-contain"
                    />
                    <span className="text-[8px] font-bold text-slate-300 group-hover:text-white transition tracking-tight mt-0.5">
                        Your bridge to the world of payments
                    </span>
                </Link>

                <Link
                    href="/"
                    className="flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white transition duration-200 bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-xl"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Home</span>
                </Link>
            </div>
        </header>
    )
}
