import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectOption } from '@/components/ui/Select'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { Checkbox } from '@/components/ui/Checkbox'
import { useRegisterStore } from '@/store/registerStore'
import { getCountries } from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en.json'
import { BusinessStepper } from './BusinessStepper'
import { useMutation } from '@tanstack/react-query'
import { authService, RegisterRequest } from '@/services/auth.service'
import { toast } from 'sonner'
import { isValidPhoneNumber } from 'react-phone-number-input'

const enLabels = en as Record<string, string>;
const COUNTRY_OPTIONS: SelectOption[] = getCountries()
  .map((countryCode) => ({
    value: countryCode,
    label: enLabels[countryCode] || countryCode,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const CredentialsStep: React.FC = () => {
  const {
    accountType,
    firstName,
    lastName,
    email,
    phone,
    pin,
    country,
    agree,
    companyName,
    companyRegNo,
    industry,
    countryOfIncorp,
    annualRevenue,
    website,
    updateCredentials,
    setStep
  } = useRegisterStore();

  const [errorMsg, setErrorMsg] = useState('');

  // Single validation errors state object
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

  // React Query Register Mutation
  const registerMutation = useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success('Registration successful! Please verify your email.');
        setStep('verify');
      } else {
        const rawError = data?.error;
        const msg = typeof rawError === 'object'
          ? (rawError.message || JSON.stringify(rawError))
          : (rawError || 'Registration failed');
        setErrorMsg(msg);
        toast.error(msg);
      }
    },
    onError: (err: any) => {
      console.error('Registration Mutation Error:', err);
      const rawError = err.response?.data?.error;
      const msg = typeof rawError === 'object'
        ? (rawError.message || JSON.stringify(rawError))
        : (rawError || err.response?.data?.message || 'An unexpected error occurred during signup.');
      setErrorMsg(msg);
      toast.error(msg);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const newErrors: Record<string, string> = {};

    // First Name check
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last Name check
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email check
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone check
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhoneNumber(phone)) {
      newErrors.phone = 'Please enter a valid international phone number';
    }

    // PIN check
    if (!pin.trim()) {
      newErrors.pin = 'PIN is required';
    } else if (pin.length !== 6) {
      newErrors.pin = 'PIN must be exactly 6 digits';
    }

    // Country check
    if (!country) {
      newErrors.country = 'Country selection is required';
    }

    // Agree checkbox check
    if (!agree) {
      setErrorMsg('You must agree to the Terms of Service and Privacy Policy');
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0 || !agree) return;

    const registerPayload: RegisterRequest = {
      accountType: accountType || 'individual',
      firstName,
      lastName,
      email,
      phone,
      pin,
      country,
      ...(accountType === 'business' ? {
        companyLegalName: companyName,
        companyRegistrationNo: companyRegNo,
        industry,
        countryOfIncorporation: countryOfIncorp,
        annualRevenue,
        businessWebsite: website || undefined
      } : {})
    };

    registerMutation.mutate(registerPayload);
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
      {accountType === 'business' && <BusinessStepper currentStepIndex={2} />}

      <div>
        <button
          onClick={() => setStep(accountType === 'business' ? 'business-details' : 'account-type')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-350 transition-colors font-sans select-none mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <span className="text-[10px] font-bold text-primary-400 tracking-[0.15em] uppercase font-mono block mb-1.5">
          {accountType === 'business' ? 'Step 3 of 6' : 'Get Started Free'}
        </span>
        <h1 className="font-satoshi font-black text-2xl text-white tracking-tight font-bold">
          {accountType === 'business' ? 'Business owner / director' : 'Create your account'}
        </h1>
        <p className="text-[#6D778A] text-sm font-sans mt-1">
          {accountType === 'business' ? 'Details of the primary account holder or authorised signatory.' : 'Join DigitalCap FX in under 2 minutes.'}
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs font-semibold text-rose-400 font-sans leading-relaxed select-none">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            required
            label="First name*"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => {
              updateCredentials({ firstName: e.target.value });
              clearFieldError('firstName');
            }}
            error={errors.firstName}
          />
          <Input
            required
            label="Last name*"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => {
              updateCredentials({ lastName: e.target.value });
              clearFieldError('lastName');
            }}
            error={errors.lastName}
          />
        </div>

        <Input
          required
          type="email"
          label="Email*"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => {
            updateCredentials({ email: e.target.value });
            clearFieldError('email');
          }}
          error={errors.email}
        />

        <PhoneInput
          required
          label="Phone number*"
          placeholder="Enter phone number"
          value={phone}
          onChange={(val) => {
            updateCredentials({ phone: val || '' });
            clearFieldError('phone');
          }}
          error={errors.phone}
        />

        <div className="space-y-1.5">
          <Input
            required
            type="password"
            label="PIN / Password (6 Digits)*"
            placeholder="Create a strong 6-digit PIN"
            maxLength={6}
            value={pin}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, '');
              updateCredentials({ pin: cleaned });
              clearFieldError('pin');
            }}
            error={errors.pin}
          />
          <span className="text-[10px] text-slate-500 font-semibold block select-none">
            Must be a 6-digit numeric PIN code for rapid access security.
          </span>
        </div>

        <Select
          required
          label="Country*"
          placeholder="Select country..."
          value={country}
          onChange={(val) => {
            updateCredentials({ country: val });
            clearFieldError('country');
          }}
          options={COUNTRY_OPTIONS}
          error={errors.country}
        />

        <div className="flex items-start space-x-2.5 pt-2 select-none">
          <div className="mt-0.5">
            <Checkbox
              checked={agree}
              onChange={(val) => updateCredentials({ agree: val })}
            />
          </div>
          <label className="text-xs font-semibold text-slate-400 cursor-pointer font-sans leading-relaxed">
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

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={registerMutation.isPending}
            className="w-full rounded-full h-[52px] font-semibold text-base"
            rightIcon={<ArrowRight className="h-5 w-5" />}
          >
            {registerMutation.isPending ? 'Registering...' : 'Create account'}
          </Button>
        </div>
      </form>
    </div>
  );
};
