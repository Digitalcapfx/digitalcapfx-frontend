'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { NumberInput } from '@/components/ui/NumberInput'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const BILLERS = [
    { id: 'ENEO', name: 'ENEO (Cameroon Electricity)' },
    { id: 'Camwater', name: 'Camwater (Cameroon Water)' },
    { id: 'CIE', name: 'CIE (Côte d\'Ivoire Electricity)' },
    { id: 'SODECI', name: 'SODECI (Côte d\'Ivoire Water)' },
    { id: 'Senelec', name: 'Senelec (Senegal Electricity)' },
    { id: 'SenEau', name: 'SenEau (Senegal Water)' },
];

interface BillPaymentFormProps {
    currency: 'XAF' | 'XOF';
    isPending: boolean;
    onSubmit: (payload: { accountNumber: string; amount: number; billerId: string }) => void;
}

export const BillPaymentForm: React.FC<BillPaymentFormProps> = ({ currency, isPending, onSubmit }) => {
    const [billerId, setBillerId] = useState('ENEO');
    const [accountNumber, setAccountNumber] = useState('');
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

        if (!accountNumber) newErrors.accountNumber = 'Account/Meter number is required';
        if (isNaN(amt) || amt <= 0) newErrors.amount = 'Enter a valid amount greater than 0';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit({ accountNumber, amount: amt, billerId });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Utility Provider / Biller</label>
                <select
                    value={billerId}
                    onChange={(e) => setBillerId(e.target.value)}
                    className="bg-black/35 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-500/50 w-full font-semibold [&>option]:bg-[#080E1E]"
                >
                    {BILLERS.map(biller => (
                        <option key={biller.id} value={biller.id}>
                            {biller.name}
                        </option>
                    ))}
                </select>
            </div>

            <Input 
                required
                label="Account / Meter Number*"
                placeholder="Enter meter or account reference"
                value={accountNumber}
                onChange={(e) => {
                    setAccountNumber(e.target.value);
                    clearError('accountNumber');
                }}
                error={errors.accountNumber}
            />

            <div className="w-full space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-400 block tracking-wide">
                    {`Payment Amount (${currency})*`}
                </label>
                <div className="relative flex items-center">
                    <NumberInput 
                        required
                        placeholder="e.g. 5,000"
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
                    {isPending ? 'Processing...' : 'Pay Bill'}
                </Button>
            </div>
        </form>
    );
};
