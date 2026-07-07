'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import AuthLayout from '@/components/pages/no-auth/layout/AuthLayout'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
        }
    };

    return (
        <AuthLayout>
            {!submitted ? (
                /* State 1: Forgot Password Input Form */
                <div className="space-y-6">
                    {/* Back to sign in link at top */}
                    <div>
                        <Link 
                            href="/login" 
                            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-350 transition-colors font-sans select-none"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to sign in</span>
                        </Link>
                    </div>

                    {/* Glowing Mail Envelope Icon */}
                    <div className="relative w-fit">
                        <div className="absolute inset-0 rounded-2xl bg-primary-500/20 blur-[20px]"></div>
                        <div className="relative w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-primary-400">
                            <Mail className="h-5 w-5" />
                        </div>
                    </div>

                    {/* Header info */}
                    <div className="space-y-2">
                        <h1 className="font-satoshi font-black text-3xl text-white tracking-tight">
                            Forgot your password?
                        </h1>
                        <p className="text-slate-400 text-sm font-sans leading-relaxed">
                            No problem. Enter the email address linked to your account and we'll send you a secure reset link.
                        </p>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input 
                            required
                            type="email"
                            label="Email*"
                            placeholder="you@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full rounded-full h-[52px] font-semibold shadow-lg shadow-primary-500/10 text-base"
                            rightIcon={<ArrowRight className="h-5 w-5" />}
                        >
                            Send reset link
                        </Button>
                    </form>

                    {/* Sign in fallback */}
                    <div className="text-center pt-2 select-none">
                        <span className="text-xs font-medium text-slate-500 font-sans">
                            Remembered it?{' '}
                            <Link href="/login" className="text-primary-400 font-semibold hover:underline">
                                Sign in instead
                            </Link>
                        </span>
                    </div>
                </div>
            ) : (
                /* State 2: Check Your Inbox Instruction Card */
                <div className="space-y-6">
                    {/* Glowing Mail Envelope Icon */}
                    <div className="relative w-fit mx-auto lg:mx-0">
                        <div className="absolute inset-0 rounded-2xl bg-cyan-500/15 blur-[20px]"></div>
                        <div className="relative w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                            <Mail className="h-6 w-6" />
                        </div>
                    </div>

                    {/* Header info */}
                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="font-satoshi font-black text-3xl text-white tracking-tight">
                            Check your inbox
                        </h1>
                        <p className="text-slate-400 text-sm font-sans leading-relaxed">
                            We've sent a password reset link to <br />
                            <strong className="text-white font-bold font-mono">{email}</strong>
                        </p>
                    </div>

                    {/* Step Instructions Panel */}
                    <div className="bg-[#0C1224]/50 border border-white/5 rounded-2xl p-5 space-y-4 text-left select-none font-sans">
                        <div className="flex items-start space-x-3.5">
                            <div className="w-5 h-5 rounded-full bg-primary-500/15 flex items-center justify-center text-[10px] font-bold text-primary-400 shrink-0 mt-0.5">
                                1
                            </div>
                            <span className="text-xs font-semibold text-slate-350 leading-relaxed">
                                Open the email from DigitalCap FX
                            </span>
                        </div>
                        <div className="flex items-start space-x-3.5">
                            <div className="w-5 h-5 rounded-full bg-primary-500/15 flex items-center justify-center text-[10px] font-bold text-primary-400 shrink-0 mt-0.5">
                                2
                            </div>
                            <span className="text-xs font-semibold text-slate-350 leading-relaxed">
                                Click "Reset my password" in the email
                            </span>
                        </div>
                        <div className="flex items-start space-x-3.5">
                            <div className="w-5 h-5 rounded-full bg-primary-500/15 flex items-center justify-center text-[10px] font-bold text-primary-400 shrink-0 mt-0.5">
                                3
                            </div>
                            <span className="text-xs font-semibold text-slate-350 leading-relaxed">
                                Choose a new strong password
                            </span>
                        </div>
                    </div>

                    {/* Resend Email Button */}
                    <div className="space-y-4">
                        <button 
                            onClick={() => setSubmitted(false)}
                            className="w-full h-[52px] rounded-full border border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition duration-200 text-sm font-semibold select-none font-sans active:scale-[0.98]"
                        >
                            Resend email
                        </button>

                        <div className="text-center">
                            <Link 
                                href="/login" 
                                className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-350 transition-colors font-sans select-none"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back to sign in</span>
                            </Link>
                        </div>
                    </div>

                    {/* Expiration disclaimer */}
                    <div className="text-center lg:text-left select-none pt-4 border-t border-white/5">
                        <p className="text-[10px] font-bold text-slate-550 tracking-wide uppercase font-sans">
                            Link expires in 30 minutes. Check your spam folder if you don't see it.
                        </p>
                    </div>
                </div>
            )}
        </AuthLayout>
    )
}

export default ForgotPassword
