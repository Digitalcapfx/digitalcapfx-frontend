import React from 'react'
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
        <h1 className="font-satoshi font-black text-3xl text-white tracking-tight">
          What type of account?
        </h1>
        <p className="text-[#6D778A] text-sm mt-2">
          Choose the account type that best describes your use case.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {ACCOUNT_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = accountType === type.id;

          return (
            <div
              key={type.id}
              onClick={() => setAccountType(type.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer select-none flex items-start space-x-4 ${isSelected
                ? 'bg-primary-500/5 border-primary-500'
                : 'bg-[#0C1224] border-[#3E4658] hover:border-white hover:bg-[#0C1224]/60'
                }`}
            >
              <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-250 ${isSelected ? 'bg-primary-500/10 text-primary-400' : 'bg-white/5 text-slate-400'
                }`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-white">{type.title}</h3>
                <p className="text-sm text-[#6D778A] leading-relaxed max-w-xs">
                  {type.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 select-none">
                  {type.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-[#3E4658] text-[#6D778A]">
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
            className="w-full rounded-full h-[52px] font-semibold text-base"
            rightIcon={<ArrowRight className="h-5 w-5" />}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};
