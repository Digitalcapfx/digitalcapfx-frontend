'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Shield, Scan, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'

interface TabItem {
    id: string;
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabItem[] = [
    { id: 'profile', label: 'Profile', href: '/settings', icon: User },
    { id: 'security', label: 'Security', href: '/settings/security', icon: Shield },
    { id: 'verification', label: 'Verification', href: '/settings/verification', icon: Scan },
    // { id: 'notifications', label: 'Notifications', href: '/settings/notifications', icon: Bell },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { t } = useLanguageStore();

    return (
        <div className="space-y-6 text-left relative min-h-[500px]">

            {/* Layout Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                {/* Left Sticky Sidebar Panel (including Header & Tabs) */}
                <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">

                    {/* Header section */}
                    <div className="space-y-1 select-none">
                        <h2 className="text-2xl font-black text-white font-satoshi">{t('settings.title')}</h2>
                        <p className="text-xs font-semibold text-slate-555 font-sans leading-relaxed">
                            {t('settings.subtitle')}
                        </p>
                    </div>

                    {/* Tabs Sidebar navigation */}
                    <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible -mx-4 px-4 lg:mx-0 lg:px-0 space-x-2 lg:space-x-0 lg:space-y-1 scrollbar-none pb-2 lg:pb-0 shrink-0 select-none">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = pathname === tab.href;

                            return (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    className={cn(
                                        "w-auto lg:w-full flex items-center space-x-3 px-4 py-2.5 lg:px-4.5 lg:py-3.5 rounded-xl lg:rounded-2xl text-xs font-bold transition duration-200 cursor-pointer select-none shrink-0 block",
                                        isActive
                                            ? "bg-primary-500/10 border border-primary-500/20 text-primary-400 font-extrabold"
                                            : "text-slate-400 hover:text-white hover:bg-white/[0.015]"
                                    )}
                                >
                                    <div className="flex items-center space-x-2 lg:space-x-3">
                                        <Icon className="h-4.5 w-4.5 shrink-0" />
                                        <span>{t('settings.tabs.' + tab.id)}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                </div>

                {/* Sub routing content column (3/4 width) */}
                <div className="lg:col-span-3">
                    {children}
                </div>

            </div>

        </div>
    );
}
