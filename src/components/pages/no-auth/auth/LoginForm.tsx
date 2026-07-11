'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Lock, ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'

interface LoginFormProps {
    phone: string;
    setPhone: (phone: string) => void;
    phoneError: string;
    pin: string;
    setPin: (pin: string) => void;
    rememberMe: boolean;
    setRememberMe: (checked: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    errorMsg?: string;
    loading?: boolean;

    // 2FA login fields
    is2FA?: boolean;
    otpCode?: string;
    setOtpCode?: (code: string) => void;
    on2FASubmit?: (e: React.FormEvent) => void;
    onCancel2FA?: () => void;

    // Google OAuth actions
    onGoogleSubmit?: () => void;
    googleLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
    phone,
    setPhone,
    phoneError,
    pin,
    setPin,
    rememberMe,
    setRememberMe,
    onSubmit,
    errorMsg,
    loading,

    is2FA = false,
    otpCode = '',
    setOtpCode,
    on2FASubmit,
    onCancel2FA,

    onGoogleSubmit,
    googleLoading = false
}) => {
    if (is2FA) {
        return (
            <div className="space-y-6 text-left animate-in fade-in duration-200">
                <div>
                    <span className="text-[10px] font-bold text-primary-400 tracking-[0.2em] uppercase font-mono block mb-2 select-none">
                        MFA Verification
                    </span>
                    <h1 className="font-satoshi font-black text-3xl text-white tracking-tight">
                        Two-Factor Authentication
                    </h1>
                    <p className="text-slate-400 text-sm mt-2 font-sans select-none">
                        Enter the 6-digit confirmation code from your authenticator app to complete your session sign-in.
                    </p>
                </div>

                {errorMsg && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs font-semibold text-rose-450 font-sans leading-relaxed select-none">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={on2FASubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Verification code</label>
                        <input 
                            type="text"
                            maxLength={6}
                            required
                            value={otpCode}
                            onChange={(e) => setOtpCode && setOtpCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            className="bg-black/45 border border-white/10 rounded-xl px-4 py-3.5 text-center text-sm font-bold text-white placeholder-slate-700 tracking-[0.4em] focus:outline-none focus:border-primary-500/50 w-full font-mono"
                        />
                    </div>

                    <div className="flex space-x-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onCancel2FA}
                            className="w-1/2 rounded-xl h-11 text-xs"
                            leftIcon={<ArrowLeft className="h-4 w-4" />}
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={otpCode.length !== 6 || loading}
                            className="w-1/2 rounded-xl h-11 text-xs"
                        >
                            {loading ? 'Verifying...' : 'Verify & Sign In'}
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header info */}
            <div>
                <span className="text-[10px] font-bold text-primary-400 tracking-[0.2em] uppercase font-mono block mb-2 select-none">
                    Welcome Back
                </span>
                <h1 className="font-satoshi font-black text-3xl text-white tracking-tight">
                    Sign in to your account
                </h1>
                <p className="text-slate-400 text-sm mt-2 font-sans select-none">
                    Don't have an account?{' '}
                    <Link href="/get-started" className="text-primary-400 font-semibold hover:underline">
                        Create one free
                    </Link>
                </p>
            </div>

            {errorMsg && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs font-semibold text-rose-450 font-sans leading-relaxed select-none text-left">
                    {errorMsg}
                </div>
            )}

            {/* Login Form */}
            <form onSubmit={onSubmit} className="space-y-5 text-left">
                
                {/* Phone Field */}
                <PhoneInput
                    required
                    label="Phone number*"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={setPhone}
                    error={phoneError}
                />

                {/* PIN Field */}
                <div className="space-y-1.5 relative">
                    <div className="absolute right-0 top-0 select-none z-10">
                        <Link href="/forgot-password" className="text-[11px] font-semibold text-slate-500 hover:text-slate-355 hover:underline">
                            Forgot PIN?
                        </Link>
                    </div>
                    <Input 
                        required
                        type="password"
                        label="PIN (6 Digits)*"
                        placeholder="Enter your 6-digit PIN"
                        maxLength={6}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    />
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2.5 pt-1 select-none">
                    <Checkbox 
                        checked={rememberMe}
                        onChange={setRememberMe}
                    />
                    <label 
                        className="text-xs font-semibold text-slate-400 cursor-pointer font-sans"
                    >
                        Remember me for 30 days
                    </label>
                </div>

                {/* Action button */}
                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="w-full rounded-xl h-[52px] font-bold text-base shadow-lg shadow-primary-500/10"
                        rightIcon={<ArrowRight className="h-5 w-5" />}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </div>

            </form>

            {/* Google Social Divider */}
            {onGoogleSubmit && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between select-none">
                        <div className="h-[1px] bg-white/5 flex-1"></div>
                        <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest px-3 font-mono">Or continue with</span>
                        <div className="h-[1px] bg-white/5 flex-1"></div>
                    </div>
                    
                    <button
                        type="button"
                        onClick={onGoogleSubmit}
                        disabled={googleLoading}
                        className="w-full h-12 rounded-xl bg-[#0C1224] hover:bg-[#111930] text-slate-300 hover:text-white font-bold text-xs border border-white/5 flex items-center justify-center space-x-2.5 transition duration-200 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50"
                    >
                        {googleLoading ? (
                            <RefreshCw className="h-4 w-4 animate-spin text-primary-400" />
                        ) : (
                            <>
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.472 0-6.29-2.818-6.29-6.29 0-3.472 2.818-6.29 6.29-6.29 1.506 0 2.88.533 3.96 1.417l3.056-3.056C18.995 2.19 15.82 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.74-4.246 10.74-10.74 0-.482-.043-.956-.12-1.422H12.24z"/>
                                </svg>
                                <span>Continue with Google</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Encryption badge footer */}
            <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500 font-bold tracking-wide select-none pt-4 font-sans">
                <Lock className="h-3 w-3 stroke-[2.5]" />
                <span>Secured with 256-bit AES encryption • FCA authorised</span>
            </div>
        </div>
    )
}

export default LoginForm
