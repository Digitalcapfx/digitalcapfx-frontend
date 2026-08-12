'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Send, ArrowDownLeft, RefreshCw } from 'lucide-react'
import { useTransactionStore } from '@/store/transactionStore'
import { useLanguageStore } from '@/store/languageStore'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Wallet } from '../WalletsPage'

interface WalletQuickActionsProps {
    wallet: Wallet;
}

export const WalletQuickActions: React.FC<WalletQuickActionsProps> = ({ wallet }) => {
    const { t } = useLanguageStore();
    const router = useRouter();
    const openSend = useTransactionStore((state) => state.openSend);
    const openReceive = useTransactionStore((state) => state.openReceive);

    return (
        <div className="grid grid-cols-3 gap-3 select-none">
            <button
                type="button"
                onClick={() => {
                    if (wallet.actions?.can_send === false) {
                        toast.error('Send feature is disabled for this wallet.');
                        return;
                    }
                    openSend(wallet.id);
                }}
                disabled={wallet.actions?.can_send === false}
                className={cn(
                    "bg-[#0C1224] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center space-y-2 transition duration-200 font-semibold cursor-pointer",
                    wallet.actions?.can_send === false
                        ? "opacity-40 cursor-not-allowed"
                        : "text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.01]"
                )}
            >
                <div className="w-8 h-8 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 shrink-0">
                    <Send className="h-4 w-4" />
                </div>
                <span className="text-[11px]">{t('action.send')}</span>
            </button>

            <button
                type="button"
                onClick={() => {
                    if (wallet.actions?.can_receive === false) {
                        toast.error('Receive feature is disabled for this wallet.');
                        return;
                    }
                    openReceive(wallet.id);
                }}
                disabled={wallet.actions?.can_receive === false}
                className={cn(
                    "bg-[#0C1224] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center space-y-2 transition duration-200 font-semibold cursor-pointer",
                    wallet.actions?.can_receive === false
                        ? "opacity-40 cursor-not-allowed"
                        : "text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.01]"
                )}
            >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <ArrowDownLeft className="h-4.5 w-4.5" />
                </div>
                <span className="text-[11px]">{t('action.receive')}</span>
            </button>

            <button
                type="button"
                onClick={() => {
                    if (wallet.actions?.can_exchange === false) {
                        toast.error('Exchange feature is disabled for this wallet.');
                        return;
                    }
                    router.push('/exchange');
                }}
                disabled={wallet.actions?.can_exchange === false}
                className={cn(
                    "bg-[#0C1224] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center space-y-2 transition duration-200 font-semibold cursor-pointer",
                    wallet.actions?.can_exchange === false
                        ? "opacity-40 cursor-not-allowed"
                        : "text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.01]"
                )}
            >
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                    <RefreshCw className="h-4 w-4" />
                </div>
                <span className="text-[11px]">{t('nav.exchange')}</span>
            </button>
        </div>
    );
};

export default WalletQuickActions;
