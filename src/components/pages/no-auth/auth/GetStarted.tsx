'use client'

import React, { useEffect } from 'react'
import AuthLayout from '@/components/pages/no-auth/layout/AuthLayout'
import { useRegisterStore } from '@/store/registerStore'
import { AccountTypeStep } from './get-started/AccountTypeStep'
import { BusinessDetailsStep } from './get-started/BusinessDetailsStep'
import { CredentialsStep } from './get-started/CredentialsStep'
import { VerifyEmailStep } from './get-started/VerifyEmailStep'
import { DoneStep } from './get-started/DoneStep'

const GetStarted = () => {
    const { step, reset } = useRegisterStore();

    // Reset store data when user unmounts/leaves the signup page
    useEffect(() => {
        return () => {
            reset();
        };
    }, [reset]);

    return (
        <AuthLayout>
            {step === 'account-type' && <AccountTypeStep />}
            {step === 'business-details' && <BusinessDetailsStep />}
            {step === 'credentials' && <CredentialsStep />}
            {step === 'verify' && <VerifyEmailStep />}
            {step === 'done' && <DoneStep />}
        </AuthLayout>
    );
};

export default GetStarted;
