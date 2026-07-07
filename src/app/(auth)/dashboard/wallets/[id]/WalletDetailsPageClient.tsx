'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import WalletDetails from '@/components/pages/auth/wallet/WalletDetails'
import { WALLETS_DATA } from '@/components/pages/auth/wallet/WalletsPage'
import { useNavigationStore } from '@/store/navigationStore'

interface WalletDetailsPageClientProps {
    id: string;
}

export default function WalletDetailsPageClient({ id }: WalletDetailsPageClientProps) {
    const router = useRouter();

    // Find the wallet data by matching the dynamic ID parameter
    const wallet = WALLETS_DATA.find((w) => w.id === id);

    if (!wallet) {
        return (
            <div className="text-center py-16 min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <h3 className="text-lg font-bold text-white font-satoshi">Wallet not found</h3>
                <p className="text-xs text-slate-500 font-sans">The wallet currency code you requested could not be loaded.</p>
                <button
                    onClick={() => router.push('/dashboard/wallets')}
                    className="text-xs font-bold text-primary-400 hover:text-primary-350 hover:underline bg-[#0C1224] border border-white/5 px-4 py-2 rounded-xl cursor-pointer"
                >
                    Back to Wallets
                </button>
            </div>
        );
    }

    const onBack = () => {
        // Resolve on click to prevent hydration errors during Next.js SSR
        const path = useNavigationStore.getState().backPath;
        router.push(path);
    };

    return (
        <WalletDetails
            wallet={wallet}
            onBack={onBack}
        />
    );
}
