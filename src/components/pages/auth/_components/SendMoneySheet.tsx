'use client'

import React, { useState, useEffect } from 'react'
import { 
    ChevronDown, 
    Search, 
    ArrowLeft, 
    Check, 
    HelpCircle, 
    Download, 
    RefreshCw, 
    CheckCircle2,
    Info
} from 'lucide-react'
import { useTransactionStore } from '@/store/transactionStore'
import { WALLETS_DATA, Wallet } from '../wallet/WalletsPage'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { Sheet } from '@/components/ui/Sheet'
import { Switch } from '@/components/ui/Switch'
import { cn } from '@/lib/utils'

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

    // Pre-select wallet if default is provided
    useEffect(() => {
        if (isSendOpen) {
            setSelectedWalletId(sendDefaultWalletId);
            setStep(1);
            setAmount('');
            setNote('');
            setRoutingNumber('');
            setAccountNumber('');
            setAccountName('');
            setCryptoAddress('');
        }
    }, [isSendOpen, sendDefaultWalletId]);

    const activeWallet = WALLETS_DATA.find(w => w.id === selectedWalletId);
    const isCrypto = activeWallet ? (activeWallet.type === 'crypto' || activeWallet.type === 'stablecoin') : false;

    // Computed recipient name/title for display
    const activeBeneficiary = BENEFICIARIES.find(b => b.id === selectedBeneficiaryId) || BENEFICIARIES[0];
    const displayRecipientName = isCrypto 
        ? (cryptoAddress ? `${cryptoAddress.slice(0, 8)}...${cryptoAddress.slice(-6)}` : 'Crypto Address')
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
                return routingNumber.length > 3 && accountNumber.length > 4 && accountName.length > 1;
            }
        }
    };

    const handleProceed = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid()) {
            setStep(2);
        }
    };

    const handleConfirmSend = () => {
        setStep(3);
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

    const filteredBeneficiaries = BENEFICIARIES.filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.bankName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Sheet 
            isOpen={isSendOpen} 
            onClose={closeSend}
            title={step === 1 ? "Send Money" : step === 2 ? "Review & confirm" : undefined}
            description={step === 1 ? "Transfer to anyone, anywhere" : step === 2 ? "Please verify all details before sending." : undefined}
        >
            {step === 1 && (
                <form onSubmit={handleProceed} className="space-y-6 flex flex-col justify-between h-full text-left">
                    <div className="space-y-5">
                        
                        {/* Wallet From dropdown selector card */}
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">From</span>
                            <div className="relative">
                                <div 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="bg-[#0C1224] border border-white/10 hover:border-white/15 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition select-none"
                                >
                                    {activeWallet ? (
                                        <div className="flex items-center space-x-3">
                                            <CurrencyIcon code={activeWallet.code} size="md" />
                                            <div className="text-left">
                                                <span className="font-bold text-white block text-sm leading-tight">{activeWallet.name}</span>
                                                <span className="text-[9px] text-slate-500 font-bold uppercase block mt-0.5">{activeWallet.code} • {activeWallet.type}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-3 text-slate-500">
                                            <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-dashed border-white/10 flex items-center justify-center shrink-0">
                                                <span className="text-xs">?</span>
                                            </div>
                                            <span className="text-sm font-semibold">Select source wallet</span>
                                        </div>
                                    )}
                                    
                                    {/* Dropdown Chevron */}
                                    <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                                </div>

                                {/* Dropdown menu overlay */}
                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1528] border border-white/10 rounded-2xl shadow-2xl z-30 max-h-[220px] overflow-y-auto scrollbar-none py-1.5">
                                        {WALLETS_DATA.map((w) => (
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

                            {/* Wallet Balance Info */}
                            <div className="text-[10px] text-slate-500 font-bold tracking-wide select-none">
                                Account Balance: <span className="font-mono text-slate-350">{activeWallet ? activeWallet.balance : '--'}</span>
                            </div>
                        </div>

                        {/* If Wallet Selected -> Render To recipients forms */}
                        {selectedWalletId && (
                            <div className="space-y-4">
                                
                                {/* Standalone Amount Card */}
                                <div className="space-y-2">
                                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Amount</span>
                                    <div className="bg-[#0C1224] border border-white/10 focus-within:border-primary-500/50 rounded-2xl p-5 text-center flex flex-col items-center justify-center space-y-1 relative shadow-inner">
                                        <div className="flex items-center justify-center space-x-1.5 w-full">
                                            {activeWallet?.type === 'fiat' && (
                                                <span className="text-3xl font-black text-slate-500 font-mono select-none">$</span>
                                            )}
                                            <input 
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="bg-transparent border-none focus:outline-none focus:ring-0 text-center text-white font-mono font-black text-3.5xl placeholder-slate-700 w-full max-w-[240px] leading-none"
                                            />
                                            {activeWallet?.type !== 'fiat' && (
                                                <span className="text-2xl font-black text-slate-500 font-mono select-none uppercase">{activeWallet?.code}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[1px] bg-white/5 my-1"></div>

                                {isCrypto ? (
                                    /* Crypto Destination address form */
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Recipient</span>
                                            <input 
                                                type="text"
                                                value={cryptoAddress}
                                                onChange={(e) => setCryptoAddress(e.target.value)}
                                                placeholder={`Enter destination ${activeWallet?.code} address`}
                                                className="bg-black/30 border border-white/10 rounded-xl px-4.5 py-3.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 w-full font-mono"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    /* Fiat Destination bank account form */
                                    <div className="space-y-4">
                                        
                                        {/* To Selector switcher */}
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
                                                Saved Beneficiary
                                            </button>
                                        </div>

                                        {recipientType === 'new' ? (
                                            /* Render New Beneficiary Form fields */
                                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-none">
                                                {/* Recipient bank details dropdown */}
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Recipient bank details</span>
                                                    <select 
                                                        value={bankDetails}
                                                        onChange={(e) => setBankDetails(e.target.value)}
                                                        className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-500/50 w-full font-sans cursor-pointer"
                                                    >
                                                        <option value="" disabled className="bg-[#080D1C] text-slate-550">Select receiver bank details</option>
                                                        <option value="wire" className="bg-[#080D1C] text-white">International Wire (SWIFT)</option>
                                                        <option value="ach" className="bg-[#080D1C] text-white">Local Transfer (ACH)</option>
                                                    </select>
                                                </div>

                                                {/* Receiver type */}
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Receiver type</span>
                                                    <select 
                                                        value={receiverType}
                                                        onChange={(e) => setReceiverType(e.target.value)}
                                                        className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-500/50 w-full font-sans cursor-pointer"
                                                    >
                                                        <option value="" disabled className="bg-[#080D1C] text-slate-550">Select receiver type</option>
                                                        <option value="individual" className="bg-[#080D1C] text-white">Individual</option>
                                                        <option value="company" className="bg-[#080D1C] text-white">Company</option>
                                                    </select>
                                                </div>

                                                {/* ACH routing number */}
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">ACH routing number</span>
                                                    <input 
                                                        type="text"
                                                        value={routingNumber}
                                                        onChange={(e) => setRoutingNumber(e.target.value)}
                                                        placeholder="Enter ach routing number"
                                                        className="bg-black/30 border border-white/10 rounded-xl px-4.5 py-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 w-full font-mono"
                                                    />
                                                </div>

                                                {/* Account number */}
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Account number</span>
                                                    <input 
                                                        type="text"
                                                        value={accountNumber}
                                                        onChange={(e) => setAccountNumber(e.target.value)}
                                                        placeholder="Enter account number"
                                                        className="bg-black/30 border border-white/10 rounded-xl px-4.5 py-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 w-full font-mono"
                                                    />
                                                </div>

                                                {/* Account type */}
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Account type</span>
                                                    <select 
                                                        value={accountType}
                                                        onChange={(e) => setAccountType(e.target.value)}
                                                        className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-500/50 w-full font-sans cursor-pointer"
                                                    >
                                                        <option value="" disabled className="bg-[#080D1C] text-slate-550">Select account type</option>
                                                        <option value="checking" className="bg-[#080D1C] text-white">Checking</option>
                                                        <option value="savings" className="bg-[#080D1C] text-white">Savings</option>
                                                    </select>
                                                </div>

                                                {/* Account name */}
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Account name</span>
                                                    <input 
                                                        type="text"
                                                        value={accountName}
                                                        onChange={(e) => setAccountName(e.target.value)}
                                                        placeholder="Enter account name"
                                                        className="bg-black/30 border border-white/10 rounded-xl px-4.5 py-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 w-full font-sans"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            /* Render Saved Beneficiary list selection */
                                            <div className="space-y-3">
                                                {/* Inline search filter */}
                                                <div className="relative flex items-center w-full">
                                                    <Search className="absolute left-3.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                                                    <input 
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        placeholder="Search beneficiaries..."
                                                        className="bg-black/30 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 w-full font-sans"
                                                    />
                                                </div>

                                                {/* Beneficiary Grid Items scroll list */}
                                                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-none">
                                                    {filteredBeneficiaries.map((b) => (
                                                        <div
                                                            key={b.id}
                                                            onClick={() => setSelectedBeneficiaryId(b.id)}
                                                            className={cn(
                                                                "p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none",
                                                                selectedBeneficiaryId === b.id 
                                                                    ? "bg-primary-500/10 border-primary-500/30" 
                                                                    : "bg-black/25 border-white/5 hover:border-white/15"
                                                            )}
                                                        >
                                                            <div className="flex items-center space-x-3 text-left">
                                                                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center font-bold text-xs text-slate-300">
                                                                    {b.avatar}
                                                                </div>
                                                                <div className="space-y-0.5">
                                                                    <span className="font-bold text-white text-xs block leading-tight">{b.name}</span>
                                                                    <span className="text-[9px] text-slate-500 font-bold block">{b.country} • {b.currency}</span>
                                                                    <span className="text-[9px] text-slate-600 font-mono block mt-0.5">Account: {b.accountNumber.slice(0,4)}...{b.accountNumber.slice(-4)}</span>
                                                                </div>
                                                            </div>
                                                            {selectedBeneficiaryId === b.id && (
                                                                <Check className="h-4 w-4 text-primary-400 shrink-0" />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Add note input */}
                                <div className="space-y-1.5 text-left">
                                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Add Note (optional)</span>
                                    <input 
                                        type="text"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="what's this transfer for?"
                                        className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 w-full font-sans"
                                    />
                                </div>

                                {/* Save beneficiary toggle (New Recipient only) */}
                                {!isCrypto && recipientType === 'new' && (
                                    <div className="flex items-center justify-between p-3.5 bg-black/25 border border-white/5 rounded-2xl select-none">
                                        <div className="text-left space-y-0.5">
                                            <span className="text-xs font-bold text-white block">Save Beneficiary</span>
                                            <span className="text-[9px] text-slate-500 font-bold block">Save details for instant transfers in future</span>
                                        </div>
                                        <Switch 
                                            checked={saveBeneficiary}
                                            onChange={setSaveBeneficiary}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Action button */}
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
                            Send {amount ? `${activeWallet?.type === 'fiat' ? '$' : ''}${parseFloat(amount).toLocaleString()} ${activeWallet?.type === 'fiat' ? '' : activeWallet?.code || ''}` : ''}
                        </button>
                        <span className="text-[10px] text-slate-550 block text-center select-none leading-relaxed">
                            Funds reflect instantly or within a few minutes
                        </span>
                    </div>
                </form>
            )}

            {step === 2 && (
                <div className="space-y-6 flex flex-col justify-between h-full text-left">
                    <div className="space-y-5">
                        
                        {/* Summary Display Card */}
                        <div className="bg-gradient-to-br from-[#0F172A] to-[#0A0F1D] border border-white/5 rounded-3xl p-6.5 text-center shadow-xl select-none">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">You are sending</span>
                            <span className="text-2.5xl md:text-3.5xl font-black text-white block mt-1.5 font-satoshi">
                                {activeWallet?.type === 'fiat' ? '$' : ''}{parseFloat(amount).toLocaleString()} {activeWallet?.code}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 block mt-1">
                                from your {activeWallet?.name} Wallet
                            </span>
                        </div>

                        {/* Details parameters table */}
                        <div className="bg-black/20 border border-white/5 rounded-2.5xl p-5 space-y-3.5 select-none font-sans text-xs">
                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Recipient</span>
                                <div className="text-right">
                                    <span className="font-bold text-white block">{displayRecipientName}</span>
                                    {!isCrypto && (
                                        <span className="text-[9.5px] font-medium text-slate-500 block mt-0.5">
                                            {recipientType === 'saved' ? activeBeneficiary.country : 'United States'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Recipient gets</span>
                                <span className="font-bold text-emerald-400 font-mono">
                                    {activeWallet?.type === 'fiat' ? '$' : ''}{parseFloat(amount).toLocaleString()} {activeWallet?.code}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Exchange rate</span>
                                <span className="font-bold text-slate-400 font-mono">No conversion (same currency)</span>
                            </div>

                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Transfer fee</span>
                                <span className="font-bold text-white font-mono">
                                    {activeWallet?.type === 'fiat' ? '$' : ''}{(parseFloat(amount) * 0.001).toFixed(2)} (0.1%)
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Settlement time</span>
                                <span className="font-bold text-white">1–2 business days</span>
                            </div>

                            <div className="flex justify-between items-start py-0.5">
                                <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px] pt-0.5">Reference</span>
                                <span className="font-bold text-slate-350 max-w-[200px] text-right truncate">
                                    {note || 'Invoice payment Q2 2026'}
                                </span>
                            </div>
                        </div>

                        {/* Caution info panel */}
                        <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-4 flex items-start space-x-3 text-xs text-orange-400 leading-relaxed select-none">
                            <Info className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                            <p className="font-semibold text-[11px]">
                                Please confirm you're sending to the correct recipient. International transfers cannot be recalled once processed.
                            </p>
                        </div>

                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col space-y-2 mt-auto">
                        <button
                            onClick={handleConfirmSend}
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
                                <CheckCircle2 className="h-9 w-9 animate-pulse" />
                            </div>
                        </div>
                        
                        {/* Subtitle details */}
                        <div className="space-y-2 max-w-sm mx-auto">
                            <span className="text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase font-mono block">
                                Transfer Sent
                            </span>
                            <h2 className="font-satoshi font-black text-2.5xl text-white tracking-tight">
                                {activeWallet?.type === 'fiat' ? '$' : ''}{parseFloat(amount).toLocaleString()} {activeWallet?.code}
                            </h2>
                            <p className="text-slate-400 text-xs font-sans leading-relaxed">
                                successfully sent to <strong className="text-white font-bold">{displayRecipientName}</strong>
                            </p>
                        </div>
                    </div>

                    {/* Transaction logs receipt block */}
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-2.5xl p-5 text-left space-y-3.5 select-none font-sans text-xs max-w-md mx-auto w-full">
                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Transaction ID</span>
                            <span className="font-mono text-slate-350">TXN-2026-9148</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Est. delivery</span>
                            <span className="text-white">Jun 27, 2026 by 17:00 UTC</span>
                        </div>

                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Recipient</span>
                            <span className="font-bold text-white">{displayRecipientName}</span>
                        </div>

                        <div className="flex justify-between items-start py-0.5">
                            <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px] pt-0.5">Reference</span>
                            <span className="font-bold text-slate-350 max-w-[200px] truncate">{note || 'Invoice payment Q2 2026'}</span>
                        </div>

                        <div className="flex justify-between items-center py-0.5 border-t border-white/5 pt-3">
                            <span className="text-slate-550 font-bold uppercase tracking-wider text-[9px]">Status</span>
                            <span className="text-emerald-400 font-bold">Processing</span>
                        </div>
                    </div>

                    {/* Action buttons */}
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
