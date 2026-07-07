'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Wallet,
    CreditCard,
    RefreshCw,
    Settings,
    HelpCircle,
    Bell,
    LogOut,
    Search
} from 'lucide-react'
import { cn } from '@/lib/utils'
import SendMoneySheet from '@/components/pages/auth/_components/SendMoneySheet'
import ReceiveMoneySheet from '@/components/pages/auth/_components/ReceiveMoneySheet'
import FundCardSheet from '@/components/pages/auth/cards/FundCardSheet'
import NewCardSheet from '@/components/pages/auth/cards/NewCardSheet'

const SIDEBAR_LINKS = [
    { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Wallets', icon: Wallet, href: '/dashboard/wallets' },
    { label: 'Cards', icon: CreditCard, href: '/dashboard/cards' },
    { label: 'Exchange', icon: RefreshCw, href: '/dashboard/exchange' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="h-screen w-screen bg-[#050816] text-white flex overflow-hidden">

            {/* Left Fixed Navigation Sidebar */}
            <aside className="w-[260px] border-r border-white/5 bg-[#080E1E] flex flex-col justify-between p-6 select-none shrink-0 h-full">
                <div className="space-y-8">
                    {/* Brand Logo */}
                    <div>
                        <Link href="/">
                            <Image
                                src="/DFXLogo.svg"
                                alt="DigitalCap Logo"
                                width={130}
                                height={28}
                                className="h-7 w-auto object-contain cursor-pointer"
                            />
                        </Link>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-1.5 ">
                        {SIDEBAR_LINKS.map((link) => {
                            const IconComponent = link.icon;
                            const active = pathname === link.href;
                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={cn(
                                        "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 focus:outline-none",
                                        active
                                            ? "bg-primary-500/10 border border-primary-500/20 text-primary-400"
                                            : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
                                    )}
                                >
                                    <IconComponent className="h-5 w-5" />
                                    <span>{link.label}</span>
                                </Link>
                            )
                        })}

                        <div className="h-[1px] bg-white/5 my-4"></div>

                        {/* Settings Button */}
                        <Link
                            href="/dashboard/settings"
                            className={cn(
                                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 focus:outline-none",
                                pathname === '/dashboard/settings'
                                    ? "bg-primary-500/10 border border-primary-500/20 text-primary-400"
                                    : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
                            )}
                        >
                            <Settings className="h-5 w-5" />
                            <span>Settings</span>
                        </Link>
                    </div>
                </div>

                {/* Bottom Profile Details */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                    {/* Acme Corp verification indicator */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition">
                        <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center text-primary-400 shrink-0">
                                <span className="font-bold text-xs font-satoshi">🏢</span>
                            </div>
                            <div className="text-left">
                                <h4 className="text-xs font-bold text-white truncate max-w-[110px]">Acme Corp Ltd</h4>
                                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block mt-0.5">
                                    ✓ KYB Level 2 Verified
                                </span>
                            </div>
                        </div>
                        <svg className="h-3.5 w-3.5 text-slate-500 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                    </div>

                    {/* Support & Logout */}
                    <div className="space-y-1">
                        <button className="w-full flex items-center space-x-3 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition rounded-lg">
                            <HelpCircle className="h-4 w-4" />
                            <span>Help & Support</span>
                        </button>
                        <button
                            onClick={() => router.push('/login')}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-xs font-semibold text-rose-400 hover:text-rose-350 transition rounded-lg"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Sign out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Portal Dashboard Content Area */}
            <div className="flex-grow flex flex-col h-full overflow-hidden">

                {/* Top Search Header */}
                <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-[#050816]/80 backdrop-blur z-30 select-none">

                    {/* Search Field */}
                    <div className="relative flex items-center w-[320px]">
                        <Search className="absolute left-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search transactions, wallets..."
                            className="bg-black/20 border border-white/10 rounded-xl pl-10 pr-14 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 w-full font-sans"
                        />
                        <span className="absolute right-3.5 bg-white/5 border border-white/10 text-[9px] font-bold text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-widest font-mono">
                            ⌘K
                        </span>
                    </div>

                    {/* Notification & Avatar controls */}
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1.5 border border-white/10 hover:bg-white/5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-400 hover:text-white transition duration-200">
                            <HelpCircle className="h-4 w-4" />
                            <span>Help</span>
                        </button>
                        <button className="relative w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary-400"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center font-bold text-white text-xs select-none">
                            PA
                        </div>
                    </div>

                </header>

                {/* Inner Pages Content */}
                <div className="p-8 space-y-8 flex-grow overflow-y-auto">
                    {children}
                </div>

                {/* Global Action Sheets */}
                <SendMoneySheet />
                <ReceiveMoneySheet />
                <FundCardSheet />
                <NewCardSheet />

            </div>

        </div>
    )
}
