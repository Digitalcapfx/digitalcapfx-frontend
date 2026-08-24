'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'
import TransactionItem from './TransactionItem'

interface WalletActivityListProps {
    filteredTxs: any[];
    walletCode: string;
    onSelectTx: (tx: any) => void;
    currentPage?: number;
    onPageChange?: (page: number) => void;
    hasNextPage?: boolean;
    emptyTextKey?: string;
}

export const WalletActivityList: React.FC<WalletActivityListProps> = ({
    filteredTxs,
    walletCode,
    onSelectTx,
    currentPage = 1,
    onPageChange,
    hasNextPage = false,
    emptyTextKey = 'details.tx.empty'
}) => {
    const { t } = useLanguageStore();

    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 text-left shadow-xl space-y-5">
            <h3 className="font-satoshi font-bold text-base text-white select-none">
                {t('section.recent')}
            </h3>

            <div className="space-y-3.5 min-h-[300px] max-h-[540px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {filteredTxs.length > 0 ? (
                    filteredTxs.map((tx) => (
                        <TransactionItem
                            key={tx.id}
                            tx={tx}
                            walletCode={walletCode}
                            onSelect={onSelectTx}
                        />
                    ))
                ) : (
                    <div className="text-center py-12 text-xs text-slate-500 font-sans select-none">
                        {t(emptyTextKey)}
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs font-mono select-none">
                <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange?.(currentPage - 1)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Prev</span>
                </button>
                <span className="text-[11px] font-bold text-slate-400 font-sans">
                    Page {currentPage}
                </span>
                <button
                    type="button"
                    disabled={!hasNextPage}
                    onClick={() => onPageChange?.(currentPage + 1)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default WalletActivityList;
