'use client'

import React, { useState, useEffect } from 'react'
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
    ShieldAlert,
    ShieldAlert as ShieldWarning,
    RefreshCw as SpinnerIcon,
    Clock,
    Gift,
    Menu,
    X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import SendMoneySheet from '@/components/pages/auth/_components/SendMoneySheet'
import ReceiveMoneySheet from '@/components/pages/auth/_components/ReceiveMoneySheet'
import FundCardSheet from '@/components/pages/auth/cards/FundCardSheet'
import NewCardSheet from '@/components/pages/auth/cards/NewCardSheet'
import PhoneSendSheet from '@/components/pages/auth/_components/PhoneSendSheet'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '@/services/profile.service'
import { authService } from '@/services/auth.service'
import { toast } from 'sonner'

const SIDEBAR_LINKS = [
    { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Wallets', icon: Wallet, href: '/wallets' },
    { label: 'Cards', icon: CreditCard, href: '/cards' },
    { label: 'Exchange', icon: RefreshCw, href: '/exchange' },
    { label: 'Activity', icon: Clock, href: '/activity' },
    { label: 'Referrals', icon: Gift, href: '/referrals' },
    { label: 'Support Desk', icon: HelpCircle, href: '/support' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Verification blocker states
    const [otpCode, setOtpCode] = useState('');
    const [timer, setTimer] = useState(30);

    // Profile Query
    const profileQuery = useQuery({
        queryKey: ['profile'],
        queryFn: () => profileService.getProfile(),
        refetchOnWindowFocus: false,
    });

    // Countdown for Resend OTP code
    useEffect(() => {
        if (!profileQuery.data?.data || profileQuery.data.data.isEmailVerified) return;
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer, profileQuery.data]);

    // Mutations
    const verifyEmailMutation = useMutation({
        mutationFn: (code: string) => authService.verifyEmail(code),
        onSuccess: (data) => {
            if (data?.success) {
                toast.success('Email verified successfully!');
                queryClient.invalidateQueries({ queryKey: ['profile'] });
            } else {
                toast.error(data?.error?.message || 'Verification code is invalid.');
            }
        },
        onError: (err: any) => {
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object' ? rawError.message : (rawError || 'Failed to verify email.');
            toast.error(msg);
        }
    });

    const resendOtpMutation = useMutation({
        mutationFn: () => authService.resendOtp(),
        onSuccess: (data) => {
            if (data?.success) {
                toast.success('New verification code sent to your email!');
                setTimer(30);
            } else {
                toast.error(data?.error?.message || 'Failed to resend code.');
            }
        },
        onError: (err: any) => {
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object' ? rawError.message : (rawError || 'Failed to resend OTP.');
            toast.error(msg);
        }
    });

    const handleVerifySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otpCode.length < 4) {
            toast.error('Please enter a valid verification code.');
            return;
        }
        verifyEmailMutation.mutate(otpCode);
    };

    const handleSignOut = () => {
        authService.logout().finally(() => {
            localStorage.removeItem('account_type');
            router.push('/login');
        });
    };

    // Full page loading overlay for session setups
    if (profileQuery.isLoading) {
        return (
            <div className="h-screen w-screen bg-[#050816] flex flex-col items-center justify-center space-y-4">
                <SpinnerIcon className="h-10 w-10 text-primary-500 animate-spin" />
                <p className="text-xs text-slate-550 font-sans">Connecting to secure banking session...</p>
            </div>
        );
    }

    const profile = profileQuery.data?.data;

    // Block page view if email is unverified
    if (profile && !profile.isEmailVerified) {
        return (
            <div className="h-screen w-screen bg-[#050816] text-white flex items-center justify-center p-6 select-none relative overflow-hidden">
                <div className="absolute right-[-150px] top-[-150px] w-[350px] h-[350px] rounded-full bg-primary-500/10 blur-[90px] pointer-events-none"></div>

                <div className="bg-[#080E1E] border border-white/5 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
                    <div className="space-y-4">
                        <div className="relative inline-flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-primary-500/20 blur-[15px]"></div>
                            <div className="relative w-14 h-14 rounded-full bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-primary-400">
                                <ShieldAlert className="h-7 w-7" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <h3 className="font-satoshi font-black text-xl text-white">Verify your Email</h3>
                            <p className="text-slate-455 text-xs font-sans leading-relaxed">
                                We sent a verification code to <strong className="text-slate-200">{profile.email}</strong>. Enter it below to unlock your account.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleVerifySubmit} className="space-y-4">
                        <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="Enter 6-digit code"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                            className="bg-black/35 border border-white/10 rounded-xl px-4.5 py-3.5 text-center text-white focus:outline-none focus:border-primary-500/50 w-full font-mono font-black text-xl tracking-[0.2em] placeholder-slate-700"
                        />

                        <button
                            type="submit"
                            disabled={verifyEmailMutation.isPending || otpCode.length < 5}
                            className={cn(
                                "w-full py-3.5 rounded-xl font-bold text-xs tracking-wide shadow-lg transition duration-200 cursor-pointer active:scale-[0.98]",
                                otpCode.length >= 5 && !verifyEmailMutation.isPending
                                    ? "bg-primary-500 hover:bg-primary-450 text-white"
                                    : "bg-slate-800 text-slate-550 cursor-not-allowed"
                            )}
                        >
                            {verifyEmailMutation.isPending ? 'Verifying...' : 'Unlock Account'}
                        </button>
                    </form>

                    <div className="flex justify-between items-center text-[10px] font-bold px-1 select-none">
                        {timer > 0 ? (
                            <span className="text-slate-500">Resend code in 00:{timer.toString().padStart(2, '0')}</span>
                        ) : (
                            <button
                                onClick={() => resendOtpMutation.mutate()}
                                disabled={resendOtpMutation.isPending}
                                className="text-primary-400 hover:underline cursor-pointer"
                            >
                                {resendOtpMutation.isPending ? 'Sending...' : 'Resend Code'}
                            </button>
                        )}

                        <button
                            onClick={handleSignOut}
                            className="text-rose-455 hover:underline cursor-pointer flex items-center space-x-1"
                        >
                            <LogOut className="h-3 w-3" />
                            <span>Sign out</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isBusiness = profile?.accountType === 'business';
    const initials = profile ? `${profile.firstName.slice(0, 1)}${profile.lastName.slice(0, 1)}`.toUpperCase() : 'US';
    const profileName = isBusiness ? (profile?.companyLegalName || 'Company') : `${profile?.firstName} ${profile?.lastName}`;

    // KYC Status sidebar formatting
    let kycBadge = '✕ KYC Unverified';
    let badgeColor = 'text-rose-400 border-rose-500/10 bg-rose-500/5';
    if (profile?.kycStatus === 'approved') {
        kycBadge = isBusiness ? '✓ KYB Verified' : '✓ KYC Verified';
        badgeColor = 'text-emerald-400 border-emerald-500/10 bg-emerald-500/5';
    } else if (profile?.kycStatus === 'pending') {
        kycBadge = '⚠ KYC Under Review';
        badgeColor = 'text-orange-400 border-orange-500/10 bg-orange-500/5';
    } else if (profile?.kycStatus === 'rejected') {
        kycBadge = '✕ KYC Rejected';
        badgeColor = 'text-rose-455 border-rose-500/10 bg-rose-500/5';
    }

    return (
        <div className="h-screen w-screen bg-[#050816] text-white flex overflow-hidden">

            {/* Left Fixed Navigation Sidebar */}
            <aside className="hidden lg:flex w-[260px] border-r border-white/5 bg-[#080E1E] flex-col justify-between p-6 select-none shrink-0 h-full">
                <div className="space-y-8">
                    {/* Brand Logo */}
                    <div>
                        <Link href="/dashboard">
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
                            href="/settings"
                            className={cn(
                                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 focus:outline-none",
                                pathname.startsWith('/settings')
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
                    {/* Profile verification indicator */}
                    <div
                        onClick={() => router.push('/settings')}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition"
                    >
                        <div className="flex items-center space-x-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center text-primary-400 shrink-0">
                                <span className="font-bold text-xs font-satoshi">{isBusiness ? '🏢' : '👤'}</span>
                            </div>
                            <div className="text-left min-w-0">
                                <h4 className="text-xs font-bold text-white truncate max-w-[110px]">{profileName}</h4>
                                <span className={cn("text-[9px] font-bold uppercase tracking-wider block mt-0.5 border px-1 py-0.5 rounded-sm truncate", badgeColor)}>
                                    {kycBadge}
                                </span>
                            </div>
                        </div>
                        <svg className="h-3.5 w-3.5 text-slate-500 fill-current shrink-0" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                    </div>

                    {/* Support & Logout */}
                    <div className="space-y-1">
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-xs font-semibold text-rose-455 hover:text-rose-350 transition rounded-lg"
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
                <header className="h-20 border-b border-white/5 px-6 lg:px-8 flex items-center justify-between lg:justify-end sticky top-0 bg-[#050816]/80 backdrop-blur z-30 select-none shrink-0">

                    {/* Brand Logo on Mobile Left */}
                    <div className="lg:hidden shrink-0">
                        <Link href="/dashboard">
                            <Image
                                src="/DFXLogo.svg"
                                alt="DigitalCap Logo"
                                width={115}
                                height={24}
                                className="h-6 w-auto object-contain cursor-pointer"
                            />
                        </Link>
                    </div>

                    {/* Notification & Avatar controls + Hamburger beside it on Mobile */}
                    <div className="flex items-center space-x-3 lg:space-x-4">
                        <Link
                            href="/settings/notifications"
                            className="relative w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition"
                        >
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary-400"></span>
                        </Link>

                        <Link
                            href="/settings"
                            className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center font-bold text-white text-xs select-none hover:opacity-90 transition cursor-pointer active:scale-95"
                        >
                            {initials}
                        </Link>

                        {/* Mobile Menu Toggle Button (Beside Avatar) */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition duration-200"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>

                </header>

                {/* Banner notice for unverified KYC status */}
                {profile && profile.kycStatus !== 'approved' && (
                    <div className={cn(
                        "px-8 py-3.5 border-b flex items-center justify-between text-xs font-semibold select-none animate-in slide-in-from-top duration-300",
                        profile.kycStatus === 'pending'
                            ? "bg-amber-500/5 border-amber-500/10 text-amber-400"
                            : "bg-rose-500/5 border-rose-500/10 text-rose-455"
                    )}>
                        <div className="flex items-center space-x-3.5">
                            <ShieldWarning className="h-5 w-5 shrink-0" />
                            <p>
                                {profile.kycStatus === 'pending'
                                    ? 'Identity verification is currently under compliance review. Transfers, exchanges, and top-ups will remain locked until verified.'
                                    : 'Identity Verification Required. Please submit compliance documentation to activate treasury actions, stablecoin sends, and exchanges.'}
                            </p>
                        </div>
                        {profile.kycStatus !== 'pending' && (
                            <Link
                                href="/settings/verification"
                                className="px-4.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 text-white transition font-bold shrink-0 text-[10.5px] uppercase tracking-wider"
                            >
                                Verify Now
                            </Link>
                        )}
                    </div>
                )}

                {/* Inner Pages Content */}
                <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 flex-grow overflow-y-auto">
                    {children}
                </div>

                {/* Global Action Sheets */}
                <SendMoneySheet />
                <ReceiveMoneySheet />
                <FundCardSheet />
                <NewCardSheet />
                <PhoneSendSheet />

            </div>

            {/* Mobile Sidebar Overlay Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative w-[280px] bg-[#080E1E] border-r border-white/5 flex flex-col justify-between p-6 h-full select-none animate-in slide-in-from-left duration-300 shadow-2xl">
                        <div className="space-y-8">
                            {/* Brand Logo & Close Button */}
                            <div className="flex items-center justify-between">
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                    <Image
                                        src="/DFXLogo.svg"
                                        alt="DigitalCap Logo"
                                        width={130}
                                        height={28}
                                        className="h-7 w-auto object-contain cursor-pointer"
                                    />
                                </Link>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Navigation Items */}
                            <div className="space-y-1.5">
                                {SIDEBAR_LINKS.map((link) => {
                                    const IconComponent = link.icon;
                                    const active = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
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
                                    href="/settings"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 focus:outline-none",
                                        pathname.startsWith('/settings')
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
                            {/* Profile verification indicator */}
                            <div
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    router.push('/settings');
                                }}
                                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition"
                            >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center text-primary-400 shrink-0">
                                        <span className="font-bold text-xs font-satoshi">{isBusiness ? '🏢' : '👤'}</span>
                                    </div>
                                    <div className="text-left min-w-0">
                                        <h4 className="text-xs font-bold text-white truncate max-w-[110px]">{profileName}</h4>
                                        <span className={cn("text-[9px] font-bold uppercase tracking-wider block mt-0.5 border px-1 py-0.5 rounded-sm truncate", badgeColor)}>
                                            {kycBadge}
                                        </span>
                                    </div>
                                </div>
                                <svg className="h-3.5 w-3.5 text-slate-500 fill-current shrink-0" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </div>

                            {/* Support & Logout */}
                            <div className="space-y-1">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center space-x-3 px-4 py-2 text-xs font-semibold text-rose-455 hover:text-rose-350 transition rounded-lg"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Sign out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
