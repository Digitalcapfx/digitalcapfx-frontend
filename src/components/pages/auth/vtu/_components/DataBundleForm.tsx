'use client'

import React, { useState } from 'react'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useLanguageStore } from '@/store/languageStore'

const OPERATORS = ['MTN', 'Orange', 'Moov', 'Airtel', 'Nexttel'];

const DATA_BUNDLES: Record<string, Array<{ id: string; name: string; amount: number }>> = {
    MTN: [
        { id: 'MTN_DATA_500MB', name: 'MTN 500MB Daily (500 XAF/XOF)', amount: 500 },
        { id: 'MTN_DATA_1GB', name: 'MTN 1.2GB Weekly (1000 XAF/XOF)', amount: 1000 },
        { id: 'MTN_DATA_3GB', name: 'MTN 3.5GB Monthly (2000 XAF/XOF)', amount: 2000 },
        { id: 'MTN_DATA_10GB', name: 'MTN 12GB Monthly (5000 XAF/XOF)', amount: 5000 },
    ],
    Orange: [
        { id: 'ORANGE_DATA_500MB', name: 'Orange 500MB Daily (500 XAF/XOF)', amount: 500 },
        { id: 'ORANGE_DATA_1GB', name: 'Orange 1.2GB Weekly (1000 XAF/XOF)', amount: 1000 },
        { id: 'ORANGE_DATA_3GB', name: 'Orange 3.5GB Monthly (2000 XAF/XOF)', amount: 2000 },
        { id: 'ORANGE_DATA_10GB', name: 'Orange 12GB Monthly (5000 XAF/XOF)', amount: 5000 },
    ],
    Moov: [
        { id: 'MOOV_DATA_1GB', name: 'Moov 1.2GB Weekly (1000 XAF/XOF)', amount: 1000 },
        { id: 'MOOV_DATA_3GB', name: 'Moov 3.5GB Monthly (2000 XAF/XOF)', amount: 2000 },
    ],
    Airtel: [
        { id: 'AIRTEL_DATA_1GB', name: 'Airtel 1.2GB Weekly (1000 XAF/XOF)', amount: 1000 },
        { id: 'AIRTEL_DATA_3GB', name: 'Airtel 3.5GB Monthly (2000 XAF/XOF)', amount: 2000 },
    ],
    Nexttel: [
        { id: 'NEXTTEL_DATA_1GB', name: 'Nexttel 1.2GB Weekly (1000 XAF/XOF)', amount: 1000 },
        { id: 'NEXTTEL_DATA_3GB', name: 'Nexttel 3.5GB Monthly (2000 XAF/XOF)', amount: 2000 },
    ]
};

interface DataBundleFormProps {
    currency: 'XAF' | 'XOF';
    isPending: boolean;
    onSubmit: (payload: { phone: string; bundleId: string; amount: number; operator: string }) => void;
}

export const DataBundleForm: React.FC<DataBundleFormProps> = ({ currency, isPending, onSubmit }) => {
    const { t } = useLanguageStore();
    const [operator, setOperator] = useState('MTN');
    const [phone, setPhone] = useState('');
    const [bundleId, setBundleId] = useState('');
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
        const newErrors: Record<string, string> = {};

        if (!phone) newErrors.phone = t('vtu.airtime.phoneRequired');
        if (!bundleId) newErrors.bundleId = t('vtu.data.bundleRequired');

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const selectedBundle = (DATA_BUNDLES[operator] || []).find(b => b.id === bundleId);
        if (!selectedBundle) {
            toast.error('Invalid bundle selected.');
            return;
        }

        onSubmit({ 
            phone, 
            bundleId, 
            amount: selectedBundle.amount, 
            operator 
        });
    };

    const activeBundles = DATA_BUNDLES[operator] || [];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('vtu.airtime.network')}</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {OPERATORS.map(op => (
                        <button
                            key={op}
                            type="button"
                            onClick={() => {
                                setOperator(op);
                                setBundleId('');
                            }}
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

            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('vtu.data.bundlePack')}</label>
                <select
                    value={bundleId}
                    onChange={(e) => {
                        setBundleId(e.target.value);
                        clearError('bundleId');
                    }}
                    className="bg-black/35 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-500/50 w-full font-semibold [&>option]:bg-[#080E1E]"
                >
                    <option value="" disabled>{t('vtu.data.selectOption')}</option>
                    {activeBundles.map(bundle => (
                        <option key={bundle.id} value={bundle.id}>
                            {bundle.name}
                        </option>
                    ))}
                </select>
                {errors.bundleId && (
                    <p className="text-xs text-red-500 font-semibold mt-1">
                        {errors.bundleId}
                    </p>
                )}
            </div>

            <div className="pt-2">
                <Button
                    type="submit"
                    disabled={isPending || !bundleId}
                    className="w-full rounded-xl h-[52px] font-bold text-base shadow-lg shadow-primary-500/10"
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                    {isPending ? t('vtu.btn.processing') : t('vtu.data.submit')}
                </Button>
            </div>
        </form>
    );
};
