'use client'

import React, { useState, useEffect, useRef } from 'react'
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
import { cn, formatCurrencyByLocale } from '@/lib/utils'
import { NumberInput } from '@/components/ui/NumberInput'
import { PhoneInput } from '@/components/ui/PhoneInput'
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
    iban?: string | null;
    bic?: string | null;
    sortCode?: string | null;
    accountNumberUk?: string | null;
}

const CURRENCY_NAMES: Record<string, string> = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    XOF: 'CFA Franc BCEAO',
    XAF: 'CFA Franc BEAC',
    USDC: 'USD Coin',
    IUSD: 'Instant USD',
    NGN: 'Nigerian Naira',
};

const formatBalance = (amount: string | number, currency: string) => {
    return formatCurrencyByLocale(amount, currency);
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-between bg-black/25 border border-white/5 rounded-xl px-4 py-3 select-text select-none">
            <div className="text-left space-y-0.5 min-w-0 flex-1 pr-3">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block font-sans">{label}</span>
                <span className="font-mono text-xs text-white block break-all select-all leading-normal">{value}</span>
            </div>
            <button
                type="button"
                onClick={handleCopy}
                className="text-slate-500 hover:text-white transition duration-200 cursor-pointer shrink-0"
            >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
        </div>
    );
};

export const ReceiveMoneySheet: React.FC = () => {
    const queryClient = useQueryClient();
    const { isReceiveOpen, closeReceive, receiveDefaultWalletId } = useTransactionStore();

    const [selectedWalletId, setSelectedWalletId] = useState<string>('usdc');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'momo'>('details');

    // Mobile Money form states
    const [operator, setOperator] = useState('MTN');
    const [phone, setPhone] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [depositSuccess, setDepositSuccess] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close select currency dropdown if clicked anywhere else
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isDropdownOpen]);

    // Queries
    const fiatQuery = useQuery({
        queryKey: ['accounts'],
        queryFn: () => accountService.getAccounts(),
    });

    const cryptoQuery = useQuery({
        queryKey: ['cryptoBalances'],
        queryFn: () => accountService.getCryptoBalances(),
    });

    const walletsList: Wallet[] = [];

    // Map stablecoin wallet
    if (cryptoQuery.data?.success && cryptoQuery.data.data) {
        const d = cryptoQuery.data.data;
        const symbol = d.symbol || 'iUSD';
        walletsList.push({
            id: symbol.toLowerCase(),
            name: d.name || CURRENCY_NAMES[symbol.toUpperCase()] || 'Instant USD',
            code: symbol,
            type: 'stablecoin',
            balance: d.balanceFormatted || formatBalance(d.balanceUsdc, symbol),
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
                iban: acc.iban,
                bic: acc.bic,
                sortCode: acc.sortCode,
                accountNumberUk: acc.accountNumberUk,
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
        : (activeWallet.iban || activeWallet.accountNumberUk || activeWallet.accountNumber || 'Account details loading...');

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
            toast.success('Details copied to clipboard!');
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
                        <div className="relative" ref={dropdownRef}>
                            <div
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-[#0C1224] border border-white/10 hover:border-white/15 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition select-none"
                            >
                                <div className="flex items-center space-x-3">
                                    <CurrencyIcon code={activeWallet.code} size="md" />
                                    <div className="text-left">
                                        <span className="font-bold text-white text-xs block leading-tight">{activeWallet.name}</span>
                                        <span className="text-[9px] text-slate-500 font-bold">{activeWallet.code} • {activeWallet.balance}</span>
                                    </div>
                                </div>
                                <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
                            </div>

                            {/* Dropdown Options */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#090E1E] border border-white/10 rounded-2xl overflow-hidden z-50 max-h-60 overflow-y-auto shadow-2xl">
                                    {walletsList.map((w) => (
                                        <div
                                            key={w.id}
                                            onClick={() => {
                                                setSelectedWalletId(w.id);
                                                setIsDropdownOpen(false);
                                                setCopied(false);
                                                setDepositSuccess(false);
                                                setDepositAmount('');
                                                setPhone('');
                                                // Reset tab to momo if selected momo currency, else details
                                                setActiveTab((w.code === 'XAF' || w.code === 'XOF') ? 'momo' : 'details');
                                            }}
                                            className={cn(
                                                "p-4 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition",
                                                selectedWalletId === w.id && "bg-white/[0.03]"
                                            )}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <CurrencyIcon code={w.code} size="md" />
                                                <div className="text-left">
                                                    <span className="font-bold text-white text-xs block leading-tight">{w.name}</span>
                                                    <span className="text-[9px] text-slate-500 font-bold">{w.code} • {w.balance}</span>
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
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(address)}`}
                                        alt="Wallet/Account QR Code"
                                        className="w-full h-full rounded-lg"
                                    />
                                </div>
                                <span className="text-[10px] text-slate-550 font-bold tracking-wider uppercase block">
                                    Your {activeWallet.code} {isCrypto ? 'address' : 'bank details'}
                                </span>
                            </div>

                            {/* Dynamically List Banking / Local details */}
                            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin select-none">
                                {isCrypto ? (
                                    <DetailRow label="SCW Wallet Address" value={activeWallet.walletAddress || '0xSCW1234567890abcdef...'} />
                                ) : (
                                    <>
                                        {activeWallet.accountNumber && (
                                            <DetailRow label={`${activeWallet.code} Account Number`} value={activeWallet.accountNumber} />
                                        )}
                                        {activeWallet.accountNumberUk && (
                                            <DetailRow label="UK Account Number" value={activeWallet.accountNumberUk} />
                                        )}
                                        {activeWallet.sortCode && (
                                            <DetailRow label="Sort Code" value={activeWallet.sortCode} />
                                        )}
                                        {activeWallet.iban && (
                                            <DetailRow label="IBAN" value={activeWallet.iban} />
                                        )}
                                        {activeWallet.bic && (
                                            <DetailRow label="BIC / SWIFT Code" value={activeWallet.bic} />
                                        )}
                                    </>
                                )}
                            </div>

                            {isCrypto && (
                                <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl p-4 flex items-start space-x-3 text-left animate-in slide-in-from-bottom duration-300">
                                    <Info className="h-5 w-5 text-primary-400 shrink-0 mt-0.5" />
                                    <div className="space-y-2">
                                        <span className="text-xs font-bold text-white block">How to Receive Instant USD (iUSD)</span>
                                        <ul className="text-[10px] text-slate-400 leading-normal space-y-1.5 list-disc list-inside font-sans">
                                            <li>
                                                <span className="font-bold text-white">Internal Transfers:</span> Other DigitalFX users can instantly send you <span className="font-semibold text-white">iUSD</span> using your registered phone number.
                                            </li>
                                            <li>
                                                <span className="font-bold text-white">External Deposits:</span> To deposit from a personal crypto wallet, send <span className="font-bold text-white">USDC</span> on the <span className="font-bold text-white">Polygon (POL)</span> network to the address above.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}
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
                                    <PhoneInput
                                        required
                                        label="Phone Number*"
                                        placeholder="Enter phone"
                                        value={phone}
                                        onChange={setPhone}
                                    />
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">Deposit Amount ({activeWallet.code})*</span>
                                        <NumberInput
                                            required
                                            value={depositAmount}
                                            onChange={setDepositAmount}
                                            placeholder="0"
                                            className="bg-black/30 border border-white/10 rounded-xl px-4.5 py-3.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-primary-500/50 w-full font-mono"
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
