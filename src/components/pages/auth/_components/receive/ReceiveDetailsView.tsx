'use client'

import React, { useState } from 'react'
import { Check, Copy, Share2, Info, AlertTriangle } from 'lucide-react'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { Wallet } from '../ReceiveMoneySheet'
import { useLanguageStore } from '@/store/languageStore'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'

import { useQuery } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'

interface DetailRowProps {
    label: string;
    value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-between bg-black/25 border border-white/5 rounded-xl px-4 py-3 select-text select-none">
            <div className="text-left space-y-0.5 min-w-0 flex-1 pr-3">
                <span className="text-[9px] text-slate-555 font-bold uppercase tracking-wider block font-sans">{label}</span>
                <span className="font-mono text-xs text-white block break-all select-all leading-normal">{value}</span>
            </div>
            <button
                type="button"
                onClick={handleCopy}
                className="text-slate-555 hover:text-white transition duration-200 cursor-pointer shrink-0"
            >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
        </div>
    );
};

interface ReceiveDetailsViewProps {
    activeWallet: Wallet;
    isCrypto: boolean;
    address: string;
    handleShare: () => void;
}

export const ReceiveDetailsView: React.FC<ReceiveDetailsViewProps> = ({
    activeWallet,
    isCrypto,
    address,
    handleShare,
}) => {
    const { t } = useLanguageStore();

    const cryptoWalletQuery = useQuery({
        queryKey: ['cryptoWallet'],
        queryFn: () => accountService.getCryptoWallet(),
        enabled: isCrypto,
    });

    const fetchedCaasAddress = cryptoWalletQuery.data?.data?.abstraction_address ||
                               cryptoWalletQuery.data?.data?.abstractionAddress ||
                               cryptoWalletQuery.data?.data?.walletAddress || '';

    const validWalletAddress = activeWallet.walletAddress && activeWallet.walletAddress !== t('receive.addressNotAvailable')
        ? activeWallet.walletAddress
        : '';
    const validPassedAddress = address && address !== t('receive.addressNotAvailable')
        ? address
        : '';

    const actualAddress = (validWalletAddress || fetchedCaasAddress || validPassedAddress).trim();
    const hasBankDetails = Boolean(
        activeWallet.accountNumber ||
        activeWallet.accountNumberUk ||
        activeWallet.iban ||
        activeWallet.bic ||
        activeWallet.sortCode
    );

    const hasDetails = isCrypto ? Boolean(actualAddress) : hasBankDetails;

    // Determine clean QR payload value for instant mobile scanner compatibility
    const qrValue = isCrypto
        ? actualAddress
        : (activeWallet.accountNumber || activeWallet.iban || activeWallet.accountNumberUk || actualAddress);

    const onShareClick = () => {
        if (!hasDetails) {
            toast.error(t('receive.details.noDetailsToShare'));
            return;
        }
        handleShare();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-200 flex flex-col h-full">
            {hasDetails ? (
                <>
                    {/* QR Code Container */}
                    <div className="flex flex-col items-center justify-center p-6 bg-white/[0.01] border border-white/5 rounded-3xl text-center space-y-4 select-none">
                        <div className="w-44 h-44 bg-white p-3 rounded-2xl shadow-lg relative flex items-center justify-center">
                            <QRCodeSVG
                                value={qrValue}
                                size={152}
                                level="H"
                                includeMargin={true}
                                className="w-full h-full"
                            />
                            <div className="absolute w-8 h-8 rounded-full bg-[#080D1C] flex items-center justify-center border-2 border-white shadow-md pointer-events-none">
                                <CurrencyIcon code={activeWallet.code} size="sm" className="border-none shadow-none scale-75" />
                            </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold tracking-wider block">
                            {t('receive.details.yourCodeDetails', {
                                code: activeWallet.code,
                                type: isCrypto ? t('receive.details.address') : t('receive.details.bankDetails')
                            })}
                        </span>

                        {isCrypto && (
                            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/25 rounded-full text-cyan-400 font-mono text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                                <span>Network: USDC on Polygon (POL)</span>
                            </div>
                        )}
                    </div>

                    {/* Dynamically List Banking / Local details */}
                    <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin select-none">
                        {isCrypto ? (
                            actualAddress && <DetailRow label={t('receive.details.scwAddress')} value={actualAddress} />
                        ) : (
                            <>
                                {activeWallet.accountNumber && (
                                    <DetailRow label={t('receive.details.accountNumberLabel', { code: activeWallet.code })} value={activeWallet.accountNumber} />
                                )}
                                {activeWallet.accountNumberUk && (
                                    <DetailRow label={t('receive.details.ukAccount')} value={activeWallet.accountNumberUk} />
                                )}
                                {activeWallet.sortCode && (
                                    <DetailRow label={t('receive.details.sortCode')} value={activeWallet.sortCode} />
                                )}
                                {activeWallet.iban && (
                                    <DetailRow label={t('receive.details.iban')} value={activeWallet.iban} />
                                )}
                                {activeWallet.bic && (
                                    <DetailRow label={t('receive.details.bic')} value={activeWallet.bic} />
                                )}
                            </>
                        )}
                    </div>
                </>
            ) : (
                /* Warning state when no address / bank details are provisioned */
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 text-center space-y-3 select-none my-auto">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-sm text-white">
                            {isCrypto ? t('receive.details.noAddressTitle') : t('receive.details.noBankTitle')}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                            {isCrypto
                                ? t('receive.details.noAddressDesc', { code: activeWallet.code })
                                : t('receive.details.noBankDesc', { code: activeWallet.code })}
                        </p>
                    </div>
                </div>
            )}

            {isCrypto && hasDetails && (
                <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl p-4 flex items-start space-x-3 text-left animate-in slide-in-from-bottom duration-300">
                    <Info className="h-5 w-5 text-primary-400 shrink-0 mt-0.5" />
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-white block">{t('receive.details.info.title')}</span>
                        <ul className="text-[10px] text-slate-400 leading-normal space-y-1.5 list-disc list-inside font-sans">
                            <li>
                                <span className="font-bold text-white">{t('receive.details.info.internal.label')}</span> {t('receive.details.info.internal.desc')}
                            </li>
                            <li>
                                <span className="font-bold text-white">{t('receive.details.info.external.label')}</span> {t('receive.details.info.external.desc')}
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            <button
                onClick={onShareClick}
                disabled={!hasDetails}
                className="w-full bg-primary-500 hover:bg-primary-450 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transition duration-200 cursor-pointer flex items-center justify-center space-x-2 active:scale-[0.98] mt-auto select-none"
            >
                <Share2 className="h-4.5 w-4.5" />
                <span>{t('receive.details.btn.share')}</span>
            </button>
        </div>
    );
};
