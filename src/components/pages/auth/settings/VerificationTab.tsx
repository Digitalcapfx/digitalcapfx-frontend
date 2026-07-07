'use client'

import React from 'react'
import { Check, Clock, Upload, RefreshCw } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'
import { cn } from '@/lib/utils'

export const VerificationTab: React.FC = () => {
    const { addressVerificationStatus, uploadAddressDoc } = useSettingsStore();

    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 md:p-8 shadow-xl text-left">
            <h3 className="font-satoshi font-black text-sm text-white border-b border-white/[0.03] pb-3 select-none">
                Verification Timeline
            </h3>
            <span className="text-[9px] font-bold text-slate-555 tracking-[0.15em] uppercase block mt-3 mb-6 select-none font-mono">
                Complete any pending process by clicking.
            </span>

            {/* Stepper Timeline list */}
            <div className="relative border-l border-white/10 pl-6.5 space-y-6.5 ml-2">
                
                {/* Step 1: Email */}
                <div className="relative">
                    <div className="absolute top-0.5 left-[-35.5px] w-6.5 h-6.5 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                    </div>
                    <div className="bg-black/10 border border-emerald-500/10 rounded-2xl p-4 flex justify-between items-center shadow-sm select-none">
                        <div className="text-left space-y-0.5">
                            <span className="font-bold text-white text-xs block">Email Address</span>
                            <span className="text-[10px] text-slate-500 font-semibold block">Primary contact point verified</span>
                        </div>
                        <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
                            Complete
                        </span>
                    </div>
                </div>

                {/* Step 2: Phone */}
                <div className="relative">
                    <div className="absolute top-0.5 left-[-35.5px] w-6.5 h-6.5 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                    </div>
                    <div className="bg-black/10 border border-emerald-500/10 rounded-2xl p-4 flex justify-between items-center shadow-sm select-none">
                        <div className="text-left space-y-0.5">
                            <span className="font-bold text-white text-xs block">Phone Number</span>
                            <span className="text-[10px] text-slate-500 font-semibold block">Two-factor mobile access active</span>
                        </div>
                        <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
                            Complete
                        </span>
                    </div>
                </div>

                {/* Step 3: Proof of Address (Interactive Pending) */}
                <div className="relative">
                    <div className={cn(
                        "absolute top-0.5 left-[-35.5px] w-6.5 h-6.5 rounded-full flex items-center justify-center transition duration-300",
                        addressVerificationStatus === 'complete'
                            ? "bg-emerald-500/10 border border-emerald-500/35 text-emerald-400"
                            : addressVerificationStatus === 'uploading'
                            ? "bg-primary-500/10 border border-primary-500/35 text-primary-400"
                            : "bg-orange-500/10 border border-orange-500/35 text-orange-400"
                    )}>
                        {addressVerificationStatus === 'complete' ? (
                            <Check className="h-3.5 w-3.5" />
                        ) : addressVerificationStatus === 'uploading' ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                            <Clock className="h-3.5 w-3.5" />
                        )}
                    </div>
                    <div className={cn(
                        "rounded-2xl p-4 flex justify-between items-center shadow-md transition duration-300 border",
                        addressVerificationStatus === 'complete'
                            ? "bg-black/10 border-emerald-500/10"
                            : addressVerificationStatus === 'uploading'
                            ? "bg-primary-500/5 border-primary-500/20"
                            : "bg-orange-500/5 border-orange-500/25"
                    )}>
                        <div className="text-left space-y-0.5">
                            <span className="font-bold text-white text-xs block">Proof of Address</span>
                            <span className="text-[10px] text-slate-500 font-semibold block">
                                Utility bill or bank statement required
                            </span>
                            {addressVerificationStatus === 'pending' && (
                                <button
                                    onClick={uploadAddressDoc}
                                    type="button"
                                    className="text-[10px] font-bold text-orange-400 hover:text-orange-350 flex items-center space-x-1 mt-2 cursor-pointer transition active:scale-[0.98] w-fit bg-transparent border-none"
                                >
                                    <Upload className="h-3.5 w-3.5 shrink-0" />
                                    <span className="underline">Upload document</span>
                                </button>
                            )}
                            {addressVerificationStatus === 'uploading' && (
                                <span className="text-[9.5px] font-bold text-primary-450 block mt-2 animate-pulse select-none">
                                    Processing document upload...
                                </span>
                            )}
                        </div>
                        <span className={cn(
                            "text-[8px] font-extrabold uppercase px-2 py-0.5 rounded select-none border",
                            addressVerificationStatus === 'complete'
                                ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400"
                                : addressVerificationStatus === 'uploading'
                                ? "bg-primary-500/15 border-primary-500/20 text-primary-400"
                                : "bg-orange-500/15 border-orange-500/20 text-orange-400"
                        )}>
                            {addressVerificationStatus}
                        </span>
                    </div>
                </div>

                {/* Step 4: Job details */}
                <div className="relative">
                    <div className="absolute top-0.5 left-[-35.5px] w-6.5 h-6.5 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                    </div>
                    <div className="bg-black/10 border border-emerald-500/10 rounded-2xl p-4 flex justify-between items-center shadow-sm select-none">
                        <div className="text-left space-y-0.5">
                            <span className="font-bold text-white text-xs block">Job Details</span>
                            <span className="text-[10px] text-slate-500 font-semibold block">Employment profile details verified</span>
                        </div>
                        <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
                            Complete
                        </span>
                    </div>
                </div>

                {/* Step 5: Identity check */}
                <div className="relative">
                    <div className="absolute top-0.5 left-[-35.5px] w-6.5 h-6.5 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                    </div>
                    <div className="bg-black/10 border border-emerald-500/10 rounded-2xl p-4 flex justify-between items-center shadow-sm select-none">
                        <div className="text-left space-y-0.5">
                            <span className="font-bold text-white text-xs block">Identity Verification</span>
                            <span className="text-[10px] text-slate-500 font-semibold block">KYC documents and passport validated</span>
                        </div>
                        <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
                            Complete
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VerificationTab;
