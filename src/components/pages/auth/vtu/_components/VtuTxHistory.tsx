import React from 'react'
import { RefreshCw } from 'lucide-react'
import { cn, formatCurrencyByLocale } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'

interface VtuTxHistoryProps {
    isLoading: boolean;
    txList: any[];
}

export const VtuTxHistory: React.FC<VtuTxHistoryProps> = ({ isLoading, txList }) => {
    const { t } = useLanguageStore();
    return (
        <div className="lg:col-span-5 bg-[#0C1224] border border-white/5 rounded-3xl p-6.5 shadow-2xl space-y-4">
            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block font-mono border-b border-white/[0.03] pb-2">
                {t('vtu.history.title')}
            </span>

            {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2 text-xs text-slate-500 select-none">
                    <RefreshCw className="h-6 w-6 animate-spin text-primary-400" />
                    <span>{t('vtu.history.loading')}</span>
                </div>
            ) : txList.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-600">
                    {t('vtu.history.empty')}
                </div>
            ) : (
                <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin select-none">
                    {txList.map((tx: any) => {
                        const dateStr = tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'N/A';
                        const isSuccess = tx.status === 'SUCCESSFUL';
                        const targetLabel = tx.serviceType === 'bill' ? tx.targetAccount : tx.targetPhone;
                        return (
                            <div key={tx.id} className="flex justify-between items-center py-2.5 border-b border-white/[0.02] last:border-b-0">
                                <div className="text-left space-y-0.5">
                                    <div className="flex items-center space-x-1.5">
                                        <span className="font-bold text-white text-xs capitalize">
                                            {tx.serviceType}
                                        </span>
                                        <span className="text-[9px] text-slate-505">
                                            ({tx.provider})
                                        </span>
                                    </div>
                                    <span className="text-[9px] text-slate-400 block font-mono">
                                        {targetLabel || 'N/A'}
                                    </span>
                                    <span className="text-[8px] text-slate-600 block">
                                        {dateStr} • Ref: {tx.reference ? tx.reference.slice(0, 12) : 'N/A'}
                                    </span>
                                </div>
                                <div className="text-right space-y-1">
                                    <span className="font-bold font-mono text-xs text-white block">
                                        {formatCurrencyByLocale(tx.amount, tx.currency)}
                                    </span>
                                    <span className={cn(
                                        "text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border block w-fit ml-auto",
                                        isSuccess ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                        tx.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                        'bg-rose-500/10 border-rose-500/20 text-rose-455'
                                    )}>
                                        {tx.status || 'pending'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
