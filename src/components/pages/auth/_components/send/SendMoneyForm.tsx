'use client'

import React from 'react'
import { ChevronDown, Check, Trash2 } from 'lucide-react'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { cn } from '@/lib/utils'
import { NumberInput } from '@/components/ui/NumberInput'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { Wallet } from '../SendMoneySheet'
import { Beneficiary } from '@/services/withdrawal.service'
import { Button } from '@/components/ui/Button'
import { useLanguageStore } from '@/store/languageStore'
import { Select } from '@/components/ui/Select'

interface SendMoneyFormProps {
    walletsList: Wallet[];
    activeWallet: Wallet;
    selectedWalletId: string | null;
    setSelectedWalletId: (val: string | null) => void;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (val: boolean) => void;
    amount: string;
    setAmount: (val: string) => void;
    isCrypto: boolean;
    isMobileMoney: boolean;
    cryptoSendMode: 'phone' | 'withdraw' | 'address';
    setCryptoSendMode: (val: 'phone' | 'withdraw' | 'address') => void;
    cryptoAddress: string;
    setCryptoAddress: (val: string) => void;
    operator: string;
    setOperator: (val: string) => void;
    isInternal: boolean;
    setIsInternal: (val: boolean) => void;
    recipientType: 'new' | 'saved';
    setRecipientType: (val: 'new' | 'saved') => void;
    accountNumber: string;
    setAccountNumber: (val: string) => void;
    accountName: string;
    setAccountName: (val: string) => void;
    bankName: string;
    setBankName: (val: string) => void;
    country: string;
    setCountry: (val: string) => void;
    selectedBeneficiaryId: string | null;
    setSelectedBeneficiaryId: (val: string | null) => void;
    beneficiariesList: Beneficiary[];
    deleteBeneficiary: (id: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isFormValid: boolean;
}
export const SendMoneyForm: React.FC<SendMoneyFormProps> = ({
    walletsList,
    activeWallet,
    selectedWalletId,
    setSelectedWalletId,
    isDropdownOpen,
    setIsDropdownOpen,
    amount,
    setAmount,
    isCrypto,
    isMobileMoney,
    cryptoSendMode,
    setCryptoSendMode,
    cryptoAddress,
    setCryptoAddress,
    operator,
    setOperator,
    isInternal,
    setIsInternal,
    recipientType,
    setRecipientType,
    accountNumber,
    setAccountNumber,
    accountName,
    setAccountName,
    bankName,
    setBankName,
    country,
    setCountry,
    selectedBeneficiaryId,
    setSelectedBeneficiaryId,
    beneficiariesList,
    deleteBeneficiary,
    onSubmit,
    isFormValid,
}) => {
    const { t } = useLanguageStore();

    const operatorOptionsCrypto = [
        { value: 'DigitalCap', label: t('send.form.operatorDigitalCap') },
        { value: 'MTN', label: 'MTN Mobile Money' },
        { value: 'Orange', label: 'Orange Money' },
        { value: 'Moov', label: 'Moov Money' },
        { value: 'Wave', label: 'Wave' }
    ];

    const operatorOptionsFiat = [
        { value: 'DigitalCap', label: t('send.form.operatorDigitalCap') },
        { value: 'Orange', label: 'Orange Money' },
        { value: 'MTN', label: 'MTN MoMo' },
        { value: 'Moov', label: 'Moov Money' },
        { value: 'Wave', label: 'Wave' }
    ];

    return (
        <form onSubmit={onSubmit} className="space-y-6 flex flex-col justify-between h-full text-left">
            <div className="space-y-5">
                {/* Selector for FROM Wallet */}
                <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block select-none">{t('send.form.sourceWallet')}</span>
                    <div className="relative">
                        <div
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="bg-[#0C1224] border border-white/10 hover:border-white/15 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition select-none"
                        >
                            <div className="flex items-center space-x-3">
                                <CurrencyIcon code={activeWallet.code} size="md" />
                                <div className="text-left">
                                    <span className="font-bold text-white block text-sm leading-tight">{activeWallet.name}</span>
                                    <span className="text-[9px] text-slate-500 font-bold block mt-0.5">{activeWallet.code} • Balance: {activeWallet.balance}</span>
                                </div>
                            </div>
                            <ChevronDown className="h-4 w-4 text-slate-500" />
                        </div>

                        {isDropdownOpen && (
                            <div
                                className="fixed inset-0 z-20"
                                onClick={() => setIsDropdownOpen(false)}
                            />
                        )}

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1528] border border-white/10 rounded-2xl shadow-2xl z-30 max-h-[220px] overflow-y-auto scrollbar-none py-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                {walletsList.map((w) => (
                                    <div
                                        key={w.id}
                                        onClick={() => {
                                            setSelectedWalletId(w.id);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={cn(
                                            "px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition",
                                            selectedWalletId === w.id ? "bg-white/[0.01]" : ""
                                        )}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <CurrencyIcon code={w.code} size="md" />
                                            <div className="text-left">
                                                <span className="font-bold text-white text-xs block leading-tight">{w.name}</span>
                                                <span className="text-[9px] text-slate-555 font-bold uppercase">{w.code} • {w.balance}</span>
                                            </div>
                                        </div>
                                        {selectedWalletId === w.id && <Check className="h-4 w-4 text-primary-400" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Amount Entry Card */}
                <div className="bg-[#0C1224] border border-white/10 rounded-2xl p-5 text-center relative select-none">
                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block mb-1">{t('send.form.enterAmount')}</span>
                    <div className="flex items-center justify-center space-x-1 py-1">
                        <NumberInput
                            value={amount}
                            onChange={setAmount}
                            placeholder="0.00"
                            className="bg-transparent border-none focus:outline-none focus:ring-0 text-center text-white font-mono font-black text-3.5xl placeholder-slate-700 w-full max-w-[240px] leading-none"
                        />
                        {activeWallet.type !== 'fiat' && (
                            <span className="text-2xl font-black text-slate-500 font-mono">{activeWallet.code}</span>
                        )}
                    </div>
                </div>
                <div className="h-[1px] bg-white/5 my-1"></div>

                {isCrypto ? (
                    /* Crypto Recipient Input */
                    <div className="space-y-4 animate-in fade-in duration-200">
                        {activeWallet.provider === 'waas' ? (
                            <div className="space-y-1.5 animate-in fade-in duration-200">
                                <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">{t('send.form.recipientAddress', { code: activeWallet.code })}</span>
                                <input
                                    type="text"
                                    required
                                    placeholder={t('send.form.addressPlaceholder', { code: activeWallet.code })}
                                    value={cryptoAddress}
                                    onChange={(e) => setCryptoAddress(e.target.value)}
                                    className="bg-[#0C1224] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none w-full font-mono focus:border-primary-500/50"
                                />
                            </div>
                        ) : (
                            <>
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">{t('send.form.transferMethod')}</span>
                                    <div className="flex bg-black/30 border border-white/15 p-1 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCryptoSendMode('phone');
                                                setCryptoAddress('');
                                            }}
                                            className={cn(
                                                "flex-1 py-2 text-[10px] font-bold rounded-lg transition duration-200 cursor-pointer select-none",
                                                cryptoSendMode === 'phone'
                                                    ? "bg-primary-500 text-white shadow-md"
                                                    : "text-slate-400 hover:text-white"
                                            )}
                                        >
                                            {t('send.form.sendToPhone')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCryptoSendMode('withdraw');
                                                setCryptoAddress('');
                                            }}
                                            className={cn(
                                                "flex-1 py-2 text-[10px] font-bold rounded-lg transition duration-200 cursor-pointer select-none",
                                                cryptoSendMode === 'withdraw'
                                                    ? "bg-primary-500 text-white shadow-md"
                                                    : "text-slate-400 hover:text-white"
                                            )}
                                        >
                                            {t('send.form.withdrawToMomo')}
                                        </button>
                                    </div>
                                </div>

                                {cryptoSendMode === 'phone' && (
                                    <PhoneInput
                                        required
                                        label={t('send.form.recipientPhone')}
                                        placeholder={t('send.form.phonePlaceholder')}
                                        value={cryptoAddress}
                                        onChange={setCryptoAddress}
                                    />
                                )}
                                {cryptoSendMode === 'withdraw' && (
                                    <div className="space-y-4">
                                        <PhoneInput
                                            required
                                            label={t('send.form.withdrawPhone')}
                                            placeholder={t('send.form.withdrawPhonePlaceholder')}
                                            value={cryptoAddress}
                                            onChange={setCryptoAddress}
                                        />
                                        <Select
                                            label={t('send.form.operator')}
                                            options={operatorOptionsCrypto}
                                            value={operator}
                                            onChange={(val) => {
                                                if (val === 'DigitalCap') {
                                                    setCryptoSendMode('phone');
                                                } else {
                                                    setCryptoSendMode('withdraw');
                                                    setOperator(val);
                                                }
                                            }}
                                            searchable={false}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    /* Fiat Recipient Form */
                    <div className="space-y-4">
                        <div className="flex space-x-3 mb-2">
                            <label className="flex items-center space-x-2 text-xs font-bold text-slate-300 select-none cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isInternal}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setIsInternal(checked);
                                        if (checked) {
                                            setOperator('DigitalCap');
                                        } else {
                                            setOperator('Orange');
                                        }
                                    }}
                                    className="rounded border-white/10 bg-black/40 text-primary-500 focus:ring-0"
                                />
                                <span>{t('send.form.internalTransfer')}</span>
                            </label>
                        </div>

                        <div className="flex bg-black/30 border border-white/5 p-1 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setRecipientType('new')}
                                className={cn(
                                    "flex-1 py-2 text-[11px] font-bold rounded-lg transition duration-200 cursor-pointer select-none",
                                    recipientType === 'new'
                                        ? "bg-primary-500 text-white shadow-md"
                                        : "text-slate-400 hover:text-white"
                                )}
                            >
                                {t('send.form.newBeneficiary')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setRecipientType('saved')}
                                className={cn(
                                    "flex-1 py-2 text-[11px] font-bold rounded-lg transition duration-200 cursor-pointer select-none",
                                    recipientType === 'saved'
                                        ? "bg-primary-500 text-white shadow-md"
                                        : "text-slate-400 hover:text-white"
                                )}
                            >
                                {t('send.form.saved')}
                            </button>
                        </div>

                        {recipientType === 'new' ? (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                {isMobileMoney ? (
                                    <PhoneInput
                                        required
                                        label={t('send.form.momoPhone')}
                                        placeholder={t('send.form.withdrawPhonePlaceholder')}
                                        value={accountNumber}
                                        onChange={setAccountNumber}
                                    />
                                ) : (
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">{t('send.form.bankAccount')}</span>
                                        <input
                                            type="text"
                                            required
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value)}
                                            placeholder={t('send.form.bankAccountPlaceholder')}
                                            className="bg-black/30 border border-white/10 rounded-xl px-4.5 py-3.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-primary-500/50 w-full font-mono"
                                        />
                                    </div>
                                )}
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">{t('send.form.recipientFullName')}</span>
                                    <input
                                        type="text"
                                        required
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        placeholder={t('send.form.recipientNamePlaceholder')}
                                        className="bg-black/30 border border-white/10 rounded-xl px-4.5 py-3.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-primary-500/50 w-full font-sans"
                                    />
                                </div>

                                {isMobileMoney ? (
                                    /* Mobile Money Network Selector */
                                    <Select
                                        label={t('send.form.momoOperator')}
                                        options={operatorOptionsFiat}
                                        value={operator}
                                        onChange={(val) => {
                                            setOperator(val);
                                            if (val === 'DigitalCap') {
                                                setIsInternal(true);
                                            } else {
                                                setIsInternal(false);
                                            }
                                        }}
                                        searchable={false}
                                    />
                                ) : !isInternal && (
                                    /* Standard bank wire inputs */
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">{t('send.form.bankName')}</span>
                                            <input
                                                type="text"
                                                value={bankName}
                                                onChange={(e) => setBankName(e.target.value)}
                                                placeholder="Wells Fargo"
                                                className="bg-black/30 border border-white/10 rounded-xl px-4.5 py-3.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-primary-500/50 w-full"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">{t('send.form.country')}</span>
                                            <input
                                                type="text"
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                placeholder="Senegal"
                                                className="bg-black/30 border border-white/10 rounded-xl px-4.5 py-3.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-primary-500/50 w-full"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Interactive Beneficiaries tiles list */
                            <div className="space-y-2.5 animate-in fade-in duration-200">
                                <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">{t('send.form.selectBeneficiary')}</span>
                                {beneficiariesList.length === 0 ? (
                                    <div className="p-6 text-center border border-dashed border-white/10 rounded-2xl text-xs text-slate-500 select-none">
                                        {t('send.form.noBeneficiaries')}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-2.5 max-h-[220px] overflow-y-auto scrollbar-none pr-1">
                                        {beneficiariesList.map((b) => (
                                            <div
                                                key={b.id}
                                                onClick={() => setSelectedBeneficiaryId(b.id)}
                                                className={cn(
                                                    "border p-3.5 rounded-2xl cursor-pointer flex items-center justify-between transition hover:bg-white/[0.02]",
                                                    selectedBeneficiaryId === b.id
                                                        ? "border-primary-500/40 bg-primary-500/[0.02]"
                                                        : "border-white/5 bg-[#0C1224]"
                                                )}
                                            >
                                                <div className="flex items-center space-x-3.5 text-left">
                                                    <div className="w-8 h-8 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center font-bold text-primary-400 text-xs">
                                                        {b.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-xs leading-none">{b.name}</h4>
                                                        <span className="text-[10px] text-slate-500 font-bold block mt-1 font-mono">{b.accountNumber} • {b.bankName}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2.5">
                                                    {selectedBeneficiaryId === b.id && (
                                                        <div className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center">
                                                            <Check className="h-2.5 w-2.5 text-white" />
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteBeneficiary(b.id);
                                                        }}
                                                        className="text-slate-600 hover:text-rose-500 p-1.5 rounded-lg transition"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="pt-4 mt-auto">
                <Button
                    type="submit"
                    disabled={!isFormValid}
                    className="w-full rounded-2xl h-[52px] font-bold text-sm shadow-xl"
                >
                    {t('send.form.btn.continue')}
                </Button>
            </div>
        </form>
    );
};
