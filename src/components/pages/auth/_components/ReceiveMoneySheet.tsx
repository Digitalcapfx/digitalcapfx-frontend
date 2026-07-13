'use client'

import React, { useState, useEffect } from 'react'
import { 
    ChevronDown, 
    Check, 
    Copy, 
    Share2,
    QrCode,
    CheckCircle2,
    RefreshCw,
    Info
} from 'lucide-react'
import { useTransactionStore } from '@/store/transactionStore'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { Sheet } from '@/components/ui/Sheet'
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

export const ReceiveMoneySheet: React.FC = () => {
    const queryClient = useQueryClient();
    const { isReceiveOpen, closeReceive, receiveDefaultWalletId } = useTransactionStore();

    const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Funding form states
    const [activeTab, setActiveTab] = useState<'details' | 'momo'>('details');
    const [depositAmount, setDepositAmount] = useState('');
    const [operator, setOperator] = useState('MTN');
    const [phone, setPhone] = useState('');
    const [depositSuccess, setDepositSuccess] = useState(false);

    // Queries
    const fiatQuery = useQuery({
        queryKey: ['accounts'],
        queryFn: () => accountService.getAccounts(),
        enabled: isReceiveOpen,
    });

    const cryptoQuery = useQuery({
        queryKey: ['cryptoBalances'],
        queryFn: () => accountService.getCryptoBalances(),
        enabled: isReceiveOpen,
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
            balance: formatBalance(d.balanceUsdc, 'USDC'),
            rawBalance: parseFloat(d.balanceUsdc || '0'),
            walletAddress: d.walletAddress,
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
                accountNumber: acc.accountNumber,
            });
        });
    }

    // Sync state on opening
    useEffect(() => {
        if (isReceiveOpen && walletsList.length > 0) {
            const matchesDefault = walletsList.find(w => w.id === receiveDefaultWalletId);
            setSelectedWalletId(matchesDefault ? matchesDefault.id : walletsList[0].id);
            setCopied(false);
            setDepositSuccess(false);
            setDepositAmount('');
            setPhone('');
            setActiveTab('details');
        }
    }, [isReceiveOpen, receiveDefaultWalletId, walletsList.length]);

    const activeWallet = walletsList.find(w => w.id === selectedWalletId) || walletsList[0] || {
        id: 'usdc',
        name: 'USD Coin',
        code: 'USDC',
        type: 'stablecoin' as const,
        balance: '0.00 USDC',
        rawBalance: 0,
        walletAddress: '0xSCW1234567890abcdef...',
    };

    const isCrypto = activeWallet.type === 'stablecoin';
    const address = isCrypto 
        ? (activeWallet.walletAddress || '0xSCW1234567890abcdef...')
        : (activeWallet.accountNumber ? `Account: ${activeWallet.accountNumber}` : 'Account details loading...');

    const isMomoAvailable = activeWallet.code === 'XAF' || activeWallet.code === 'XOF';

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `My ${activeWallet.code} details`,
                text: address
            }).catch(console.error);
        } else {
            handleCopy();
            alert('Details copied to clipboard! Share them with anyone to receive payments.');
        }
    };

    // MoMo Fund Mutation
    const fundMutation = useMutation({
        mutationFn: (payload: { amount: number; currency: 'XOF' | 'XAF'; operator: string; phone: string; token?: 'USDC' | 'USDT' }) => transferService.fundAccount(payload),
        onSuccess: (data) => {
            if (data?.success) {
                setDepositSuccess(true);
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
                queryClient.invalidateQueries({ queryKey: ['activity'] });
            } else {
                toast.error(data?.error?.message || 'Funding request failed.');
            }
        },
        onError: (err: any) => {
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object' ? rawError.message : (rawError || 'Failed to request deposit.');
            toast.error(msg);
        }
    });

    const handleInitiateDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!depositAmount || parseFloat(depositAmount) <= 0 || !phone) return;
        fundMutation.mutate({
            amount: parseFloat(depositAmount),
            currency: activeWallet.code as 'XOF' | 'XAF',
            operator,
            phone,
            token: 'USDC',
        });
    };

    const isLoading = fiatQuery.isLoading || cryptoQuery.isLoading;

    return (
        <Sheet
            isOpen={isReceiveOpen}
            onClose={closeReceive}
            title="Receive / Fund"
            description="Get paid or top up your account balance"
        >
            <div className="space-y-6 flex flex-col justify-between h-full text-left">
                
                <div className="space-y-6">
                    {/* Wallet Select Dropdown */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Select Currency</span>
                        <div className="relative">
                            <div 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-[#0C1224] border border-white/10 hover:border-white/15 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition select-none"
                            >
                                <div className="flex items-center space-x-3">
                                    <CurrencyIcon code={activeWallet.code} size="md" />
                                    <div className="text-left">
                                        <span className="font-bold text-white block text-sm leading-tight">{activeWallet.name}</span>
                                        <span className="text-[9px] text-slate-500 font-bold uppercase block mt-0.5">{activeWallet.code} • {activeWallet.type}</span>
                                    </div>
                                </div>
                                <ChevronDown className="h-4 w-4 text-slate-500" />
                            </div>

                            {/* Overlay to close dropdown when clicking outside */}
                            {isDropdownOpen && (
                                <div 
                                    className="fixed inset-0 z-20" 
                                    onClick={() => setIsDropdownOpen(false)} 
                                />
                            )}

                            {/* Dropdown Options */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1528] border border-white/10 rounded-2xl shadow-2xl z-30 max-h-[220px] overflow-y-auto scrollbar-none py-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {walletsList.map((w) => (
                                        <div
                                            key={w.id}
                                            onClick={() => {
                                                setSelectedWalletId(w.id);
                                                setIsDropdownOpen(false);
                                                setDepositSuccess(false);
                                                setActiveTab('details');
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

                    {isMomoAvailable && (
                        /* Tab selector for MoMo vs bank details */
                        <div className="flex bg-black/30 border border-white/5 p-1 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setActiveTab('details')}
                                className={cn(
                                    "flex-1 py-2 text-[11px] font-bold rounded-lg transition duration-200 cursor-pointer select-none",
                                    activeTab === 'details' 
                                        ? "bg-primary-500 text-white shadow-md" 
                                        : "text-slate-400 hover:text-white"
                                )}
                            >
                                Transfer Details
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('momo')}
                                className={cn(
                                    "flex-1 py-2 text-[11px] font-bold rounded-lg transition duration-200 cursor-pointer select-none",
                                    activeTab === 'momo' 
                                        ? "bg-primary-500 text-white shadow-md" 
                                        : "text-slate-400 hover:text-white"
                                )}
                            >
                                Mobile Money Deposit
                            </button>
                        </div>
                    )}

                    {activeTab === 'details' ? (
                        /* Details/Address view */
                        <div className="space-y-6 animate-in fade-in duration-200">
                            {/* QR Code Container */}
                            <div className="flex flex-col items-center justify-center p-6 bg-white/[0.01] border border-white/5 rounded-3xl text-center space-y-4 select-none">
                                <div className="w-40 h-40 bg-white p-3 rounded-2xl shadow-lg relative flex items-center justify-center">
                                    <div className="absolute w-10 h-10 rounded-full bg-[#080D1C] flex items-center justify-center border-4 border-white shadow-md">
                                        <CurrencyIcon code={activeWallet.code} size="sm" className="border-none shadow-none" />
                                    </div>
                                    <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                                        <path d="M 0,0 L 25,0 L 25,7 L 7,7 L 7,25 L 0,25 Z M 75,0 L 100,0 L 100,25 L 93,25 L 93,7 L 75,7 Z M 0,75 L 25,75 L 25,93 L 7,93 L 7,75 L 0,75 Z M 75,93 L 100,93 L 100,75 L 93,75 L 93,93 L 75,93 Z" />
                                        <path d="M 12,12 L 25,12 L 25,25 L 12,25 Z M 75,12 L 88,12 L 88,25 L 75,25 Z M 12,75 L 25,75 L 25,88 L 12,88 Z" />
                                        <circle cx="35" cy="18" r="3" /><circle cx="50" cy="18" r="3" /><circle cx="62" cy="18" r="3" />
                                        <circle cx="35" cy="35" r="3" /><circle cx="50" cy="35" r="3" /><circle cx="62" cy="35" r="3" />
                                        <circle cx="35" cy="50" r="3" /><circle cx="50" cy="50" r="3" /><circle cx="62" cy="50" r="3" />
                                        <circle cx="35" cy="62" r="3" /><circle cx="50" cy="62" r="3" /><circle cx="62" cy="62" r="3" />
                                        <circle cx="18" cy="35" r="3" /><circle cx="18" cy="50" r="3" /><circle cx="18" cy="62" r="3" />
                                        <circle cx="82" cy="35" r="3" /><circle cx="82" cy="50" r="3" /><circle cx="82" cy="62" r="3" />
                                        <circle cx="35" cy="82" r="3" /><circle cx="50" cy="82" r="3" /><circle cx="62" cy="82" r="3" />
                                    </svg>
                                </div>
                                <span className="text-[10px] text-slate-550 font-bold tracking-wider uppercase block">
                                    Your {activeWallet.code} {isCrypto ? 'address' : 'bank details'}
                                </span>
                            </div>

                            {/* Address Text Field */}
                            <div className="flex items-center justify-between bg-black/20 border border-white/5 rounded-xl px-4 py-3 font-mono text-xs text-slate-355 select-text">
                                <span className="truncate mr-3 leading-relaxed">
                                    {isLoading ? 'Loading details...' : address}
                                </span>
                                <button 
                                    onClick={handleCopy}
                                    className="text-slate-500 hover:text-white transition duration-200 cursor-pointer shrink-0"
                                >
                                    {copied ? <Check className="h-4.5 w-4.5 text-emerald-400" /> : <Copy className="h-4.5 w-4.5" />}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Mobile Money Deposit Form */
                        <div className="space-y-5 animate-in fade-in duration-200">
                            {depositSuccess ? (
                                <div className="py-6 space-y-4 text-center select-none">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-white">Deposit Request Sent</h4>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            Please authorize the checkout prompt of {formatBalance(depositAmount, activeWallet.code)} MTN/Orange request on your phone.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleInitiateDeposit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Operator*</span>
                                        <select 
                                            value={operator}
                                            onChange={(e) => setOperator(e.target.value)}
                                            className="bg-[#0C1224] border border-white/10 rounded-xl px-4.5 py-3.5 text-xs text-white focus:outline-none w-full font-sans select-none"
                                        >
                                            <option value="MTN">MTN Mobile Money</option>
                                            <option value="Orange">Orange Money</option>
                                            <option value="Moov">Moov Money</option>
                                            <option value="Wave">Wave</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Phone Number*</span>
                                        <input 
                                            type="text"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Enter phone (e.g. +2376...)"
                                            className="bg-black/30 border border-white/10 rounded-xl px-4.5 py-3.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 w-full font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Deposit Amount ({activeWallet.code})*</span>
                                        <input 
                                            type="number"
                                            required
                                            value={depositAmount}
                                            onChange={(e) => setDepositAmount(e.target.value)}
                                            placeholder="0"
                                            className="bg-black/30 border border-white/10 rounded-xl px-4.5 py-3.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 w-full font-mono"
                                        />
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={fundMutation.isPending || !depositAmount || !phone}
                                        className={cn(
                                            "w-full py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transition duration-200 cursor-pointer active:scale-[0.98] mt-2",
                                            (depositAmount && phone && !fundMutation.isPending)
                                                ? "bg-primary-500 hover:bg-primary-450 text-white shadow-primary-500/10"
                                                : "bg-slate-800 text-slate-550 cursor-not-allowed"
                                        )}
                                    >
                                        {fundMutation.isPending ? 'Requesting Deposit...' : 'Initiate Deposit'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>

                {activeTab === 'details' && (
                    /* Share Button CTA */
                    <button
                        onClick={handleShare}
                        className="w-full bg-primary-500 hover:bg-primary-450 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transition duration-200 cursor-pointer flex items-center justify-center space-x-2 active:scale-[0.98] mt-auto select-none"
                    >
                        <Share2 className="h-4.5 w-4.5" />
                        <span>Share Details</span>
                    </button>
                )}
            </div>
        </Sheet>
    );
};

export default ReceiveMoneySheet;
