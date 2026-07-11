'use client'

import React, { useState } from 'react'
import { Check, Clock, RefreshCw, AlertCircle, Shield, ArrowRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { kycService } from '@/services/kyc.service'

export const VerificationTab: React.FC = () => {
    const queryClient = useQueryClient();
    const [verificationLaunched, setVerificationLaunched] = useState(false);

    // Fetch live KYC status
    const kycStatusQuery = useQuery({
        queryKey: ['kycStatus'],
        queryFn: () => kycService.getKycStatus(),
    });

    const kycDocsQuery = useQuery({
        queryKey: ['kycDocuments'],
        queryFn: () => kycService.getKycDocuments(),
    });

    const docList = kycDocsQuery.data?.success && Array.isArray(kycDocsQuery.data.data) 
        ? kycDocsQuery.data.data 
        : [];

    const kycData = kycStatusQuery.data?.success ? kycStatusQuery.data.data : null;
    const kycStatus = kycData?.status || 'idle'; // 'idle' | 'pending' | 'approved' | 'rejected'
    const rejectionReason = kycData?.rejectionReason || '';

    // Metamap Initialization Mutation
    const initMetaMapMutation = useMutation({
        mutationFn: () => kycService.initMetaMap(),
        onSuccess: (res) => {
            if (res?.success && res?.data) {
                const { flowId, identityAccess } = res.data;
                
                // MetaMap standard client/merchant token placeholder
                const merchantToken = '60f1a2b3c4d5e6f7a8b9c0d1';
                
                // Build MetaMap signup URL
                const url = `https://signup.getmati.com/?merchantToken=${merchantToken}&flowId=${flowId}&identityAccess=${identityAccess}`;
                
                // Open MetaMap verification tab
                window.open(url, '_blank');
                setVerificationLaunched(true);
                toast.success('MetaMap identity verification flow initiated!');
            } else {
                toast.error('Failed to retrieve MetaMap verification tokens.');
            }
        },
        onError: (err: any) => {
            console.error('MetaMap initialization error:', err);
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object'
                ? (rawError.message || JSON.stringify(rawError))
                : (rawError || 'Failed to start MetaMap verification.');
            toast.error(msg);
        }
    });

    const handleRefreshStatus = async () => {
        const refetchPromise = kycStatusQuery.refetch();
        toast.promise(refetchPromise, {
            loading: 'Checking compliance database...',
            success: () => {
                queryClient.invalidateQueries({ queryKey: ['profile'] });
                return 'Verification status updated!';
            },
            error: 'Failed to update status. Please try again.'
        });
    };

    return (
        <div className="space-y-6 text-left">
            <div>
                <h3 className="font-satoshi font-black text-sm text-white border-b border-white/[0.03] pb-3 select-none">
                    Compliance & Identity Verification
                </h3>
                <p className="text-[11px] font-semibold text-slate-500 mt-2 block leading-relaxed select-none">
                    Verify your identity to unlock all premium fiat and stablecoin treasury capabilities on DigitalCap.
                </p>
            </div>

            {/* Verification Status Cards */}

            {/* 1. Approved State */}
            {kycStatus === 'approved' && (
                <div className="bg-[#0C1224]/50 border border-emerald-500/10 rounded-2xl p-6 space-y-6 max-w-lg">
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <Shield className="h-6 w-6 stroke-[2.5]" />
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border bg-emerald-500/15 border-emerald-500/20 text-emerald-400 tracking-wider">
                                Live & Verified
                            </span>
                            <h4 className="font-satoshi font-black text-base text-white">
                                Verification Complete
                            </h4>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Your account identity check has been approved. You have full access to wallets creation, fiat swaps, and virtual card generation.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Pending State */}
            {kycStatus === 'pending' && (
                <div className="bg-[#0C1224]/50 border border-orange-500/10 rounded-2xl p-6 space-y-6 max-w-lg">
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                            <Clock className="h-6 w-6 stroke-[2.5]" />
                        </div>
                        <div className="space-y-1.5 w-full">
                            <div className="flex justify-between items-start">
                                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border bg-orange-500/15 border-orange-500/20 text-orange-400 tracking-wider">
                                    Under Review
                                </span>
                                <button
                                    onClick={handleRefreshStatus}
                                    disabled={kycStatusQuery.isFetching}
                                    className="text-[10px] font-bold text-primary-400 hover:underline flex items-center space-x-1"
                                >
                                    <RefreshCw className={cn("h-3 w-3", kycStatusQuery.isFetching && "animate-spin")} />
                                    <span>Refresh Status</span>
                                </button>
                            </div>
                            <h4 className="font-satoshi font-black text-base text-white">
                                KYC Review in Progress
                            </h4>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Your MetaMap identity details have been received and are currently under review. This usually takes from a few minutes up to 24 hours.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Idle / Rejected State */}
            {(kycStatus === 'idle' || kycStatus === 'rejected') && (
                <div className="space-y-6 max-w-lg">
                    {kycStatus === 'rejected' && (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start space-x-3 text-left">
                            <AlertCircle className="h-5 w-5 text-rose-455 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h5 className="text-xs font-bold text-white">Verification Rejected</h5>
                                <p className="text-[11px] text-slate-400 leading-normal">
                                    {rejectionReason || 'Your previous identity documents could not be verified. Please retry with a valid government document.'}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="bg-[#0C1224]/30 border border-[#131B30] rounded-2xl p-6 space-y-6">
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-white">
                                Verify with MetaMap
                            </h4>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                We utilize MetaMap's secure compliance platform to verify your identity. You will be prompted to present your government-issued document and capture a biometric face match.
                            </p>
                        </div>

                        {/* Feature Badges list */}
                        <div className="space-y-3 pt-1 border-t border-white/[0.03]">
                            <div className="flex items-center space-x-2.5 text-xs text-slate-350">
                                <div className="w-5 h-5 rounded-full bg-[#131B30] flex items-center justify-center text-slate-400">
                                    <Check className="h-3 w-3" />
                                </div>
                                <span>No-Nigeria isolation protocol (WAEMU / CEMAC document options)</span>
                            </div>
                            <div className="flex items-center space-x-2.5 text-xs text-slate-350">
                                <div className="w-5 h-5 rounded-full bg-[#131B30] flex items-center justify-center text-slate-400">
                                    <Check className="h-3 w-3" />
                                </div>
                                <span>Real-time biometric and document authenticity checks</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 pt-3">
                            <Button
                                onClick={() => initMetaMapMutation.mutate()}
                                disabled={initMetaMapMutation.isPending}
                                className="w-full rounded-xl h-[52px] font-bold text-sm"
                                rightIcon={initMetaMapMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                            >
                                {initMetaMapMutation.isPending ? 'Initializing MetaMap flow...' : 'Start MetaMap Verification'}
                            </Button>

                            {verificationLaunched && (
                                <div className="p-4 rounded-xl bg-primary-500/5 border border-primary-500/15 space-y-3">
                                    <p className="text-[11px] text-slate-400 leading-normal">
                                        MetaMap verification window opened. Complete the verification flow there, then return here to sync your status.
                                    </p>
                                    <Button
                                        onClick={handleRefreshStatus}
                                        variant="secondary"
                                        className="w-full rounded-lg h-9 text-xs font-bold"
                                        leftIcon={<RefreshCw className={cn("h-3.5 w-3.5", kycStatusQuery.isFetching && "animate-spin")} />}
                                    >
                                        Refresh Verification Status
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Submitted KYC Documents history */}
            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 shadow-xl space-y-4 max-w-lg">
                <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block font-mono border-b border-white/[0.03] pb-2">Verification History</span>
                
                {kycDocsQuery.isLoading ? (
                    <div className="py-6 flex items-center justify-center space-x-2 text-xs text-slate-500">
                        <RefreshCw className="h-4 w-4 animate-spin text-primary-400" />
                        <span>Loading document records...</span>
                    </div>
                ) : docList.length === 0 ? (
                    <p className="text-xs text-slate-600 py-1">No identity verification logs found.</p>
                ) : (
                    <div className="space-y-3">
                        {docList.map((doc: any) => {
                            const dateStr = doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A';
                            const labelMap: Record<string, string> = {
                                national_id: 'National ID Card',
                                passport: 'International Passport',
                                selfie: 'Biometric Selfie',
                                proof_of_address: 'Proof of Address'
                            };
                            const typeLabel = labelMap[doc.docType] || doc.docType || 'Compliance Record';

                            return (
                                <div key={doc.id} className="flex justify-between items-center py-2 border-b border-white/[0.02] last:border-b-0 pb-3 last:pb-0">
                                    <div className="text-left space-y-0.5">
                                        <span className="font-bold text-white text-xs block">{typeLabel}</span>
                                        <span className="text-[9px] text-slate-500 block font-mono">Submitted: {dateStr}</span>
                                    </div>
                                    <div className="text-right flex items-center space-x-3.5">
                                        <span className={cn(
                                            "text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border",
                                            doc.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                            doc.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                            'bg-rose-500/10 border-rose-500/20 text-rose-455'
                                        )}>
                                            {doc.status || 'pending'}
                                        </span>
                                        {doc.docUrl && (
                                            <a 
                                                href={doc.docUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-[10px] font-bold text-primary-400 hover:underline flex items-center space-x-1"
                                            >
                                                <span>View</span>
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerificationTab;
