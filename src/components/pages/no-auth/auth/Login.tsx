'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from './LoginForm'
import AuthLayout from '@/components/pages/no-auth/layout/AuthLayout'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { authService, LoginRequest } from '@/services/auth.service'

const Login = () => {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [pin, setPin] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // 2FA login state variables
    const [is2FA, setIs2FA] = useState(false);
    const [totpRef, setTotpRef] = useState('');
    const [otpCode, setOtpCode] = useState('');

    // 1. React Query Login Mutation
    const loginMutation = useMutation({
        mutationFn: (payload: LoginRequest) => authService.login(payload),
        onSuccess: (data) => {
            if (data?.success) {
                // Check if user has 2FA enabled and requires verification
                if (data.data?.twoFactorRequired) {
                    setTotpRef(data.data.totpRef || '');
                    setIs2FA(true);
                    toast.info('2FA verification code required.');
                } else {
                    toast.success('Logged in successfully!');
                    if (data?.data?.accountType) {
                        localStorage.setItem('account_type', data.data.accountType);
                    }
                    router.push('/dashboard');
                }
            } else {
                const rawError = data?.error;
                const msg = typeof rawError === 'object'
                    ? (rawError.message || JSON.stringify(rawError))
                    : (rawError || 'Invalid phone number or PIN');
                setErrorMsg(msg);
                toast.error(msg);
            }
        },
        onError: (err: any) => {
            console.error('Login error:', err);
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object'
                ? (rawError.message || JSON.stringify(rawError))
                : (rawError || err.response?.data?.message || 'Authentication failed. Please verify your credentials.');
            setErrorMsg(msg);
            toast.error(msg);
        }
    });

    // 2. React Query 2FA Complete Login Mutation
    const login2FAMutation = useMutation({
        mutationFn: (payload: { ref: string; code: string }) => authService.login2FA(payload.ref, payload.code),
        onSuccess: (data) => {
            toast.success('MFA verification successful! Logged in.');
            if (data?.data?.accountType) {
                localStorage.setItem('account_type', data.data.accountType);
            }
            router.push('/dashboard');
        },
        onError: (err: any) => {
            console.error('MFA validation error:', err);
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object'
                ? (rawError.message || JSON.stringify(rawError))
                : (rawError || err.response?.data?.message || 'Invalid 2FA code.');
            setErrorMsg(msg);
            toast.error(msg);
        }
    });

    // 3. React Query Google Sign-In Mutation
    const googleLoginMutation = useMutation({
        mutationFn: (token: string) => authService.loginGoogle(token),
        onSuccess: (data) => {
            toast.success('Signed in with Google successfully!');
            if (data?.data?.accountType) {
                localStorage.setItem('account_type', data.data.accountType);
            }
            router.push('/dashboard');
        },
        onError: (err: any) => {
            console.error('Google Sign-In error:', err);
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object'
                ? (rawError.message || JSON.stringify(rawError))
                : (rawError || err.response?.data?.message || 'Google OAuth failed.');
            setErrorMsg(msg);
            toast.error(msg);
        }
    });

    // Handlers
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setPhoneError('');

        if (!phone) {
            setPhoneError('Phone number is required');
            return;
        }

        if (!isValidPhoneNumber(phone)) {
            setPhoneError('Please enter a valid phone number');
            return;
        }

        if (phone && pin) {
            loginMutation.mutate({ phone, pin });
        }
    };

    const handle2FASubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        if (totpRef && otpCode.length === 6) {
            login2FAMutation.mutate({ ref: totpRef, code: otpCode });
        }
    };

    const handleGoogleSubmit = () => {
        setErrorMsg('');
        // Trigger with a mock Google OAuth token representing the third-party client session
        googleLoginMutation.mutate('google_oauth_desktop_client_token_2026');
    };

    const handleCancel2FA = () => {
        setIs2FA(false);
        setOtpCode('');
        setTotpRef('');
        setErrorMsg('');
    };

    const isPending = loginMutation.isPending || login2FAMutation.isPending;

    return (
        <AuthLayout>
            <LoginForm 
                phone={phone}
                setPhone={setPhone}
                phoneError={phoneError}
                pin={pin}
                setPin={setPin}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                onSubmit={handleLoginSubmit}
                errorMsg={errorMsg}
                loading={isPending}
                
                is2FA={is2FA}
                otpCode={otpCode}
                setOtpCode={setOtpCode}
                on2FASubmit={handle2FASubmit}
                onCancel2FA={handleCancel2FA}

                onGoogleSubmit={handleGoogleSubmit}
                googleLoading={googleLoginMutation.isPending}
            />
        </AuthLayout>
    )
}

export default Login
