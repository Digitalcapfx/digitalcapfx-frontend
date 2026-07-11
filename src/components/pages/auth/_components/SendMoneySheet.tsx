'use client'

import React, { useState, useEffect } from 'react'
import { 
    ChevronDown, 
    Search, 
    ArrowLeft, 
    Check, 
    Download, 
    RefreshCw, 
    CheckCircle2,
    Info
} from 'lucide-react'
import { useTransactionStore } from '@/store/transactionStore'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { Sheet } from '@/components/ui/Sheet'
import { Switch } from '@/components/ui/Switch'
import { cn } from '@/lib/utils'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'
import { transferService } from '@/services/transfer.service'
import { toast } from 'sonner'

export interface Wallet {
    id: string;
    name: string;
    code: string;
    type: 'fiat' | 'stablecoin';
    balance: string;
    rawBalance: number;
    accountNumber?: string;
    walletAddress?: string;
}

const CURRENCY_NAMES: Record<string, string> = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    XOF: 'CFA Franc BCEAO',
    XAF: 'CFA Franc BEAC',
    USDC: 'USD Coin',
};

const formatBalance = (amount: string | number, currency: string) => {
    const val = typeof amount === 'number' ? amount : parseFloat(amount || '0');
    if (isNaN(val)) return '0.00';
    if (currency === 'XAF' || currency === 'XOF') {
        return val.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ` ${currency}`;
    }
    const symbols: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
    };
    const prefix = symbols[currency] || '';
    return prefix + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (prefix ? '' : ` ${currency}`);
};

// Beneficiary mock database
interface Beneficiary {
    id: string;
    name: string;
    country: string;
    currency: string;
    accountNumber: string;
    bankName: string;
    avatar: string;
}

const BENEFICIARIES: Beneficiary[] = [
    { id: '1', name: 'John Smith', country: 'United States', currency: 'USD', accountNumber: '4069999078837863', bankName: 'Wells Fargo Bank', avatar: 'JS' },
    { id: '2', name: 'Acme Corp Ltd', country: 'Germany', currency: 'EUR', accountNumber: '8843920193847581', bankName: 'Deutsche Bank', avatar: 'AC' },
    { id: '3', name: 'Remy Industries', country: 'France', currency: 'EUR', accountNumber: '3349204928104829', bankName: 'BNP Paribas', avatar: 'RI' },
];

export const SendMoneySheet: React.FC = () => {
    const queryClient = useQueryClient();
    const { isSendOpen, closeSend, sendDefaultWalletId } = useTransactionStore();

    // Wizard step state: 1 = Form, 2 = Review & Confirm, 3 = Success
    const [step, setStep] = useState<1 | 2 | 3>(1);
    
    // Form inputs state
    const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [recipientType, setRecipientType] = useState<'new' | 'saved'>('new');
    
    // New beneficiary inputs
    const [routingNumber, setRoutingNumber] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [bankDetails, setBankDetails] = useState('');
    const [receiverType, setReceiverType] = useState('');
    const [accountType, setAccountType] = useState('');
    
    // Crypto recipient inputs
    const [cryptoAddress, setCryptoAddress] = useState('');
    
    // Shared inputs
    const [note, setNote] = useState('');
    const [saveBeneficiary, setSaveBeneficiary] = useState(false);
    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>('1');
    const [searchQuery, setSearchQuery] = useState('');

    // Transaction Result states
    const [txRef, setTxRef] = useState('TXN-2026-9148');
    const [txStatus, setTxStatus] = useState('Processing');

    // Queries
    const fiatQuery = useQuery({
        queryKey: ['accounts'],
        queryFn: () => accountService.getAccounts(),
        enabled: isSendOpen,
    });

    const cryptoQuery = useQuery({
        queryKey: ['cryptoBalances'],
        queryFn: () => accountService.getCryptoBalances(),
        enabled: isSendOpen,
    });

    const walletsList: Wallet[] = [];

    // Map stablecoin wallet
    if (cryptoQuery.data?.success && cryptoQuery.data.data) {
        const d = cryptoQuery.data.data;
        walletsList.push({
            id: 'usdc',
            name: CURRENCY_NAMES.USDC,
            code: 'USDC',
            type: 'stablecoin',
            balance: formatBalance(d.balance_usdc, 'USDC'),
            rawBalance: parseFloat(d.balance_usdc || '0'),
            walletAddress: d.wallet_address,
        });
    }

    // Map fiat wallets
    if (fiatQuery.data?.success && Array.isArray(fiatQuery.data.data)) {
        fiatQuery.data.data.forEach((acc) => {
            walletsList.push({
                id: acc.currency.toLowerCase(),
                name: CURRENCY_NAMES[acc.currency] || acc.currency,
                code: acc.currency,
                type: 'fiat',
                balance: formatBalance(acc.balance, acc.currency),
                rawBalance: parseFloat(acc.balance || '0'),
                accountNumber: acc.account_number,
            });
        });
    }

    // Pre-select wallet if default is provided
    useEffect(() => {
        if (isSendOpen && walletsList.length > 0) {
            const matchesDefault = walletsList.find(w => w.id === sendDefaultWalletId);
            setSelectedWalletId(matchesDefault ? matchesDefault.id : walletsList[0].id);
            setStep(1);
            setAmount('');
            setNote('');
            setRoutingNumber('');
            setAccountNumber('');
            setAccountName('');
            setCryptoAddress('');
        }
    }, [isSendOpen, sendDefaultWalletId, walletsList.length]);

    const activeWallet = walletsList.find(w => w.id === selectedWalletId) || walletsList[0] || {
        id: 'usdc',
        name: 'USD Coin',
        code: 'USDC',
        type: 'stablecoin' as const,
        balance: '0.00 USDC',
        rawBalance: 0,
    };

    const isCrypto = activeWallet.type === 'stablecoin';

    // Computed recipient name/title for display
    const activeBeneficiary = BENEFICIARIES.find(b => b.id === selectedBeneficiaryId) || BENEFICIARIES[0];
    const displayRecipientName = isCrypto 
        ? (cryptoAddress ? `${cryptoAddress.slice(0, 8)}...${cryptoAddress.slice(-6)}` : 'Recipient Phone')
        : (recipientType === 'saved' ? activeBeneficiary.name : (accountName || 'New Recipient'));

    // Check if form is valid to proceed
    const isFormValid = () => {
        if (!selectedWalletId || !amount || parseFloat(amount) <= 0) return false;
        
        if (isCrypto) {
            return cryptoAddress.length > 5;
        } else {
            if (recipientType === 'saved') {
                return !!selectedBeneficiaryId;
            } else {
                return accountNumber.length > 4 && accountName.length > 1;
            }
        }
    };

    const handleProceed = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid()) {
            setStep(2);
        }
    };

    // Send Mutations
    const sendCryptoMutation = useMutation({
        mutationFn: (payload: { receiver_phone: string; amount: string }) => transferService.sendCrypto(payload),
        onSuccess: (data) => {
            if (data?.success && data?.data) {
                setTxRef(data.data.reference || data.data.transaction_hash || 'TXN-OK');
                setTxStatus('Completed');
                setStep(3);
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
                queryClient.invalidateQueries({ queryKey: ['cryptoBalances'] });
                queryClient.invalidateQueries({ queryKey: ['activity'] });
            } else {
                toast.error(data?.error?.message || 'Send stablecoin failed.');
            }
        },
        onError: (err: any) => {
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object' ? rawError.message : (rawError || 'Failed to send.');
            toast.error(msg);
        }
    });

    const withdrawMutation = useMutation({
        mutationFn: (payload: { amount: number; phone: string }) => transferService.withdraw(payload),
        onSuccess: (data) => {
            if (data?.success && data?.data) {
                setTxRef(data.data.reference || 'TXN-MM-OK');
                setTxStatus(data.data.status || 'Processing');
                setStep(3);
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
                queryClient.invalidateQueries({ queryKey: ['cryptoBalances'] });
                queryClient.invalidateQueries({ queryKey: ['activity'] });
            } else {
                toast.error(data?.error?.message || 'Withdrawal failed.');
            }
        },
        onError: (err: any) => {
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object' ? rawError.message : (rawError || 'Failed to withdraw.');
            toast.error(msg);
        }
    });

    const handleConfirmSend = () => {
        if (isCrypto) {
            sendCryptoMutation.mutate({
                receiver_phone: cryptoAddress,
                amount: amount,
            });
        } else {
            const phoneVal = recipientType === 'saved' ? activeBeneficiary.accountNumber : accountNumber;
            // If local MM currency XAF/XOF, withdraw to mobile money. Otherwise trigger standard transfer.
            if (activeWallet.code === 'XAF' || activeWallet.code === 'XOF') {
                withdrawMutation.mutate({
                    amount: parseFloat(amount),
                    phone: phoneVal,
                });
            } else {
                // Mock international wire transfer
                setTxRef(`TXN-WIRE-${Math.floor(1000 + Math.random() * 9000)}`);
                setTxStatus('Processing');
                setStep(3);
                toast.success('Wire transfer initiated successfully!');
            }
        }
    };

    const handleReset = () => {
        setStep(1);
        setAmount('');
        setNote('');
        setRoutingNumber('');
        setAccountNumber('');
        setAccountName('');
        setCryptoAddress('');
    };

    const isPending = sendCryptoMutation.isPending || withdrawMutation.isPending;

    return (
        <Sheet
            isOpen={isSendOpen}
            onClose={closeSend}
            title="Send Money"
            description="Send fiat or stablecoins anywhere in the world"
        >
            {step === 1 && (
                /* Step 1: Input details form */
                <form onSubmit={handleProceed} className="space-y-6 flex flex-col justify-between h-full text-left">
                    <div className="space-y-5">
                        
                        {/* Selector for FROM Wallet */}
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Source Wallet</span>
                            <div className="relative">
                                <div 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="bg-[#0C1224] border border-white/10 hover:border-white/15 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition select-none"
                                >
                                    <div className="flex items-center space-x-3">
                                        <CurrencyIcon code={activeWallet.code} size="md" />
                                        <div className="text-left">
                                            <span className="font-bold text-white block text-sm leading-tight">{activeWallet.name}</span>
                                            <span className="text-[9px] text-slate-500 font-bold uppercase block mt-0.5">{activeWallet.code} • Balance: {activeWallet.balance}</span>
                                        </div>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-slate-500" />
                                </div>

                                {/* Dropdown FROM selections */}
                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1528] border border-white/10 rounded-2xl shadow-2xl z-30 max-h-[220px] overflow-y-auto scrollbar-none py-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                        {walletsList.map((w) => (
                                            <div
                                                key={w.id}
                                                onClick={() => {
                                                    setSelectedWalletId(w.id);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={cn(
                                                    "px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition",
                                                    selectedWalletId === w.id ? "bg-white/[0.01]" : ""
                                                )}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <CurrencyIcon code={w.code} size="md" />
                                                    <div className="text-left">
                                                        <span className="font-bold text-white text-xs block leading-tight">{w.name}</span>
                                                        <span className="text-[9px] text-slate-500 font-bold uppercase">{w.code} • {w.balance}</span>
                                                    </div>
                                                </div>
                                                {selectedWalletId === w.id && <Check className="h-4 w-4 text-primary-400" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Amount Entry Card */}
                        <div className="bg-[#0C1224] border border-white/10 rounded-2xl p-5 text-center relative select-none">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Enter Amount</span>
                            <div className="flex items-center justify-center space-x-1 py-1">
                                <input 
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-center text-white font-mono font-black text-3.5xl placeholder-slate-700 w-full max-w-[240px] leading-none"
                                />
                                {activeWallet.type !== 'fiat' && (
                                    <span className="text-2xl font-black text-slate-500 font-mono uppercase">{activeWallet.code}</span>
                                )}
                            </div>
                        </div>

                        <div className="h-[1px] bg-white/5 my-1"></div>

                        {isCrypto ? (
                            /* Crypto Recipient Input */
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Recipient Mobile or Address</span>
                                    <input 
                                        type="text"
                                        value={cryptoAddress}
                                        onChange={(e) => setCryptoAddress(e.target.value)}
                                        placeholder="Enter receiver's phone number (e.g. +2376...)"
                                        className="bg-black/30 border border-white/10 rounded-xl px-4.5 py-3.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 w-full font-mono"
                                    />
                                </div>
                            </div>
                        ) : (
                            /* Fiat Recipient Form */
                            <div className="space-y-4">
                                <div className="flex bg-black/30 border border-white/5 p-1 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setRecipientType('new')}
                                        className={cn(
                                            "flex-1 py-2 text-[11px] font-bold rounded-lg transition duration-200 cursor-pointer select-none",
                                            recipientType === 'new' 
                                                ? "bg-primary-500 text-white shadow-md" 
                                                : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        New Beneficiary
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRecipientType('saved')}
                                        className={cn(
                                            "flex-1 py-2 text-[11px] font-bold rounded-lg transition duration-200 cursor-pointer select-none",
                                            recipientType === 'saved' 
                                                ? "bg-primary-500 text-white shadow-md" 
                                                : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        Saved
                                    </button>
                                </div>

                                {recipientType === 'new' ? (
                                    <div className="space-y-4 animate-in fade-in duration-200">
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Mobile or Account Number*</span>
                                            <input 
                                                type="text"
                                                required
                                                value={accountNumber}
                                                onChange={(e) => setAccountNumber(e.target.value)}
                                                placeholder={activeWallet.code === 'XAF' || activeWallet.code === 'XOF' ? "Enter MoMo phone number (e.g. +237...)" : "Enter Account Number"}
                                                className="bg-black/30 border border-white/10 rounded-xl px-4.5 py-3.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 w-full font-mono"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Recipient Full Name*</span>
                                            <input 
                                                type="text"
                                                required
                                                value={accountName}
                                                onChange={(e) => setAccountName(e.target.value)}
                                                placeholder="Enter recipient's name"
                                                className="bg-black/30 border border-white/10 rounded-xl px-4.5 py-3.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 w-full font-sans"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 animate-in fade-in duration-200">
                                        <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Select Beneficiary</span>
                                        <select 
                                            value={selectedBeneficiaryId}
                                            onChange={(e) => setSelectedBeneficiaryId(e.target.value)}
                                            className="bg-[#0C1224] border border-white/10 rounded-xl px-4.5 py-3.5 text-xs text-white focus:outline-none w-full font-sans select-none"
                                        >
                                            {BENEFICIARIES.map(b => (
                                                <option key={b.id} value={b.id}>
                                                    {b.name} ({b.bankName} - {b.accountNumber.slice(-4)})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Reference / Note</span>
                            <input 
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Enter transfer reference"
                                className="bg-black/30 border border-white/10 rounded-xl px-4.5 py-3.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-primary-500/50 w-full font-sans"
                            />
                        </div>

                    </div>

                    <div className="space-y-3 mt-auto">
                        <button
                            type="submit"
                            disabled={!isFormValid()}
                            className={cn(
                                "w-full py-4 rounded-xl font-bold text-sm tracking-wide shadow-lg transition duration-200 cursor-pointer active:scale-[0.98]",
                                isFormValid() 
                                    ? "bg-primary-500 hover:bg-primary-450 text-white shadow-primary-500/10" 
                                    : "bg-slate-800 text-slate-550 cursor-not-allowed"
                            )}
                        >
                            Send {amount ? `${activeWallet.type === 'fiat' ? '$' : ''}${parseFloat(amount).toLocaleString()} ${activeWallet.type === 'fiat' ? '' : activeWallet.code || ''}` : ''}
                        </button>
                        <span className="text-[10px] text-slate-555 block text-center select-none leading-relaxed">
                            Funds reflect instantly or within a few minutes
                        </span>
                    </div>
                </form>
            )}

            {step === 2 && (
                /* Step 2: Review and Confirm conversion */
                <div className="space-y-6 flex flex-col justify-between h-full text-left">
                    <div className="space-y-5">
                        
                        <div className="bg-gradient-to-br from-[#0F172A] to-[#0A0F1D] border border-white/5 rounded-3xl p-6.5 text-center shadow-xl select-none">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">You are sending</span>
                            <span className="text-2.5xl md:text-3.5xl font-black text-white block mt-1.5 font-satoshi">
                                {activeWallet.type === 'fiat' ? '$' : ''}{parseFloat(amount).toLocaleString()} {activeWallet.code}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 block mt-1">
                                from your {activeWallet.name} Wallet
                            </span>
                        </div>

                        <div className="bg-black/20 border border-white/5 rounded-2.5xl p-5 space-y-3.5 select-none font-sans text-xs">
                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Recipient</span>
                                <div className="text-right">
                                    <span className="font-bold text-white block">{displayRecipientName}</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Recipient gets</span>
                                <span className="font-bold text-emerald-400 font-mono">
                                    {activeWallet.type === 'fiat' ? '$' : ''}{parseFloat(amount).toLocaleString()} {activeWallet.code}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Transfer fee</span>
                                <span className="font-bold text-white font-mono">
                                    {activeWallet.type === 'fiat' ? '$' : ''}{(parseFloat(amount) * 0.001).toFixed(2)} (0.1%)
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Settlement time</span>
                                <span className="font-bold text-white">Instant / Same day</span>
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
                                Please confirm you're sending to the correct recipient. Mobile Money cashouts and blockchain transfers cannot be recalled.
                            </p>
                        </div>

                    </div>

                    <div className="flex flex-col space-y-2 mt-auto">
                        <button
                            onClick={handleConfirmSend}
                            disabled={isPending}
                            className="w-full bg-primary-500 hover:bg-primary-450 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transition duration-200 cursor-pointer active:scale-[0.98]"
                        >
                            {isPending ? 'Sending...' : 'Confirm & Send'}
                        </button>
                        <button
                            onClick={() => setStep(1)}
                            className="w-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 py-3.5 rounded-xl font-bold text-sm tracking-wide transition duration-200 border border-white/5 cursor-pointer animate-in"
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                /* Step 3: Success Screen details */
                <div className="space-y-6 flex flex-col justify-between h-full text-center">
                    
                    <div className="space-y-6 select-none pt-8">
                        <div className="relative inline-flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-[20px]"></div>
                            <div className="relative w-18 h-18 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                                <CheckCircle2 className="h-9 w-9" />
                            </div>
                        </div>
                        
                        <div className="space-y-2 max-w-sm mx-auto">
                            <span className="text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase font-mono block">
                                Transfer Sent
                            </span>
                            <h2 className="font-satoshi font-black text-2.5xl text-white tracking-tight">
                                {activeWallet.type === 'fiat' ? '$' : ''}{parseFloat(amount).toLocaleString()} {activeWallet.code}
                            </h2>
                            <p className="text-slate-400 text-xs font-sans leading-relaxed">
                                successfully sent to <strong className="text-white font-bold">{displayRecipientName}</strong>
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-5 text-left space-y-3.5 select-none font-sans text-xs max-w-md mx-auto w-full">
                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Transaction ID</span>
                            <span className="font-mono text-slate-350">{txRef}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Est. delivery</span>
                            <span className="text-white">Instant / Same day</span>
                        </div>

                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Recipient</span>
                            <span className="font-bold text-white">{displayRecipientName}</span>
                        </div>

                        <div className="flex justify-between items-start py-0.5">
                            <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px] pt-0.5">Reference</span>
                            <span className="font-bold text-slate-350 max-w-[200px] truncate">{note || 'Fund transfer'}</span>
                        </div>

                        <div className="flex justify-between items-center py-0.5 border-t border-white/5 pt-3">
                            <span className="text-slate-555 font-bold uppercase tracking-wider text-[9px]">Status</span>
                            <span className="text-emerald-400 font-bold">{txStatus}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-auto">
                        <button
                            onClick={() => alert('Downloading receipt PDF...')}
                            className="bg-transparent hover:bg-white/[0.02] border border-white/15 text-white font-bold text-xs py-3.5 rounded-xl transition duration-200 cursor-pointer flex items-center justify-center space-x-1.5"
                        >
                            <Download className="h-4 w-4 text-slate-400" />
                            <span>Receipt</span>
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-primary-500 hover:bg-primary-450 text-white font-bold text-xs py-3.5 rounded-xl transition duration-200 cursor-pointer flex items-center justify-center space-x-1.5 active:scale-[0.98]"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>Send Again</span>
                        </button>
                    </div>

                </div>
            )}
        </Sheet>
    );
};

export default SendMoneySheet;
