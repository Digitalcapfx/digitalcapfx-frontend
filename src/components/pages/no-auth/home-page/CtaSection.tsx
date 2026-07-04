'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Check } from 'lucide-react'

const CtaSection = () => {
    return (
        <section id="cta" className="py-20 lg:py-24 max-w-7xl mx-auto px-4 md:px-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#080E21] to-[#12224A] border border-white/10 rounded-[32px] py-16 px-6 sm:px-12 text-center shadow-2xl">
                
                {/* Glowing decorative blobs */}
                <div className="absolute top-[-150px] right-[-150px] w-[350px] h-[350px] rounded-full bg-primary-500/20 blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[-150px] left-[-150px] w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-cyan-400 uppercase block font-mono">
                        Start Today
                    </span>
                    <h2 className="font-satoshi font-black text-3xl sm:text-4xl lg:text-[44px] leading-tight text-white tracking-tight">
                        Ready to get started?
                    </h2>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans max-w-lg mx-auto">
                        Join 150,000+ users managing their money the smart way. Create your account in under 2 minutes.
                    </p>
                    
                    <div className="pt-4 flex flex-col items-center space-y-4">
                        <Link href="/get-started">
                            <Button 
                                variant="primary" 
                                size="large"
                                className="rounded-full px-8 font-semibold shadow-xl shadow-primary-500/20"
                                rightIcon={<ArrowRight className="h-4.5 w-4.5" />}
                            >
                                Create Business Account
                            </Button>
                        </Link>

                        {/* Checklist */}
                        <div className="flex items-center justify-center space-x-6 text-xs text-slate-500 select-none pt-2">
                            <div className="flex items-center">
                                <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3] mr-1.5" />
                                <span className="font-semibold text-slate-400 font-sans">No credit card required</span>
                            </div>
                            <div className="flex items-center">
                                <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3] mr-1.5" />
                                <span className="font-semibold text-slate-400 font-sans">Cancel anytime</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default CtaSection
