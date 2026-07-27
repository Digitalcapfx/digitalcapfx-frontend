import React from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectOption } from '@/components/ui/Select'
import { useRegisterStore } from '@/store/registerStore'
import { getCountries } from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en.json'
import { BusinessStepper } from './BusinessStepper'

const enLabels = en as Record<string, string>;
const COUNTRY_OPTIONS: SelectOption[] = getCountries()
    .map((countryCode) => ({
        value: countryCode,
        label: enLabels[countryCode] || countryCode,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

const INDUSTRY_OPTIONS: SelectOption[] = [
    { value: 'fintech', label: 'Fintech / Payments' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'saas', label: 'SaaS / Software' },
    { value: 'retail', label: 'Retail & Wholesale' },
    { value: 'consulting', label: 'Professional Services / Consulting' },
    { value: 'logistics', label: 'Logistics & Supply Chain' },
    { value: 'other', label: 'Other' },
];

const REVENUE_OPTIONS: SelectOption[] = [
    { value: '< $50k', label: 'Less than $50k' },
    { value: '$50k-$500k', label: '$50k - $500k' },
    { value: '$500k-$1M', label: '$500k - $1M' },
    { value: '$1M-$5M', label: '$1M - $5M' },
    { value: '> $5M', label: 'More than $5M' },
];

export const BusinessDetailsStep: React.FC = () => {
  const {
    companyName,
    companyRegNo,
    industry,
    countryOfIncorp,
    annualRevenue,
    website,
    updateBusinessDetails,
    setStep
  } = useRegisterStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('credentials');
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
      <BusinessStepper currentStepIndex={1} />

      <div>
        <button 
          onClick={() => setStep('account-type')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-cyan-300 transition-colors font-sans select-none mb-3 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <span className="text-[10px] font-bold text-cyan-400 tracking-[0.15em] uppercase font-mono block mb-1.5">
          Step 3 of 5
        </span>
        <h1 className="font-satoshi font-black text-2xl text-white tracking-tight">
          Business details
        </h1>
        <p className="text-slate-400 text-sm font-sans mt-1">
          Tell us about your company.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          required
          label="Company legal name*"
          placeholder="Acme Corp Ltd"
          value={companyName}
          onChange={(e) => updateBusinessDetails({ companyName: e.target.value })}
        />

        <Input 
          required
          label="Company registration number*"
          placeholder="RC-12345678"
          value={companyRegNo}
          onChange={(e) => updateBusinessDetails({ companyRegNo: e.target.value })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select 
            required
            label="Industry*"
            placeholder="Select industry..."
            value={industry}
            onChange={(val) => updateBusinessDetails({ industry: val })}
            options={INDUSTRY_OPTIONS}
          />

          <Select 
            required
            label="Country of incorporation*"
            placeholder="Select country..."
            value={countryOfIncorp}
            onChange={(val) => updateBusinessDetails({ countryOfIncorp: val })}
            options={COUNTRY_OPTIONS}
          />
        </div>

        <Select 
          required
          label="Annual revenue*"
          placeholder="Select revenue band..."
          value={annualRevenue}
          onChange={(val) => updateBusinessDetails({ annualRevenue: val })}
          options={REVENUE_OPTIONS}
        />

        <Input 
          label="Business website (Optional)"
          placeholder="https://yourcompany.com"
          value={website}
          onChange={(e) => updateBusinessDetails({ website: e.target.value })}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
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
