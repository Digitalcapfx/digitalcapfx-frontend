'use client'

import React, { useState, useEffect } from 'react'
import { Check, Clock, RefreshCw, AlertCircle, Shield, ArrowRight, ExternalLink, FileText, CheckCircle2, Lock, UserCheck, Save, Sparkles, Building2, Globe, Edit3, UploadCloud, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectOption } from '@/components/ui/Select'
import { DatePicker } from '@/components/ui/DatePicker'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { FileUpload } from '@/components/ui/FileUpload'
import { FilePreviewDialog } from '@/components/ui/FilePreviewDialog'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { kycService, KYCIntakePayload, IntakeFieldSpec, DocumentSpec } from '@/services/kyc.service'
import { profileService } from '@/services/profile.service'
import { useLanguageStore } from '@/store/languageStore'
import { getCountries } from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en.json'

const enLabels = en as Record<string, string>;

const COUNTRY_OPTIONS: SelectOption[] = getCountries()
  .map((countryCode) => ({
    value: countryCode,
    label: enLabels[countryCode] || countryCode,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const getCountryCodeByName = (name: string): string => {
  if (!name) return '';
  if (name.length === 2) return name.toUpperCase();
  const code = Object.keys(enLabels).find(key => enLabels[key].toLowerCase() === name.toLowerCase());
  return code || name;
};

const getCountryNameByCode = (code: string): string => {
  if (!code) return '';
  return enLabels[code] || code;
};

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
    const [historyPreviewUrl, setHistoryPreviewUrl] = useState('');
    const [historyPreviewOpen, setHistoryPreviewOpen] = useState(false);
    const [historyPreviewName, setHistoryPreviewName] = useState('');
    const [showIntakeOverride, setShowIntakeOverride] = useState(false);
    const [uploadedDocUrls, setUploadedDocUrls] = useState<Record<string, string>>({});
    const [docUploadingKey, setDocUploadingKey] = useState<string | null>(null);

    // Fetch user profile for default pre-fills
    const profileQuery = useQuery({
        queryKey: ['profile'],
        queryFn: () => profileService.getProfile(),
    });

    // Fetch live KYC status & requirements
    const kycStatusQuery = useQuery({
        queryKey: ['kycStatus'],
        queryFn: () => kycService.getKycStatus(),
    });

    const kycRequirementsQuery = useQuery({
        queryKey: ['kycRequirements'],
        queryFn: () => kycService.getKycRequirements(),
    });

    const kycDocsQuery = useQuery({
        queryKey: ['kycDocuments'],
        queryFn: () => kycService.getKycDocuments(),
    });

    const reqData = kycRequirementsQuery.data?.data || kycRequirementsQuery.data || {};
    const isIntakeCompleted = Boolean(reqData.completed);
    const fieldsList: IntakeFieldSpec[] = Array.isArray(reqData.fields) ? reqData.fields : [];
    const documentsList: DocumentSpec[] = Array.isArray(reqData.documents) ? reqData.documents : [];
    const notesList: string[] = Array.isArray(reqData.notes) ? reqData.notes : [];
    
    // Priority: requirement account_type > profile accountType > default 'business'
    const accountType = (reqData.account_type || profileQuery.data?.data?.accountType || 'business').toLowerCase();
    const isBusiness = accountType === 'business';

    const [activeStep, setActiveStep] = useState<number>(1);

    // Auto-advance step based on completion state
    useEffect(() => {
        if (isIntakeCompleted) {
            setActiveStep(isBusiness ? 2 : 2);
        } else {
            setActiveStep(1);
        }
    }, [isIntakeCompleted, isBusiness]);

    // Dynamic Intake Form State
    const [intakeForm, setIntakeForm] = useState<KYCIntakePayload>({
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        nationality: '',
        date_of_birth: '',
        occupation: '',
        source_of_funds: 'Salary',
        purpose_of_account: 'Personal Use',
        contact_email: '',
        contact_phone: '',
        is_importer: false,
        top_3_counterparties: [
            { country: '', purpose: '', relationship: '' },
            { country: '', purpose: '', relationship: '' },
            { country: '', purpose: '', relationship: '' }
        ]
    });

    // Initialize & pre-fill form fields from profile and requirements
    useEffect(() => {
        if (fieldsList.length > 0) {
            setIntakeForm(prev => {
                const updated = { ...prev };
                fieldsList.forEach(field => {
                    if (updated[field.key] === undefined) {
                        if (field.type === 'boolean') {
                            updated[field.key] = false;
                        } else if (field.type === 'counterparties') {
                            updated[field.key] = updated[field.key] || [
                                { country: '', purpose: '', relationship: '' },
                                { country: '', purpose: '', relationship: '' },
                                { country: '', purpose: '', relationship: '' }
                            ];
                        } else if (field.type === 'select' && field.options && field.options.length > 0) {
                            updated[field.key] = field.options[0];
                        } else {
                            updated[field.key] = '';
                        }
                    }
                });

                if (profileQuery.data?.success && profileQuery.data.data) {
                    const p = profileQuery.data.data;
                    if (!updated.contact_email && p.email) updated.contact_email = p.email;
                    if (!updated.contact_phone && p.phoneNumber) updated.contact_phone = p.phoneNumber;
                    if (!updated.nationality && p.nationality) updated.nationality = p.nationality;
                    if (!updated.date_of_birth && p.dateOfBirth) updated.date_of_birth = p.dateOfBirth;
                }

                return updated;
            });
        }
    }, [reqData, profileQuery.data]);

    // Calculate required field metrics
    const requiredFields = fieldsList.filter(f => f.required);
    const filledRequiredCount = requiredFields.filter(f => {
        const val = intakeForm[f.key];
        if (f.type === 'boolean') return val !== undefined && val !== null;
        if (f.type === 'counterparties') return Array.isArray(val) && val.some(c => c.country || c.purpose || c.relationship);
        return Boolean(val && String(val).trim() !== '');
    }).length;
    const totalRequiredCount = requiredFields.length > 0 ? requiredFields.length : 10;
    const completionPercentage = totalRequiredCount > 0 ? Math.min(100, Math.round((filledRequiredCount / totalRequiredCount) * 100)) : 0;

    const docList = kycDocsQuery.data?.success && Array.isArray(kycDocsQuery.data.data) 
        ? kycDocsQuery.data.data 
        : [];

    const kycData = kycStatusQuery.data?.success ? kycStatusQuery.data.data : null;
    const rawStatus = (kycData?.kyc_status || kycData?.kycStatus || kycData?.status || 'pending').toLowerCase();
    const rejectionReason = kycData?.rejectionReason || kycData?.rejection_reason || '';

    const isApproved = rawStatus === 'approved';
    
    // isInReview is ONLY true if intake is completed AND status is in-review AND user hasn't requested manual edit override
    const isInReview = isIntakeCompleted && ['submitted', 'under_review', 'processing'].includes(rawStatus) && !showIntakeOverride;
    const isRejected = rawStatus === 'rejected';

    // Mutation for Intake Submission (/kyc/intake)
    const submitIntakeMutation = useMutation({
        mutationFn: (payload: KYCIntakePayload) => kycService.submitIntake(payload),
        onSuccess: (res) => {
            toast.success(res?.message || 'Profile and account details saved successfully!');
            queryClient.invalidateQueries({ queryKey: ['kycRequirements'] });
            queryClient.invalidateQueries({ queryKey: ['kycStatus'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            
            if (isBusiness) {
                setActiveStep(2);
            } else {
                setActiveStep(2);
            }
        },
        onError: (err: any) => {
            console.error('Intake submission error:', err);
            const rawError = err.response?.data?.error;
            const msg = typeof rawError === 'object' ? rawError.message : (rawError || err.message || 'Failed to save intake fields.');
            toast.error(msg);
        }
    });

    const handleSaveIntake = (e: React.FormEvent) => {
        e.preventDefault();
        submitIntakeMutation.mutate(intakeForm);
    };

    const updateCounterparty = (index: number, key: 'country' | 'purpose' | 'relationship', value: string) => {
        setIntakeForm(prev => {
            const currentList = Array.isArray(prev.top_3_counterparties) ? [...prev.top_3_counterparties] : [];
            while (currentList.length <= index) {
                currentList.push({ country: '', purpose: '', relationship: '' });
            }
            currentList[index] = { ...currentList[index], [key]: value };
            return { ...prev, top_3_counterparties: currentList };
        });
    };

    // Handle document upload for business documents
    const handleDocumentUploadComplete = async (docKey: string, fileUrl: string) => {
        setDocUploadingKey(docKey);
        try {
            await kycService.submitDocument({
                doc_type: docKey as any,
                doc_url: fileUrl
            });
            setUploadedDocUrls(prev => ({ ...prev, [docKey]: fileUrl }));
            toast.success('Document uploaded and queued for verification!');
            queryClient.invalidateQueries({ queryKey: ['kycDocuments'] });
            queryClient.invalidateQueries({ queryKey: ['kycStatus'] });
        } catch (err: any) {
            console.error('Document submission error:', err);
            toast.error('Failed to submit document. Please try again.');
        } finally {
            setDocUploadingKey(null);
        }
    };

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
                () => kycService.initKyc().then(res => res.data?.identityAccess || res.data?.token || res?.token)
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
                queryClient.invalidateQueries({ queryKey: ['kycStatus'] });
                queryClient.invalidateQueries({ queryKey: ['profile'] });
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

    // Sumsub Identity & Liveness Check Mutation (/kyc/init)
    const initKycMutation = useMutation({
        mutationFn: () => kycService.initKyc(),
        onSuccess: (res) => {
            const accessToken = res?.data?.identityAccess || res?.data?.token || res?.identityAccess || res?.token;
            if (accessToken) {
                setVerificationLaunched(true);
                toast.success(t('settings.verification.toast.flowInitiated'));
                setTimeout(() => {
                    launchSumsub(accessToken);
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
                queryClient.invalidateQueries({ queryKey: ['kycRequirements'] });
                return t('settings.verification.toast.statusUpdated');
            },
            error: t('settings.verification.toast.updateStatusError')
        });
    };

    // Filter out idv_liveness from document upload list as liveness is done in the biometric step
    const uploadableDocuments = documentsList.filter(d => d.key !== 'idv_liveness');
    const totalSteps = isBusiness ? 3 : 2;
    const finalStepNumber = totalSteps;

    return (
        <div className="space-y-6 text-left w-full max-w-5xl">
            {/* Header Title */}
            <div>
                <h3 className="font-satoshi font-black text-lg text-white border-b border-white/[0.03] pb-3 select-none flex items-center justify-between">
                    <span>{t('settings.verification.title')}</span>
                    <span className={cn(
                        "text-xs font-extrabold uppercase px-3 py-1 rounded-full border font-mono tracking-wider",
                        isBusiness 
                            ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                            : "bg-primary-500/10 border-primary-500/20 text-primary-400"
                    )}>
                        {isBusiness ? 'BUSINESS KYB VERIFICATION' : 'INDIVIDUAL KYC VERIFICATION'}
                    </span>
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-2 block leading-relaxed select-none">
                    {t('settings.verification.desc')}
                </p>
            </div>

            {/* Verification Loading Skeleton */}
            {kycStatusQuery.isLoading || kycRequirementsQuery.isLoading ? (
                <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-12 w-full flex flex-col items-center justify-center space-y-3 text-center animate-pulse min-h-[220px]">
                    <RefreshCw className="h-8 w-8 text-primary-400 animate-spin" />
                    <span className="text-xs text-slate-400 font-semibold">{t('settings.verification.loadingRecords')}</span>
                </div>
            ) : (
                <>
                    {/* 1. Approved State */}
                    {isApproved && (
                        <div className="bg-[#0C1224] border border-emerald-500/20 rounded-3xl p-8 space-y-6 w-full shadow-2xl">
                            <div className="flex items-start space-x-5">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                    <Shield className="h-7 w-7 stroke-[2.5]" />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border bg-emerald-500/15 border-emerald-500/20 text-emerald-400 tracking-wider">
                                        {t('settings.verification.status.verified')}
                                    </span>
                                    <h4 className="font-satoshi font-black text-xl text-white">
                                        {t('settings.verification.status.complete')}
                                    </h4>
                                    <p className="text-slate-350 text-xs leading-relaxed max-w-2xl">
                                        {t('settings.verification.status.approvedDesc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. In Review State */}
                    {isInReview && (
                        <div className="bg-[#0C1224] border border-orange-500/20 rounded-3xl p-8 space-y-6 w-full shadow-2xl">
                            <div className="flex items-start space-x-5">
                                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                                    <Clock className="h-7 w-7 stroke-[2.5]" />
                                </div>
                                <div className="space-y-4 w-full">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border bg-orange-500/15 border-orange-500/20 text-orange-400 tracking-wider">
                                            {rawStatus.toUpperCase().replace('_', ' ')}
                                        </span>
                                        <button
                                            onClick={handleRefreshStatus}
                                            disabled={kycStatusQuery.isFetching}
                                            className="text-xs font-bold text-primary-400 hover:underline flex items-center space-x-1.5 cursor-pointer"
                                        >
                                            <RefreshCw className={cn("h-3.5 w-3.5", kycStatusQuery.isFetching && "animate-spin")} />
                                            <span>{t('settings.verification.refreshStatus')}</span>
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-satoshi font-black text-xl text-white">
                                            {t('settings.verification.status.inProgress')}
                                        </h4>
                                        <p className="text-slate-350 text-xs leading-relaxed max-w-2xl">
                                            {t('settings.verification.status.pendingDesc')}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-white/5">
                                        <button
                                            type="button"
                                            onClick={() => setShowIntakeOverride(true)}
                                            className="text-xs font-bold text-slate-400 hover:text-white hover:underline flex items-center space-x-2 cursor-pointer"
                                        >
                                            <Edit3 className="h-4 w-4 text-primary-400" />
                                            <span>View or Update Compliance Details</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. Active Multi-Step KYC Workflow */}
                    {(!isApproved && !isInReview) && (
                        <div className="space-y-6 w-full">
                            {isRejected && (
                                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 flex items-start space-x-3.5 text-left">
                                    <AlertCircle className="h-5 w-5 text-rose-455 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <h5 className="text-xs font-bold text-white">{t('settings.verification.status.rejected')}</h5>
                                        <p className="text-xs text-slate-350 leading-normal">
                                            {rejectionReason || t('settings.verification.status.rejectedDesc')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* User-Friendly Multi-Step Progress Stepper */}
                            <div className="bg-[#0C1224] border border-[#131B30] p-4 rounded-3xl space-y-4 shadow-xl">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-400">
                                        Verification Progress
                                    </span>
                                    <span className="text-xs font-mono font-bold text-primary-400">
                                        {isIntakeCompleted ? 'Step 1 Complete ✓' : `${completionPercentage}% Form Filled (${filledRequiredCount}/${totalRequiredCount})`}
                                    </span>
                                </div>

                                <div className={cn("grid gap-3", isBusiness ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2")}>
                                    {/* STEP 1: Details */}
                                    <button
                                        type="button"
                                        onClick={() => setActiveStep(1)}
                                        className={cn(
                                            "flex items-center space-x-3 p-3.5 rounded-2xl transition-all text-left cursor-pointer border",
                                            activeStep === 1
                                                ? "bg-primary-500/10 border-primary-500/40 text-white"
                                                : "hover:bg-white/5 border-white/5 text-slate-400"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0",
                                            isIntakeCompleted
                                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                : activeStep === 1
                                                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                                                : "bg-white/5 text-slate-500 border border-white/5"
                                        )}>
                                            {isIntakeCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : "1"}
                                        </div>
                                        <div className="space-y-0.5 overflow-hidden">
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider block text-slate-500">Step 1</span>
                                            <span className="text-xs font-bold block truncate">
                                                {isBusiness ? 'Business & Profile Details' : 'Personal & Address Details'}
                                            </span>
                                        </div>
                                    </button>

                                    {/* STEP 2 (Business): Corporate Documents */}
                                    {isBusiness && (
                                        <button
                                            type="button"
                                            onClick={() => isIntakeCompleted && setActiveStep(2)}
                                            disabled={!isIntakeCompleted}
                                            className={cn(
                                                "flex items-center space-x-3 p-3.5 rounded-2xl transition-all text-left border",
                                                !isIntakeCompleted ? "opacity-50 cursor-not-allowed border-white/5 text-slate-600" : "cursor-pointer",
                                                activeStep === 2
                                                    ? "bg-primary-500/10 border-primary-500/40 text-white"
                                                    : "hover:bg-white/5 border-white/5 text-slate-400"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0",
                                                activeStep === 2
                                                    ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                                                    : !isIntakeCompleted
                                                    ? "bg-white/5 text-slate-600 border border-white/5"
                                                    : "bg-white/10 text-slate-300"
                                            )}>
                                                {!isIntakeCompleted ? <Lock className="h-4 w-4" /> : "2"}
                                            </div>
                                            <div className="space-y-0.5 overflow-hidden">
                                                <span className="text-[10px] font-extrabold uppercase tracking-wider block text-slate-500">Step 2</span>
                                                <span className="text-xs font-bold block truncate">Corporate Documents</span>
                                            </div>
                                        </button>
                                    )}

                                    {/* STEP 3 (or Step 2 for Individual): Identity & Biometrics */}
                                    <button
                                        type="button"
                                        onClick={() => isIntakeCompleted && setActiveStep(finalStepNumber)}
                                        disabled={!isIntakeCompleted}
                                        className={cn(
                                            "flex items-center space-x-3 p-3.5 rounded-2xl transition-all text-left border",
                                            !isIntakeCompleted ? "opacity-50 cursor-not-allowed border-white/5 text-slate-600" : "cursor-pointer",
                                            activeStep === finalStepNumber
                                                ? "bg-primary-500/10 border-primary-500/40 text-white"
                                                : "hover:bg-white/5 border-white/5 text-slate-400"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0",
                                            activeStep === finalStepNumber
                                                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                                                : !isIntakeCompleted
                                                ? "bg-white/5 text-slate-600 border border-white/5"
                                                : "bg-white/10 text-slate-300"
                                        )}>
                                            {!isIntakeCompleted ? <Lock className="h-4 w-4" /> : finalStepNumber}
                                        </div>
                                        <div className="space-y-0.5 overflow-hidden">
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider block text-slate-500">
                                                Step {finalStepNumber}
                                            </span>
                                            <span className="text-xs font-bold block truncate">Identity & Biometrics</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* STEP 1: DETAILS FORM */}
                            {activeStep === 1 && (
                                <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 md:p-8 space-y-6 text-left animate-in fade-in duration-200 shadow-xl">
                                    <div className="flex justify-between items-start border-b border-white/[0.04] pb-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <FileText className="h-5 w-5 text-primary-400" />
                                                <h4 className="text-base font-bold text-white">
                                                    {isBusiness ? 'Step 1: Business & Profile Details' : 'Step 1: Personal & Address Details'}
                                                </h4>
                                            </div>
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Provide your profile details below. You can save your progress in bits at any time.
                                            </p>
                                        </div>
                                        {isIntakeCompleted ? (
                                            <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center space-x-1 shrink-0">
                                                <Check className="h-3.5 w-3.5" />
                                                <span>Details Saved</span>
                                            </span>
                                        ) : (
                                            <span className="text-[11px] font-bold text-slate-400 font-mono shrink-0 bg-white/5 px-3 py-1 rounded-xl border border-white/5">
                                                {filledRequiredCount}/{totalRequiredCount} Required Filled
                                            </span>
                                        )}
                                    </div>

                                    {/* Compliance Guidance */}
                                    {notesList.length > 0 && (
                                        <div className="bg-primary-500/5 border border-primary-500/10 rounded-2xl p-4 space-y-1.5 text-xs text-slate-400">
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-400 block font-mono">Compliance Guidance</span>
                                            <ul className="list-disc list-inside space-y-1 text-xs text-slate-350">
                                                {notesList.map((note, idx) => (
                                                    <li key={idx} className="leading-relaxed">{note}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <form onSubmit={handleSaveIntake} className="space-y-6">
                                        {/* Widescreen 2-Column Grid Layout */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {fieldsList.length > 0 ? (
                                                fieldsList.map((field) => {
                                                    // Date field -> DatePicker
                                                    if (field.key === 'date_of_birth' || field.type === 'date') {
                                                        return (
                                                            <DatePicker
                                                                key={field.key}
                                                                label={field.label}
                                                                required={field.required}
                                                                value={intakeForm[field.key] || ''}
                                                                onChange={(val) => setIntakeForm({ ...intakeForm, [field.key]: val })}
                                                            />
                                                        );
                                                    }

                                                    // Country field -> Select with COUNTRY_OPTIONS
                                                    if (field.key === 'nationality' || field.type === 'country') {
                                                        return (
                                                            <Select
                                                                key={field.key}
                                                                label={field.label}
                                                                required={field.required}
                                                                placeholder="Select country"
                                                                options={COUNTRY_OPTIONS}
                                                                value={getCountryCodeByName(intakeForm[field.key] || '')}
                                                                onChange={(val) => setIntakeForm({ ...intakeForm, [field.key]: getCountryNameByCode(val) })}
                                                                searchable
                                                            />
                                                        );
                                                    }

                                                    // Phone input
                                                    if (field.key.includes('phone')) {
                                                        return (
                                                            <PhoneInput
                                                                key={field.key}
                                                                label={field.label}
                                                                required={field.required}
                                                                value={intakeForm[field.key] || ''}
                                                                onChange={(val) => setIntakeForm({ ...intakeForm, [field.key]: val })}
                                                            />
                                                        );
                                                    }

                                                    // Select dropdown
                                                    if (field.type === 'select') {
                                                        const opts = (field.options || []).map(opt => ({ value: opt, label: opt }));
                                                        return (
                                                            <Select
                                                                key={field.key}
                                                                label={field.label}
                                                                required={field.required}
                                                                options={opts}
                                                                value={intakeForm[field.key] || (field.options?.[0] || '')}
                                                                onChange={(val) => setIntakeForm({ ...intakeForm, [field.key]: val })}
                                                                searchable={false}
                                                            />
                                                        );
                                                    }

                                                    // Boolean toggle
                                                    if (field.type === 'boolean') {
                                                        return (
                                                            <div key={field.key} className="md:col-span-2 p-4 bg-black/25 border border-white/10 rounded-2xl space-y-1.5">
                                                                <label className="flex items-center space-x-3 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={Boolean(intakeForm[field.key])}
                                                                        onChange={(e) => setIntakeForm({ ...intakeForm, [field.key]: e.target.checked })}
                                                                        className="w-4 h-4 rounded border-white/20 bg-black/40 text-primary-500 focus:ring-primary-500"
                                                                    />
                                                                    <span className="text-xs text-white font-bold">{field.label}</span>
                                                                </label>
                                                                {field.help && (
                                                                    <p className="text-xs text-slate-400 pl-7">{field.help}</p>
                                                                )}
                                                            </div>
                                                        );
                                                    }

                                                    // Counterparties
                                                    if (field.type === 'counterparties') {
                                                        return (
                                                            <div key={field.key} className="md:col-span-2 space-y-4 pt-3 border-t border-white/[0.04]">
                                                                <div className="flex justify-between items-center">
                                                                    <label className="text-xs font-bold text-white block">{field.label}</label>
                                                                    <span className="text-[10px] text-slate-500 font-mono">Top 3 Trading Partners</span>
                                                                </div>
                                                                {field.help && <p className="text-xs text-slate-400 leading-relaxed">{field.help}</p>}

                                                                <div className="grid grid-cols-1 gap-4">
                                                                    {[0, 1, 2].map((idx) => {
                                                                        const cp = (intakeForm.top_3_counterparties && intakeForm.top_3_counterparties[idx]) || { country: '', purpose: '', relationship: '' };
                                                                        return (
                                                                            <div key={idx} className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-3">
                                                                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Counterparty #{idx + 1}</span>
                                                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                                                    <Select
                                                                                        placeholder="Select Country"
                                                                                        options={COUNTRY_OPTIONS}
                                                                                        value={getCountryCodeByName(cp.country || '')}
                                                                                        onChange={(val) => updateCounterparty(idx, 'country', getCountryNameByCode(val))}
                                                                                        searchable
                                                                                    />
                                                                                    <Input
                                                                                        placeholder="Relationship (e.g. Supplier)"
                                                                                        value={cp.relationship || ''}
                                                                                        onChange={(e) => updateCounterparty(idx, 'relationship', e.target.value)}
                                                                                    />
                                                                                    <Input
                                                                                        placeholder="Payment Purpose"
                                                                                        value={cp.purpose || ''}
                                                                                        onChange={(e) => updateCounterparty(idx, 'purpose', e.target.value)}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        );
                                                    }

                                                    // Standard text input
                                                    return (
                                                        <Input
                                                            key={field.key}
                                                            label={field.label}
                                                            type={field.key.includes('email') ? 'email' : 'text'}
                                                            required={field.required}
                                                            helperText={field.help}
                                                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                                                            value={intakeForm[field.key] || ''}
                                                            onChange={(e) => setIntakeForm({ ...intakeForm, [field.key]: e.target.value })}
                                                        />
                                                    );
                                                })
                                            ) : (
                                                /* Fallback 2-column inputs */
                                                <>
                                                    <DatePicker
                                                        label="Date of Birth"
                                                        required
                                                        value={intakeForm.date_of_birth || ''}
                                                        onChange={(val) => setIntakeForm({ ...intakeForm, date_of_birth: val })}
                                                    />

                                                    <Select
                                                        label="Nationality"
                                                        required
                                                        placeholder="Select country"
                                                        options={COUNTRY_OPTIONS}
                                                        value={getCountryCodeByName(intakeForm.nationality || '')}
                                                        onChange={(val) => setIntakeForm({ ...intakeForm, nationality: getCountryNameByCode(val) })}
                                                        searchable
                                                    />

                                                    <Input
                                                        label="Registered Address Line 1"
                                                        required
                                                        placeholder="Street address..."
                                                        value={intakeForm.address_line1 || ''}
                                                        onChange={(e) => setIntakeForm({ ...intakeForm, address_line1: e.target.value })}
                                                    />

                                                    <Input
                                                        label="City"
                                                        required
                                                        placeholder="Douala / Lagos"
                                                        value={intakeForm.city || ''}
                                                        onChange={(e) => setIntakeForm({ ...intakeForm, city: e.target.value })}
                                                    />
                                                </>
                                            )}
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 border-t border-white/5">
                                            <Button
                                                type="submit"
                                                variant="secondary"
                                                isLoading={submitIntakeMutation.isPending}
                                                className="w-full sm:w-auto rounded-xl h-[48px] px-6 text-xs font-bold"
                                                leftIcon={<Save className="h-4 w-4" />}
                                            >
                                                Save Progress (Partial)
                                            </Button>

                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    submitIntakeMutation.mutate(intakeForm);
                                                }}
                                                isLoading={submitIntakeMutation.isPending}
                                                className="w-full sm:w-auto rounded-xl h-[48px] px-8 text-xs font-bold"
                                                rightIcon={<ArrowRight className="h-4 w-4" />}
                                            >
                                                {isBusiness ? 'Save & Proceed to Documents' : 'Save & Proceed to Identity Check'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* STEP 2 (BUSINESS): CORPORATE DOCUMENTS UPLOAD */}
                            {isBusiness && activeStep === 2 && (
                                <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 md:p-8 space-y-6 text-left animate-in fade-in duration-200 shadow-xl">
                                    <div className="flex justify-between items-start border-b border-white/[0.04] pb-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <UploadCloud className="h-5 w-5 text-cyan-400" />
                                                <h4 className="text-base font-bold text-white">Step 2: Corporate & Compliance Documents</h4>
                                            </div>
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Upload your corporate onboarding documents below for compliance review.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Uploadable Documents Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {uploadableDocuments.length > 0 ? (
                                            uploadableDocuments.map((doc) => (
                                                <div key={doc.key} className="bg-black/30 border border-white/10 rounded-2xl p-5 space-y-3.5 flex flex-col justify-between">
                                                    <div className="space-y-1">
                                                        <div className="flex items-start justify-between">
                                                            <h5 className="text-xs font-bold text-white">{doc.label}</h5>
                                                            <span className={cn(
                                                                "text-[9px] font-extrabold uppercase px-2 py-0.5 rounded font-mono",
                                                                doc.required ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                                                            )}>
                                                                {doc.required ? 'Required' : 'Optional'}
                                                            </span>
                                                        </div>
                                                        {doc.help && (
                                                            <p className="text-[11px] text-slate-400 leading-relaxed">{doc.help}</p>
                                                        )}
                                                        {doc.max_age_months && (
                                                            <span className="text-[10px] text-cyan-400 font-mono block">Max age: {doc.max_age_months} months</span>
                                                        )}
                                                    </div>

                                                    <div className="pt-2">
                                                        <FileUpload
                                                            required={doc.required}
                                                            label={doc.label}
                                                            purpose="kyc"
                                                            value={uploadedDocUrls[doc.key] || ''}
                                                            onUploadComplete={(fileUrl) => handleDocumentUploadComplete(doc.key, fileUrl)}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-2 text-center py-8 text-xs text-slate-500">
                                                No specific document uploads required for your account type.
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end pt-4 border-t border-white/5">
                                        <Button
                                            type="button"
                                            onClick={() => setActiveStep(3)}
                                            className="rounded-xl h-[48px] px-8 text-xs font-bold"
                                            rightIcon={<ArrowRight className="h-4 w-4" />}
                                        >
                                            Proceed to Biometric Identity Check
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* FINAL STEP: BIOMETRIC IDENTITY & LIVENESS CHECK (SUMSUB) */}
                            {activeStep === finalStepNumber && (
                                <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 md:p-8 space-y-6 text-left animate-in fade-in duration-200 shadow-xl">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <UserCheck className="h-5 w-5 text-emerald-400" />
                                            <h4 className="text-base font-bold text-white">
                                                Step {finalStepNumber}: Biometric Identity & Liveness Check
                                            </h4>
                                        </div>
                                        <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">
                                            Present a valid government-issued ID (Passport, National ID, or Driver's License) and complete a quick facial biometric liveness scan.
                                        </p>
                                    </div>

                                    {verificationLaunched ? (
                                        <div className="space-y-4">
                                            <div id="sumsub-container" className="w-full min-h-[550px] bg-black/40 border border-white/10 rounded-2xl p-4 animate-in fade-in duration-300"></div>
                                            <Button
                                                onClick={handleRefreshStatus}
                                                variant="secondary"
                                                className="w-full rounded-xl h-12 text-xs font-bold"
                                                leftIcon={<RefreshCw className={cn("h-4 w-4", kycStatusQuery.isFetching && "animate-spin")} />}
                                            >
                                                {t('settings.verification.syncStatus')}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="bg-black/30 border border-white/10 rounded-2xl p-6 space-y-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3 text-xs text-slate-300">
                                                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                                        <Check className="h-3.5 w-3.5" />
                                                    </div>
                                                    <span>Fast, automated document verification</span>
                                                </div>
                                                <div className="flex items-center space-x-3 text-xs text-slate-300">
                                                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                                        <Check className="h-3.5 w-3.5" />
                                                    </div>
                                                    <span>Secure facial biometrics & liveness check</span>
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <Button
                                                    onClick={() => initKycMutation.mutate()}
                                                    disabled={initKycMutation.isPending}
                                                    className="w-full rounded-xl h-[52px] font-bold text-sm"
                                                    rightIcon={initKycMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                                                >
                                                    {initKycMutation.isPending ? 'Initializing Biometric Verification...' : 'Start Biometric Identity Check'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Submitted Records History */}
            {docList.length > 0 && (
                <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 shadow-xl space-y-4 w-full">
                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block font-mono border-b border-white/[0.03] pb-2">{t('settings.verification.historyTitle')}</span>
                    
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
                </div>
            )}

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
