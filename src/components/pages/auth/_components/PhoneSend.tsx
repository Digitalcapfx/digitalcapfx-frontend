'use client'

import React, { useState, useEffect } from 'react'
import { Phone } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'
import { transferService } from '@/services/transfer.service'
import { toast } from 'sonner'
import { formatCurrencyByLocale } from '@/lib/utils'

// Import subcomponents
import { PhoneSendForm } from './phone-send/PhoneSendForm'
import { PhoneSendConfirm } from './phone-send/PhoneSendConfirm'
import { PhoneSendSuccess } from './phone-send/PhoneSendSuccess'

interface PhoneSendProps {
    isSheet?: boolean;
    onClose?: () => void;
}

const PhoneSend: React.FC<PhoneSendProps> = ({ isSheet = false, onClose }) => {
    const queryClient = useQueryClient();
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Form, 2: Confirm, 3: Success
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [amountError, setAmountError] = useState('');

    const [txRef, setTxRef] = useState('TXN-OK');
    const [txStatus, setTxStatus] = useState('Processing');

    const cryptoQuery = useQuery({
        queryKey: ['cryptoBalances'],
        queryFn: () => accountService.getCryptoBalances(),
    });

    const balanceUsdc = cryptoQuery.data?.success && cryptoQuery.data.data
        ? parseFloat(cryptoQuery.data.data.balanceUsdc || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : '0.00';

    const showPolling = step === 3 && !!txRef && txRef !== 'TXN-OK';

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

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let hasError = false;

        if (!phoneNumber) {
            setPhoneError('Please enter a phone number');
            hasError = true;
        } else {
            setPhoneError('');
        }

        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) {
            setAmountError('Please enter a valid amount');
            hasError = true;
        } else {
            setAmountError('');
        }

        if (hasError) return;
        setStep(2);
    };

    const sendCryptoMutation = useMutation({
        mutationFn: (payload: { receiverPhone: string; amount: string; token: 'USDC' }) => transferService.sendCrypto(payload),
        onSuccess: (data) => {
            if (data?.success && data?.data) {
                setTxRef(data.data.reference || data.data.transactionHash || 'TXN-OK');
                setTxStatus('Completed');
                setStep(3);
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

    const handleConfirmSend = () => {
        sendCryptoMutation.mutate({
            receiverPhone: phoneNumber,
            amount: amount,
            token: 'USDC',
        });
    };

    const handleReset = () => {
        setStep(1);
        setPhoneNumber('');
        setAmount('');
        setNote('');
        setPhoneError('');
        setAmountError('');
        if (onClose) onClose();
    };

    const handleDownloadReceipt = () => {
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
                <div class="amount-val">${formatCurrencyByLocale(amount || '0', 'iUSD')}</div>
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
                    <td class="value">Instant USD (iUSD)</td>
                </tr>
                <tr class="details-row">
                    <td class="label">Recipient</td>
                    <td class="value">${phoneNumber}</td>
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
        window.print();

        document.head.removeChild(style);
        document.body.removeChild(container);
    };

    const isPending = sendCryptoMutation.isPending;

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <PhoneSendForm
                        isSheet={isSheet}
                        balanceUsdc={balanceUsdc}
                        phoneNumber={phoneNumber}
                        setPhoneNumber={setPhoneNumber}
                        phoneError={phoneError}
                        setPhoneError={setPhoneError}
                        amount={amount}
                        setAmount={setAmount}
                        amountError={amountError}
                        setAmountError={setAmountError}
                        note={note}
                        setNote={setNote}
                        onSubmit={handleFormSubmit}
                    />
                );
            case 2:
                return (
                    <PhoneSendConfirm
                        amount={amount}
                        phoneNumber={phoneNumber}
                        note={note}
                        isPending={isPending}
                        onBack={() => setStep(1)}
                        onConfirm={handleConfirmSend}
                    />
                );
            case 3:
                return (
                    <PhoneSendSuccess
                        amount={amount}
                        phoneNumber={phoneNumber}
                        txRef={txRef}
                        txStatus={txStatus}
                        handleDownloadReceipt={handleDownloadReceipt}
                        handleReset={handleReset}
                    />
                );
        }
    };

    const innerContent = (
        <>
            {!isSheet && (
                <div className="flex justify-between items-center select-none pb-4 border-b border-white/5">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-primary-400">
                            <Phone className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-satoshi font-bold text-base text-white">Phone Send</h3>
                            <span className="text-[10px] font-semibold text-slate-555">Instant • Stablecoin-powered</span>
                        </div>
                    </div>
                    {step < 3 && (
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Balance</span>
                            <span className="text-sm font-extrabold text-white font-mono mt-0.5 block">${balanceUsdc} <span className="text-[10px] text-slate-555">iUSD</span></span>
                        </div>
                    )}
                </div>
            )}

            {renderStep()}

            {step === 1 && (
                <div className="text-center select-none pt-2 text-[10px] text-slate-555 font-semibold font-sans">
                    Send to any DigitalCapFx customer — just a phone number, no bank details needed.
                </div>
            )}
        </>
    );

    if (isSheet) {
        return <div className="space-y-6 flex flex-col justify-between h-full text-left">{innerContent}</div>;
    }

    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 text-left shadow-xl space-y-6">
            {innerContent}
        </div>
    );
};

export default PhoneSend;
