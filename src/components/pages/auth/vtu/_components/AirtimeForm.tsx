'use client'

import React, { useState } from 'react'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { NumberInput } from '@/components/ui/NumberInput'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'

const OPERATORS = ['MTN', 'Orange', 'Moov', 'Airtel', 'Nexttel'];

interface AirtimeFormProps {
    currency: 'XAF' | 'XOF';
    isPending: boolean;
    onSubmit: (payload: { phone: string; amount: number; operator: string }) => void;
}

export const AirtimeForm: React.FC<AirtimeFormProps> = ({ currency, isPending, onSubmit }) => {
    const { t } = useLanguageStore();
    const [operator, setOperator] = useState('MTN');
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const clearError = (field: string) => {
        if (errors[field]) {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amt = parseFloat(amount.replace(/,/g, ''));
        const newErrors: Record<string, string> = {};

        if (!phone) newErrors.phone = t('vtu.airtime.phoneRequired');
        if (isNaN(amt) || amt <= 0) newErrors.amount = t('vtu.airtime.amountInvalid');

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit({ phone, amount: amt, operator });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('vtu.airtime.network')}</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {OPERATORS.map(op => (
                        <button
                            key={op}
                            type="button"
                            onClick={() => setOperator(op)}
                            className={cn(
                                "py-2 rounded-xl text-xs font-bold border transition text-center select-none cursor-pointer",
                                operator === op 
                                    ? "bg-primary-500/10 border-primary-500 text-primary-400" 
                                    : "bg-black/25 border-white/5 text-slate-400 hover:border-white/10 hover:text-white"
                            )}
                        >
                            {op}
                        </button>
                    ))}
                </div>
            </div>

            <PhoneInput 
                required
                label={t('vtu.airtime.phoneLabel')}
                placeholder={t('vtu.airtime.phonePlaceholder')}
                value={phone}
                onChange={(val) => {
                    setPhone(val);
                    clearError('phone');
                }}
                error={errors.phone}
            />

            <div className="w-full space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-400 block tracking-wide">
                    {t('vtu.airtime.amountLabel', { currency })}
                </label>
                <div className="relative flex items-center">
                    <NumberInput 
                        required
                        placeholder={t('vtu.airtime.amountPlaceholder')}
                        value={amount}
                        onChange={(val) => {
                            setAmount(val);
                            clearError('amount');
                        }}
                        className={cn(
                            "w-full h-[52px] rounded-[12px] bg-black/30 border border-white/10 px-4 text-sm text-white font-sans focus:outline-none transition-all duration-200 focus:border-primary-500/80 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 placeholder-slate-500",
                            errors.amount && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        )}
                    />
                </div>
                {errors.amount && (
                    <p className="text-xs text-red-500 font-semibold mt-1">
                        {errors.amount}
                    </p>
                )}
            </div>

            <div className="pt-2">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-xl h-[52px] font-bold text-base shadow-lg shadow-primary-500/10"
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                    {isPending ? t('vtu.btn.processing') : t('vtu.airtime.submit')}
                </Button>
            </div>
        </form>
    );
};
