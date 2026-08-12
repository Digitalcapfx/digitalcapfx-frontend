'use client'

import React from 'react'
import { Wallet } from './WalletsPage'
import StablecoinWalletView from './views/StablecoinWalletView'
import FiatWalletView from './views/FiatWalletView'
import MomoWalletView from './views/MomoWalletView'
import WaasWalletView from './views/WaasWalletView'

export interface WalletDetailsProps {
    wallet: Wallet;
    initialTransactions?: any[];
    onBack: () => void;
    momoTab?: 'deposits' | 'withdrawals';
    setMomoTab?: (tab: 'deposits' | 'withdrawals') => void;
    currentPage?: number;
    onPageChange?: (newPage: number) => void;
    hasNextPage?: boolean;
}

const WalletDetails: React.FC<WalletDetailsProps> = (props) => {
    const { wallet } = props;
    const provider = (wallet as any).provider || '';
    const type = (wallet.type || '').toLowerCase();
    const code = (wallet.code || '').toUpperCase();

    // 1. WaaS Provider View
    if (provider === 'waas') {
        return <WaasWalletView {...props} />;
    }

    // 2. MoMo Mobile Money View
    if (code === 'XAF' || code === 'XOF') {
        return <MomoWalletView {...props} />;
    }

    // 3. Stablecoin / Crypto CAAS View
    if (type === 'stablecoin' || ['USDC', 'USDT', 'IUSD', 'BUSD'].includes(code)) {
        return <StablecoinWalletView {...props} />;
    }

    // 4. Fallback Fiat Bank Account View
    return <FiatWalletView {...props} />;
};

export default WalletDetails;
