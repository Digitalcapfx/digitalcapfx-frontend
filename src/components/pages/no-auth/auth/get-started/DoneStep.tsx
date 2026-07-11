import React from 'react'
import { useRouter } from 'next/navigation'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useRegisterStore } from '@/store/registerStore'
import { BusinessStepper } from './BusinessStepper'

export const DoneStep: React.FC = () => {
  const router = useRouter();
  const { reset } = useRegisterStore();

  const handleContinue = () => {
    reset();
    router.push('/dashboard');
  };

  return (
    <div className="space-y-6 text-center lg:text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
      <BusinessStepper currentStepIndex={5} />

      <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
        <div className="relative w-fit mx-auto lg:mx-0">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-[20px]"></div>
          <div className="relative w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
            <Check className="h-8 w-8 stroke-[3]" />
          </div>
        </div>

        <div className="space-y-2 select-none">
          <span className="text-[10px] font-bold text-emerald-450 tracking-[0.2em] uppercase font-mono block">
            Application Submitted
          </span>
          <h1 className="font-satoshi font-black text-3xl text-white tracking-tight">
            You're almost there!
          </h1>
          <p className="text-slate-455 text-sm font-sans leading-relaxed max-w-sm">
            Our compliance team is reviewing your application. You'll receive an email confirmation within 24–48 hours.
          </p>
        </div>

        {/* What Happens Next steps timeline card */}
        <div className="bg-[#0C1224]/50 border border-white/5 rounded-2xl p-6 w-full text-left space-y-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
            What Happens Next
          </span>
          <div className="space-y-4 select-none">
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-white">Document review</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 font-mono">0–4 hrs</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center text-slate-500 text-[10px] font-bold">
                  2
                </div>
                <span className="text-slate-450">KYB verification</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 font-mono">4–24 hrs</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center text-slate-500 text-[10px] font-bold">
                  3
                </div>
                <span className="text-slate-450">Compliance sign-off</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 font-mono">24–48 hrs</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center text-slate-500 text-[10px] font-bold">
                  4
                </div>
                <span className="text-slate-450">Account activated</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 font-mono">&lt; 48 hrs</span>
            </div>
          </div>
        </div>

        {/* While You Wait Tip Panel */}
        <div className="bg-primary-500/5 border border-primary-500/10 rounded-2xl p-4.5 w-full text-left flex items-start space-x-3 select-none">
          <Sparkles className="h-5 w-5 text-primary-400 shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-white">While you wait</h5>
            <p className="text-[11px] leading-relaxed text-slate-400 mt-1 font-sans">
              Explore the platform in sandbox mode. You can set up wallets, test FX conversions, and invite your team before going live.
            </p>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          variant="primary"
          className="w-full rounded-full h-[52px] font-semibold text-base"
          rightIcon={<ArrowRight className="h-5 w-5" />}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
