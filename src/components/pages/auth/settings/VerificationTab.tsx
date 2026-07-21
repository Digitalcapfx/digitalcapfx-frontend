'use client'

import React, { useState } from 'react'
import { Check, Clock, RefreshCw, AlertCircle, Shield, ArrowRight, ExternalLink, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { kycService } from '@/services/kyc.service'
import { uploadService } from '@/services/upload.service'
import { FileUpload } from '@/components/ui/FileUpload'
import { FilePreviewDialog } from '@/components/ui/FilePreviewDialog'
import { useLanguageStore } from '@/store/languageStore'
import { Select } from '@/components/ui/Select'

const loadSumsubScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') {
            resolve(false);
            return;
        }
        if ((window as any).snsWebSdk) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://static.sumsub.com/websdk-v2/iframe.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const VerificationTab: React.FC = () => {
    const { t } = useLanguageStore();
    const queryClient = useQueryClient();
    const [verificationLaunched, setVerificationLaunched] = useState(false);
    const [manualDocType, setManualDocType] = useState<'national_id' | 'passport' | 'selfie' | 'proof_of_address'>('national_id');
    const [docUrl, setDocUrl] = useState('');
    const [manualUploading, setManualUploading] = useState(false);
    const [historyPreviewUrl, setHistoryPreviewUrl] = useState('');
    const [historyPreviewOpen, setHistoryPreviewOpen] = useState(false);
    const [historyPreviewName, setHistoryPreviewName] = useState('');

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
    const kycStatus = kycData?.kycStatus || kycData?.status || 'idle'; // 'idle' | 'pending' | 'approved' | 'rejected'
    const rejectionReason = kycData?.rejectionReason || kycData?.rejection_reason || '';

    const launchSumsub = async (accessToken: string) => {
        const loaded = await loadSumsubScript();
        if (!loaded) {
            toast.error(t('settings.verification.toast.sdkLoadFailed'));
            return;
        }
        const snsWebSdk = (window as any).snsWebSdk;
        if (!snsWebSdk) {
            toast.error(t('settings.verification.toast.sdkInitFailed'));
            return;
        }

        try {
            const snsWebSdkInstance = snsWebSdk.init(
                accessToken,
                () => kycService.initKyc().then(res => res.data.identityAccess)
            )
            .withConf({
                lang: 'en',
            })
            .withOptions({
                addViewportTag: false,
                adaptIframeHeight: true
            })
            .on('onStepCompleted', (payload: any) => {
                console.log('Sumsub step completed:', payload);
            })
            .on('onError', (error: any) => {
                console.error('Sumsub SDK error:', error);
            })
            .onMessage((type: any, payload: any) => {
                console.log('Sumsub message:', type, payload);
            })
            .build();

            snsWebSdkInstance.launch('#sumsub-container');
        } catch (e) {
            console.error('Error launching Sumsub:', e);
            toast.error(t('settings.verification.toast.widgetError'));
        }
    };

    // Sumsub KYC Initialization Mutation
    const initKycMutation = useMutation({
        mutationFn: () => kycService.initKyc(),
        onSuccess: (res) => {
            if (res?.success && res?.data) {
                const { identityAccess } = res.data;
                setVerificationLaunched(true);
                toast.success(t('settings.verification.toast.flowInitiated'));
                setTimeout(() => {
                    launchSumsub(identityAccess);
                }, 100);
            } else {
                toast.error(t('settings.verification.toast.tokenError'));
            }
        },
        onError: (err: any) => {
            console.error('Sumsub initialization error:', err);
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object'
                ? (rawError.message || JSON.stringify(rawError))
                : (rawError || t('settings.verification.toast.startError'));
            toast.error(msg);
        }
    });

    const handleRefreshStatus = async () => {
        const refetchPromise = kycStatusQuery.refetch();
        toast.promise(refetchPromise, {
            loading: t('settings.verification.toast.checkingDatabase'),
            success: () => {
                queryClient.invalidateQueries({ queryKey: ['profile'] });
                return t('settings.verification.toast.statusUpdated');
            },
            error: t('settings.verification.toast.updateStatusError')
        });
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!docUrl) {
            toast.error(t('settings.verification.toast.uploadFirst'));
            return;
        }

        setManualUploading(true);
        try {
            const submitRes = await kycService.submitDocument({
                doc_type: manualDocType,
                doc_url: docUrl
            });

            toast.success(t('settings.verification.toast.submitSuccess'));
            setDocUrl('');
            
            // Invalidate/refetch to display in document logs history
            queryClient.invalidateQueries({ queryKey: ['kycDocuments'] });
            queryClient.invalidateQueries({ queryKey: ['kycStatus'] });
        } catch (err: any) {
            console.error('Manual submission error:', err);
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object' ? rawError.message : (rawError || err.message || t('settings.verification.toast.submitFailed'));
            toast.error(msg);
        } finally {
            setManualUploading(false);
        }
    };

    return (
        <div className="space-y-6 text-left">
            <div>
                <h3 className="font-satoshi font-black text-sm text-white border-b border-white/[0.03] pb-3 select-none">
                    {t('settings.verification.title')}
                </h3>
                <p className="text-[11px] font-semibold text-slate-500 mt-2 block leading-relaxed select-none">
                    {t('settings.verification.desc')}
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
                                {t('settings.verification.status.verified')}
                            </span>
                            <h4 className="font-satoshi font-black text-base text-white">
                                {t('settings.verification.status.complete')}
                            </h4>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                {t('settings.verification.status.approvedDesc')}
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
                                    {t('settings.verification.status.underReview')}
                                </span>
                                <button
                                    onClick={handleRefreshStatus}
                                    disabled={kycStatusQuery.isFetching}
                                    className="text-[10px] font-bold text-primary-400 hover:underline flex items-center space-x-1"
                                >
                                    <RefreshCw className={cn("h-3 w-3", kycStatusQuery.isFetching && "animate-spin")} />
                                    <span>{t('settings.verification.refreshStatus')}</span>
                                </button>
                            </div>
                            <h4 className="font-satoshi font-black text-base text-white">
                                {t('settings.verification.status.inProgress')}
                            </h4>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                {t('settings.verification.status.pendingDesc')}
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
                                <h5 className="text-xs font-bold text-white">{t('settings.verification.status.rejected')}</h5>
                                <p className="text-[11px] text-slate-400 leading-normal">
                                    {rejectionReason || t('settings.verification.status.rejectedDesc')}
                                </p>
                            </div>
                        </div>
                    )}

                    {verificationLaunched ? (
                        <div className="space-y-4">
                            <div id="sumsub-container" className="w-full min-h-[550px] bg-black/40 border border-white/10 rounded-2xl p-4 animate-in fade-in duration-300"></div>
                            <Button
                                onClick={handleRefreshStatus}
                                variant="secondary"
                                className="w-full rounded-xl h-11 text-xs font-bold"
                                leftIcon={<RefreshCw className={cn("h-3.5 w-3.5", kycStatusQuery.isFetching && "animate-spin")} />}
                            >
                                {t('settings.verification.syncStatus')}
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-[#0C1224]/30 border border-[#131B30] rounded-2xl p-6 space-y-6">
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-white">
                                    {t('settings.verification.sumsubTitle')}
                                </h4>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    {t('settings.verification.sumsubDesc')}
                                </p>
                            </div>

                            {/* Feature Badges list */}
                            <div className="space-y-3 pt-1 border-t border-white/[0.03]">
                                <div className="flex items-center space-x-2.5 text-xs text-slate-350">
                                    <div className="w-5 h-5 rounded-full bg-[#131B30] flex items-center justify-center text-slate-400">
                                        <Check className="h-3 w-3" />
                                    </div>
                                    <span>{t('settings.verification.sumsubPoint1')}</span>
                                </div>
                                <div className="flex items-center space-x-2.5 text-xs text-slate-350">
                                    <div className="w-5 h-5 rounded-full bg-[#131B30] flex items-center justify-center text-slate-400">
                                        <Check className="h-3 w-3" />
                                    </div>
                                    <span>{t('settings.verification.sumsubPoint2')}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-3">
                                <Button
                                    onClick={() => initKycMutation.mutate()}
                                    disabled={initKycMutation.isPending}
                                    className="w-full rounded-xl h-[52px] font-bold text-sm"
                                    rightIcon={initKycMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                                >
                                    {initKycMutation.isPending ? t('settings.verification.initializingSumsub') : t('settings.verification.startSumsub')}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Manual File Upload Card Alternative */}
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-2xl p-6 space-y-6 text-left">
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-white">
                                {t('settings.verification.manualTitle')}
                            </h4>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                {t('settings.verification.manualDesc')}
                            </p>
                        </div>

                        <form onSubmit={handleManualSubmit} className="space-y-4 pt-1">
                            {/* Document Type Dropdown */}
                            <Select
                                label={t('settings.verification.docType')}
                                options={[
                                    { value: 'national_id', label: t('settings.verification.docs.nationalId') },
                                    { value: 'passport', label: t('settings.verification.docs.passport') },
                                    { value: 'selfie', label: t('settings.verification.docs.selfie') },
                                    { value: 'proof_of_address', label: t('settings.verification.docs.address') }
                                ]}
                                value={manualDocType}
                                onChange={(val) => setManualDocType(val as any)}
                                searchable={false}
                            />

                            {/* Reusable File Upload Input */}
                            <FileUpload
                                required
                                label={t('settings.verification.selectFile')}
                                purpose="kyc"
                                value={docUrl}
                                onUploadComplete={(readUrl) => setDocUrl(readUrl)}
                            />

                            {/* Submit Action */}
                            <Button
                                type="submit"
                                isLoading={manualUploading}
                                disabled={!docUrl}
                                className="w-full rounded-xl h-[46px] text-xs font-bold"
                            >
                                {t('settings.verification.submitDoc')}
                            </Button>
                        </form>
                    </div>

                </div>
            )}

            {/* 4. Submitted KYC Documents history */}
            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 shadow-xl space-y-4 max-w-lg">
                <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block font-mono border-b border-white/[0.03] pb-2">{t('settings.verification.historyTitle')}</span>
                
                {kycDocsQuery.isLoading ? (
                    <div className="py-6 flex items-center justify-center space-x-2 text-xs text-slate-500">
                        <RefreshCw className="h-4 w-4 animate-spin text-primary-400" />
                        <span>{t('settings.verification.loadingRecords')}</span>
                    </div>
                ) : docList.length === 0 ? (
                    <p className="text-xs text-slate-600 py-1">{t('settings.verification.noRecords')}</p>
                ) : (
                    <div className="space-y-3">
                        {docList.map((doc: any) => {
                            const dateStr = doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A';
                            const labelMap: Record<string, string> = {
                                national_id: t('settings.verification.docs.nationalId'),
                                passport: t('settings.verification.docs.passport'),
                                selfie: t('settings.verification.docs.selfie'),
                                proof_of_address: t('settings.verification.docs.address')
                            };
                            const typeLabel = labelMap[doc.docType] || doc.docType || 'Compliance Record';

                            return (
                                <div key={doc.id} className="flex justify-between items-center py-2 border-b border-white/[0.02] last:border-b-0 pb-3 last:pb-0">
                                    <div className="text-left space-y-0.5">
                                        <span className="font-bold text-white text-xs block">{typeLabel}</span>
                                        <span className="text-[9px] text-slate-500 block font-mono">{t('settings.verification.submittedAt', { date: dateStr })}</span>
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
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    setHistoryPreviewUrl(doc.docUrl);
                                                    setHistoryPreviewName(typeLabel);
                                                    setHistoryPreviewOpen(true);
                                                }}
                                                className="text-[10px] font-bold text-primary-400 hover:underline flex items-center space-x-1 bg-transparent border-0 cursor-pointer focus:outline-none"
                                            >
                                                <span>{t('settings.verification.view')}</span>
                                                <ExternalLink className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Reusable History Document Preview Modal */}
            <FilePreviewDialog
                isOpen={historyPreviewOpen}
                onClose={() => setHistoryPreviewOpen(false)}
                url={historyPreviewUrl}
                fileName={historyPreviewName}
            />
        </div>
    );
};

export default VerificationTab;
