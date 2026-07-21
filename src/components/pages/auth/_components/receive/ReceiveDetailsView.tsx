'use client'

import React, { useState } from 'react'
import { Check, Copy, Share2, Info } from 'lucide-react'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { Wallet } from '../ReceiveMoneySheet'
import { useLanguageStore } from '@/store/languageStore'

interface DetailRowProps {
    label: string;
    value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
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

    return (
        <div className="space-y-6 animate-in fade-in duration-200 flex flex-col h-full">
            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-6 bg-white/[0.01] border border-white/5 rounded-3xl text-center space-y-4 select-none">
                <div className="w-40 h-40 bg-white p-3 rounded-2xl shadow-lg relative flex items-center justify-center">
                    <div className="absolute w-10 h-10 rounded-full bg-[#080D1C] flex items-center justify-center border-4 border-white shadow-md">
                        <CurrencyIcon code={activeWallet.code} size="sm" className="border-none shadow-none" />
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(address)}`}
                        alt="Wallet/Account QR Code"
                        className="w-full h-full rounded-lg"
                    />
                </div>
                <span className="text-[10px] text-slate-555 font-bold tracking-wider block">
                    {t('receive.details.yourCodeDetails', {
                        code: activeWallet.code,
                        type: isCrypto ? t('receive.details.address') : t('receive.details.bankDetails')
                    })}
                </span>
            </div>

            {/* Dynamically List Banking / Local details */}
            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin select-none">
                {isCrypto ? (
                    <DetailRow label={t('receive.details.scwAddress')} value={activeWallet.walletAddress || '0xSCW1234567890abcdef...'} />
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

            {isCrypto && (
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
                onClick={handleShare}
                className="w-full bg-primary-500 hover:bg-primary-450 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transition duration-200 cursor-pointer flex items-center justify-center space-x-2 active:scale-[0.98] mt-auto select-none"
            >
                <Share2 className="h-4.5 w-4.5" />
                <span>{t('receive.details.btn.share')}</span>
            </button>
        </div>
    );
};
