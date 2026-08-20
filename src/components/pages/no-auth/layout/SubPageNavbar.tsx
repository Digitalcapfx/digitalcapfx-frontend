'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { useLanguageStore } from '@/store/languageStore'
import LanguageSelector from '@/components/ui/LanguageSelector'

export default function SubPageNavbar() {
    const { t } = useLanguageStore();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050816]/90 backdrop-blur-md transition-all duration-200">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                <Logo href="/" size="md" />

                <div className="flex items-center space-x-3">
                    <LanguageSelector />

                    <Link
                        href="/"
                        className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-white transition duration-200 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 sm:px-3.5 rounded-xl shrink-0"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span className="hidden min-[400px]:inline">{t('nav.backToHome', { defaultValue: 'Back to Home' })}</span>
                        <span className="inline min-[400px]:hidden">{t('nav.home', { defaultValue: 'Home' })}</span>
                    </Link>
                </div>
            </div>
        </header>
    )
}
