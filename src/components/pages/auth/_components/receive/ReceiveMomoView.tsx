'use client'

import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { NumberInput } from '@/components/ui/NumberInput'
import { cn, formatCurrencyByLocale } from '@/lib/utils'
import { Wallet } from '../ReceiveMoneySheet'
import { useLanguageStore } from '@/store/languageStore'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

interface ReceiveMomoViewProps {
    activeWallet: Wallet;
    isCrypto: boolean;
    depositSuccess: boolean;
    depositAmount: string;
    setDepositAmount: (val: string) => void;
    phone: string;
    setPhone: (val: string) => void;
    operator: string;
    setOperator: (val: string) => void;
    fundingCurrency: 'XOF' | 'XAF';
    setFundingCurrency: (val: 'XOF' | 'XAF') => void;
    isPending: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export const ReceiveMomoView: React.FC<ReceiveMomoViewProps> = ({
    activeWallet,
    isCrypto,
    depositSuccess,
    depositAmount,
    setDepositAmount,
    phone,
    setPhone,
    operator,
    setOperator,
    fundingCurrency,
    setFundingCurrency,
    isPending,
    onSubmit,
}) => {
    const { t } = useLanguageStore();

    const currencyOptions = [
        { value: 'XOF', label: 'XOF (West African CFA)' },
        { value: 'XAF', label: 'XAF (Central African CFA)' }
    ];

    const operatorOptions = [
        { value: 'MTN', label: 'MTN Mobile Money' },
        { value: 'Orange', label: 'Orange Money' },
        { value: 'Moov', label: 'Moov Money' },
        { value: 'Wave', label: 'Wave' }
    ];

    return (
        <div className="space-y-5 animate-in fade-in duration-200">
            {depositSuccess ? (
                <div className="py-6 space-y-4 text-center select-none">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">{t('receive.momo.success.title')}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {t('receive.momo.success.desc', {
                                amount: formatCurrencyByLocale(depositAmount, activeWallet.code),
                                operator: operator
                            })}
                        </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                    {isCrypto && (
                        <div className="animate-in fade-in duration-200">
                            <Select
                                label={t('receive.momo.paymentCurrency')}
                                options={currencyOptions}
                                value={fundingCurrency}
                                onChange={(val) => setFundingCurrency(val as 'XOF' | 'XAF')}
                                searchable={false}
                            />
                        </div>
                    )}
                    <Select
                        label={t('receive.momo.operator')}
                        options={operatorOptions}
                        value={operator}
                        onChange={setOperator}
                        searchable={false}
                    />
                    <PhoneInput
                        required
                        label={t('receive.momo.phone')}
                        placeholder={t('receive.momo.phonePlaceholder')}
                        value={phone}
                        onChange={setPhone}
                    />
                    <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">
                            {t('receive.momo.amountLabel', { code: isCrypto ? fundingCurrency : activeWallet.code })}
                        </span>
                        <NumberInput
                            required
                            value={depositAmount}
                            onChange={setDepositAmount}
                            placeholder="0"
                            className="bg-black/30 border border-white/10 rounded-xl px-4.5 py-3.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-primary-500/50 w-full font-mono"
                        />
                    </div>

                    <Button
                        type="submit"
                        isLoading={isPending}
                        disabled={!depositAmount || !phone}
                        className="w-full h-[52px] rounded-xl font-bold text-sm shadow-lg shadow-primary-500/10 mt-2"
                    >
                        {t('receive.momo.btn.initiate')}
                    </Button>
                </form>
            )}
        </div>
    );
};
