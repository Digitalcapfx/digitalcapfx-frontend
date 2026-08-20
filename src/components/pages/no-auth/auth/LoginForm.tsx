import React from 'react'
import Link from 'next/link'
import { ArrowRight, Lock, ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { useLanguageStore } from '@/store/languageStore'

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
    const { t } = useLanguageStore();

    if (is2FA) {
        return (
            <div className="space-y-6 text-left animate-in fade-in duration-200">
                <div>
                    <span className="text-[10px] font-bold text-primary-400 tracking-[0.2em] uppercase font-mono block mb-2 select-none">
                        {t('auth.mfa.label', { defaultValue: 'MFA Verification' })}
                    </span>
                    <h1 className="font-satoshi font-black text-3xl text-white tracking-tight">
                        {t('auth.mfa.title', { defaultValue: 'Two-Factor Authentication' })}
                    </h1>
                    <p className="text-slate-400 text-sm mt-2 font-sans select-none">
                        {t('auth.mfa.subtitle', { defaultValue: 'Enter the 6-digit confirmation code from your authenticator app to complete your session sign-in.' })}
                    </p>
                </div>

                {errorMsg && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs font-semibold text-rose-450 font-sans leading-relaxed select-none">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={on2FASubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('auth.mfa.codeLabel', { defaultValue: 'Verification code' })}</label>
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
                            {t('action.back', { defaultValue: 'Back' })}
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={otpCode.length !== 6 || loading}
                            className="w-1/2 rounded-xl h-11 text-xs"
                        >
                            {loading ? t('auth.mfa.verifying', { defaultValue: 'Verifying...' }) : t('auth.mfa.verifyBtn', { defaultValue: 'Verify & Sign In' })}
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
                <span className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] uppercase font-mono block mb-1 select-none">
                    {t('auth.login.welcomeBack', { defaultValue: 'Welcome Back' })}
                </span>
                <h1 className="font-satoshi font-black text-3xl text-white tracking-tight">
                    {t('auth.login.title', { defaultValue: 'Sign in to your account' })}
                </h1>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-1 select-none">
                    <span className="text-slate-350 text-sm font-sans">{t('auth.login.noAccount', { defaultValue: "Don't have an account?" })}</span>
                    <Link 
                        href="/get-started" 
                        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/50 font-bold text-xs transition-all duration-200 shadow-sm shadow-cyan-500/10"
                    >
                        <span>{t('auth.login.createOne', { defaultValue: 'Create one free' })}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>

            {errorMsg && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs font-semibold text-rose-400 font-sans leading-relaxed select-none text-left">
                    {errorMsg}
                </div>
            )}

            {/* Login Form */}
            <form onSubmit={onSubmit} className="space-y-5 text-left">
                
                {/* Phone Field */}
                <PhoneInput
                    required
                    label={t('auth.login.phoneLabel', { defaultValue: 'Phone number*' })}
                    placeholder={t('auth.login.phonePlaceholder', { defaultValue: 'Enter phone number' })}
                    value={phone}
                    onChange={setPhone}
                    error={phoneError}
                />

                {/* PIN Field */}
                <div className="space-y-1.5 relative">
                    <div className="absolute right-0 top-0 select-none z-10">
                        <Link href="/forgot-password" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">
                            {t('auth.login.forgotPin', { defaultValue: 'Forgot PIN?' })}
                        </Link>
                    </div>
                    <Input 
                        required
                        type="password"
                        label={t('auth.login.pinLabel', { defaultValue: 'PIN (6 Digits)*' })}
                        placeholder={t('auth.login.pinPlaceholder', { defaultValue: 'Enter your 6-digit PIN' })}
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
                        className="text-xs font-semibold text-slate-350 cursor-pointer font-sans"
                    >
                        {t('auth.login.rememberMe', { defaultValue: 'Remember me for 30 days' })}
                    </label>
                </div>

                {/* Action button */}
                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="w-full rounded-xl h-[52px] font-bold text-base bg-gradient-to-r from-primary-600 via-primary-500 to-cyan-500 hover:from-primary-500 hover:to-cyan-400 text-white shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                        rightIcon={<ArrowRight className="h-5 w-5" />}
                    >
                        {loading ? t('auth.login.signingIn', { defaultValue: 'Signing in...' }) : t('auth.login.signInBtn', { defaultValue: 'Sign in' })}
                    </Button>
                </div>

            </form>

            {/* Google Social Divider */}
            {onGoogleSubmit && (
                <div className="space-y-4 pt-1">
                    <div className="flex items-center justify-between select-none">
                        <div className="h-[1px] bg-white/10 flex-1"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 font-mono">{t('auth.login.orContinue', { defaultValue: 'Or continue with' })}</span>
                        <div className="h-[1px] bg-white/10 flex-1"></div>
                    </div>
                    
                    <button
                        type="button"
                        onClick={onGoogleSubmit}
                        disabled={googleLoading}
                        className="w-full h-12 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-bold text-xs flex items-center justify-center space-x-3 transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 shadow-md shadow-black/20 group"
                    >
                        {googleLoading ? (
                            <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                        ) : (
                            <>
                                <svg className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                                <span className="tracking-wide">{t('auth.login.googleBtn', { defaultValue: 'Continue with Google' })}</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Encryption badge footer */}
            <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400 font-bold tracking-wide select-none pt-2 font-sans">
                <Lock className="h-3 w-3 stroke-[2.5] text-cyan-400" />
                <span>{t('auth.login.encryption', { defaultValue: 'Secured with 256-bit AES encryption • FCA authorised' })}</span>
            </div>
        </div>
    )
}

export default LoginForm
