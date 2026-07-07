'use client'

import React, { useState, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { useCardStore } from '@/store/cardStore'
import { Sheet } from '@/components/ui/Sheet'
import { cn } from '@/lib/utils'

const CURRENCIES = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'NGN', name: 'Nigeria Naira' },
];

export const NewCardSheet: React.FC = () => {
    const { isIssueOpen, closeIssue, addCard } = useCardStore();
    
    const [name, setName] = useState('');
    const [holder, setHolder] = useState('Sarah Okonkwo');
    const [currency, setCurrency] = useState('USD');
    const [limit, setLimit] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (isIssueOpen) {
            setName('');
            setCurrency('USD');
            setLimit('');
            setIsDropdownOpen(false);
        }
    }, [isIssueOpen]);

    const isFormValid = () => {
        return name.trim().length > 1 && parseFloat(limit) > 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid()) {
            addCard({
                name: name.trim(),
                holder,
                currency,
                limit: parseFloat(limit)
            });
        }
    };

    const selectedCurrencyName = CURRENCIES.find(c => c.code === currency)?.name || 'US Dollar';

    return (
        <Sheet
            isOpen={isIssueOpen}
            onClose={closeIssue}
            title="Issue Virtual Card"
            description="Create a virtual card for fast and secure payments"
        >
            <form onSubmit={handleSubmit} className="space-y-6 flex flex-col justify-between h-full text-left">
                
                <div className="space-y-5">
                    
                    {/* Card Name */}
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Card Name</span>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Figma Subscription, AWS Card"
                            className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 w-full font-sans"
                        />
                    </div>

                    {/* Card Holder */}
                    <div className="space-y-1 opacity-70">
                        <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Card Holder</span>
                        <input 
                            type="text"
                            value={holder}
                            disabled
                            className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-slate-400 w-full font-sans cursor-not-allowed"
                        />
                    </div>

                    {/* Currency Selector */}
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Currency</span>
                        <div className="relative">
                            <div 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-[#0C1224] border border-white/10 hover:border-white/15 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer transition select-none"
                            >
                                <div className="text-left text-xs font-semibold text-white">
                                    {selectedCurrencyName} ({currency})
                                </div>
                                <ChevronDown className="h-4 w-4 text-slate-550 shrink-0" />
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1528] border border-white/10 rounded-xl shadow-2xl z-30 py-1">
                                    {CURRENCIES.map((c) => (
                                        <div
                                            key={c.code}
                                            onClick={() => {
                                                setCurrency(c.code);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={cn(
                                                "px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition text-xs font-semibold text-white",
                                                currency === c.code ? "bg-white/[0.01] text-primary-400" : ""
                                            )}
                                        >
                                            <span>{c.name} ({c.code})</span>
                                            {currency === c.code && <Check className="h-4 w-4 text-primary-400" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card Spend Limit */}
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">Spend Limit</span>
                        <div className="relative flex items-center bg-black/30 border border-white/10 focus-within:border-primary-500/50 rounded-xl w-full">
                            {currency === 'USD' && (
                                <span className="absolute left-4.5 font-mono text-xs text-slate-550 font-bold">$</span>
                            )}
                            <input 
                                type="number"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                placeholder="0.00"
                                className={cn(
                                    "bg-transparent border-none focus:outline-none focus:ring-0 py-3.5 text-xs text-white placeholder-slate-650 w-full font-mono",
                                    currency === 'USD' ? "pl-9" : "px-4.5"
                                )}
                            />
                            {currency !== 'USD' && (
                                <span className="absolute right-4.5 font-mono text-[10px] text-slate-550 font-bold uppercase select-none">
                                    {currency}
                                </span>
                            )}
                        </div>
                    </div>

                </div>

                {/* Issue card Action CTA */}
                <div className="pt-6 border-t border-white/5 mt-auto">
                    <button
                        type="submit"
                        disabled={!isFormValid()}
                        className={cn(
                            "w-full py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transition duration-200 cursor-pointer active:scale-[0.98]",
                            isFormValid() 
                                ? "bg-primary-500 hover:bg-primary-450 text-white" 
                                : "bg-slate-800 text-slate-550 cursor-not-allowed"
                        )}
                    >
                        Issue Card
                    </button>
                </div>

            </form>
        </Sheet>
    );
};

export default NewCardSheet;
