'use client'

import React from 'react'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { NumberInput } from '@/components/ui/NumberInput'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'
import { Select } from '@/components/ui/Select'

interface PhoneSendFormProps {
    isSheet: boolean;
    balanceUsdc: string;
    phoneNumber: string;
    setPhoneNumber: (val: string) => void;
    phoneError: string;
    setPhoneError: (val: string) => void;
    amount: string;
    setAmount: (val: string) => void;
    amountError: string;
    setAmountError: (val: string) => void;
    note: string;
    setNote: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    selectedToken?: string;
    setSelectedToken?: (token: string) => void;
    availableTokens?: string[];
}

export const PhoneSendForm: React.FC<PhoneSendFormProps> = ({
    isSheet,
    balanceUsdc,
    phoneNumber,
    setPhoneNumber,
    phoneError,
    setPhoneError,
    amount,
    setAmount,
    amountError,
    setAmountError,
    note,
    setNote,
    onSubmit,
    selectedToken = 'USDC',
    setSelectedToken,
    availableTokens = ['USDC', 'USDT'],
}) => {
    const { t } = useLanguageStore();
    const [mode, setMode] = React.useState<'phone' | 'address'>(
        phoneNumber.startsWith('0x') ? 'address' : 'phone'
    );

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {isSheet && (
                <div className="flex justify-between items-center select-none pb-2 mb-2 border-b border-white/5">
                    <span className="text-xs font-bold text-slate-400">{t('phone.send.form.stablecoinBalance')}</span>
                    <span className="text-sm font-extrabold text-white font-mono">${balanceUsdc} <span className="text-[10px] text-slate-400">{selectedToken}</span></span>
                </div>
            )}

            {/* Network Badge */}
            <div className="flex items-center justify-between text-[10px] bg-cyan-500/10 border border-cyan-500/25 rounded-xl px-3.5 py-2 text-cyan-300 font-mono select-none">
                <span className="font-bold uppercase tracking-wider">Settlement Network</span>
                <span className="font-extrabold text-cyan-400">Polygon (POL)</span>
            </div>

            {/* Recipient Type Segment Toggle */}
            <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Recipient Rail</span>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 border border-white/10 rounded-xl text-xs font-bold">
                    <button
                        type="button"
                        onClick={() => {
                            setMode('phone');
                            if (phoneNumber.startsWith('0x')) setPhoneNumber('');
                        }}
                        className={cn(
                            "py-1.5 rounded-lg transition-all text-center cursor-pointer",
                            mode === 'phone' ? "bg-primary-500/20 text-primary-400 border border-primary-500/30" : "text-slate-400 hover:text-white"
                        )}
                    >
                        Phone Number
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setMode('address');
                            if (!phoneNumber.startsWith('0x')) setPhoneNumber('');
                        }}
                        className={cn(
                            "py-1.5 rounded-lg transition-all text-center cursor-pointer",
                            mode === 'address' ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-white"
                        )}
                    >
                        Wallet Address (0x)
                    </button>
                </div>
            </div>

            {mode === 'phone' ? (
                <PhoneInput
                    label={t('phone.send.form.recipientLabel')}
                    value={phoneNumber}
                    onChange={(val) => {
                        if (val.startsWith('0x')) {
                            setMode('address');
                        }
                        setPhoneNumber(val);
                        if (phoneError) setPhoneError('');
                    }}
                    placeholder={t('phone.send.form.phonePlaceholder')}
                    error={phoneError}
                />
            ) : (
                <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">SCW Wallet Address (0x)</span>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            if (phoneError) setPhoneError('');
                        }}
                        placeholder="Enter raw 0x SCW wallet address"
                        className={cn(
                            "bg-black/30 border rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-655 focus:outline-none focus:border-cyan-500/50 w-full",
                            phoneError ? "border-rose-500/50" : "border-white/10"
                        )}
                    />
                    {phoneError && <span className="text-[10px] text-rose-500 font-bold block">{phoneError}</span>}
                </div>
            )}

            {/* Amount Entry beneath Phone Input */}
            <div className={cn(
                "bg-[#0C1224] border rounded-2xl p-4 relative select-none transition-colors",
                amountError ? "border-rose-500/50 bg-rose-500/[0.02]" : "border-cyan-500/30 hover:border-cyan-500/45"
            )}>
                <div className="flex items-center justify-between mb-1 min-h-[36px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t('phone.send.form.sendAmount')}</span>
                    {availableTokens && availableTokens.length > 1 ? (
                        <div className="w-28">
                            <Select
                                options={availableTokens.map((t) => ({ value: t, label: t }))}
                                value={selectedToken}
                                onChange={(val) => setSelectedToken?.(val)}
                                searchable={false}
                                className="!h-9 py-1 px-3 border-cyan-500/30 hover:border-cyan-400/60 bg-cyan-500/10 text-xs font-mono font-bold text-cyan-300 rounded-xl"
                            />
                        </div>
                    ) : (
                        <span className="text-xs font-black text-cyan-400 font-mono px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">{selectedToken}</span>
                    )}
                </div>

                <div className="flex items-center justify-center py-2">
                    <NumberInput
                        value={amount}
                        onChange={(val) => {
                            setAmount(val);
                            if (amountError) setAmountError('');
                        }}
                        placeholder="0.00"
                        className="bg-transparent border-none focus:outline-none focus:ring-0 text-center text-white font-mono font-black text-3xl placeholder-slate-700 w-full leading-none"
                    />
                </div>

                <div className="text-center">
                    <span className="text-[9px] text-slate-400 font-semibold block mt-1">{t('phone.send.form.available', { balance: balanceUsdc })}</span>
                    {amountError && <span className="text-[10px] text-rose-500 font-bold block mt-1.5">{amountError}</span>}
                </div>
            </div>

            {/* Optional reference */}
            <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">{t('phone.send.form.referenceLabel')}</span>
                <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={t('phone.send.form.referencePlaceholder')}
                    className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-primary-500/50 w-full font-sans"
                />
            </div>

            <div className="pt-2">
                <Button
                    type="submit"
                    variant="primary"
                    className="w-full rounded-xl h-[48px] font-semibold text-sm"
                >
                    {t('phone.send.form.btn.continue')}
                </Button>
            </div>
        </form>
    );
};
