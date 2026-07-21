'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn, formatCurrencyByLocale } from '@/lib/utils'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { useNavigationStore } from '@/store/navigationStore'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'
import { Plus, X, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

const getCardBg = (currency: string) => {
    switch (currency.toUpperCase()) {
        case 'USD':
            return 'bg-gradient-to-br from-[#1E88E5] to-[#1565C0] border-blue-400/20';
        case 'EUR':
            return 'bg-gradient-to-br from-[#7B1FA2] to-[#4A148C] border-purple-400/20';
        case 'GBP':
            return 'bg-gradient-to-br from-[#1565C0] to-[#0D47A1] border-indigo-400/20';
        case 'XOF':
            return 'bg-gradient-to-br from-[#EF6C00] to-[#E65100] border-orange-400/20';
        case 'XAF':
            return 'bg-gradient-to-br from-[#C62828] to-[#9E1A1A] border-rose-500/20';
        case 'USDC':
        case 'IUSD':
            return 'bg-gradient-to-br from-[#2775CA] to-[#1E5D9F] border-blue-300/20';
        default:
            return 'bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] border-emerald-500/20';
    }
};

const formatBalance = (amount: string | number, currency: string) => {
    return formatCurrencyByLocale(amount, currency);
};

const WalletCarousel: React.FC = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const setBackPath = useNavigationStore((state) => state.setBackPath);

    // Modal state for provisioning
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

    // Prepare lists
    let instantUsdWallet: { currency: string; name: string; amount: string; cardNum: string; bg: string; provider: 'caas' } | null = null;
    const fiatWallets: Array<{ currency: string; amount: string; cardNum: string; bg: string }> = [];
    const cryptoWallets: Array<{ currency: string; name: string; amount: string; cardNum: string; bg: string; provider: 'waas'; network?: string }> = [];

    // Push fiat accounts
    if (fiatQuery.data?.success && Array.isArray(fiatQuery.data.data)) {
        fiatQuery.data.data.forEach((acc) => {
            const num = acc.accountNumber || '';
            const shortNum = num ? num.slice(-4) : 'DFX';
            fiatWallets.push({
                currency: acc.currency,
                cardNum: shortNum,
                amount: formatBalance(acc.balance, acc.currency),
                bg: getCardBg(acc.currency),
            });
        });
    }

    // Push CaaS iUSD stablecoin balance as Instant USD
    if (cryptoQuery.data?.success && cryptoQuery.data.data) {
        const d = cryptoQuery.data.data;
        const addr = d.walletAddress || '';
        const shortAddr = addr ? addr.slice(-4) : 'SCW';
        const symbol = d.symbol === 'IUSD' ? 'iUSD' : (d.symbol || 'iUSD');
        instantUsdWallet = {
            currency: symbol,
            name: d.name || 'Instant USD',
            cardNum: shortAddr,
            amount: d.balanceFormatted || formatBalance(d.balanceUsdc, symbol),
            bg: getCardBg(symbol),
            provider: 'caas'
        };
    }

    // Push WaaS crypto wallets
    const waasAddressesData = waasWalletsQuery.data?.data?.addresses || waasWalletsQuery.data?.data || [];
    if (Array.isArray(waasAddressesData)) {
        waasAddressesData.forEach((w: any) => {
            const addr = w.address || '';
            const shortAddr = addr ? addr.slice(-4) : 'WaS';
            const balancesArr = Array.isArray(w.balances) ? w.balances : [];

            // 1. Map the native asset of the network
            const nativeSymbol = w.network || 'POL';
            const nativeBalObj = balancesArr.find((b: any) => b.symbol?.toUpperCase() === nativeSymbol.toUpperCase() || b.currency?.toUpperCase() === nativeSymbol.toUpperCase());
            const nativeBalVal = nativeBalObj?.balance !== undefined ? parseFloat(nativeBalObj.balance.toString()) : 0;
            const nativeFormattedBal = nativeBalObj?.formatted_balance ||
                nativeBalObj?.formattedBalance ||
                formatBalance(nativeBalVal, nativeSymbol);

            cryptoWallets.push({
                currency: nativeSymbol,
                name: `${w.network} Wallet`,
                cardNum: shortAddr,
                amount: nativeFormattedBal,
                bg: getCardBg(nativeSymbol),
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

                cryptoWallets.push({
                    currency: sym,
                    name: `${sym} Wallet`,
                    cardNum: shortAddr,
                    amount: formattedBal,
                    bg: getCardBg(sym),
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

    const isFiatLoading = fiatQuery.isLoading;
    const isCryptoLoading = cryptoQuery.isLoading || waasWalletsQuery.isLoading;

    const availableNetworks = ['BTC', 'SOL', 'POL', 'TRX', 'ETH', 'BSC', 'LTC', 'XRP', 'BCH'].filter(
        net => !cryptoWallets.some(w => w.currency.toUpperCase() === net.toUpperCase())
    );

    return (
        <div className="space-y-6 text-left">
            {/* Instant USD Section */}
            {instantUsdWallet && (
                <div className="space-y-3">
                    <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest block select-none">
                        Instant USD
                    </span>
                    <div className="flex select-none">
                        <div
                            onClick={() => {
                                setBackPath('/dashboard');
                                router.push(`/wallets/${instantUsdWallet!.currency.toLowerCase()}?provider=caas`);
                            }}
                            className={cn(
                                "w-[200px] h-[130px] rounded-2xl p-5 border flex flex-col justify-between hover:scale-[1.02] transition duration-200 cursor-pointer shadow-lg group",
                                instantUsdWallet.bg
                            )}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-2">
                                    <CurrencyIcon code={instantUsdWallet.currency} size="sm" className="border-none shadow-none bg-white/10" />
                                    <div>
                                        <span className="text-sm font-bold tracking-wider text-white group-hover:text-white/95 block leading-none">{instantUsdWallet.currency}</span>
                                        <span className="text-[8px] font-bold opacity-60 text-white block mt-1 uppercase font-mono">CaaS</span>
                                    </div>
                                </div>
                                <span className="text-[10px] opacity-60 font-mono text-white pt-1 whitespace-nowrap">**** {instantUsdWallet.cardNum}</span>
                            </div>
                            <div className="text-xl font-extrabold font-satoshi text-white tracking-tight">
                                {instantUsdWallet.amount}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Fiat Accounts Section */}
            <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block select-none">
                    Fiat Accounts
                </span>

                {isFiatLoading && fiatWallets.length === 0 ? (
                    <div className="flex gap-4 pb-2 overflow-x-auto scrollbar-none">
                        {[1, 2].map((idx) => (
                            <div key={idx} className="w-[200px] h-[130px] rounded-2xl bg-white/5 border border-white/5 animate-pulse shrink-0" />
                        ))}
                    </div>
                ) : (
                    <div className="flex overflow-x-auto pb-2 scrollbar-none select-none gap-4">
                        {fiatWallets.map((card) => (
                            <div
                                key={card.currency}
                                onClick={() => {
                                    setBackPath('/dashboard');
                                    router.push(`/wallets/${card.currency.toLowerCase()}`);
                                }}
                                className={cn(
                                    "w-[200px] h-[130px] rounded-2xl p-5 flex-1 border flex flex-col justify-between shrink-0 hover:scale-[1.02] transition duration-200 cursor-pointer shadow-lg group",
                                    card.bg
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-2">
                                        <CurrencyIcon code={card.currency} size="sm" className="border-none shadow-none bg-white/10" />
                                        <span className="text-sm font-bold tracking-wider text-white group-hover:text-white/95">{card.currency}</span>
                                    </div>
                                    <span className="text-[10px] opacity-60 font-mono text-white pt-1 whitespace-nowrap">**** {card.cardNum}</span>
                                </div>
                                <div className="text-xl font-extrabold font-satoshi text-white tracking-tight">
                                    {card.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Crypto Wallets Section */}
            <div className="space-y-3">
                <div className="flex justify-between items-center select-none">
                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block">
                        On-Chain Crypto Wallets
                    </span>
                    {availableNetworks.length > 0 && (
                        <button
                            onClick={() => setIsProvisionOpen(true)}
                            className="text-[10px] font-bold text-primary-400 hover:text-primary-350 hover:underline cursor-pointer flex items-center space-x-1"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Provision Wallet</span>
                        </button>
                    )}
                </div>

                {isCryptoLoading && cryptoWallets.length === 0 ? (
                    <div className="flex gap-4 pb-2 overflow-x-auto scrollbar-none">
                        {[1, 2].map((idx) => (
                            <div key={idx} className="w-[200px] h-[130px] rounded-2xl bg-white/5 border border-white/5 animate-pulse shrink-0" />
                        ))}
                    </div>
                ) : cryptoWallets.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-white/5 rounded-2xl text-xs text-slate-500 font-sans select-none">
                        No active on-chain wallets. Click provision to generate.
                    </div>
                ) : (
                    <div className="flex overflow-x-auto pb-2 scrollbar-none select-none gap-4">
                        {cryptoWallets.map((card) => (
                            <div
                                key={card.currency}
                                onClick={() => {
                                    setBackPath('/dashboard');
                                    const query = card.provider === 'waas' && card.network
                                        ? `?provider=waas&network=${card.network.toLowerCase()}`
                                        : `?provider=${card.provider}`;
                                    router.push(`/wallets/${card.currency.toLowerCase()}${query}`);
                                }}
                                className={cn(
                                    "w-[200px] h-[130px] rounded-2xl p-5 flex-1 border flex flex-col justify-between shrink-0 hover:scale-[1.02] transition duration-200 cursor-pointer shadow-lg group",
                                    card.bg
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-2">
                                        <CurrencyIcon code={card.currency} size="sm" className="border-none shadow-none bg-white/10" />
                                        <div>
                                            <span className="text-sm font-bold tracking-wider text-white group-hover:text-white/95 block leading-none">{card.currency}</span>
                                            <span className="text-[8px] font-bold opacity-60 text-white block mt-1 uppercase font-mono">On-Chain</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] opacity-60 font-mono text-white pt-1 whitespace-nowrap">**** {card.cardNum}</span>
                                </div>
                                <div className="text-xl font-extrabold font-satoshi text-white tracking-tight">
                                    {card.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Provision Wallet Modal */}
            {isProvisionOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0C1224] border border-white/10 rounded-3xl p-6 max-w-sm w-full space-y-5 animate-in fade-in zoom-in-95 duration-200 text-left">
                        <div className="flex justify-between items-center select-none">
                            <h4 className="font-satoshi font-black text-white text-base">Provision HD Wallet</h4>
                            <button
                                onClick={() => setIsProvisionOpen(false)}
                                className="text-slate-500 hover:text-white p-1 rounded-lg transition"
                            >
                                <X className="h-4.5 w-4.5" />
                            </button>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                            Generate on-chain BIP-44 HD wallet seed and derive deposit addresses using Rach WaaS.
                        </p>

                        <form onSubmit={handleCreateWallet} className="space-y-4">
                            <div className="space-y-1.5 select-none">
                                <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Select Network*</span>
                                <select
                                    value={selectedNetwork}
                                    onChange={(e) => setSelectedNetwork(e.target.value)}
                                    className="bg-[#080E1E] border border-white/10 rounded-xl px-4.5 py-3.5 text-xs text-white focus:outline-none w-full font-sans cursor-pointer"
                                >
                                    {availableNetworks.map(net => (
                                        <option key={net} value={net}>{net} Network</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={provisionMutation.isPending}
                                className="w-full bg-primary-500 hover:bg-primary-450 text-white font-bold text-xs py-3.5 rounded-xl transition duration-200 cursor-pointer flex items-center justify-center space-x-2 shadow-lg disabled:cursor-not-allowed"
                            >
                                {provisionMutation.isPending && <RefreshCw className="h-4.5 w-4.5 animate-spin" />}
                                <span>{provisionMutation.isPending ? 'Provisioning Seed...' : 'Generate Wallet'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletCarousel;
