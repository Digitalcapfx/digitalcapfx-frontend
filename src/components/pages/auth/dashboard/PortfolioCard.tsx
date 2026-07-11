'use client'

import React, { useState } from 'react'
import { Zap, Eye, EyeOff } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'

const CONVERSION_RATES: Record<string, number> = {
    USD: 1.0,
    USDC: 1.0,
    EUR: 1.08,
    GBP: 1.28,
    XAF: 0.0016,
    XOF: 0.0016,
};

const PortfolioCard: React.FC = () => {
    const [showPortfolio, setShowPortfolio] = useState(true);

    const fiatQuery = useQuery({
        queryKey: ['accounts'],
        queryFn: () => accountService.getAccounts(),
    });

    const cryptoQuery = useQuery({
        queryKey: ['cryptoBalances'],
        queryFn: () => accountService.getCryptoBalances(),
    });

    let totalUsd = 0;
    if (cryptoQuery.data?.success && cryptoQuery.data.data) {
        totalUsd += parseFloat(cryptoQuery.data.data.balance_usdc || '0');
    }

    if (fiatQuery.data?.success && Array.isArray(fiatQuery.data.data)) {
        fiatQuery.data.data.forEach((acc) => {
            const bal = parseFloat(acc.balance || '0');
            const weight = CONVERSION_RATES[acc.currency.toUpperCase()] || 1.0;
            totalUsd += bal * weight;
        });
    }

    const displayVal = '$' + totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const isLoading = fiatQuery.isLoading || cryptoQuery.isLoading;

    return (
        <div className="bg-[#0C1224] border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[170px] shadow-2xl">
            {/* Glow backings */}
            <div className="absolute right-[-100px] top-[-100px] w-[260px] h-[260px] rounded-full bg-primary-500/10 blur-[80px] pointer-events-none"></div>

            {/* Top detail */}
            <div className="flex justify-between items-start relative z-10 select-none">
                <div className="space-y-1 text-left">
                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest flex items-center space-x-1.5">
                        <Zap className="h-3 w-3 text-primary-400" />
                        <span>Total Portfolio</span>
                    </span>
                    <div className="flex items-center space-x-3 pt-1">
                        <span className="text-3xl font-black text-white font-satoshi">
                            {isLoading ? (
                                <span className="inline-block w-24 h-8 bg-white/5 animate-pulse rounded"></span>
                            ) : showPortfolio ? (
                                displayVal
                            ) : (
                                '••••••'
                            )}
                        </span>
                        {showPortfolio && !isLoading && (
                            <div className="inline-flex items-center space-x-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] font-bold text-emerald-400 font-mono">
                                <span>↗ Stable</span>
                            </div>
                        )}
                    </div>
                </div>
                <button 
                    onClick={() => setShowPortfolio(!showPortfolio)}
                    className="text-slate-550 hover:text-white transition duration-200"
                >
                    {showPortfolio ? <Eye className="h-5.5 w-5.5" /> : <EyeOff className="h-5.5 w-5.5" />}
                </button>
            </div>

            {/* Middle trend vector indicator (SVG spline) */}
            <div className="absolute bottom-12 left-6 right-6 h-8">
                <svg className="w-full h-full" viewBox="0 0 600 30" preserveAspectRatio="none">
                    <path 
                        d="M0 25 C100 24, 200 23, 300 24 C400 25, 500 22, 600 20" 
                        fill="none" 
                        stroke="#2F80FF" 
                        strokeWidth="2.5" 
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {/* Bottom detail */}
            <div className="text-left text-[10px] font-bold text-slate-550 font-mono tracking-wide select-none pt-4">
                Estimated value in USD
            </div>
        </div>
    );
};

export default PortfolioCard;
