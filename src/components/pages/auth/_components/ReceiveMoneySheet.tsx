'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useTransactionStore } from '@/store/transactionStore'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { Sheet } from '@/components/ui/Sheet'
import { cn, formatCurrencyByLocale } from '@/lib/utils'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'
import { transferService } from '@/services/transfer.service'
import { toast } from 'sonner'

// Import subcomponents
import { ReceiveDetailsView } from './receive/ReceiveDetailsView'
import { ReceiveMomoView } from './receive/ReceiveMomoView'

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
    provider?: 'caas' | 'waas';
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

export const ReceiveMoneySheet: React.FC = () => {
    const queryClient = useQueryClient();
    const { isReceiveOpen, closeReceive, receiveDefaultWalletId } = useTransactionStore();

    const [selectedWalletId, setSelectedWalletId] = useState<string>('usdc');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'momo'>('details');

    // Mobile Money form states
    const [operator, setOperator] = useState('MTN');
    const [phone, setPhone] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [depositSuccess, setDepositSuccess] = useState(false);
    const [fundingCurrency, setFundingCurrency] = useState<'XOF' | 'XAF'>('XOF');

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close select currency dropdown if clicked anywhere else
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    // Fetch wallets/balances
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

    const waasWalletsQuery = useQuery({
        queryKey: ['waasWallets'],
        queryFn: () => accountService.getWaaSWallets(),
        enabled: isReceiveOpen,
    });

    const waasDetailsQuery = useQuery({
        queryKey: ['waasWalletsDetails', waasWalletsQuery.data?.data],
        queryFn: async () => {
            const list = waasWalletsQuery.data?.data || [];
            const details = await Promise.all(list.map(async (w: any) => {
                try {
                    const res = await accountService.getWaaSWalletDetail(w.network);
                    return {
                        ...w,
                        balanceData: res?.success && res.data ? res.data : null
                    };
                } catch (e) {
                    return {
                        ...w,
                        balanceData: null
                    };
                }
            }));
            return details;
        },
        enabled: isReceiveOpen && !!waasWalletsQuery.data?.success
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
            balance: d.balanceFormatted || formatCurrencyByLocale(d.balanceUsdc, symbol),
            rawBalance: parseFloat(d.balanceUsdc || '0'),
            walletAddress: d.walletAddress,
            provider: 'caas'
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
                balance: formatCurrencyByLocale(acc.balance, acc.currency),
                rawBalance: parseFloat(acc.balance || '0'),
                accountNumber: acc.accountNumber,
                iban: acc.iban || null,
                bic: acc.bic || null,
                sortCode: acc.sortCode || null,
                accountNumberUk: acc.accountNumberUk || null,
            });
        });
    }

    // Map WaaS wallets
    if (waasDetailsQuery.data && Array.isArray(waasDetailsQuery.data)) {
        waasDetailsQuery.data.forEach((w: any) => {
            const balObj = w.balanceData?.wallet || w.balanceData;
            const balSymbol = balObj?.symbol || w.network || 'POL';
            const balVal = balObj?.balance !== undefined ? parseFloat(balObj.balance.toString()) : 0;
            const formattedBal = w.balanceData?.wallet?.formatted_balance || 
                                 w.balanceData?.formatted_balance || 
                                 `${balVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${balSymbol}`;
            
            walletsList.push({
                id: balSymbol.toLowerCase(),
                name: `${w.network} Wallet`,
                code: balSymbol,
                type: 'stablecoin',
                balance: formattedBal,
                rawBalance: balVal,
                walletAddress: w.address,
                provider: 'waas'
            });
        });
    }

    // Pre-select wallet if default is provided
    useEffect(() => {
        if (isReceiveOpen && walletsList.length > 0) {
            const matchesDefault = walletsList.find(w => w.id === receiveDefaultWalletId);
            setSelectedWalletId(matchesDefault ? matchesDefault.id : walletsList[0].id);
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
    };

    const isCrypto = activeWallet.type === 'stablecoin';
    const isMomoAvailable = (isCrypto && activeWallet.provider !== 'waas') || activeWallet.code === 'XOF' || activeWallet.code === 'XAF';

    // Build the dynamic address/copy label
    const address = isCrypto
        ? (activeWallet.walletAddress || 'Address not available')
        : `Bank: ${activeWallet.name}\nAccount: ${activeWallet.accountNumber || ''}\nIBAN: ${activeWallet.iban || ''}`;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `DigitalFX Deposit Details (${activeWallet.code})`,
                    text: address,
                });
                toast.success('Shared successfully');
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback copy details
            navigator.clipboard.writeText(address);
            toast.success('Deposit details copied to clipboard!');
        }
    };

    // Deposit API mutation
    const fundMutation = useMutation({
        mutationFn: (payload: { amount: number; currency: 'XOF' | 'XAF'; operator: string; phone: string; token?: 'USDC' | 'USDT' }) =>
            transferService.initiateDeposit({
                ...payload,
                isStablecoin: isCrypto
            }),
        onSuccess: (res) => {
            if (res?.success) {
                setDepositSuccess(true);
                toast.success('Deposit request initiated.');
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
                queryClient.invalidateQueries({ queryKey: ['cryptoBalances'] });
                queryClient.invalidateQueries({ queryKey: ['activity'] });
            } else {
                toast.error(res?.error?.message || 'Deposit initiation failed.');
            }
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.error?.message || 'Deposit failed. Please try again.');
        }
    });

    const handleInitiateDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        const amt = parseFloat(depositAmount);
        if (isNaN(amt) || amt <= 0) {
            toast.error('Please enter a valid deposit amount.');
            return;
        }
        if (!phone) {
            toast.error('Please enter your mobile money phone number.');
            return;
        }

        const currency = isCrypto ? fundingCurrency : (activeWallet.code as 'XOF' | 'XAF');
        fundMutation.mutate({
            amount: amt,
            currency,
            operator,
            phone,
            token: activeWallet.code === 'USDT' ? 'USDT' : 'USDC'
        });
    };

    return (
        <Sheet
            isOpen={isReceiveOpen}
            onClose={closeReceive}
            title="Receive Money"
            description="Display bank details or load funds directly using Mobile Money"
        >
            <div className="space-y-6 flex flex-col justify-between h-full text-center">
                <div className="space-y-5">
                    {/* Wallet selector dropdown */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block text-left select-none">Select Wallet</span>
                        <div className="relative" ref={dropdownRef}>
                            <div
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-[#0C1224] border border-white/10 hover:border-white/15 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition select-none"
                            >
                                <div className="flex items-center space-x-3">
                                    <CurrencyIcon code={activeWallet.code} size="md" />
                                    <div className="text-left">
                                        <span className="font-bold text-white block text-sm leading-tight">{activeWallet.name}</span>
                                        <span className="text-[9px] text-slate-500 font-bold block mt-0.5">{activeWallet.code} • Balance: {activeWallet.balance}</span>
                                    </div>
                                </div>
                                <ChevronDown className="h-4 w-4 text-slate-500" />
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1528] border border-white/10 rounded-2xl shadow-2xl z-30 max-h-[220px] overflow-y-auto scrollbar-none py-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {walletsList.map((w) => (
                                        <div
                                            key={w.id}
                                            onClick={() => {
                                                setSelectedWalletId(w.id);
                                                setDepositSuccess(false);
                                                setDepositAmount('');
                                                setPhone('');
                                                setActiveTab('details');
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
                        <div className="flex bg-black/30 border border-white/15 p-1 rounded-xl">
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
                        <ReceiveDetailsView
                            activeWallet={activeWallet}
                            isCrypto={isCrypto}
                            address={address}
                            handleShare={handleShare}
                        />
                    ) : (
                        <ReceiveMomoView
                            activeWallet={activeWallet}
                            isCrypto={isCrypto}
                            depositSuccess={depositSuccess}
                            depositAmount={depositAmount}
                            setDepositAmount={setDepositAmount}
                            phone={phone}
                            setPhone={setPhone}
                            operator={operator}
                            setOperator={setOperator}
                            fundingCurrency={fundingCurrency}
                            setFundingCurrency={setFundingCurrency}
                            isPending={fundMutation.isPending}
                            onSubmit={handleInitiateDeposit}
                        />
                    )}
                </div>
            </div>
        </Sheet>
    );
};

export default ReceiveMoneySheet;
