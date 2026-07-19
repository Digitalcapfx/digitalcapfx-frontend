'use client'

import React from 'react'
import { Info, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrencyByLocale } from '@/lib/utils'
import { Wallet } from '../SendMoneySheet'
import { Beneficiary } from '@/services/withdrawal.service'

interface SendMoneyReviewProps {
    amount: string;
    activeWallet: Wallet;
    isCrypto: boolean;
    isMobileMoney: boolean;
    isInternal: boolean;
    displayRecipientName: string;
    note: string;
    quoteDetails: { fee: number; rate: number; totalAmount: number } | null;
    recipientType: 'new' | 'saved';
    activeBeneficiary: Beneficiary | undefined;
    operator: string;
    isPending: boolean;
    onBack: () => void;
    onConfirm: () => void;
}

export const SendMoneyReview: React.FC<SendMoneyReviewProps> = ({
    amount,
    activeWallet,
    isCrypto,
    isMobileMoney,
    isInternal,
    displayRecipientName,
    note,
    quoteDetails,
    recipientType,
    activeBeneficiary,
    operator,
    isPending,
    onBack,
    onConfirm,
}) => {
    // Computes review variables
    const feeAmount = isCrypto || isMobileMoney || isInternal
        ? (parseFloat(amount) * 0.001) // 0.1% internal P2P fee
        : (quoteDetails?.fee || 0);

    const totalSending = isCrypto || isMobileMoney || isInternal
        ? (parseFloat(amount) + feeAmount)
        : (parseFloat(amount));

    const totalRecipientGets = isCrypto || isMobileMoney || isInternal
        ? parseFloat(amount)
        : (quoteDetails?.totalAmount || parseFloat(amount));

    const displayRate = isCrypto || isMobileMoney || isInternal
        ? 1
        : (quoteDetails?.rate || 1);

    const isDifferentCurrency = !isCrypto && !isMobileMoney && !isInternal &&
        recipientType === 'saved' &&
        activeBeneficiary?.currency !== activeWallet.code;

    return (
        <div className="space-y-6 flex flex-col justify-between h-full text-left">
            <div className="space-y-5">
                <div className="bg-gradient-to-br from-[#0F172A] to-[#0A0F1D] border border-white/5 rounded-2.5xl p-6 text-center shadow-xl select-none">
                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block">Total Sending</span>
                    <span className="text-3.5xl font-black text-white block mt-1.5 font-satoshi">
                        {formatCurrencyByLocale(totalSending, activeWallet.code)}
                    </span>
                    <span className="text-[9.5px] text-slate-500 font-bold block mt-1.5 uppercase font-mono">
                        Base: {formatCurrencyByLocale(amount, activeWallet.code)}
                    </span>
                </div>

                <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-5 space-y-3.5 select-none text-xs font-sans">
                    <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Source Wallet</span>
                        <span className="font-bold text-white block">
                            {activeWallet.name} ({activeWallet.code})
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Recipient</span>
                        <span className="font-bold text-white block">{displayRecipientName}</span>
                    </div>

                    {!isCrypto && !isInternal && (
                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Operator / Method</span>
                            <span className="font-bold text-white block uppercase">
                                {isMobileMoney ? `${operator} Mobile Money` : 'Nilos Bank Wire'}
                            </span>
                        </div>
                    )}

                    {isDifferentCurrency && activeBeneficiary && (
                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Destination Currency</span>
                            <span className="font-bold text-white font-mono">{activeBeneficiary.currency}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Recipient Gets</span>
                        <span className="font-bold text-emerald-400 font-mono">
                            {formatCurrencyByLocale(totalRecipientGets, isDifferentCurrency && activeBeneficiary ? activeBeneficiary.currency : activeWallet.code)}
                        </span>
                    </div>

                    {!isCrypto && !isMobileMoney && !isInternal && displayRate !== 1 && (
                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Exchange Rate</span>
                            <span className="font-bold text-slate-350 font-mono">
                                1 {activeWallet.code} = {displayRate} {recipientType === 'saved' ? activeBeneficiary?.currency : activeWallet.code}
                            </span>
                        </div>
                    )}

                    {feeAmount > 0 ? (
                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Transfer fee</span>
                            <span className="font-bold text-white font-mono">
                                {formatCurrencyByLocale(feeAmount, activeWallet.code)} { (isCrypto || isMobileMoney || isInternal) && '(0.1%)' }
                            </span>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Transfer fee</span>
                            <span className="font-bold text-emerald-400">Free</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Settlement time</span>
                        <span className="font-bold text-white">
                            {isCrypto ? 'Instant' : isMobileMoney ? 'Instant' : 'Same day'}
                        </span>
                    </div>

                    <div className="flex justify-between items-start py-0.5">
                        <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px] pt-0.5">Reference</span>
                        <span className="font-bold text-slate-350 max-w-[200px] text-right truncate">
                            {note || 'Invoice payment'}
                        </span>
                    </div>
                </div>

                <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-4 flex items-start space-x-3 text-xs text-orange-400 leading-relaxed select-none">
                    <Info className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <p className="font-semibold text-[11px]">
                        Please confirm you're sending to the correct recipient. Mobile Money cashouts, bank withdrawals, and blockchain transfers cannot be recalled.
                    </p>
                </div>
            </div>

            <div className="flex flex-col space-y-2 mt-auto">
                <Button
                    onClick={onConfirm}
                    disabled={isPending}
                    className="w-full rounded-xl h-[52px] font-bold text-sm shadow-lg"
                    leftIcon={isPending && <RefreshCw className="h-4 w-4 animate-spin" />}
                >
                    {isPending ? 'Processing Transfer...' : 'Confirm & Send'}
                </Button>
                <button
                    onClick={onBack}
                    className="w-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 py-3.5 rounded-xl font-bold text-sm tracking-wide transition duration-200 border border-white/5 cursor-pointer animate-in"
                >
                    Back
                </button>
            </div>
        </div>
    );
};
