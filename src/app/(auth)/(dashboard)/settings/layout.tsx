'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Shield, Scan, Bell, CheckCircle2 } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'
import { cn } from '@/lib/utils'

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
    { id: 'notifications', label: 'Notifications', href: '/settings/notifications', icon: Bell },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { toast, clearToast } = useSettingsStore();

    // Auto-clear toast alert on changes
    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => {
                clearToast();
            }, 3000);
            return () => clearTimeout(t);
        }
    }, [toast, clearToast]);

    return (
        <div className="space-y-6 text-left relative min-h-[500px]">
            
            {/* Global Settings Toast Alerts */}
            {toast && (
                <div 
                    className={cn(
                        "fixed top-6 right-6 z-50 flex items-center space-x-2.5 px-4.5 py-3 rounded-xl border text-xs font-bold font-sans shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300",
                        toast.type === 'success'
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-rose-500/10 border-rose-500/20 text-rose-450"
                    )}
                >
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                    <span>{toast.message}</span>
                </div>
            )}

            {/* Layout Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                
                {/* Left Sticky Sidebar Panel (including Header & Tabs) */}
                <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
                    
                    {/* Header section */}
                    <div className="space-y-1 select-none">
                        <h2 className="text-2xl font-black text-white font-satoshi">Settings</h2>
                        <p className="text-xs font-semibold text-slate-555 font-sans leading-relaxed">
                            Configure your preferences and security details
                        </p>
                    </div>

                    {/* Tabs Sidebar navigation */}
                    <div className="space-y-1">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = pathname === tab.href;
                            
                            return (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    className={cn(
                                        "w-full flex items-center space-x-3 px-4.5 py-3.5 rounded-2xl text-xs font-bold transition duration-200 cursor-pointer select-none text-left block",
                                        isActive
                                            ? "bg-primary-500/10 border border-primary-500/20 text-primary-400 font-extrabold"
                                            : "text-slate-400 hover:text-white hover:bg-white/[0.015]"
                                    )}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Icon className="h-4.5 w-4.5 shrink-0" />
                                        <span>{tab.label}</span>
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
