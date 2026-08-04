'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle2, Copy, Check, Info, Smartphone, ExternalLink, ArrowRight } from 'lucide-react'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { NumberInput } from '@/components/ui/NumberInput'
import { Input } from '@/components/ui/Input'
import { cn, formatCurrencyByLocale } from '@/lib/utils'
import { Wallet } from '../ReceiveMoneySheet'
import { useLanguageStore } from '@/store/languageStore'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { momoService, ManualMomoAccount } from '@/services/momo.service'
import { toast } from 'sonner'

interface ReceiveMomoViewProps {
    activeWallet: Wallet;
    isCrypto: boolean;
    fundingCurrency: 'XOF' | 'XAF';
    setFundingCurrency: (val: 'XOF' | 'XAF') => void;
}

export const ReceiveMomoView: React.FC<ReceiveMomoViewProps> = ({
    activeWallet,
    isCrypto,
    fundingCurrency,
    setFundingCurrency,
}) => {
    const { t } = useLanguageStore();
    const queryClient = useQueryClient();

    const targetCurrency = isCrypto ? fundingCurrency : (activeWallet.code === 'XAF' ? 'XAF' : 'XOF');

    const [selectedAccountId, setSelectedAccountId] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [senderPhone, setSenderPhone] = useState<string>('');
    const [senderName, setSenderName] = useState<string>('');
    const [reference, setReference] = useState<string>('');
    const [note, setNote] = useState<string>('');
    const [copiedNumber, setCopiedNumber] = useState<boolean>(false);
    const [submittedClaim, setSubmittedClaim] = useState<any | null>(null);

    // Fetch active collection accounts
    const accountsQuery = useQuery({
        queryKey: ['momoAccounts'],
        queryFn: () => momoService.getMomoAccounts(),
    });

    const rawRes = accountsQuery.data;
    const accountsData: any[] = Array.isArray(rawRes?.data) ? rawRes.data : (Array.isArray(rawRes) ? rawRes : []);
    
    const allAccounts = accountsData.filter((a: any) => {
        const active = a.isActive !== undefined ? a.isActive : (a.is_active !== undefined ? a.is_active : true);
        return active;
    });

    // Filter accounts matching currency
    const matchingAccounts = allAccounts.filter(
        (a: any) => !a.currency || a.currency.toUpperCase() === targetCurrency.toUpperCase()
    );

    const activeAccountsList = matchingAccounts.length > 0 ? matchingAccounts : allAccounts;

    // Auto-select first matching account
    useEffect(() => {
        if (activeAccountsList.length > 0 && (!selectedAccountId || !activeAccountsList.some(a => a.id === selectedAccountId))) {
            setSelectedAccountId(activeAccountsList[0].id);
        }
    }, [activeAccountsList, selectedAccountId]);

    const selectedAccount = activeAccountsList.find((a) => a.id === selectedAccountId) || activeAccountsList[0];

    const copyToClipboard = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedNumber(true);
        toast.success(t('receive.toast.copied'));
        setTimeout(() => setCopiedNumber(false), 2000);
    };

    // Deposit claim mutation
    const claimMutation = useMutation({
        mutationFn: (payload: {
            momo_account_id: string;
            amount: number;
            reference?: string;
            sender_phone?: string;
            sender_name?: string;
            note?: string;
        }) => momoService.submitDepositClaim(payload),
        onSuccess: (res) => {
            if (res?.success || res?.data) {
                setSubmittedClaim(res.data || { amount: parseFloat(amount), currency: targetCurrency });
                toast.success('Deposit claim submitted successfully!');
                queryClient.invalidateQueries({ queryKey: ['momoDeposits'] });
                queryClient.invalidateQueries({ queryKey: ['activity'] });
            } else {
                toast.error(res?.error?.message || 'Failed to submit deposit claim');
            }
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.error?.message || 'Failed to submit deposit claim. Please retry.');
        },
    });

    const handleSubmitClaim = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmt = parseFloat(amount);
        if (isNaN(numAmt) || numAmt <= 0) {
            toast.error(t('receive.toast.invalidAmount'));
            return;
        }
        if (!senderPhone || !senderPhone.trim()) {
            toast.error('Please enter your Mobile Money phone number');
            return;
        }
        if (!reference || !reference.trim()) {
            toast.error('Please enter the transaction reference / Txn ID');
            return;
        }
        if (!senderName || !senderName.trim()) {
            toast.error('Please enter the sender name on account');
            return;
        }
        if (!selectedAccount) {
            toast.error('Please select a payment provider account');
            return;
        }

        claimMutation.mutate({
            momo_account_id: selectedAccount.id,
            amount: numAmt,
            sender_phone: senderPhone,
            sender_name: senderName,
            reference: reference,
            note: note,
        });
    };

    const currencyOptions = [
        { value: 'XOF', label: 'XOF (West African CFA)' },
        { value: 'XAF', label: 'XAF (Central African CFA)' },
    ];

    if (submittedClaim) {
        return (
            <div className="py-6 space-y-5 text-center select-none animate-in fade-in duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-base font-bold text-white">Deposit Claim Submitted</h4>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                        Your payment claim of <span className="text-white font-mono font-bold">{formatCurrencyByLocale(submittedClaim.amount || amount, targetCurrency)}</span> has been logged.
                    </p>
                    <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl p-4 text-left space-y-2 mt-3">
                        <div className="flex items-center space-x-2 text-xs font-bold text-primary-400">
                            <Info className="h-4 w-4 shrink-0" />
                            <span>What happens next?</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                            Our team verifies mobile money transfers manually. Once confirmed, your <span className="text-white font-bold">{targetCurrency}</span> balance will be updated automatically and you will receive a notification.
                        </p>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={() => {
                        setSubmittedClaim(null);
                        setAmount('');
                        setReference('');
                        setNote('');
                    }}
                    variant="secondary"
                    className="w-full h-11 rounded-xl text-xs font-bold mt-4"
                >
                    Submit Another Claim
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-5 text-left animate-in fade-in duration-200">
            {/* Currency selector if funding crypto */}
            {isCrypto && (
                <Select
                    label={t('receive.momo.paymentCurrency')}
                    options={currencyOptions}
                    value={fundingCurrency}
                    onChange={(val) => setFundingCurrency(val as 'XOF' | 'XAF')}
                    searchable={false}
                />
            )}

            {/* Provider Numbers Selection */}
            <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    1. Choose Mobile Money Provider & Pay
                </span>

                {accountsQuery.isLoading ? (
                    <div className="p-6 text-center text-xs text-slate-400 bg-black/20 rounded-2xl border border-white/5 animate-pulse">
                        Loading collection accounts...
                    </div>
                ) : activeAccountsList.length === 0 ? (
                    <div className="p-4 text-center text-xs text-amber-400 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                        No active collection numbers found for {targetCurrency}. Please contact support.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {activeAccountsList.map((acc: any) => {
                            const isSelected = acc.id === selectedAccountId;
                            const displayName = acc.displayName || acc.display_name || acc.provider;
                            const phoneNumber = acc.phoneNumber || acc.phone_number;
                            const accountName = acc.accountName || acc.account_name;
                            const instructions = acc.instructions;

                            return (
                                <div
                                    key={acc.id}
                                    onClick={() => setSelectedAccountId(acc.id)}
                                    className={cn(
                                        "p-3.5 rounded-2xl border transition cursor-pointer flex flex-col space-y-2",
                                        isSelected
                                            ? "bg-primary-500/10 border-primary-500/40 ring-1 ring-primary-500/30"
                                            : "bg-[#0C1224] border-white/10 hover:border-white/20"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-400 shrink-0">
                                                <Smartphone className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-white block leading-tight">
                                                    {displayName}
                                                </span>
                                                {accountName && (
                                                    <span className="text-[10px] font-medium text-slate-400 block">
                                                        Holder: {accountName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase">
                                            {acc.currency}
                                        </span>
                                    </div>

                                    {/* Number display & Copy */}
                                    <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-3 py-2">
                                        <span className="text-xs font-mono font-bold text-white tracking-wider">
                                            {phoneNumber}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                copyToClipboard(phoneNumber);
                                            }}
                                            className="flex items-center space-x-1 text-[10px] font-bold text-primary-400 hover:text-primary-300 transition"
                                        >
                                            {copiedNumber && isSelected ? (
                                                <>
                                                    <Check className="h-3 w-3" />
                                                    <span>Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3 w-3" />
                                                    <span>Copy Number</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {acc.instructions && isSelected && (
                                        <p className="text-[10px] text-slate-400 italic bg-white/[0.02] p-2 rounded-lg leading-relaxed">
                                            💡 {acc.instructions}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Claim Form */}
            <form onSubmit={handleSubmitClaim} className="space-y-4 pt-2 border-t border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    2. Submit Payment Claim ("I've Paid")
                </span>

                <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Amount Paid ({targetCurrency}) *
                    </span>
                    <NumberInput
                        required
                        value={amount}
                        onChange={setAmount}
                        placeholder="e.g. 10000"
                        className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/50 w-full font-mono"
                    />
                </div>

                <PhoneInput
                    required
                    label="Your Mobile Money Phone Number *"
                    placeholder="+225 07 00 00 00 00"
                    value={senderPhone}
                    onChange={setSenderPhone}
                />

                <Input
                    required
                    label="Transaction Reference / Txn ID *"
                    placeholder="e.g. WAVE-TXN-123456"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                />

                <Input
                    required
                    label="Sender Name on Account *"
                    placeholder="e.g. Kofi Mensah"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                />

                <Button
                    type="submit"
                    isLoading={claimMutation.isPending}
                    disabled={!amount || !senderPhone || !reference || !senderName || !selectedAccountId}
                    className="w-full h-12 rounded-xl font-bold text-xs shadow-lg shadow-primary-500/10 mt-2"
                >
                    I've Paid — Submit Claim
                </Button>
            </form>
        </div>
    );
};
