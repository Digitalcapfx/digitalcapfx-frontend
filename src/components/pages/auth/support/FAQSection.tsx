'use client'

import React, { useState } from 'react';
import { Search, Loader2, ChevronUp, ChevronDown } from 'lucide-react';
import { FAQ } from '@/services/support.service';
import { cn } from '@/lib/utils';
import { useLanguageStore } from '@/store/languageStore';
import { Select } from '@/components/ui/Select';

interface FAQSectionProps {
    faqList: FAQ[];
    isLoading: boolean;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
    faqList,
    isLoading,
    selectedCategory,
    onCategoryChange,
    searchQuery,
    onSearchChange
}) => {
    const { t } = useLanguageStore();
    const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
    const categories = ['all', 'general', 'account', 'payment', 'kyc', 'technical', 'card'];

    const filteredFAQs = faqList.filter(f =>
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-550" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={t('support.faq.searchPlaceholder')}
                        className="bg-[#0C1224] border border-[#131B30] rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-primary-500/50 w-full"
                    />
                </div>

                <div className="sm:w-[180px]">
                    <Select
                        options={categories.map(c => ({
                            value: c,
                            label: t('support.faq.cat.' + c).toUpperCase()
                        }))}
                        value={selectedCategory}
                        onChange={onCategoryChange}
                        searchable={false}
                        className="h-[44px] text-xs py-2 px-3"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 shadow-xl py-16 flex items-center justify-center space-x-2 text-xs text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin text-primary-400" />
                        <span>{t('support.faq.loading')}</span>
                    </div>
                ) : filteredFAQs.length === 0 ? (
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 shadow-xl">
                        <p className="text-xs text-slate-500 py-8 text-center select-none">{t('support.faq.empty')}</p>
                    </div>
                ) : (
                    filteredFAQs.map((faq) => {
                        const isExpanded = expandedFaqId === faq.id;
                        return (
                            <div
                                key={faq.id}
                                className="bg-[#0C1224] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300 shadow shadow-black/20 group"
                            >
                                <button
                                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                                    className="w-full px-5 py-4.5 flex items-center justify-between font-satoshi font-bold text-xs text-white focus:outline-none select-none text-left cursor-pointer transition duration-200"
                                >
                                    <span>{faq.question}</span>
                                    <div className="p-1 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white flex items-center justify-center shrink-0 ml-4 transition duration-200">
                                        {isExpanded ? (
                                            <ChevronUp className="h-3.5 w-3.5" />
                                        ) : (
                                            <ChevronDown className="h-3.5 w-3.5" />
                                        )}
                                    </div>
                                </button>

                                <div className={cn(
                                    "grid transition-all duration-300 ease-in-out",
                                    isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                )}>
                                    <div className="overflow-hidden">
                                        <p className="px-5 pb-5 text-[11px] text-slate-400 leading-relaxed font-sans border-t border-white/5 pt-3.5">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
