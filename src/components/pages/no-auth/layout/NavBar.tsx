'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { ArrowRight, Menu, X, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguageStore, Language } from '@/store/languageStore'
import LanguageSelector from '@/components/ui/LanguageSelector'

interface NavLink {
    id: string;
    labelKey: string;
    defaultLabel: string;
    href: string;
}

const NAV_LINKS: NavLink[] = [
    { id: 'features', labelKey: 'nav.features', defaultLabel: 'Features', href: '#features' },
    { id: 'how-it-works', labelKey: 'nav.howItWorks', defaultLabel: 'How it works', href: '#how-it-works' },
    { id: 'reviews', labelKey: 'nav.reviews', defaultLabel: 'Reviews', href: '#reviews' },
];

const LANGUAGES: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'zh', label: '中文' },
];

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeId, setActiveId] = useState('features');
    const { t, language, setLanguage } = useLanguageStore();

    return (
        <nav className="flex items-center justify-between h-20 w-full backdrop-blur-md fixed top-0 z-50 border-b border-white/6 px-4 md:px-8 bg-[#050816]/80">

            {/* Logo with tagline */}
            <Logo href="/" size="md" />

            {/* Nav Menu for Desktop */}
            <div className="hidden lg:flex items-center space-x-1 border border-white/5 px-1.5 py-1 rounded-full">
                {NAV_LINKS.map((link) => {
                    const isActive = activeId === link.id;
                    return (
                        <Link
                            key={link.id}
                            href={link.href}
                            onClick={() => setActiveId(link.id)}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-full transition duration-200 border",
                                isActive
                                    ? "text-white bg-white/5 border-white/5"
                                    : "text-[#C8D0DD] hover:text-slate-200 border-transparent"
                            )}
                        >
                            {t(link.labelKey, { defaultValue: link.defaultLabel })}
                        </Link>
                    )
                })}
            </div>

            {/* Actions & Language Switcher for Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
                {/* Language Switcher */}
                <LanguageSelector />

                <Link href="/login">
                    <Button variant="ghost" className="text-slate-300 font-medium px-4 text-sm h-9">
                        {t('nav.login', { defaultValue: 'Log in' })}
                    </Button>
                </Link>
                <Link href="/get-started">
                    <Button
                        variant="primary"
                        className="rounded-full px-5 text-sm h-9 font-medium"
                        rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                    >
                        {t('nav.getStarted', { defaultValue: 'Get Started' })}
                    </Button>
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center space-x-2">
                <LanguageSelector compact />
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-slate-400 hover:text-white p-2 focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu Drawer */}
            {isOpen && (
                <div className="absolute top-20 left-0 w-full bg-[#050816] border-b border-white/5 px-6 py-6 lg:hidden flex flex-col space-y-4 z-40 transition-all duration-200">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.id}
                            href={link.href}
                            onClick={() => {
                                setActiveId(link.id);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "text-sm font-semibold transition py-2",
                                activeId === link.id ? "text-white font-bold" : "text-slate-300 hover:text-white"
                            )}
                        >
                            {t(link.labelKey, { defaultValue: link.defaultLabel })}
                        </Link>
                    ))}
                    <div className="border-t border-white/5 pt-4 flex flex-col space-y-3">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full text-slate-300 font-semibold">
                                {t('nav.login', { defaultValue: 'Log in' })}
                            </Button>
                        </Link>
                        <Link href="/get-started" onClick={() => setIsOpen(false)}>
                            <Button
                                variant="primary"
                                className="w-full rounded-full font-semibold"
                                rightIcon={<ArrowRight className="h-4 w-4" />}
                            >
                                {t('nav.getStarted', { defaultValue: 'Get Started' })}
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default NavBar