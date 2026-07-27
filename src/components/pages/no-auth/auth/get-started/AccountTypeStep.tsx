import React from 'react'
import Link from 'next/link'
import { ArrowRight, User, Building } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useRegisterStore } from '@/store/registerStore'

interface AccountTypeOption {
  id: 'individual' | 'business';
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
}

const ACCOUNT_TYPES: AccountTypeOption[] = [
  {
    id: 'individual',
    title: 'Individual Account',
    description: 'For freelancers and sole traders who need to send and receive international payments.',
    icon: User,
    tags: ['KYC only', 'Single user', 'Core features']
  },
  {
    id: 'business',
    title: 'Business Account',
    description: 'For companies, startups, and organisations managing multi-currency treasury and cross-border payments.',
    icon: Building,
    tags: ['KYB required', 'Multi-user', 'Full platform']
  }
];

export const AccountTypeStep: React.FC = () => {
  const { accountType, setAccountType, setStep } = useRegisterStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountType) return;
    if (accountType === 'business') {
      setStep('business-details');
    } else {
      setStep('credentials');
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <span className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] uppercase font-mono block mb-1 select-none">
          Step 2 of 5
        </span>
        <h1 className="font-satoshi font-black text-3xl text-white tracking-tight">
          What type of account?
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-1 select-none">
          <span className="text-slate-350 text-sm font-sans">Already have an account?</span>
          <Link 
            href="/login" 
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/50 font-bold text-xs transition-all duration-200 shadow-sm shadow-cyan-500/10"
          >
            <span>Sign in</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {ACCOUNT_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = accountType === type.id;

          return (
            <div
              key={type.id}
              onClick={() => setAccountType(type.id)}
              className={`p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer select-none flex items-start space-x-4 ${isSelected
                ? 'bg-[#0E1A38] border-cyan-400 shadow-lg shadow-cyan-500/15'
                : 'bg-white/[0.04] border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.07]'
                }`}
            >
              <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-250 ${isSelected ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-white/5 text-slate-400'
                }`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-white text-base">{type.title}</h3>
                <p className="text-sm text-slate-350 leading-relaxed">
                  {type.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 select-none">
                  {type.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-slate-350">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={!accountType}
            className="w-full rounded-xl h-[52px] font-bold text-base bg-gradient-to-r from-primary-600 via-primary-500 to-cyan-500 hover:from-primary-500 hover:to-cyan-400 text-white shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            rightIcon={<ArrowRight className="h-5 w-5" />}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

