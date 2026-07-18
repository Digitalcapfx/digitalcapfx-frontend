'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, ShieldCheck, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { OtpInput } from '@/components/ui/OtpInput'
import { Tabs } from '@/components/ui/Tabs'
import { PhoneInput } from '@/components/ui/PhoneInput'
import AuthLayout from '@/components/pages/no-auth/layout/AuthLayout'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { toast } from 'sonner'
import { isValidPhoneNumber } from 'react-phone-number-input'

const ForgotPassword = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'email' | 'phone'>('phone');
    const usePhone = activeTab === 'phone';
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [code, setCode] = useState('');
    const [newPin, setNewPin] = useState('');
    const [step, setStep] = useState<'request' | 'reset'>('request');
    const [errorMsg, setErrorMsg] = useState('');

    const forgotPasswordTabs = [
        { id: 'phone', label: 'Phone number' },
        { id: 'email', label: 'Email address' },
    ];

    // Form field errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    const clearFieldError = (field: string) => {
        if (errors[field]) {
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    // React Query Mutations
    const forgotPinMutation = useMutation({
        mutationFn: (emailOrPhone: string) => authService.forgotPin(emailOrPhone),
        onSuccess: (data) => {
            if (data?.success) {
                toast.success('Verification code sent successfully!');
                setStep('reset');
            } else {
                const rawError = data?.error;
                const msg = typeof rawError === 'object'
                    ? (rawError.message || JSON.stringify(rawError))
                    : (rawError || 'Failed to request reset OTP.');
                setErrorMsg(msg);
                toast.error(msg);
            }
        },
        onError: (err: any) => {
            console.error('Forgot PIN Error:', err);
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object'
                ? (rawError.message || JSON.stringify(rawError))
                : (rawError || err.response?.data?.message || 'Failed to request verification code.');
            setErrorMsg(msg);
            toast.error(msg);
        }
    });

    const resetPinMutation = useMutation({
        mutationFn: (payload: { emailOrPhone: string; code: string; newPin: string }) =>
            authService.resetPin(payload),
        onSuccess: (data) => {
            if (data?.success) {
                toast.success('PIN reset successfully! Please sign in with your new PIN.');
                router.push('/login');
            } else {
                const rawError = data?.error;
                const msg = typeof rawError === 'object'
                    ? (rawError.message || JSON.stringify(rawError))
                    : (rawError || 'Reset PIN failed.');
                setErrorMsg(msg);
                toast.error(msg);
            }
        },
        onError: (err: any) => {
            console.error('Reset PIN Error:', err);
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object'
                ? (rawError.message || JSON.stringify(rawError))
                : (rawError || err.response?.data?.message || 'Failed to reset PIN.');
            setErrorMsg(msg);
            toast.error(msg);
        }
    });

    const handleRequestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (usePhone) {
            if (!phone) {
                setErrors({ phone: 'Phone number is required' });
                return;
            }
            if (!isValidPhoneNumber(phone)) {
                setErrors({ phone: 'Please enter a valid phone number' });
                return;
            }
            setErrors({});
            setEmailOrPhone(phone);
            forgotPinMutation.mutate(phone);
        } else {
            const trimmedEmail = email.trim();
            if (!trimmedEmail) {
                setErrors({ email: 'Email address is required' });
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmedEmail)) {
                setErrors({ email: 'Please enter a valid email address' });
                return;
            }
            setErrors({});
            setEmailOrPhone(trimmedEmail);
            forgotPinMutation.mutate(trimmedEmail);
        }
    };

    const handleResetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        const newErrors: Record<string, string> = {};
        if (code.length !== 6) {
            newErrors.code = 'Please enter the 6-digit verification code';
        }
        if (!newPin.trim()) {
            newErrors.newPin = 'New PIN is required';
        } else if (newPin.length !== 6) {
            newErrors.newPin = 'New PIN must be exactly 6 digits';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        resetPinMutation.mutate({
            emailOrPhone: emailOrPhone.trim(),
            code,
            newPin: newPin.trim(),
        });
    };

    return (
        <AuthLayout>
            {step === 'request' ? (
                /* Phase 1: Request OTP Code */
                <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                        <Link
                            href="/login"
                            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-350 transition-colors font-sans select-none"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to sign in</span>
                        </Link>
                    </div>

                    <div className="relative w-fit">
                        <div className="absolute inset-0 rounded-2xl bg-primary-500/20 blur-[20px]"></div>
                        <div className="relative w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-primary-400">
                            {usePhone ? <Phone className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="font-satoshi font-black text-3xl text-white tracking-tight">
                            Forgot your PIN?
                        </h1>
                        <p className="text-[#6D778A] text-sm font-sans leading-relaxed">
                            Enter the email address or phone number linked to your account and we'll send you a verification code.
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs font-semibold text-rose-455 font-sans leading-relaxed select-none">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleRequestSubmit} className="space-y-5">
                        <div className="w-full flex justify-center pb-1">
                            <Tabs
                                tabs={forgotPasswordTabs}
                                activeTab={activeTab}
                                onChange={(id) => {
                                    setActiveTab(id as 'email' | 'phone');
                                    setErrors({});
                                    setErrorMsg('');
                                }}
                                className="w-full grid grid-cols-2 text-center"
                            />
                        </div>

                        {usePhone ? (
                            <PhoneInput
                                required
                                label="Phone number*"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={(val) => {
                                    setPhone(val);
                                    clearFieldError('phone');
                                }}
                                error={errors.phone}
                            />
                        ) : (
                            <Input
                                required
                                type="email"
                                label="Email address*"
                                placeholder="you@email.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    clearFieldError('email');
                                }}
                                error={errors.email}
                            />
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={forgotPinMutation.isPending}
                            className="w-full rounded-full h-[52px] font-semibold text-base"
                            rightIcon={<ArrowRight className="h-5 w-5" />}
                        >
                            {forgotPinMutation.isPending ? 'Sending...' : 'Send reset code'}
                        </Button>
                    </form>

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
                /* Phase 2: Verify OTP & Enter New PIN */
                <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                        <button
                            onClick={() => {
                                setStep('request');
                                setCode('');
                                setNewPin('');
                                setErrors({});
                                setErrorMsg('');
                            }}
                            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-355 transition-colors font-sans select-none"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Change email/phone</span>
                        </button>
                    </div>

                    <div className="relative w-fit">
                        <div className="absolute inset-0 rounded-2xl bg-cyan-500/20 blur-[20px]"></div>
                        <div className="relative w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="font-satoshi font-black text-3xl text-white tracking-tight">
                            Reset your PIN
                        </h1>
                        <p className="text-[#6D778A] text-sm font-sans leading-relaxed">
                            We've sent a 6-digit code to <strong className="text-white font-bold">{emailOrPhone}</strong>. Enter it below along with your new PIN.
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs font-semibold text-rose-400 font-sans leading-relaxed select-none">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleResetSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 block tracking-wide select-none">
                                Verification Code*
                            </label>
                            <div className="max-w-[340px] flex py-1">
                                <OtpInput
                                    value={code}
                                    onChange={(val) => {
                                        setCode(val);
                                        clearFieldError('code');
                                    }}
                                    length={6}
                                />
                            </div>
                            {errors.code && (
                                <p className="text-xs text-red-500 font-semibold mt-1">
                                    {errors.code}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Input
                                required
                                type="password"
                                label="New 6-Digit PIN*"
                                placeholder="Enter new 6-digit PIN"
                                maxLength={6}
                                value={newPin}
                                onChange={(e) => {
                                    const cleaned = e.target.value.replace(/\D/g, '');
                                    setNewPin(cleaned);
                                    clearFieldError('newPin');
                                }}
                                error={errors.newPin}
                            />
                            <span className="text-[10px] text-slate-500 font-semibold block select-none">
                                Pin code must be 6 numeric digits for rapid authentication.
                            </span>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={resetPinMutation.isPending}
                            className="w-full rounded-full h-[52px] font-semibold text-base"
                            rightIcon={<ArrowRight className="h-5 w-5" />}
                        >
                            {resetPinMutation.isPending ? 'Resetting PIN...' : 'Reset PIN'}
                        </Button>
                    </form>
                </div>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
