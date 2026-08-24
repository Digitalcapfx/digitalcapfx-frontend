'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
    Download,
    FileText,
    Camera,
    Users,
    Mail,
    Send,
    Sparkles,
    CheckCircle2
} from 'lucide-react'
import { toast } from 'sonner'
import { useLanguageStore } from '@/store/languageStore'
import NewsletterSection from '../shared/NewsletterSection'

export default function PressKitPage() {
    const { t } = useLanguageStore()
    const [newsletterEmail, setNewsletterEmail] = useState('')

    const handleDownloadAssets = (assetType: string) => {
        toast.success(`Downloading DigitalCap FX ${assetType}...`)
    }

    const handleNewsletterSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newsletterEmail || !newsletterEmail.includes('@')) {
            toast.error('Please enter a valid email address.')
            return
        }
        toast.success('Thank you for subscribing to DigitalCap FX updates!')
        setNewsletterEmail('')
    }

    return (
        <div className="w-full text-white flex flex-col font-sans relative overflow-x-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute top-[500px] right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <main className="flex-grow">
                {/* 1. HERO SECTION */}
                <div className="relative py-10 md:py-16 px-4 md:px-8 max-w-7xl mx-auto text-center space-y-5">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
                        <Sparkles className="h-3 w-3 text-primary-400" />
                        <span className="text-[11px] font-bold text-primary-400 uppercase tracking-widest">
                            {t('footer.pressKit', { defaultValue: 'PRESS KIT' })}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        {t('press.title', { defaultValue: 'Brand & Media Resources.' })}
                    </h1>

                    <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto font-sans">
                        {t('press.subtitle', { defaultValue: 'Resources for journalists, bloggers, and partners. Brand assets, press releases, and media contact information.' })}
                    </p>
                </div>

                {/* 2. FOUR RESOURCE CARDS GRID */}
                <div className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Card 1: Brand Assets */}
                        <div
                            onClick={() => handleDownloadAssets('Brand Assets (SVG, PNG, PDF)')}
                            className="bg-[#0C1224] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-primary-500/40 transition duration-300 shadow-xl group cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary-500/15 border border-primary-500/30 flex items-center justify-center text-primary-400 group-hover:scale-105 transition duration-300">
                                <Download className="h-5 w-5" />
                            </div>

                            <div className="space-y-1.5">
                                <h3 className="text-base font-bold text-white group-hover:text-primary-400 transition">
                                    Brand Assets
                                </h3>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Download our logo, brand colour, and visual guidelines in multiple formats (SVG, PNG, PDF).
                                </p>
                            </div>
                        </div>

                        {/* Card 2: Press Releases */}
                        <div
                            onClick={() => handleDownloadAssets('Press Release Fact Sheets')}
                            className="bg-[#0C1224] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-cyan-500/40 transition duration-300 shadow-xl group cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition duration-300">
                                <FileText className="h-5 w-5" />
                            </div>

                            <div className="space-y-1.5">
                                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition">
                                    Press Releases
                                </h3>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Browse our latest announcements and company milestones. High-res images and fact sheets included.
                                </p>
                            </div>
                        </div>

                        {/* Card 3: Product Screenshots */}
                        <div
                            onClick={() => handleDownloadAssets('High-Res Product Screenshots')}
                            className="bg-[#0C1224] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-blue-500/40 transition duration-300 shadow-xl group cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition duration-300">
                                <Camera className="h-5 w-5" />
                            </div>

                            <div className="space-y-1.5">
                                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">
                                    Product Screenshots
                                </h3>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    High-resolution screenshots of the DigitalCap FX app and dashboard for editorial use.
                                </p>
                            </div>
                        </div>

                        {/* Card 4: Executive Bios */}
                        <div
                            onClick={() => handleDownloadAssets('Leadership Bios & Headshots')}
                            className="bg-[#0C1224] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-purple-500/40 transition duration-300 shadow-xl group cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition duration-300">
                                <Users className="h-5 w-5" />
                            </div>

                            <div className="space-y-1.5">
                                <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition">
                                    Executive Bios
                                </h3>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Official biographies and headshots of our leadership team for media publication.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. MEDIA CONTACT CARD */}
                <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="max-w-2xl mx-auto bg-[#090E1E] border border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-2xl relative overflow-hidden">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-md">
                            <Mail className="h-6 w-6" />
                        </div>

                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block font-mono">
                                MEDIA CONTACT
                            </span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                                For press enquiries
                            </h2>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                                For interviews, media coverage, or press enquiries, contact our communications team.
                            </p>
                        </div>

                        <div className="pt-2">
                            <a
                                href="mailto:press@digitalcapfx.com"
                                className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-400 via-primary-500 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-xl shadow-lg shadow-primary-500/20 transition-all duration-200"
                            >
                                <Mail className="h-4 w-4" />
                                <span>press@digitalcapfx.com</span>
                            </a>
                        </div>

                        <p className="text-[11px] text-slate-500 font-mono">
                            Response within 2 hours for urgent requests.
                        </p>
                    </div>
                </div>

                {/* 4. STAY IN THE LOOP (NEWSLETTER) SECTION */}
                <NewsletterSection />
            </main>
        </div>
    )
}
