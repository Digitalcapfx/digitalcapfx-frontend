'use client'

import React, { useState } from 'react'
import { 
    ChevronLeft, 
    MoreHorizontal, 
    Plus, 
    Eye, 
    EyeOff, 
    Snowflake, 
    Trash2, 
    Lock,
    Copy,
    Check,
    CreditCard,
    TrendingDown
} from 'lucide-react'
import { VirtualCard, useCardStore } from '@/store/cardStore'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'

interface CardDetailsProps {
    card: VirtualCard;
    onBack: () => void;
}

interface CardTransaction {
    id: string;
    merchant: string;
    date: string;
    category: string;
    amount: string;
}

const MOCK_TRANSACTIONS: CardTransaction[] = [
    { id: '1', merchant: 'Notion HQ', date: 'Jun 25', category: 'Software', amount: '-$16.00' },
    { id: '2', merchant: 'Google Ads', date: 'Jun 24', category: 'Marketing', amount: '-$540.00' },
    { id: '3', merchant: 'AWS', date: 'Jun 23', category: 'Cloud', amount: '-$287.50' },
    { id: '4', merchant: 'Slack', date: 'Jun 22', category: 'Software', amount: '-$12.50' },
    { id: '5', merchant: 'Figma', date: 'Jun 21', category: 'Design', amount: '-$45.00' },
    { id: '6', merchant: 'Figma', date: 'Jun 21', category: 'Design', amount: '-$45.00' },
    { id: '7', merchant: 'Figma', date: 'Jun 21', category: 'Design', amount: '-$45.00' },
];

export const CardDetails: React.FC<CardDetailsProps> = ({ card, onBack }) => {
    const { t } = useLanguageStore();
    const { toggleFreeze, terminateCard, openFund } = useCardStore();
    
    const [revealDetails, setRevealDetails] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 1800);
    };

    const handleTerminate = () => {
        if (confirm(t('cards.terminate.confirm'))) {
            terminateCard(card.id);
            onBack();
        }
    };

    const isFrozen = card.status === 'frozen';
    const progressPercent = Math.min((card.spent / card.limit) * 100, 100);

    const formatCurrency = (val: number, code: string) => {
        const symbol = code === 'USD' ? '$' : code === 'EUR' ? '€' : code === 'GBP' ? '£' : '₦';
        return `${symbol}${val.toLocaleString()}`;
    };

    // Full credentials mockup
    const fullCardNumber = `4921 5829 1042 ${card.number}`;
    const cardExpiry = '12/29';
    const cardCVV = '491';

    return (
        <div className="space-y-6 text-left">
            
            {/* Header controls bar */}
            <div className="flex items-center justify-between select-none">
                <div className="flex items-center space-x-3.5">
                    <button
                        onClick={onBack}
                        className="w-9 h-9 rounded-full bg-[#0C1224] border border-white/5 hover:border-white/15 flex items-center justify-center text-slate-400 hover:text-white transition duration-200 cursor-pointer active:scale-95 shrink-0"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h2 className="font-satoshi font-black text-xl text-white">
                        {card.name} ({t('cards.badge.virtual')})
                    </h2>
                </div>
                <button className="w-9 h-9 rounded-full bg-[#0C1224] border border-white/5 hover:border-white/15 flex items-center justify-center text-slate-400 hover:text-white transition duration-200 cursor-pointer">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            {/* Layout Grid columns */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                
                {/* Left Side Details Panel (2/5 width) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Big Virtual Card Preview container */}
                    <div className={cn(
                        "relative h-[210px] rounded-3xl p-6.5 flex flex-col justify-between overflow-hidden shadow-2xl border select-none transition-all duration-300",
                        card.bgGradient
                    )}>
                        {/* Glow Spheres overlay */}
                        <div className="absolute right-[-30px] top-[-30px] w-36 h-36 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-xs"></div>
                        <div className="absolute left-[20%] bottom-[-60px] w-28 h-28 rounded-full bg-white/[0.02] border border-white/[0.04]"></div>

                        {/* Top Line */}
                        <div className="flex justify-between items-start z-10">
                            <span className="text-[11px] font-black tracking-widest text-white/90 uppercase font-satoshi">{t('cards.badge.virtual')}</span>
                            <span className="text-sm font-black italic text-white/95 tracking-tight font-satoshi">DigitalCap FX</span>
                        </div>

                        {/* Card Number */}
                        <div className="z-10 text-left">
                            {isFrozen ? (
                                <div className="flex flex-col items-center justify-center space-y-1 py-1.5 bg-black/35 backdrop-blur-xs rounded-2xl border border-white/5 w-fit px-5 mx-auto">
                                    <Snowflake className="h-4.5 w-4.5 text-white animate-pulse" />
                                    <span className="text-[9px] font-bold text-white uppercase tracking-widest">{t('cards.stat.frozen')}</span>
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    <span className="font-mono text-lg font-bold text-white tracking-widest block select-all">
                                        {revealDetails ? fullCardNumber : `•••• •••• •••• ${card.number}`}
                                    </span>
                                    {revealDetails && (
                                        <div className="flex space-x-6 text-[10px] text-white/80 font-mono">
                                            <span>{t('cards.expiry')} {cardExpiry}</span>
                                            <span>{t('cards.cvv')} {cardCVV}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bottom Line */}
                        <div className="flex justify-between items-end z-10 text-xs">
                            <span className="font-bold text-white/80 truncate max-w-[170px]">{card.holder}</span>
                            <span className="font-mono font-black text-white/90 uppercase">{card.currency}</span>
                        </div>
                    </div>

                    {/* Quick action buttons row */}
                    <div className="grid grid-cols-4 gap-3 select-none">
                        
                        {/* Add Fund */}
                        <button 
                            onClick={() => openFund(card.id)}
                            disabled={isFrozen}
                            className={cn(
                                "bg-[#0C1224] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center space-y-2 text-slate-400 font-semibold cursor-pointer active:scale-95 transition duration-200",
                                isFrozen 
                                    ? "opacity-40 cursor-not-allowed" 
                                    : "hover:text-white hover:border-white/10 hover:bg-white/[0.01]"
                            )}
                        >
                            <div className="w-8 h-8 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 shrink-0">
                                <Plus className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-[10px]">{t('cards.btn.addFund')}</span>
                        </button>

                        {/* Reveal Details */}
                        <button 
                            onClick={() => setRevealDetails(!revealDetails)}
                            disabled={isFrozen}
                            className={cn(
                                "bg-[#0C1224] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center space-y-2 text-slate-400 font-semibold cursor-pointer active:scale-95 transition duration-200",
                                isFrozen 
                                    ? "opacity-40 cursor-not-allowed" 
                                    : "hover:text-white hover:border-white/10 hover:bg-white/[0.01]"
                            )}
                        >
                            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                                {revealDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </div>
                            <span className="text-[10px] truncate w-full">{t('cards.expiry').replace(':', '')}</span>
                        </button>

                        {/* Freeze */}
                        <button 
                            onClick={() => toggleFreeze(card.id)}
                            className="bg-[#0C1224] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center space-y-2 text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.01] transition duration-200 font-semibold cursor-pointer active:scale-95"
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                                isFrozen ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                            )}>
                                {isFrozen ? <Check className="h-4 w-4" /> : <Snowflake className="h-4 w-4" />}
                            </div>
                            <span className="text-[10px]">{isFrozen ? t('cards.btn.unfreeze') : t('cards.btn.freeze')}</span>
                        </button>

                        {/* Terminate */}
                        <button 
                            onClick={handleTerminate}
                            className="bg-[#0C1224] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center space-y-2 text-rose-400 hover:text-rose-350 hover:border-rose-500/20 hover:bg-rose-500/[0.02] transition duration-200 font-semibold cursor-pointer active:scale-95"
                        >
                            <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
                                <Trash2 className="h-4 w-4" />
                            </div>
                            <span className="text-[10px]">{t('cards.btn.terminate')}</span>
                        </button>

                    </div>

                    {/* Spend Limit card block */}
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 space-y-3.5 shadow-xl select-none">
                        <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">{t('cards.stat.monthlySpend')}</span>
                        
                        <div className="space-y-2.5">
                            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                <div 
                                    className={cn(
                                        "h-full rounded-full transition-all duration-300",
                                        isFrozen ? "bg-slate-400" : "bg-primary-500"
                                    )} 
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-400 font-bold">
                                <span className="font-mono text-white text-sm">{formatCurrency(card.spent, card.currency)}</span>
                                <span className="font-mono text-slate-500 font-bold text-sm">/ {formatCurrency(card.limit, card.currency)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Specifications parameters list */}
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl space-y-4 select-none font-sans text-xs">
                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-500 font-semibold">{t('cards.details.linkedWallet')}</span>
                            <span className="font-bold text-white uppercase">{card.currency} {t('cards.sheet.walletSuffix')}</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-555 font-semibold">{t('cards.details.cardType')}</span>
                            <span className="font-bold text-white capitalize">{card.type}</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5">
                            <span className="text-slate-555 font-semibold">{t('exchange.receipt.status')}</span>
                            <span className={cn(
                                "font-bold uppercase",
                                isFrozen ? "text-slate-400" : "text-emerald-400"
                            )}>{isFrozen ? t('cards.stat.frozen') : card.status}</span>
                        </div>
                    </div>

                </div>

                {/* Right Side Transactions (3/5 width) */}
                <div className="lg:col-span-3 space-y-6">
                    
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 text-left shadow-xl space-y-5">
                        
                        <div className="flex justify-between items-center select-none pb-1 border-b border-white/[0.03]">
                            <h3 className="font-satoshi font-bold text-base text-white">{t('cards.history.title')}</h3>
                            <div className="flex space-x-2">
                                <button className="text-xs font-bold text-slate-400 hover:text-white bg-white/5 border border-white/5 hover:border-white/10 px-3 py-1.5 rounded-xl cursor-pointer">
                                    {t('cards.history.filter')}
                                </button>
                                <button className="text-xs font-bold text-slate-400 hover:text-white bg-white/5 border border-white/5 hover:border-white/10 px-3 py-1.5 rounded-xl cursor-pointer">
                                    {t('cards.history.export')}
                                </button>
                            </div>
                        </div>

                        {/* List grid transactions */}
                        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 scrollbar-none">
                            {MOCK_TRANSACTIONS.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between py-1.5 border-b border-white/[0.02] last:border-b-0">
                                    
                                    <div className="flex items-center space-x-3.5 min-w-0">
                                        <div className="w-9 h-9 rounded-full bg-slate-800/60 border border-white/5 flex items-center justify-center text-slate-400 shrink-0">
                                            <CreditCard className="h-4.5 w-4.5" />
                                        </div>
                                        <div className="text-left min-w-0">
                                            <h4 className="font-sans font-bold text-xs text-white truncate">{tx.merchant}</h4>
                                            <span className="text-[10px] text-slate-500 font-medium block mt-0.5 select-none">{tx.date} • {tx.category}</span>
                                        </div>
                                    </div>

                                    <div className="text-right flex items-center space-x-2 select-none">
                                        <span className="font-mono text-xs font-bold text-white">{tx.amount}</span>
                                        <div className="w-4 h-4 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-450 shrink-0">
                                            <TrendingDown className="h-2.5 w-2.5" />
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default CardDetails;
