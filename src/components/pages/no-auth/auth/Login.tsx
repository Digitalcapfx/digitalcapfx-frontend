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

    // React Query Login Mutation
    const loginMutation = useMutation({
        mutationFn: (payload: LoginRequest) => authService.login(payload),
        onSuccess: (data) => {
            if (data?.success) {
                toast.success('Logged in successfully!');
                router.push('/dashboard');
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
                loading={loginMutation.isPending}
            />
        </AuthLayout>
    )
}

export default Login
