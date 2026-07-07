'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { OtpInput } from '@/components/ui/OtpInput'

interface VerifyEmailFormProps {
    email: string;
    onBack: () => void;
    onSubmit: (e: React.FormEvent) => void;
    code: string;
    setCode: (code: string) => void;
}

const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({
    email,
    onBack,
    onSubmit,
    code,
    setCode,
}) => {
    const [timer, setTimer] = useState(292); // 04:52

    // Countdown Timer Loop
    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (sec: number) => {
        const mins = Math.floor(sec / 60);
        const secs = sec % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            {/* Back link */}
            <div>
                <button 
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-350 transition-colors font-sans select-none"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                </button>
            </div>

            {/* Glowing Shield Checkmark Icon */}
            <div className="relative w-fit">
                <div className="absolute inset-0 rounded-2xl bg-[#2F80FF]/20 blur-[20px]"></div>
                <div className="relative w-12 h-12 rounded-2xl bg-[#2F80FF]/10 border border-[#2F80FF]/25 flex items-center justify-center text-primary-400">
                    <ShieldCheck className="h-5 w-5 text-primary-400" />
                </div>
            </div>

            {/* Header info */}
            <div className="space-y-2">
                <h1 className="font-satoshi font-black text-3xl text-white tracking-tight">
                    Verify your email
                </h1>
                <p className="text-slate-400 text-sm font-sans leading-relaxed">
                    We sent a 6-digit code to <br />
                    <strong className="text-white font-bold font-mono">{email}</strong>
                </p>
            </div>

            {/* Code Inputs Grid */}
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="max-w-[340px] flex justify-center py-2">
                    <OtpInput 
                        value={code}
                        onChange={setCode}
                        length={6}
                    />
                </div>

                {/* Action verification CTA */}
                <Button
                    type="submit"
                    variant="primary"
                    disabled={code.length !== 6}
                    className="w-full rounded-full h-[52px] font-semibold text-base shadow-lg shadow-primary-500/10"
                >
                    Verify email
                </Button>
            </form>

            {/* Timer Footer */}
            <div className="flex justify-between items-center text-xs font-semibold select-none pt-2 font-sans text-slate-500">
                <div>
                    Code expires in <span className="text-white font-mono">{formatTime(timer)}</span>
                </div>
                {timer > 0 ? (
                    <span className="text-slate-650">Resend code</span>
                ) : (
                    <button 
                        onClick={() => setTimer(300)}
                        className="text-primary-400 hover:underline cursor-pointer"
                    >
                        Resend code
                    </button>
                )}
            </div>

            {/* Expiration subtext */}
            <div className="text-center lg:text-left select-none pt-4 border-t border-white/5 font-sans">
                <p className="text-[10px] font-bold text-slate-550 uppercase tracking-wide">
                    Check your spam folder if you don't see the email.
                </p>
            </div>
        </div>
    )
}

export default VerifyEmailForm
