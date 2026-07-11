'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Lock } from 'lucide-react'
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
    loading
}) => {
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
                        <Link href="/forgot-password" className="text-[11px] font-semibold text-slate-500 hover:text-slate-350 hover:underline">
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
                        className="w-full rounded-full h-[52px] font-semibold shadow-lg shadow-primary-500/10 text-base"
                        rightIcon={<ArrowRight className="h-5 w-5" />}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </div>

            </form>

            {/* Encryption badge footer */}
            <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500 font-bold tracking-wide select-none pt-4 font-sans">
                <Lock className="h-3 w-3 stroke-[2.5]" />
                <span>Secured with 256-bit AES encryption • FCA authorised</span>
            </div>
        </div>
    )
}

export default LoginForm
