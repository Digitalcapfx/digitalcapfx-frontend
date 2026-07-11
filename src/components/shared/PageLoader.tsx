'use client'

import React from 'react'
import Image from 'next/image'

export const PageLoader: React.FC = () => {
    return (
        <div className="w-full h-[55vh] flex flex-col items-center justify-center space-y-4 select-none animate-in fade-in duration-300">
            <div className="relative flex items-center justify-center">
                {/* Outer pulsing glow */}
                <div className="absolute w-24 h-24 rounded-full bg-primary-500/10 blur-[20px] animate-pulse"></div>
                {/* Breathing logo container */}
                <div className="relative animate-bounce duration-[2000ms] ease-in-out">
                    <Image
                        src="/DFXLogo.svg"
                        alt="DigitalCap Logo"
                        width={140}
                        height={32}
                        className="h-8 w-auto object-contain brightness-110 contrast-125"
                    />
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-slate-550 uppercase tracking-[0.2em] font-mono">
                    Securing treasury pipelines
                </span>
                <span className="flex space-x-1">
                    <span className="w-1 h-1 bg-primary-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1 h-1 bg-primary-500 rounded-full animate-bounce delay-200"></span>
                    <span className="w-1 h-1 bg-primary-500 rounded-full animate-bounce delay-300"></span>
                </span>
            </div>
        </div>
    )
}

export default PageLoader
