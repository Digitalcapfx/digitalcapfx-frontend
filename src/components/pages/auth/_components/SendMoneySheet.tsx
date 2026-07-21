'use client'

import React, { useState, useEffect } from 'react'
import { useTransactionStore } from '@/store/transactionStore'
import { Sheet } from '@/components/ui/Sheet'
import { formatCurrencyByLocale } from '@/lib/utils'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'
import { transferService } from '@/services/transfer.service'
import { withdrawalService, Beneficiary, InitiateWithdrawalRequest, WithdrawalQuoteRequest } from '@/services/withdrawal.service'
import { toast } from 'sonner'

// Import subcomponents
import { SendMoneyForm } from './send/SendMoneyForm'
import { SendMoneyReview } from './send/SendMoneyReview'
import { SendMoneySuccess } from './send/SendMoneySuccess'

export interface Wallet {
    id: string;
    name: string;
    code: string;
    type: 'fiat' | 'stablecoin';
    balance: string;
    rawBalance: number;
    accountNumber?: string;
    walletAddress?: string;
    provider?: 'caas' | 'waas';
}

const CURRENCY_NAMES: Record<string, string> = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    XOF: 'CFA Franc BCEAO',
    XAF: 'CFA Franc BEAC',
    USDC: 'USD Coin',
    IUSD: 'Instant USD',
};

const formatBalance = (amount: string | number, currency: string) => {
    const val = typeof amount === 'number' ? amount : parseFloat(amount || '0');
    if (isNaN(val)) return '0.00';
    if (currency === 'XAF' || currency === 'XOF') {
        return val.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ` ${currency}`;
    }
    const symbols: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
    };
    const prefix = symbols[currency] || '';
    return prefix + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (prefix ? '' : ` ${currency}`);
};

const toSmallestUnit = (amountStr: string, network: string): string => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return '0';
    
    const net = network.toUpperCase();
    let decimals = 18; // Default to ETH/POL/BSC 18 decimals
    
    if (net === 'BTC' || net === 'BCH' || net === 'LTC') {
        decimals = 8;
    } else if (net === 'SOL') {
        decimals = 9;
    } else if (net === 'TRX' || net === 'XRP') {
        decimals = 6;
    }
    
    const multiplier = Math.pow(10, decimals);
    const smallestUnit = Math.round(amount * multiplier);
    return smallestUnit.toString();
};

export const SendMoneySheet: React.FC = () => {
    const queryClient = useQueryClient();
    const { isSendOpen, closeSend, sendDefaultWalletId } = useTransactionStore();

    // Wizard step state: 1 = Form, 2 = Review & Confirm, 3 = Success
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Form inputs state
    const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [recipientType, setRecipientType] = useState<'new' | 'saved'>('new');

    // New beneficiary inputs
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [bankName, setBankName] = useState('Digital Cap Partner Bank');
    const [country, setCountry] = useState('Senegal');
    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string | null>(null);

    // Mobile Money operator (XAF/XOF)
    const [operator, setOperator] = useState('DigitalCap');
    // Internal user transfer toggle
    const [isInternal, setIsInternal] = useState(true);

    // Crypto recipient inputs
    const [cryptoAddress, setCryptoAddress] = useState('');
    const [cryptoSendMode, setCryptoSendMode] = useState<'phone' | 'withdraw' | 'address'>('phone');

    // Shared inputs
    const [note, setNote] = useState('');

    // Transaction Result states
    const [txRef, setTxRef] = useState('');
    const [txStatus, setTxStatus] = useState('');
    const [quoteDetails, setQuoteDetails] = useState<{ fee: number; rate: number; totalAmount: number } | null>(null);
    const [showSaveBeneficiaryPrompt, setShowSaveBeneficiaryPrompt] = useState(false);

    // Fetch wallets/balances
    const fiatQuery = useQuery({
        queryKey: ['accounts'],
        queryFn: () => accountService.getAccounts(),
        enabled: isSendOpen,
    });

    const cryptoQuery = useQuery({
        queryKey: ['cryptoBalances'],
        queryFn: () => accountService.getCryptoBalances(),
        enabled: isSendOpen,
    });

    const waasWalletsQuery = useQuery({
        queryKey: ['waasWallets'],
        queryFn: () => accountService.getWaaSWallets(),
        enabled: isSendOpen,
    });

    // Fetch beneficiaries
    const beneficiariesQuery = useQuery({
        queryKey: ['beneficiaries'],
        queryFn: () => withdrawalService.getBeneficiaries(),
        enabled: isSendOpen,
    });

    const walletsList: Wallet[] = [];

    // Map stablecoin wallet
    if (cryptoQuery.data?.success && cryptoQuery.data.data) {
        const d = cryptoQuery.data.data;
        const symbol = d.symbol || 'iUSD';
        walletsList.push({
            id: symbol.toLowerCase(),
            name: d.name || CURRENCY_NAMES[symbol.toUpperCase()] || 'Instant USD',
            code: symbol,
            type: 'stablecoin',
            balance: d.balanceFormatted || formatBalance(d.balanceUsdc, symbol),
            rawBalance: parseFloat(d.balanceUsdc || '0'),
            walletAddress: d.walletAddress,
            provider: 'caas'
        });
    }

    // Map fiat wallets
    if (fiatQuery.data?.success && Array.isArray(fiatQuery.data.data)) {
        fiatQuery.data.data.forEach((acc) => {
            walletsList.push({
                id: acc.currency.toLowerCase(),
                name: CURRENCY_NAMES[acc.currency] || acc.currency,
                code: acc.currency,
                type: 'fiat',
                balance: formatBalance(acc.balance, acc.currency),
                rawBalance: parseFloat(acc.balance || '0'),
                accountNumber: acc.accountNumber,
            });
        });
    }

    // Map WaaS wallets
    const waasAddressesData = waasWalletsQuery.data?.data?.addresses || waasWalletsQuery.data?.data || [];
    if (Array.isArray(waasAddressesData)) {
        waasAddressesData.forEach((w: any) => {
            const balancesArr = Array.isArray(w.balances) ? w.balances : [];
            
            // 1. Map the native asset of the network
            const nativeSymbol = w.network || 'POL';
            const nativeBalObj = balancesArr.find((b: any) => b.symbol?.toUpperCase() === nativeSymbol.toUpperCase() || b.currency?.toUpperCase() === nativeSymbol.toUpperCase());
            const nativeBalVal = nativeBalObj?.balance !== undefined ? parseFloat(nativeBalObj.balance.toString()) : 0;
            const nativeFormattedBal = nativeBalObj?.formatted_balance || 
                                       nativeBalObj?.formattedBalance || 
                                       formatBalance(nativeBalVal, nativeSymbol);

            walletsList.push({
                id: nativeSymbol.toLowerCase(),
                name: `${w.network} Wallet`,
                code: nativeSymbol,
                type: 'stablecoin',
                balance: nativeFormattedBal,
                rawBalance: nativeBalVal,
                walletAddress: w.address,
                provider: 'waas'
            });

            // 2. Map other stablecoins/tokens in balances list (e.g., USDC, USDT)
            balancesArr.forEach((b: any) => {
                const sym = b.symbol || b.currency || '';
                if (!sym || sym.toUpperCase() === nativeSymbol.toUpperCase()) return;

                const balVal = b.balance !== undefined ? parseFloat(b.balance.toString()) : 0;
                const formattedBal = b.formatted_balance || 
                                     b.formattedBalance || 
                                     formatBalance(balVal, sym);

                walletsList.push({
                    id: sym.toLowerCase(),
                    name: `${sym} Wallet`,
                    code: sym,
                    type: 'stablecoin',
                    balance: formattedBal,
                    rawBalance: balVal,
                    walletAddress: w.address,
                    provider: 'waas'
                });
            });
        });
    }

    // Pre-select wallet if default is provided
    useEffect(() => {
        if (isSendOpen && walletsList.length > 0) {
            const matchesDefault = walletsList.find(w => w.id === sendDefaultWalletId);
            setSelectedWalletId(matchesDefault ? matchesDefault.id : walletsList[0].id);
            setStep(1);
            setAmount('');
            setNote('');
            setAccountNumber('');
            setAccountName('');
            setCryptoAddress('');
            setQuoteDetails(null);
        }
    }, [isSendOpen, sendDefaultWalletId, walletsList.length]);

    const activeWallet = walletsList.find(w => w.id === selectedWalletId) || walletsList[0] || {
        id: 'usdc',
        name: 'USD Coin',
        code: 'USDC',
        type: 'stablecoin' as const,
        balance: '0.00 USDC',
        rawBalance: 0,
    };

    useEffect(() => {
        if (activeWallet) {
            if (activeWallet.provider === 'waas') {
                setCryptoSendMode('address');
            } else {
                setCryptoSendMode('phone');
            }
        }
    }, [selectedWalletId]);

    const isCrypto = activeWallet.type === 'stablecoin';
    const isMobileMoney = !isCrypto && (activeWallet.code === 'XAF' || activeWallet.code === 'XOF');

    const showPolling = step === 3 && isCrypto && !!txRef && txRef !== 'TXN-MM-OK' && txRef !== 'TXN-OK' && txRef !== 'TXN-INT-OK';

    const transactionQuery = useQuery({
        queryKey: ['cryptoTransaction', txRef],
        queryFn: () => accountService.getCryptoTransaction(txRef),
        enabled: showPolling,
        refetchInterval: (query) => {
            const data = query.state.data;
            const status = (data?.data?.status || '').toLowerCase();
            if (status === 'completed' || status === 'success' || status === 'failed') {
                return false;
            }
            return 3000;
        }
    });

    useEffect(() => {
        if (transactionQuery.data?.success && transactionQuery.data.data?.status) {
            setTxStatus(transactionQuery.data.data.status);
        }
    }, [transactionQuery.data]);

    const beneficiariesList: Beneficiary[] = beneficiariesQuery.data?.success && Array.isArray(beneficiariesQuery.data.data)
        ? beneficiariesQuery.data.data
        : [];

    // Pre-select first beneficiary if available
    useEffect(() => {
        if (beneficiariesList.length > 0 && !selectedBeneficiaryId) {
            setSelectedBeneficiaryId(beneficiariesList[0].id);
        }
    }, [beneficiariesList, selectedBeneficiaryId]);

    const activeBeneficiary = beneficiariesList.find(b => b.id === selectedBeneficiaryId) || beneficiariesList[0];

    const displayRecipientName = isCrypto
        ? (cryptoAddress ? `${cryptoAddress.slice(0, 8)}...${cryptoAddress.slice(-6)}` : 'Recipient Phone')
        : (recipientType === 'saved' && activeBeneficiary ? activeBeneficiary.name : (accountName || 'New Recipient'));

    // Check if form is valid to proceed
    const isFormValid = () => {
        if (!selectedWalletId || !amount || parseFloat(amount) <= 0) return false;

        if (isCrypto) {
            return cryptoAddress.length > 5;
        } else {
            if (recipientType === 'saved') {
                return !!selectedBeneficiaryId;
            } else {
                return accountNumber.length > 4 && accountName.length > 1;
            }
        }
    };

    const quoteMutation = useMutation({
        mutationFn: (payload: WithdrawalQuoteRequest) => withdrawalService.createWithdrawalQuote(payload),
        onSuccess: (res) => {
            if (res?.success && res?.data) {
                setQuoteDetails({
                    fee: res.data.fee,
                    rate: res.data.rate,
                    totalAmount: res.data.totalAmount
                });
                setStep(2);
            }
        },
        onError: (err: any) => {
            console.error('Quote preview error:', err);
            toast.error(err.response?.data?.error?.message || 'Failed to preview withdrawal rates.');
        }
    });

    const handleProceed = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid()) return;

        // Fetch rates preview if it is a standard wire/bank withdrawal (not crypto and not mobile money and not internal)
        if (!isCrypto && !isMobileMoney && !isInternal) {
            const destCurrency = recipientType === 'saved' ? activeBeneficiary?.currency : activeWallet.code;
            quoteMutation.mutate({
                amount: parseFloat(amount),
                currency: destCurrency,
                sourceCurrency: activeWallet.code
            });
        } else {
            setStep(2);
        }
    };

    // Beneficiaries mutations
    const saveBeneficiaryMutation = useMutation({
        mutationFn: (payload: { name: string; accountNumber: string; bankName: string; currency: string; country: string }) =>
            withdrawalService.createBeneficiary(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['beneficiaries'] });
        }
    });

    const deleteBeneficiaryMutation = useMutation({
        mutationFn: (id: string) => withdrawalService.deleteBeneficiary(id),
        onSuccess: () => {
            toast.success('Beneficiary removed.');
            setSelectedBeneficiaryId(null);
            queryClient.invalidateQueries({ queryKey: ['beneficiaries'] });
        },
        onError: () => toast.error('Could not delete beneficiary.')
    });

    const sendCryptoMutation = useMutation({
        mutationFn: (payload: { receiverPhone: string; amount: string; token: 'USDC' | 'USDT' }) => transferService.sendCrypto(payload),
        onSuccess: (data) => {
            if (data?.success && data?.data) {
                setTxRef(data.data.reference || data.data.transactionHash || 'TXN-OK');
                setTxStatus('Completed');
                setStep(3);
                setShowSaveBeneficiaryPrompt(true);
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
                queryClient.invalidateQueries({ queryKey: ['cryptoBalances'] });
                queryClient.invalidateQueries({ queryKey: ['activity'] });
            } else {
                toast.error(data?.error?.message || 'Send stablecoin failed.');
            }
        },
        onError: (err: any) => {
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object' ? rawError.message : (rawError || 'Failed to send.');
            toast.error(msg);
        }
    });

    const sendWaaSMutation = useMutation({
        mutationFn: (payload: { amount: string; currency: string; network: string; toAddress: string }) =>
            transferService.transferWaaS(payload),
        onSuccess: (data) => {
            if (data?.success && data?.data) {
                setTxRef(data.data.transactionHash || data.data.reference || 'TXN-WaaS-OK');
                setTxStatus('Completed');
                setStep(3);
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
                queryClient.invalidateQueries({ queryKey: ['waasWallets'] });
                queryClient.invalidateQueries({ queryKey: ['waasWalletsDetails'] });
                queryClient.invalidateQueries({ queryKey: ['activity'] });
            } else {
                toast.error(data?.error?.message || 'On-chain transfer failed.');
            }
        },
        onError: (err: any) => {
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object' ? rawError.message : (rawError || 'Failed to send on-chain.');
            toast.error(msg);
        }
    });

    const withdrawMutation = useMutation({
        mutationFn: (payload: InitiateWithdrawalRequest) =>
            withdrawalService.initiateWithdrawal(payload),
        onSuccess: (data) => {
            if (data?.success && data?.data) {
                const txId = data.data.id || data.data.caasWithdrawalId || data.data.reference || 'TXN-OK';
                const status = data.data.status || 'Processing';
                setTxRef(txId);
                setTxStatus(status);
                setStep(3);
                if (recipientType === 'new') {
                    setShowSaveBeneficiaryPrompt(true);
                }
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
                queryClient.invalidateQueries({ queryKey: ['activity'] });
            }
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.error?.message || 'Withdrawal execution failed.');
        }
    });

    const hub2TransferMutation = useMutation({
        mutationFn: (payload: { amount: number; currency: string; phone: string; operator: string }) =>
            withdrawalService.initiateWithdrawal(payload),
        onSuccess: (data) => {
            if (data?.success && data?.data) {
                const txId = data.data.id || data.data.caasWithdrawalId || data.data.reference || 'TXN-MM-OK';
                const status = data.data.status || 'Processing';
                setTxRef(txId);
                setTxStatus(status);
                setStep(3);
                if (recipientType === 'new') {
                    setShowSaveBeneficiaryPrompt(true);
                }
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
                queryClient.invalidateQueries({ queryKey: ['activity'] });
            }
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.error?.message || 'Mobile Money payout failed.');
        }
    });

    const internalTransferMutation = useMutation({
        mutationFn: (payload: { amount: number; currency: string; receiverPhone: string }) =>
            withdrawalService.transferInternal(payload),
        onSuccess: (data) => {
            if (data?.success && data?.data) {
                setTxRef(data.data.reference || 'TXN-INT-OK');
                setTxStatus(data.data.status || 'Completed');
                setStep(3);
                if (recipientType === 'new') {
                    setShowSaveBeneficiaryPrompt(true);
                }
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
                queryClient.invalidateQueries({ queryKey: ['activity'] });
            }
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.error?.message || 'Internal transfer failed. User might not exist.');
        }
    });

    const handleDownloadReceipt = () => {
        // Create dynamic print stylesheet
        const style = document.createElement('style');
        style.id = 'receipt-print-style';
        style.innerHTML = `
            @media print {
                body > * {
                    display: none !important;
                }
                #receipt-print-container {
                    display: block !important;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    color: #0f172a !important;
                    padding: 40px !important;
                    max-width: 600px !important;
                    margin: 0 auto !important;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #f1f5f9;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .logo {
                    font-size: 24px;
                    font-weight: 800;
                    color: #3b82f6;
                    margin-bottom: 5px;
                }
                .title {
                    font-size: 14px;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .amount-box {
                    text-align: center;
                    background-color: #f8fafc;
                    border-radius: 16px;
                    padding: 24px;
                    margin-bottom: 30px;
                }
                .amount-label {
                    font-size: 12px;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    display: block;
                    margin-bottom: 5px;
                }
                .amount-val {
                    font-size: 32px;
                    font-weight: 900;
                    color: #0f172a;
                }
                .details-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                }
                .details-row {
                    border-bottom: 1px solid #f1f5f9;
                }
                .details-row td {
                    padding: 14px 0;
                    font-size: 13px;
                }
                .label {
                    color: #64748b;
                    font-weight: 600;
                    width: 150px;
                    text-align: left;
                }
                .value {
                    color: #0f172a;
                    font-weight: 700;
                    text-align: right;
                }
                .value.mono {
                    font-family: monospace;
                    font-size: 12px;
                }
                .status {
                    display: inline-block;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                }
                .status.completed {
                    background-color: #dcfce7;
                    color: #15803d;
                }
                .status.pending {
                    background-color: #dbeafe;
                    color: #1d4ed8;
                }
                .footer {
                    text-align: center;
                    color: #94a3b8;
                    font-size: 11px;
                    margin-top: 50px;
                    border-top: 1px solid #f1f5f9;
                    padding-top: 20px;
                }
            }
            @media screen {
                #receipt-print-container {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Create printing wrapper element
        const container = document.createElement('div');
        container.id = 'receipt-print-container';

        const dateStr = new Date().toLocaleString();

        container.innerHTML = `
            <div class="header">
                <div class="logo">DigitalFX</div>
                <div class="title">Transaction Receipt</div>
            </div>
            
            <div class="amount-box">
                <span class="amount-label">Amount Transferred</span>
                <div class="amount-val">${formatCurrencyByLocale(amount || '0', activeWallet.code)}</div>
            </div>
            
            <table class="details-table">
                <tr class="details-row">
                    <td class="label">Transaction ID</td>
                    <td class="value mono">${txRef}</td>
                </tr>
                <tr class="details-row">
                    <td class="label">Date</td>
                    <td class="value">${dateStr}</td>
                </tr>
                <tr class="details-row">
                    <td class="label">Source Wallet</td>
                    <td class="value">${activeWallet ? activeWallet.name : ''} (${activeWallet ? activeWallet.code : ''})</td>
                </tr>
                <tr class="details-row">
                    <td class="label">Recipient</td>
                    <td class="value">${displayRecipientName}</td>
                </tr>
                <tr class="details-row">
                    <td class="label">Reference</td>
                    <td class="value">${note || 'Invoice payment'}</td>
                </tr>
                <tr class="details-row">
                    <td class="label">Status</td>
                    <td class="value">
                        <span class="status ${(txStatus || '').toLowerCase() === 'completed' || (txStatus || '').toLowerCase() === 'success' ? 'completed' : 'pending'}">
                            ${txStatus}
                        </span>
                    </td>
                </tr>
            </table>
            
            <div class="footer">
                Thank you for using DigitalFX.<br>
                This is an automated receipt generated by DigitalFX for tracking purposes.
            </div>
        `;
        document.body.appendChild(container);

        // Execute print window helper
        window.print();

        // Cleanup
        document.head.removeChild(style);
        document.body.removeChild(container);
    };

    const handleConfirmSend = async () => {
        if (isCrypto) {
            if (activeWallet.provider === 'waas') {
                sendWaaSMutation.mutate({
                    amount: toSmallestUnit(amount, activeWallet.code),
                    currency: activeWallet.code,
                    network: activeWallet.code,
                    toAddress: cryptoAddress
                });
            } else if (cryptoSendMode === 'withdraw') {
                hub2TransferMutation.mutate({
                    amount: parseFloat(amount),
                    currency: activeWallet.code,
                    phone: cryptoAddress,
                    operator
                });
            } else {
                sendCryptoMutation.mutate({
                    receiverPhone: cryptoAddress,
                    amount: amount,
                    token: activeWallet.code === 'USDT' ? 'USDT' : 'USDC',
                });
            }
        } else if (isMobileMoney) {
            const phoneVal = recipientType === 'saved' ? activeBeneficiary?.accountNumber : accountNumber;
            hub2TransferMutation.mutate({
                amount: parseFloat(amount),
                currency: activeWallet.code as 'XOF' | 'XAF',
                phone: phoneVal,
                operator
            });
        } else if (isInternal) {
            const phoneVal = recipientType === 'saved' ? activeBeneficiary?.accountNumber : accountNumber;
            internalTransferMutation.mutate({
                amount: parseFloat(amount),
                currency: activeWallet.code,
                receiverPhone: phoneVal
            });
        } else {
            // Standard Bank Wire Withdrawal
            if (recipientType === 'saved') {
                if (!selectedBeneficiaryId) {
                    toast.error('A beneficiary is required to initiate bank withdrawals.');
                    return;
                }
                withdrawMutation.mutate({
                    amount: parseFloat(amount),
                    currency: activeWallet.code,
                    beneficiaryId: selectedBeneficiaryId,
                    sourceCurrency: activeWallet.code
                });
            } else {
                withdrawMutation.mutate({
                    amount: parseFloat(amount),
                    currency: activeWallet.code,
                    sourceCurrency: activeWallet.code,
                    accountNumber,
                    bankName,
                    country,
                    recipientName: accountName,
                    destinationCurrency: activeWallet.code
                });
            }
        }
    };

    const handleReset = () => {
        setStep(1);
        setAmount('');
        setNote('');
        setAccountNumber('');
        setAccountName('');
        setCryptoAddress('');
        setOperator('DigitalCap');
        setIsInternal(true);
        setQuoteDetails(null);
        setShowSaveBeneficiaryPrompt(false);
    };

    const handleSaveBeneficiaryPostTx = async () => {
        try {
            let name = accountName || 'Beneficiary';
            let accNum = accountNumber;
            if (isCrypto) {
                name = cryptoAddress.slice(0, 8) + '...';
                accNum = cryptoAddress;
            }
            const res = await saveBeneficiaryMutation.mutateAsync({
                name,
                accountNumber: accNum,
                bankName: isCrypto ? 'Crypto Wallet' : (operator === 'DigitalCap' ? 'DigitalCap' : operator),
                currency: activeWallet.code,
                country: country || 'Senegal'
            });
            if (res?.success) {
                toast.success('Beneficiary saved successfully.');
            }
        } catch (e) {
            toast.error('Failed to save beneficiary.');
        }
        setShowSaveBeneficiaryPrompt(false);
    };

    const handleDiscardBeneficiaryPostTx = () => {
        setShowSaveBeneficiaryPrompt(false);
    };

    const isPending = sendCryptoMutation.isPending ||
        withdrawMutation.isPending ||
        hub2TransferMutation.isPending ||
        internalTransferMutation.isPending ||
        quoteMutation.isPending;

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <SendMoneyForm
                        walletsList={walletsList}
                        activeWallet={activeWallet}
                        selectedWalletId={selectedWalletId}
                        setSelectedWalletId={setSelectedWalletId}
                        isDropdownOpen={isDropdownOpen}
                        setIsDropdownOpen={setIsDropdownOpen}
                        amount={amount}
                        setAmount={setAmount}
                        isCrypto={isCrypto}
                        isMobileMoney={isMobileMoney}
                        cryptoSendMode={cryptoSendMode}
                        setCryptoSendMode={setCryptoSendMode}
                        cryptoAddress={cryptoAddress}
                        setCryptoAddress={setCryptoAddress}
                        operator={operator}
                        setOperator={setOperator}
                        isInternal={isInternal}
                        setIsInternal={setIsInternal}
                        recipientType={recipientType}
                        setRecipientType={setRecipientType}
                        accountNumber={accountNumber}
                        setAccountNumber={setAccountNumber}
                        accountName={accountName}
                        setAccountName={setAccountName}
                        bankName={bankName}
                        setBankName={setBankName}
                        country={country}
                        setCountry={setCountry}
                        selectedBeneficiaryId={selectedBeneficiaryId}
                        setSelectedBeneficiaryId={setSelectedBeneficiaryId}
                        beneficiariesList={beneficiariesList}
                        deleteBeneficiary={(id) => deleteBeneficiaryMutation.mutate(id)}
                        onSubmit={handleProceed}
                        isFormValid={isFormValid()}
                    />
                );
            case 2:
                return (
                    <SendMoneyReview
                        amount={amount}
                        activeWallet={activeWallet}
                        isCrypto={isCrypto}
                        isMobileMoney={isMobileMoney}
                        isInternal={isInternal}
                        displayRecipientName={displayRecipientName}
                        note={note}
                        quoteDetails={quoteDetails}
                        recipientType={recipientType}
                        activeBeneficiary={activeBeneficiary}
                        operator={operator}
                        isPending={isPending}
                        onBack={() => setStep(1)}
                        onConfirm={handleConfirmSend}
                    />
                );
            case 3:
                return (
                    <SendMoneySuccess
                        amount={amount}
                        activeWallet={activeWallet}
                        isCrypto={isCrypto}
                        isMobileMoney={isMobileMoney}
                        displayRecipientName={displayRecipientName}
                        txRef={txRef}
                        txStatus={txStatus}
                        note={note}
                        showSaveBeneficiaryPrompt={showSaveBeneficiaryPrompt}
                        handleSaveBeneficiaryPostTx={handleSaveBeneficiaryPostTx}
                        handleDiscardBeneficiaryPostTx={handleDiscardBeneficiaryPostTx}
                        handleDownloadReceipt={handleDownloadReceipt}
                        handleReset={handleReset}
                    />
                );
        }
    };

    return (
        <Sheet
            isOpen={isSendOpen}
            onClose={closeSend}
            title="Send Money"
            description="Send fiat or stablecoins anywhere in the world"
        >
            {renderStep()}
        </Sheet>
    );
};

export default SendMoneySheet;
