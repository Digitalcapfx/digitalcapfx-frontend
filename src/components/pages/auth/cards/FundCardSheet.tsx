'use client'

import React, { useState, useEffect } from 'react'
import { 
    Check, 
    ChevronDown, 
    CheckCircle2, 
    Info,
    Download,
    RefreshCw
} from 'lucide-react'
import { useCardStore } from '@/store/cardStore'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { Sheet } from '@/components/ui/Sheet'
import { cn, formatCurrencyByLocale } from '@/lib/utils'
import { NumberInput } from '@/components/ui/NumberInput'
import { useQuery } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'

const CURRENCY_NAMES: Record<string, string> = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    XOF: 'CFA Franc BCEAO',
    XAF: 'CFA Franc BEAC',
    USDC: 'USD Coin',
    IUSD: 'Instant USD',
};

const formatBalance = (amount: string | number, currency: string) => {
    return formatCurrencyByLocale(amount, currency);
};

export const FundCardSheet: React.FC = () => {
    const { isFundOpen, closeFund, activeCardId, cards, fundCard } = useCardStore();
    
    // Wizard step state: 1 = Form, 2 = Confirm, 3 = Success
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [amount, setAmount] = useState('');

    const fiatQuery = useQuery({
        queryKey: ['accounts'],
        queryFn: () => accountService.getAccounts(),
        enabled: isFundOpen,
    });

    const cryptoQuery = useQuery({
        queryKey: ['cryptoBalances'],
        queryFn: () => accountService.getCryptoBalances(),
        enabled: isFundOpen,
    });

    const walletsList: any[] = [];
    if (cryptoQuery.data?.success && cryptoQuery.data.data) {
        const d = cryptoQuery.data.data;
        const symbol = d.symbol || 'iUSD';
        walletsList.push({
            name: d.name || CURRENCY_NAMES[symbol.toUpperCase()] || 'Instant USD',
            code: symbol,
            balance: d.balanceFormatted || (d.balanceUsdc + ' ' + symbol),
            rawBalance: parseFloat(d.balanceUsdc || '0'),
        });
    }
    if (fiatQuery.data?.success && Array.isArray(fiatQuery.data.data)) {
        fiatQuery.data.data.forEach((acc) => {
            walletsList.push({
                name: CURRENCY_NAMES[acc.currency] || acc.currency,
                code: acc.currency,
                balance: formatBalance(acc.balance, acc.currency),
                rawBalance: parseFloat(acc.balance || '0'),
            });
        });
    }

    useEffect(() => {
        if (isFundOpen) {
            setStep(1);
            setAmount('');
        }
    }, [isFundOpen]);

    const card = cards.find(c => c.id === activeCardId);
    
    // Auto-select source wallet matching card currency
    const fundingWallet = card 
        ? walletsList.find((w: any) => w.code.toUpperCase() === card.currency.toUpperCase())
        : null;

    const isFormValid = () => {
        if (!amount || parseFloat(amount) <= 0) return false;
        if (!fundingWallet) return false;
        
        // Ensure they have enough balance in the wallet
        const balanceNum = fundingWallet.rawBalance;
        return parseFloat(amount) <= balanceNum;
    };

    const handleProceed = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid()) {
            setStep(2);
        }
    };

    const handleConfirm = () => {
        if (card && amount) {
            fundCard(card.id, parseFloat(amount));
            setStep(3);
        }
    };

    const handleDone = () => {
        closeFund();
    };

    if (!card) return null;

    const fee = parseFloat(amount || '0') * 0.001; // 0.1% funding fee

    return (
        <Sheet
            isOpen={isFundOpen}
            onClose={closeFund}
            title={step === 1 ? "Fund Card" : step === 2 ? "Review & confirm" : undefined}
            description={step === 1 ? "Top up your virtual card instantly" : step === 2 ? "Please verify all details before funding." : undefined}
        >
            {step === 1 && (
                <form onSubmit={handleProceed} className="space-y-6 flex flex-col justify-between h-full text-left">
                    
                    <div className="space-y-5">
                        {/* FROM - Wallet display (No Dropdown Chevron) */}
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">From</span>
                            <div className="bg-[#0C1224] border border-white/15 rounded-2xl p-4 flex items-center justify-between transition select-none">
                                {fundingWallet ? (
                                    <div className="flex items-center space-x-3">
                                        <CurrencyIcon code={fundingWallet.code} size="md" />
                                        <div className="text-left">
                                            <span className="font-bold text-white block text-sm leading-tight">{fundingWallet.name}</span>
                                            <span className="text-[9px] text-slate-550 font-bold uppercase block mt-0.5">{fundingWallet.code} Wallet</span>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-xs text-rose-400">No matching wallet found</span>
                                )}

                                {/* Amount Input */}
                                <div className="flex items-center space-x-2 shrink-0">
                                    {card.currency === 'USD' && (
                                        <span className="text-sm font-bold text-slate-550 font-mono select-none">$</span>
                                    )}
                                    <NumberInput 
                                        value={amount}
                                        onChange={setAmount}
                                        placeholder="0.00"
                                        className="w-24 bg-transparent border-none focus:outline-none focus:ring-0 text-right text-white font-mono font-black text-sm placeholder-slate-700"
                                    />
                                    {card.currency !== 'USD' && (
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide font-mono select-none ml-1">
                                            {card.currency}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="text-[10px] text-slate-550 font-bold select-none px-1">
                                Account Balance: <span className="text-slate-350 font-mono">{fundingWallet ? fundingWallet.balance : '--'}</span>
                            </div>
                        </div>

                        {/* TO - Target Suffix Card */}
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">To Card</span>
                            <div className="bg-[#0C1224] border border-white/5 rounded-2xl p-4 flex items-center justify-between select-none">
                                <div className="flex items-center space-x-3 text-left">
                                    <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center text-primary-400 shrink-0">
                                        💳
                                    </div>
                                    <div>
                                        <span className="font-bold text-white text-xs block leading-tight">{card.name}</span>
                                        <span className="text-[9px] text-slate-550 font-bold block mt-0.5">{card.holder}</span>
                                    </div>
                                </div>
                                <span className="font-mono text-slate-400 text-xs font-bold">
                                    **** {card.number}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Funding action */}
                    <div className="space-y-3 pt-6 border-t border-white/5 mt-auto">
                        <button
                            type="submit"
                            disabled={!isFormValid()}
                            className={cn(
                                "w-full py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transition duration-200 cursor-pointer active:scale-[0.98]",
                                isFormValid() 
                                    ? "bg-primary-500 hover:bg-primary-450 text-white" 
                                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                            )}
                        >
                            Fund Card {amount ? `(${parseFloat(amount).toLocaleString()} ${card.currency})` : ''}
                        </button>
                        <span className="text-[10px] text-slate-555 block text-center select-none leading-relaxed">
                            Funds reflect instantly on card balance
                        </span>
                    </div>

                </form>
            )}

            {step === 2 && (
                <div className="space-y-6 flex flex-col justify-between h-full text-left">
                    <div className="space-y-5">
                        
                        {/* Summary Display Card */}
                        <div className="bg-gradient-to-br from-[#0F172A] to-[#0A0F1D] border border-white/5 rounded-3xl p-6.5 text-center shadow-xl select-none">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">You are Funding</span>
                            <span className="text-2.5xl md:text-3.5xl font-black text-white block mt-1.5 font-satoshi">
                                {card.currency === 'USD' ? '$' : ''}{parseFloat(amount).toLocaleString()} {card.currency}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 block mt-1">
                                from your {fundingWallet?.name} Wallet
                            </span>
                        </div>

                        {/* Details parameters table */}
                        <div className="bg-black/20 border border-white/5 rounded-2.5xl p-5 space-y-3.5 select-none font-sans text-xs">
                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Card Recipient</span>
                                <div className="text-right">
                                    <span className="font-bold text-white block">{card.holder}</span>
                                    <span className="text-[9.5px] font-medium text-slate-500 block mt-0.5">Virtual Card **** {card.number}</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Card gets</span>
                                <span className="font-bold text-emerald-400 font-mono">
                                    {card.currency === 'USD' ? '$' : ''}{parseFloat(amount).toLocaleString()} {card.currency}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Exchange rate</span>
                                <span className="font-bold text-slate-400 font-mono">No conversion (same currency)</span>
                            </div>

                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Transfer fee</span>
                                <span className="font-bold text-white font-mono">
                                    {card.currency === 'USD' ? '$' : ''}{fee.toFixed(2)} (0.1%)
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Settlement time</span>
                                <span className="font-bold text-white">Instant</span>
                            </div>
                        </div>

                        {/* Caution info panel */}
                        <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-4 flex items-start space-x-3 text-xs text-orange-400 leading-relaxed select-none">
                            <Info className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                            <p className="font-semibold text-[11px]">
                                Card funding operations are final. Please make sure card limits allow this top up.
                            </p>
                        </div>

                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col space-y-2 mt-auto">
                        <button
                            onClick={handleConfirm}
                            className="w-full bg-primary-500 hover:bg-primary-450 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transition duration-200 cursor-pointer active:scale-[0.98]"
                        >
                            Confirm & Send
                        </button>
                        <button
                            onClick={() => setStep(1)}
                            className="w-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 py-3.5 rounded-xl font-bold text-sm tracking-wide transition duration-200 border border-white/5 cursor-pointer"
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6 flex flex-col justify-between h-full text-center">
                    
                    {/* Success Logo animation container */}
                    <div className="space-y-6 select-none pt-8">
                        <div className="relative inline-flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-[20px]"></div>
                            <div className="relative w-18 h-18 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                                <CheckCircle2 className="h-9 w-9" />
                            </div>
                        </div>
                        
                        <div className="space-y-2 max-w-sm mx-auto">
                            <span className="text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase font-mono block">
                                Funding Success
                            </span>
                            <h2 className="font-satoshi font-black text-2.5xl text-white tracking-tight">
                                {card.currency === 'USD' ? '$' : ''}{parseFloat(amount).toLocaleString()} {card.currency}
                            </h2>
                            <p className="text-slate-400 text-xs font-sans leading-relaxed">
                                successfully loaded to card <strong className="text-white font-bold">{card.name} (**** {card.number})</strong>
                            </p>
                        </div>
                    </div>

                    {/* Transaction logs receipt block */}
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-5 text-left space-y-3.5 select-none font-sans text-xs max-w-md mx-auto w-full">
                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Transaction ID</span>
                            <span className="font-mono text-slate-350">TXN-CARD-{Math.floor(1000 + Math.random() * 9000)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Target Card</span>
                            <span className="text-white font-bold">{card.name} (**** {card.number})</span>
                        </div>

                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Fund Holder</span>
                            <span className="text-white font-bold">{card.holder}</span>
                        </div>

                        <div className="flex justify-between items-center py-0.5 border-t border-white/5 pt-3">
                            <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Status</span>
                            <span className="text-emerald-400 font-bold">Completed</span>
                        </div>
                    </div>

                    {/* Done button */}
                    <button
                        onClick={handleDone}
                        className="w-full bg-primary-500 hover:bg-primary-450 text-white font-bold text-sm py-4 rounded-xl shadow-lg transition duration-200 cursor-pointer active:scale-[0.98] mt-auto select-none"
                    >
                        Done
                    </button>

                </div>
            )}
        </Sheet>
    );
};

export default FundCardSheet;
