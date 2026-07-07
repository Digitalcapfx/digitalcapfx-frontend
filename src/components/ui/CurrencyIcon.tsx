'use client'

import React from 'react'
import flags from 'react-phone-number-input/flags'
import { cn } from '@/lib/utils'

// Dynamic country code mapping for fiat currencies
const FIAT_FLAGS: Record<string, string> = {
    USD: 'US',
    GBP: 'GB',
    NGN: 'NG',
    XOF: 'SN', // CFA Franc BCEAO (Senegal flag as representative)
    XAF: 'CM', // CFA Franc BEAC (Cameroon flag as representative)
};

// Sizing mappings
const SIZES = {
    sm: 'w-9 h-9 text-xs [&>svg]:w-4.5 [&>svg]:h-4.5',
    md: 'w-10 h-10 text-sm [&>svg]:w-5 [&>svg]:h-5',
    lg: 'w-11 h-11 text-base [&>svg]:w-5.5 [&>svg]:h-5.5',
};

// Background class mappings for cryptos and fiat
const BG_CLASSES: Record<string, string> = {
    BTC: 'bg-[#F7931A]',
    ETH: 'bg-[#627EEA]',
    USDC: 'bg-[#2775CA]',
    USDT: 'bg-[#26A17B]',
    POL: 'bg-[#8247E5]',
    SOL: 'bg-gradient-to-br from-[#14F195] to-[#9945FF]',
    TRX: 'bg-[#EC0928]',
    LTC: 'bg-[#BEBEBE]',
    EUR: 'bg-[#003399] border border-white/5',
};

// Custom SVGs for crypto logos
const BtcIcon = () => (
    <svg className="text-white fill-current shrink-0" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.3 12.18c-.28 1.4-1.3 1.96-2.8 2.06v1.76h-1v-1.74c-.45-.02-.9-.05-1.35-.1v1.84h-1v-1.84c-.37-.02-.73-.05-1.08-.08l-.02-2c.32.03.65.05.98.07v-3.7c-.24 0-.48-.01-.72-.03l.02-2c.33.02.66.03.98.03V6.65h1v1.8c.42.01.83.02 1.25.02v-1.8h1v1.8c1.3.1 2.22.65 2.45 1.83.2.98-.12 1.63-.9 2v.06c.92.27 1.45.96 1.17 2.02zm-3.5-5.18c.55 0 .93-.25.93-.73s-.38-.72-.93-.72h-1v1.45h1zm.18 3.9h-1.18v1.6h1.18c.6 0 1-.27 1-.8s-.4-.8-1-.8z" />
    </svg>
);

const EthIcon = () => (
    <svg className="text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L4 11.5L12 16L20 11.5L12 2Z" fill="currentColor" fillOpacity="0.2" />
        <path d="M12 16L4 11.5L12 22L20 11.5L12 16Z" fill="currentColor" fillOpacity="0.4" />
        <path d="M12 2V16" />
        <path d="M12 16V22" />
    </svg>
);

const UsdcIcon = () => (
    <svg className="text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7V17M9.5 9.5C9.5 9.5 10 8.5 12 8.5C14 8.5 14.5 10 14.5 10.5C14.5 12 12 12 12 12C12 12 9.5 12 9.5 13.5C9.5 15 12 15.5 12 15.5C12 15.5 14 15.5 14.5 14.5" strokeLinecap="round" />
    </svg>
);

const UsdtIcon = () => (
    <svg className="text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 9H16M12 9V16" strokeLinecap="round" />
        <ellipse cx="12" cy="11.5" rx="3" ry="1" />
    </svg>
);

const PolIcon = () => (
    <svg className="text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const SolIcon = () => (
    <svg className="text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M4 6H20L17 9H1M7 12H23L20 15H4M4 18H20L17 21H1" />
    </svg>
);

const TrxIcon = () => (
    <svg className="text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3L20 18L4 18L12 3Z" strokeLinejoin="round" />
        <path d="M12 3V18" />
    </svg>
);

const LtcIcon = () => (
    <svg className="text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M10 8V16H15M8 13.5L13.5 11" />
    </svg>
);

const EuroFlag = () => (
    <svg className="w-full h-full shrink-0" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" fill="#003399" />
        <circle cx="10" cy="10" r="4.5" stroke="#FFCC00" strokeWidth="1.2" strokeDasharray="1.5 1" fill="none" />
    </svg>
);

export interface CurrencyIconProps {
    code: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const CurrencyIcon: React.FC<CurrencyIconProps> = ({ code, name, size = 'md', className }) => {
    const uppercaseCode = code.toUpperCase();
    const flagCode = FIAT_FLAGS[uppercaseCode];

    // Determine custom crypto logo or custom EUR logo
    let InnerIcon: React.ReactNode = null;
    if (uppercaseCode === 'BTC') InnerIcon = <BtcIcon />;
    else if (uppercaseCode === 'ETH') InnerIcon = <EthIcon />;
    else if (uppercaseCode === 'USDC') InnerIcon = <UsdcIcon />;
    else if (uppercaseCode === 'USDT') InnerIcon = <UsdtIcon />;
    else if (uppercaseCode === 'POL') InnerIcon = <PolIcon />;
    else if (uppercaseCode === 'SOL') InnerIcon = <SolIcon />;
    else if (uppercaseCode === 'TRX') InnerIcon = <TrxIcon />;
    else if (uppercaseCode === 'LTC') InnerIcon = <LtcIcon />;
    else if (uppercaseCode === 'EUR') InnerIcon = <EuroFlag />;

    // Retrieve circular flag icon if mapped
    const FlagIcon = flagCode ? flags[flagCode as keyof typeof flags] : null;

    // Background Class
    const bgClass = BG_CLASSES[uppercaseCode] || 'bg-slate-800 border border-white/5';

    return (
        <div className={cn(
            "rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-md transition-transform duration-250 select-none",
            SIZES[size],
            bgClass,
            className
        )}>
            {InnerIcon ? (
                InnerIcon
            ) : FlagIcon ? (
                <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-cover shrink-0">
                    <FlagIcon title={name || uppercaseCode} />
                </div>
            ) : (
                <span className="font-bold text-[10px] text-slate-400 font-mono">
                    {uppercaseCode.slice(0, 3)}
                </span>
            )}
        </div>
    );
};

export default CurrencyIcon;
