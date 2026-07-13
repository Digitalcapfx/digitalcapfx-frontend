'use client'

import React, { useState } from 'react'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'

const RECENT_RECIPIENTS = [
    { name: 'Aminata', initial: 'A', bg: 'bg-blue-600', number: '+2348123456789' },
    { name: 'Kwame', initial: 'K', bg: 'bg-emerald-600', number: '+233201234567' },
    { name: 'Fatou', initial: 'F', bg: 'bg-orange-600', number: '+221771234567' },
];

interface PhoneSendProps {
    isSheet?: boolean;
    onClose?: () => void;
}

const PhoneSend: React.FC<PhoneSendProps> = ({ isSheet = false, onClose }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');

    const cryptoQuery = useQuery({
        queryKey: ['cryptoBalances'],
        queryFn: () => accountService.getCryptoBalances(),
    });

    const balanceUsdc = cryptoQuery.data?.success && cryptoQuery.data.data
        ? parseFloat(cryptoQuery.data.data.balanceUsdc || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : '0.00';

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!phoneNumber) {
            setError('Please enter a phone number');
            return;
        }
        setError('');
        // Mock success action
        alert(`Sending to ${phoneNumber}...`);
        if (onClose) onClose();
    };

    const innerContent = (
        <>
            {!isSheet && (
                /* Header banner (only shown for inline widget) */
                <div className="flex justify-between items-center select-none pb-4 border-b border-white/5">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-primary-400">
                            <Phone className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-satoshi font-bold text-base text-white">Phone Send</h3>
                            <span className="text-[10px] font-semibold text-slate-500">Instant • Stablecoin-powered</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Balance</span>
                        <span className="text-sm font-extrabold text-white font-mono mt-0.5 block">${balanceUsdc} <span className="text-[10px] text-slate-400">USDC</span></span>
                    </div>
                </div>
            )}

            {/* Number input form */}
            <form onSubmit={handleSend} className="space-y-4">
                {isSheet && (
                    <div className="flex justify-between items-center select-none pb-2 mb-2 border-b border-white/5">
                        <span className="text-xs font-bold text-slate-400">Stablecoin Balance</span>
                        <span className="text-sm font-extrabold text-white font-mono">${balanceUsdc} <span className="text-[10px] text-slate-400">USDC</span></span>
                    </div>
                )}

                <PhoneInput
                    label="Who are you sending to?"
                    value={phoneNumber}
                    onChange={(val) => {
                        setPhoneNumber(val);
                        if (error) setError('');
                    }}
                    placeholder="Enter phone number"
                    error={error}
                />

                {/* Recents avatars row */}
                <div className="space-y-2 select-none">
                    <span className="text-[9px] font-bold text-slate-550 uppercase tracking-widest block">Recent</span>
                    <div className="flex items-center space-x-3">
                        {RECENT_RECIPIENTS.map((rec) => (
                            <button
                                key={rec.name}
                                type="button"
                                onClick={() => {
                                    setPhoneNumber(rec.number);
                                    if (error) setError('');
                                }}
                                className="flex items-center space-x-2 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 px-3 py-1.5 rounded-full transition text-xs font-semibold text-slate-355 cursor-pointer"
                            >
                                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white", rec.bg)}>
                                    {rec.initial}
                                </div>
                                <span>{rec.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full rounded-xl h-[48px] font-semibold text-sm"
                    >
                        Continue
                    </Button>
                </div>
            </form>

            {/* Phone send footnotes info */}
            <div className="text-center select-none pt-2 text-[10px] text-slate-550 font-semibold font-sans">
                Send to any DigitalFx customer — just a phone number, no bank details needed.
            </div>
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
