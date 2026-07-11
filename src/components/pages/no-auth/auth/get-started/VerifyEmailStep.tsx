import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { OtpInput } from '@/components/ui/OtpInput'
import { useRegisterStore } from '@/store/registerStore'
import { BusinessStepper } from './BusinessStepper'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { toast } from 'sonner'

export const VerifyEmailStep: React.FC = () => {
  const router = useRouter();
  const {
    accountType,
    email,
    code,
    setCode,
    setStep
  } = useRegisterStore();

  const [errorMsg, setErrorMsg] = useState('');
  const [timer, setTimer] = useState(292); // 04:52
  const [resendCooldown, setResendCooldown] = useState(false);

  // Countdown timer loop
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

  // React Query Mutations
  const verifyEmailMutation = useMutation({
    mutationFn: (code: string) => authService.verifyEmail(code),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success('Email verified successfully!');
        if (accountType === 'business') {
          setStep('done');
        } else {
          router.push('/dashboard');
        }
      } else {
        const rawError = data?.error;
        const msg = typeof rawError === 'object'
          ? (rawError.message || JSON.stringify(rawError))
          : (rawError || 'OTP Verification failed');
        setErrorMsg(msg);
        toast.error(msg);
      }
    },
    onError: (err: any) => {
      console.error('Verify Email Error:', err);
      const rawError = err.response?.data?.error;
      const msg = typeof rawError === 'object'
        ? (rawError.message || JSON.stringify(rawError))
        : (rawError || err.response?.data?.message || 'Invalid OTP code.');
      setErrorMsg(msg);
      toast.error(msg);
    }
  });

  const resendOtpMutation = useMutation({
    mutationFn: () => authService.resendOtp(),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success('New OTP sent successfully!');
        setTimer(300);
        setTimeout(() => setResendCooldown(false), 30000); // 30s cooldown
      } else {
        setResendCooldown(false);
        const rawError = data?.error;
        const msg = typeof rawError === 'object'
          ? (rawError.message || JSON.stringify(rawError))
          : (rawError || 'Resending OTP failed');
        toast.error(msg);
      }
    },
    onError: (err: any) => {
      setResendCooldown(false);
      console.error('Resend OTP Error:', err);
      const rawError = err.response?.data?.error;
      const msg = typeof rawError === 'object'
        ? (rawError.message || JSON.stringify(rawError))
        : (rawError || err.response?.data?.message || 'Could not resend OTP.');
      toast.error(msg);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    verifyEmailMutation.mutate(code);
  };

  const handleResend = () => {
    if (resendCooldown) return;
    setResendCooldown(true);
    resendOtpMutation.mutate();
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
      {accountType === 'business' && <BusinessStepper currentStepIndex={3} />}

      <div>
        <button 
          onClick={() => {
            setStep('credentials');
            setCode('');
          }}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-355 transition-colors font-sans select-none mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <h1 className="font-satoshi font-black text-2xl text-white tracking-tight">
          Verify your email
        </h1>
        <p className="text-slate-400 text-sm font-sans leading-relaxed mt-1">
          We sent a 6-digit code to <br />
          <strong className="text-white font-bold font-mono">{email}</strong>
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs font-semibold text-rose-455 font-sans select-none">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="max-w-[340px] flex justify-center py-2">
          <OtpInput 
            value={code}
            onChange={setCode}
            length={6}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={code.length !== 6 || verifyEmailMutation.isPending}
          className="w-full rounded-full h-[52px] font-semibold text-base shadow-lg"
        >
          {verifyEmailMutation.isPending ? 'Verifying...' : 'Verify email'}
        </Button>
      </form>

      <div className="flex justify-between items-center text-xs font-semibold select-none pt-2 font-sans text-slate-550">
        <div>
          Code expires in <span className="text-white font-mono">{formatTime(timer)}</span>
        </div>
        {timer > 0 ? (
          <span className="text-slate-650">Resend code</span>
        ) : (
          <button 
            onClick={handleResend}
            disabled={resendCooldown || resendOtpMutation.isPending}
            className="text-primary-400 hover:underline cursor-pointer"
          >
            {resendCooldown ? 'Wait...' : 'Resend code'}
          </button>
        )}
      </div>
    </div>
  );
};
