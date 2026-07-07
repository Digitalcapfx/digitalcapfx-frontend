'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { isValidPhoneNumber } from 'react-phone-number-input'
import RegisterForm from './RegisterForm'
import VerifyEmailForm from './VerifyEmailForm'
import AuthLayout from '@/components/pages/no-auth/layout/AuthLayout'

const GetStarted = () => {
    const router = useRouter();
    // Stage controller
    const [step, setStep] = useState<'form' | 'verify'>('form');

    // States passed to children
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [password, setPassword] = useState('');
    const [country, setCountry] = useState('');
    const [agree, setAgree] = useState(false);
    const [code, setCode] = useState('');

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!phone) {
            setPhoneError('Phone number is required');
            return;
        }

        if (!isValidPhoneNumber(phone)) {
            setPhoneError('Please enter a valid phone number');
            return;
        }

        setPhoneError('');

        if (fullName && email && phone && password && country && agree) {
            setStep('verify');
        }
    };

    const handleVerifySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/dashboard');
    };

    return (
        <AuthLayout>
            {step === 'form' ? (
                <RegisterForm 
                    fullName={fullName}
                    setFullName={setFullName}
                    email={email}
                    setEmail={setEmail}
                    phone={phone}
                    setPhone={setPhone}
                    phoneError={phoneError}
                    password={password}
                    setPassword={setPassword}
                    country={country}
                    setCountry={setCountry}
                    agree={agree}
                    setAgree={setAgree}
                    onSubmit={handleFormSubmit}
                />
            ) : (
                <VerifyEmailForm 
                    email={email}
                    onBack={() => {
                        setStep('form');
                        setCode('');
                    }}
                    onSubmit={handleVerifySubmit}
                    code={code}
                    setCode={setCode}
                />
            )}
        </AuthLayout>
    )
}

export default GetStarted
