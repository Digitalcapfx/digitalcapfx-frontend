'use client'

import React from 'react'
import { ArrowDownLeft, Send, Copy, Check, Lock } from 'lucide-react'
import Sheet from '@/components/ui/Sheet'
import { cn } from '@/lib/utils'
import { getTokenStyles } from './TransactionItem'
import { useLanguageStore } from '@/store/languageStore'

interface TransactionDetailSheetProps {
    selectedTx: any | null;
    onClose: () => void;
    walletCode: string;
    handleCopy: (text: string, field: string) => void;
    copiedField: string | null;
}

export const TransactionDetailSheet: React.FC<TransactionDetailSheetProps> = ({
    selectedTx,
    onClose,
    walletCode,
    handleCopy,
    copiedField
}) => {
    const { t } = useLanguageStore();

    if (!selectedTx) return null;

    const tokenStyles = getTokenStyles(selectedTx.rawTx?.token || selectedTx.token, walletCode);

    return (
        <Sheet
            isOpen={!!selectedTx}
            onClose={onClose}
            title={t('details.sheet.title', { defaultValue: 'Transaction Details' })}
            description={t('details.sheet.desc', { defaultValue: 'Detailed overview and cryptographic proof of transfer' })}
        >
            <div className="space-y-6 text-left pt-2 pb-6">
                
                {/* Top Balance / Status Summary Banner */}
                <div className="bg-[#0C1224] border border-white/5 rounded-3xl p-6 text-center space-y-3 relative overflow-hidden">
                    <div className="flex justify-center">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg",
                            selectedTx.isIncoming 
                                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" 
                                : "bg-rose-500/10 border-rose-500/25 text-rose-400"
                        )}>
                            {selectedTx.isIncoming ? <ArrowDownLeft className="h-6 w-6" /> : <Send className="h-5 w-5" />}
                        </div>
                    </div>

                    <div>
                        <span className={cn(
                            "font-mono text-2xl font-black tracking-tight block",
                            selectedTx.isIncoming ? "text-emerald-400" : "text-white"
                        )}>
                            {selectedTx.amount}
                        </span>
                        <span className="text-xs text-slate-400 font-sans font-semibold block mt-1">
                            {selectedTx.isIncoming ? 'Incoming Deposit' : 'Outgoing Transfer'}
                        </span>
                    </div>

                    <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <span className={cn(
                            "w-2 h-2 rounded-full",
                            selectedTx.status === 'completed' ? "bg-emerald-400" : (selectedTx.status === 'pending' ? "bg-amber-400 animate-pulse" : "bg-rose-500")
                        )} />
                        <span className={selectedTx.status === 'completed' ? "text-emerald-400" : (selectedTx.status === 'pending' ? "text-amber-400" : "text-rose-400")}>
                            {selectedTx.rawTx?.status || selectedTx.status}
                        </span>
                    </div>
                </div>

                {/* Field breakdown list */}
                <div className="bg-[#0C1224] border border-white/5 rounded-2xl p-4 space-y-3.5 text-xs font-sans">
                    
                    {/* Reference */}
                    {(selectedTx.rawTx?.reference || selectedTx.rawTx?.idempotency_key) && (
                        <div className="flex items-center justify-between py-1 border-b border-white/5">
                            <span className="text-slate-500 font-medium">Reference</span>
                            <div className="flex items-center space-x-2 font-mono text-white font-bold">
                                <span>{selectedTx.rawTx?.reference || selectedTx.rawTx?.idempotency_key}</span>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(selectedTx.rawTx?.reference || selectedTx.rawTx?.idempotency_key, 'ref')}
                                    className="text-slate-500 hover:text-white transition cursor-pointer"
                                >
                                    {copiedField === 'ref' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tx Hash / Transfer ID */}
                    {(selectedTx.rawTx?.tx_hash || selectedTx.rawTx?.caas_transfer_id) && (
                        <div className="flex flex-col space-y-1 py-1 border-b border-white/5">
                            <span className="text-slate-500 font-medium">Transaction Hash</span>
                            <div className="flex items-center justify-between bg-black/30 border border-white/5 rounded-xl px-2.5 py-1.5 font-mono text-[11px] text-slate-300">
                                <span className="truncate mr-2">{selectedTx.rawTx?.tx_hash || selectedTx.rawTx?.caas_transfer_id}</span>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(selectedTx.rawTx?.tx_hash || selectedTx.rawTx?.caas_transfer_id, 'hash')}
                                    className="text-slate-500 hover:text-white transition cursor-pointer shrink-0"
                                >
                                    {copiedField === 'hash' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Receiver Address */}
                    {selectedTx.receiverAddress && (
                        <div className="flex flex-col space-y-1 py-1 border-b border-white/5">
                            <span className="text-slate-500 font-medium">{selectedTx.isIncoming ? 'Deposit Address' : 'Receiver Address'}</span>
                            <div className="flex items-center justify-between bg-black/30 border border-white/5 rounded-xl px-2.5 py-1.5 font-mono text-[11px] text-slate-300">
                                <span className="truncate mr-2">{selectedTx.receiverAddress}</span>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(selectedTx.receiverAddress, 'recv')}
                                    className="text-slate-500 hover:text-white transition cursor-pointer shrink-0"
                                >
                                    {copiedField === 'recv' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Date & Time */}
                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-slate-500 font-medium">Date & Time</span>
                        <span className="font-mono text-slate-300 font-medium">
                            {new Date(selectedTx.rawTx?.createdAt || selectedTx.rawTx?.created_at || Date.now()).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })}
                        </span>
                    </div>

                    {/* Token / Currency */}
                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-slate-500 font-medium">Asset</span>
                        <div className="flex items-center space-x-2">
                            <span className="font-mono text-white font-bold">{selectedTx.rawTx?.token || selectedTx.token || walletCode}</span>
                            <span className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase border font-mono select-none",
                                tokenStyles.badgeBg
                            )}>
                                {tokenStyles.sym}
                            </span>
                        </div>
                    </div>

                    {/* Quote ID if present */}
                    {selectedTx.rawTx?.quote_id && (
                        <div className="flex items-center justify-between py-1">
                            <span className="text-slate-500 font-medium">Quote ID</span>
                            <span className="font-mono text-slate-400">{selectedTx.rawTx.quote_id}</span>
                        </div>
                    )}

                </div>

                {/* Footer encryption badge */}
                <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500 font-bold tracking-wide select-none pt-2 font-mono">
                    <Lock className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Verified by Rach CAAS Engine & 256-bit AES</span>
                </div>

            </div>
        </Sheet>
    );
};

export default TransactionDetailSheet;
