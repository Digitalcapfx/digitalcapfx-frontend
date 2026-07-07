'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from './LoginForm'
import TwoFactorForm from './TwoFactorForm'
import AuthLayout from '@/components/pages/no-auth/layout/AuthLayout'

const Login = () => {
    const router = useRouter();
    const [step, setStep] = useState<'form' | '2fa'>('form');

    // State parameters passed to children
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [mfaCode, setMfaCode] = useState('');

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            setStep('2fa');
        }
    };

    const handleMfaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/dashboard');
    };

    return (
        <AuthLayout>
            {step === 'form' ? (
                <LoginForm 
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    rememberMe={rememberMe}
                    setRememberMe={setRememberMe}
                    onSubmit={handleLoginSubmit}
                />
            ) : (
                <TwoFactorForm 
                    email={email}
                    onBack={() => {
                        setStep('form');
                        setMfaCode('');
                    }}
                    onSubmit={handleMfaSubmit}
                    mfaCode={mfaCode}
                    setMfaCode={setMfaCode}
                />
            )}
        </AuthLayout>
    )
}

export default Login
