'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Lock } from 'lucide-react'
import { getCountries } from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en.json'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Select, SelectOption } from '@/components/ui/Select'
import { PhoneInput } from '@/components/ui/PhoneInput'

const enLabels = en as Record<string, string>;

const GoogleIcon = () => (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
)

const COUNTRY_OPTIONS: SelectOption[] = getCountries()
    .map((countryCode) => ({
        value: countryCode,
        label: enLabels[countryCode] || countryCode,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

interface RegisterFormProps {
    fullName: string;
    setFullName: (name: string) => void;
    email: string;
    setEmail: (email: string) => void;
    phone: string;
    setPhone: (phone: string) => void;
    phoneError: string;
    password: string;
    setPassword: (password: string) => void;
    country: string;
    setCountry: (country: string) => void;
    agree: boolean;
    setAgree: (checked: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
    fullName,
    setFullName,
    email,
    setEmail,
    phone,
    setPhone,
    phoneError,
    password,
    setPassword,
    country,
    setCountry,
    agree,
    setAgree,
    onSubmit,
}) => {
    return (
        <div className="space-y-6">
            {/* Header info */}
            <div>
                <span className="text-[10px] font-bold text-primary-400 tracking-[0.2em] uppercase font-mono block mb-2 select-none">
                    Get Started Free
                </span>
                <h1 className="font-satoshi font-black text-3xl text-white tracking-tight">
                    Create your account
                </h1>
                <p className="text-slate-400 text-sm mt-2 font-sans select-none">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary-400 font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>

            {/* Google OAuth Option */}
            <div>
                <button 
                    type="button"
                    className="w-full h-[52px] rounded-full border border-white/10 flex items-center justify-center space-x-3 text-white hover:bg-white/5 hover:border-white/20 transition duration-200 text-sm font-semibold select-none font-sans active:scale-[0.98]"
                >
                    <GoogleIcon />
                    <span>Sign up with Google</span>
                </button>
            </div>

            {/* Divider */}
            <div className="relative flex py-2 items-center select-none">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-[9px] font-bold uppercase tracking-widest text-slate-550 font-sans">
                    or with email
                </span>
                <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Registration Form */}
            <form onSubmit={onSubmit} className="space-y-4">
                
                {/* Full Name */}
                <Input 
                    required
                    label="Full name*"
                    placeholder="Peter Adeyemi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

                {/* Email */}
                <Input 
                    required
                    type="email"
                    label="Email*"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Phone Number */}
                <PhoneInput
                    required
                    label="Phone number*"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={setPhone}
                    error={phoneError}
                />

                {/* Password */}
                <div className="space-y-1.5">
                    <Input 
                        required
                        type="password"
                        label="Password*"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* Strength Bar */}
                    <div className="flex space-x-1.5 mt-2 select-none">
                        <div className={`h-1.5 flex-grow rounded ${password.length >= 8 ? 'bg-emerald-500' : 'bg-[#252F48]'}`}></div>
                        <div className={`h-1.5 flex-grow rounded ${password.length >= 10 && /[A-Z]/.test(password) ? 'bg-emerald-500' : 'bg-[#252F48]'}`}></div>
                        <div className={`h-1.5 flex-grow rounded ${password.length >= 12 && /[0-9]/.test(password) ? 'bg-emerald-500' : 'bg-[#252F48]'}`}></div>
                        <div className={`h-1.5 flex-grow rounded ${password.length >= 14 && /[^A-Za-z0-9]/.test(password) ? 'bg-emerald-500' : 'bg-[#252F48]'}`}></div>
                    </div>
                </div>

                {/* Searchable Select Country Dropdown */}
                <Select 
                    required
                    label="Country*"
                    placeholder="Select country..."
                    value={country}
                    onChange={setCountry}
                    options={COUNTRY_OPTIONS}
                />

                {/* Terms of Service Checkbox */}
                <div className="flex items-start space-x-2.5 pt-2 select-none">
                    <div className="mt-0.5">
                        <Checkbox 
                            checked={agree}
                            onChange={setAgree}
                        />
                    </div>
                    <label 
                        className="text-xs font-semibold text-slate-400 cursor-pointer font-sans leading-relaxed"
                    >
                        I agree to the{' '}
                        <Link href="/terms" className="text-primary-400 hover:underline">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-primary-400 hover:underline">
                            Privacy Policy
                        </Link>
                    </label>
                </div>

                {/* Action button */}
                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full rounded-full h-[52px] font-semibold shadow-lg shadow-primary-500/10 text-base"
                        rightIcon={<ArrowRight className="h-5 w-5" />}
                    >
                        Create account
                    </Button>
                </div>

            </form>

            {/* FCA authorization badge footer */}
            <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500 font-bold tracking-wide select-none pt-4 font-sans text-center">
                <Lock className="h-3 w-3 stroke-[2.5]" />
                <span>FCA authorised • No credit card required • Free to start</span>
            </div>
        </div>
    )
}

export default RegisterForm
