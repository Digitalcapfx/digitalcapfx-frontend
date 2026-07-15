'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { OtpInput } from '@/components/ui/OtpInput'
import PhoneInput from '@/components/ui/PhoneInput'
import { useRegisterStore } from '@/store/registerStore'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { toast } from 'sonner'
import { isValidPhoneNumber } from 'react-phone-number-input'

export const PhoneVerifyStep: React.FC = () => {
  const {
    phone,
    updateCredentials,
    setStep
  } = useRegisterStore();

  const [otpCode, setOtpCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [timer, setTimer] = useState(300); // 5 minutes
  const [resendCooldown, setResendCooldown] = useState(false);

  // Timer loop for resending code
  useEffect(() => {
    if (!codeSent || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [codeSent, timer]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. Send OTP Mutation
  const sendOtpMutation = useMutation({
    mutationFn: (phoneNum: string) => authService.sendPhoneOtp(phoneNum),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success('Verification code successfully dispatched!');
        setCodeSent(true);
        setTimer(300);
        setResendCooldown(false);
      } else {
        const rawError = data?.error;
        const msg = typeof rawError === 'object'
          ? (rawError.message || JSON.stringify(rawError))
          : (rawError || 'Failed to dispatch SMS code.');
        setErrorMsg(msg);
        toast.error(msg);
      }
    },
    onError: (err: any) => {
      console.error('Send OTP Error:', err);
      const rawError = err.response?.data?.error;
      const msg = typeof rawError === 'object'
        ? (rawError.message || JSON.stringify(rawError))
        : (rawError || err.response?.data?.message || 'Could not dispatch SMS verification code.');
      setErrorMsg(msg);
      toast.error(msg);
    }
  });

  // 2. Verify OTP Mutation
  const verifyOtpMutation = useMutation({
    mutationFn: (payload: { phone: string; code: string }) =>
      authService.verifyPhoneOtp(payload.phone, payload.code),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success('Phone number verified successfully!');
        setStep('account-type');
      } else {
        const rawError = data?.error;
        const msg = typeof rawError === 'object'
          ? (rawError.message || JSON.stringify(rawError))
          : (rawError || 'Incorrect verification code.');
        setErrorMsg(msg);
        toast.error(msg);
      }
    },
    onError: (err: any) => {
      console.error('Verify OTP Error:', err);
      const rawError = err.response?.data?.error;
      const msg = typeof rawError === 'object'
        ? (rawError.message || JSON.stringify(rawError))
        : (rawError || err.response?.data?.message || 'Incorrect verification code.');
      setErrorMsg(msg);
      toast.error(msg);
    }
  });

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setPhoneError('');

    if (!phone) {
      setPhoneError('Phone number is required');
      return;
    }
    if (!isValidPhoneNumber(phone)) {
      setPhoneError('Please enter a valid international phone number');
      return;
    }

    sendOtpMutation.mutate(phone);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit verification code.');
      return;
    }

    verifyOtpMutation.mutate({ phone, code: otpCode });
  };

  const handleResend = () => {
    if (resendCooldown) return;
    setResendCooldown(true);
    sendOtpMutation.mutate(phone);
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        {!codeSent ? (
          <>
            <h1 className="font-satoshi font-black text-2xl text-white tracking-tight">
              Get Started with DigitalCap FX
            </h1>
            <p className="text-slate-400 text-sm font-sans mt-2 leading-relaxed">
              Verify your phone number first to secure your cross-border currency wallets.
            </p>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setCodeSent(false);
                setOtpCode('');
              }}
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-350 transition-colors font-sans select-none mb-3 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Change phone number</span>
            </button>
            <h1 className="font-satoshi font-black text-2xl text-white tracking-tight">
              Verify your phone
            </h1>
            <p className="text-slate-400 text-sm font-sans mt-1 leading-relaxed">
              We sent a 6-digit security code to <br />
              <strong className="text-white font-mono font-bold">{phone}</strong>
            </p>
          </>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs font-semibold text-rose-400 font-sans select-none">
          {errorMsg}
        </div>
      )}

      {!codeSent ? (
        <form onSubmit={handleSendCode} className="space-y-6">
          <PhoneInput
            required
            label="Phone number*"
            placeholder="Enter phone number"
            value={phone}
            onChange={(val) => {
              updateCredentials({ phone: val || '' });
              if (phoneError) setPhoneError('');
            }}
            error={phoneError}
          />

          <Button
            type="submit"
            variant="primary"
            disabled={!phone || sendOtpMutation.isPending}
            className="w-full rounded-full h-[52px] font-semibold text-base shadow-lg"
            rightIcon={sendOtpMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
          >
            {sendOtpMutation.isPending ? 'Sending code...' : 'Continue'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-6">
          <div className="max-w-[340px] flex justify-center py-2">
            <OtpInput
              value={otpCode}
              onChange={setOtpCode}
              length={6}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={otpCode.length !== 6 || verifyOtpMutation.isPending}
            className="w-full rounded-full h-[52px] font-semibold text-base shadow-lg"
          >
            {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify & Continue'}
          </Button>

          <div className="flex justify-between items-center text-xs font-semibold select-none pt-2 font-sans text-slate-500">
            <div>
              Code expires in <span className="text-white font-mono">{formatTime(timer)}</span>
            </div>
            {timer > 0 ? (
              <span className="text-slate-650">Resend code</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown || sendOtpMutation.isPending}
                className="text-primary-400 hover:underline cursor-pointer"
              >
                {resendCooldown ? 'Wait...' : 'Resend code'}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
