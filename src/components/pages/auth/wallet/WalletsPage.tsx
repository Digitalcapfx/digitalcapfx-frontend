'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Send, ArrowDownLeft, X, RefreshCw } from 'lucide-react'
import { useTransactionStore } from '@/store/transactionStore'
import PhoneSend from '../_components/PhoneSend'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { useNavigationStore } from '@/store/navigationStore'
import { cn, formatCurrencyByLocale } from '@/lib/utils'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'
import { toast } from 'sonner'
import { useLanguageStore } from '@/store/languageStore'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

export interface Wallet {
    id: string;
    name: string;
    code: string;
    type: 'fiat' | 'stablecoin';
    balance: string;
    rawBalance: number;
    accountNumber?: string;
    walletAddress?: string;
    iban?: string;
    bic?: string;
    routingNumber?: string;
    swiftCode?: string;
    bankName?: string;
    provider?: 'caas' | 'waas';
    network?: string;
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

const WalletsPage: React.FC = () => {
    const { t } = useLanguageStore();
    const router = useRouter();
    const queryClient = useQueryClient();
    const setBackPath = useNavigationStore((state) => state.setBackPath);
    const openSend = useTransactionStore((state) => state.openSend);
    const openReceive = useTransactionStore((state) => state.openReceive);

    const [searchQuery, setSearchQuery] = useState('');
    const [isProvisionOpen, setIsProvisionOpen] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState('POL');

    // Queries
    const fiatQuery = useQuery({
        queryKey: ['accounts'],
        queryFn: () => accountService.getAccounts(),
    });

    const cryptoQuery = useQuery({
        queryKey: ['cryptoBalances'],
        queryFn: () => accountService.getCryptoBalances(),
    });

    const waasWalletsQuery = useQuery({
        queryKey: ['waasWallets'],
        queryFn: () => accountService.getWaaSWallets(),
    });

    const provisionMutation = useMutation({
        mutationFn: (network: string) => accountService.provisionWaaSWallet(network),
        onSuccess: (res) => {
            if (res?.success) {
                toast.success(`Successfully provisioned on-chain ${selectedNetwork} wallet.`);
                setIsProvisionOpen(false);
                queryClient.invalidateQueries({ queryKey: ['waasWallets'] });
                queryClient.invalidateQueries({ queryKey: ['waasWalletsDetails'] });
            } else {
                toast.error(res?.error?.message || 'Wallet provisioning failed.');
            }
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.error?.message || 'Could not provision wallet.');
        }
    });

    let instantUsdWallet: Wallet | null = null;
    const fiatWalletsList: Wallet[] = [];
    const cryptoWalletsList: Wallet[] = [];

    // Map fiat wallets
    if (fiatQuery.data?.success && Array.isArray(fiatQuery.data.data)) {
        fiatQuery.data.data.forEach((acc) => {
            const balNum = parseFloat(acc.balance || '0');
            fiatWalletsList.push({
                id: acc.currency.toLowerCase(),
                name: CURRENCY_NAMES[acc.currency] || acc.currency,
                code: acc.currency,
                type: 'fiat',
                balance: formatBalance(acc.balance, acc.currency),
                rawBalance: balNum,
                accountNumber: acc.accountNumber,
            });
        });
    }

    // Map stablecoin wallet (CaaS - Instant USD)
    if (cryptoQuery.data?.success && cryptoQuery.data.data) {
        const d = cryptoQuery.data.data;
        const balNum = parseFloat(d.balanceUsdc || '0');
        const symbol = d.symbol === 'IUSD' ? 'iUSD' : (d.symbol || 'iUSD');
        instantUsdWallet = {
            id: symbol.toLowerCase(),
            name: d.name || CURRENCY_NAMES[symbol.toUpperCase()] || 'Instant USD',
            code: symbol,
            type: 'stablecoin',
            balance: d.balanceFormatted || formatBalance(d.balanceUsdc, symbol),
            rawBalance: balNum,
            walletAddress: d.walletAddress,
            provider: 'caas'
        };
    }

    // Map WaaS wallets
    const waasAddressesData = waasWalletsQuery.data?.data?.addresses || waasWalletsQuery.data?.data || [];
    if (Array.isArray(waasAddressesData)) {
        waasAddressesData.forEach((w: any) => {
            const balancesArr = Array.isArray(w.balances) ? w.balances : [];

            // 1. Map the native asset of the network
            const nativeSymbol = w.network || 'POL';
            const nativeBalObj = balancesArr.find((b: any) => b.symbol?.toUpperCase() === nativeSymbol.toUpperCase() || b.currency?.toUpperCase() === nativeSymbol.toUpperCase());
            const nativeBalVal = nativeBalObj?.balance !== undefined ? parseFloat(nativeBalObj.balance.toString()) : 0;
            const nativeFormattedBal = nativeBalObj?.formatted_balance ||
                nativeBalObj?.formattedBalance ||
                formatBalance(nativeBalVal, nativeSymbol);

            cryptoWalletsList.push({
                id: nativeSymbol.toLowerCase(),
                name: `${w.network} Wallet`,
                code: nativeSymbol,
                type: 'stablecoin',
                balance: nativeFormattedBal,
                rawBalance: nativeBalVal,
                walletAddress: w.address,
                provider: 'waas',
                network: w.network
            });

            // 2. Map other stablecoins/tokens in balances list (e.g., USDC, USDT)
            balancesArr.forEach((b: any) => {
                const sym = b.symbol || b.currency || '';
                if (!sym || sym.toUpperCase() === nativeSymbol.toUpperCase()) return;

                const balVal = b.balance !== undefined ? parseFloat(b.balance.toString()) : 0;
                const formattedBal = b.formatted_balance ||
                    b.formattedBalance ||
                    formatBalance(balVal, sym);

                cryptoWalletsList.push({
                    id: sym.toLowerCase(),
                    name: `${sym} Wallet`,
                    code: sym,
                    type: 'stablecoin',
                    balance: formattedBal,
                    rawBalance: balVal,
                    walletAddress: w.address,
                    provider: 'waas',
                    network: w.network
                });
            });
        });
    }

    const handleCreateWallet = (e: React.FormEvent) => {
        e.preventDefault();
        provisionMutation.mutate(selectedNetwork);
    };

    // Filter fiat list by search
    const filteredFiat = fiatWalletsList.filter((wallet) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            wallet.name.toLowerCase().includes(query) ||
            wallet.code.toLowerCase().includes(query)
        );
    });

    // Filter crypto list by search
    const filteredCrypto = cryptoWalletsList.filter((wallet) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            wallet.name.toLowerCase().includes(query) ||
            wallet.code.toLowerCase().includes(query)
        );
    });

    const isMatchInstantUsd = !searchQuery ||
        (instantUsdWallet && (
            instantUsdWallet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            instantUsdWallet.code.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    const isLoading = fiatQuery.isLoading || cryptoQuery.isLoading || waasWalletsQuery.isLoading;

    const availableNetworks = ['BTC', 'SOL', 'POL', 'TRX', 'ETH', 'BSC', 'LTC', 'XRP', 'BCH'].filter(
        net => !cryptoWalletsList.some(w => w.code.toUpperCase() === net.toUpperCase())
    );

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between text-left gap-4 select-none">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white font-satoshi">
                        {t('nav.wallets')}
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 font-sans">
                        {t('wallets.subtitle')}
                    </p>
                </div>
                <div className="flex items-center space-x-2.5">
                    <button
                        onClick={() => openSend(null)}
                        className="h-[40px] px-5 text-xs font-bold font-sans rounded-full bg-[#0C1224] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition duration-200 cursor-pointer active:scale-95 flex items-center space-x-1.5"
                    >
                        <Send className="h-4 w-4 text-primary-400" />
                        <span>{t('action.send')}</span>
                    </button>
                    <button
                        onClick={() => openReceive(null)}
                        className="h-[40px] px-5 text-xs font-bold font-sans rounded-full bg-[#0C1224] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition duration-200 cursor-pointer active:scale-95 flex items-center space-x-1.5"
                    >
                        <ArrowDownLeft className="h-4.5 w-4.5 text-emerald-400" />
                        <span>{t('action.receive')}</span>
                    </button>
                </div>
            </div>

            {/* Reusable Phone Send widget */}
            <PhoneSend />

            {/* Filters Bar */}
            <div className="flex justify-between items-center select-none gap-4 pb-2 border-b border-white/5">
                <div className="relative flex items-center max-w-xs w-full">
                    <Search className="absolute left-3 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('wallets.search')}
                        className="bg-black/30 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/50 w-full font-sans transition duration-200"
                    />
                </div>

                {availableNetworks.length > 0 && (
                    <button
                        onClick={() => setIsProvisionOpen(true)}
                        className="bg-primary-500 hover:bg-primary-450 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition duration-200 cursor-pointer flex items-center space-x-1.5 shadow-lg active:scale-98"
                    >
                        <Plus className="h-4 w-4" />
                        <span>{t('action.provision')}</span>
                    </button>
                )}
            </div>

            {isLoading && fiatWalletsList.length === 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((idx) => (
                        <div key={idx} className="h-[92px] rounded-2xl bg-white/5 border border-white/5 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Instant USD Section */}
                    {instantUsdWallet && isMatchInstantUsd && (
                        <div className="space-y-4">
                            <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest block text-left select-none">
                                {t('section.instant')}
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    key={instantUsdWallet.id}
                                    onClick={() => {
                                        setBackPath('/wallets');
                                        router.push(`/wallets/${instantUsdWallet!.id}?provider=caas`);
                                    }}
                                    className="p-5 rounded-2xl bg-[#080E1E] border border-white/5 hover:border-white/10 hover:bg-[#0C142A] transition duration-200 flex items-center justify-between cursor-pointer select-none group"
                                >
                                    <div className="flex items-center space-x-3.5 text-left">
                                        <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                                            <CurrencyIcon code={instantUsdWallet.code} size="sm" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors duration-200">
                                                {instantUsdWallet.name}
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-[10px] font-bold text-slate-500 tracking-wide">{instantUsdWallet.code}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono text-[9px]">CaaS</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-base font-extrabold text-white font-satoshi">{instantUsdWallet.balance}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Fiat Accounts Section */}
                    <div className="space-y-4">
                        <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest block text-left select-none">
                            {t('section.fiat')}
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredFiat.length > 0 ? (
                                filteredFiat.map((wallet) => (
                                    <div
                                        key={wallet.id}
                                        onClick={() => {
                                            setBackPath('/wallets');
                                            router.push(`/wallets/${wallet.code.toLowerCase()}`);
                                        }}
                                        className="p-5 rounded-2xl bg-[#080E1E] border border-white/5 hover:border-white/10 hover:bg-[#0C142A] transition duration-200 flex items-center justify-between cursor-pointer select-none group"
                                    >
                                        <div className="flex items-center space-x-3.5 text-left">
                                            <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                                                <CurrencyIcon code={wallet.code} size="sm" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors duration-200">
                                                    {wallet.name}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-[10px] font-bold text-slate-500 tracking-wide">{wallet.code}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                    <span className="text-[10px] font-semibold text-slate-500 capitalize">{wallet.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-base font-extrabold text-white font-satoshi">{wallet.balance}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center p-8 bg-[#080E1E]/50 border border-dashed border-white/5 rounded-2xl">
                                    <span className="text-xs font-semibold text-slate-500">{t('wallets.empty.fiat')}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Crypto Wallets Section */}
                    <div className="space-y-4">
                        <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block text-left select-none">
                            {t('section.crypto')}
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredCrypto.length > 0 ? (
                                filteredCrypto.map((wallet) => (
                                    <div
                                        key={wallet.id}
                                        onClick={() => {
                                            setBackPath('/wallets');
                                            const query = wallet.provider === 'waas' && wallet.network
                                                ? `?provider=waas&network=${wallet.network.toLowerCase()}`
                                                : `?provider=${wallet.provider}`;
                                            router.push(`/wallets/${wallet.id}${query}`);
                                        }}
                                        className="p-5 rounded-2xl bg-[#080E1E] border border-white/5 hover:border-white/10 hover:bg-[#0C142A] transition duration-200 flex items-center justify-between cursor-pointer select-none group"
                                    >
                                        <div className="flex items-center space-x-3.5 text-left">
                                            <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                                                <CurrencyIcon code={wallet.code} size="sm" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors duration-200">
                                                    {wallet.name}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-[10px] font-bold text-slate-555 tracking-wide">{wallet.code}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-base font-extrabold text-white font-satoshi">{wallet.balance}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center p-8 bg-[#080E1E]/50 border border-dashed border-white/5 rounded-2xl">
                                    <span className="text-xs font-semibold text-slate-550">{t('wallets.empty.crypto')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Provision Wallet Modal */}
            {isProvisionOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0C1224] border border-white/10 rounded-3xl p-6 max-w-sm w-full space-y-5 animate-in fade-in zoom-in-95 duration-200 text-left">
                        <div className="flex justify-between items-center select-none">
                            <h4 className="font-satoshi font-black text-white text-base">Provision HD Wallet</h4>
                            <button
                                onClick={() => setIsProvisionOpen(false)}
                                className="text-slate-550 hover:text-white p-1 rounded-lg transition animate-in"
                            >
                                <X className="h-4.5 w-4.5" />
                            </button>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                            Generate on-chain BIP-44 HD wallet seed and derive deposit addresses using Rach WaaS.
                        </p>

                        <form onSubmit={handleCreateWallet} className="space-y-4">
                            <Select
                                label="Select Network*"
                                options={availableNetworks.map(net => ({
                                    value: net,
                                    label: `${net} Network`
                                }))}
                                value={selectedNetwork}
                                onChange={setSelectedNetwork}
                                searchable={false}
                            />

                            <Button
                                type="submit"
                                isLoading={provisionMutation.isPending}
                                className="w-full font-bold text-xs h-[48px] rounded-xl shadow-lg mt-2"
                            >
                                Generate Wallet
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletsPage;
