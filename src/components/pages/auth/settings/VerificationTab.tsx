'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FilePreviewDialog } from '@/components/ui/FilePreviewDialog'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  kycService,
  KYCIntakePayload,
  IntakeFieldSpec,
  DocumentSpec,
  KycStage,
  IntakeCounterparty,
  IntakeRequirementsResponse,
  KycStatusResponseData
} from '@/services/kyc.service'
import { profileService } from '@/services/profile.service'
import { useLanguageStore } from '@/store/languageStore'
import { StageBanner } from './verification/StageBanner'
import { StepNavigation } from './verification/StepNavigation'
import { IntakeFieldsStep } from './verification/IntakeFieldsStep'
import { ComplianceDocumentsStep } from './verification/ComplianceDocumentsStep'
import { SumsubLivenessStep } from './verification/SumsubLivenessStep'
import { loadSumsubScript, getValueForKey } from './verification/verificationUtils'

export const VerificationTab: React.FC = () => {
  const { t } = useLanguageStore();
  const queryClient = useQueryClient();

  const [mainStep, setMainStep] = useState<number>(1);
  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);
  const [verificationLaunched, setVerificationLaunched] = useState(false);
  const [historyPreviewUrl, setHistoryPreviewUrl] = useState('');
  const [historyPreviewOpen, setHistoryPreviewOpen] = useState(false);
  const [historyPreviewName, setHistoryPreviewName] = useState('');
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

  const reqResponse = kycRequirementsQuery.data as any;
  const reqData: IntakeRequirementsResponse = (reqResponse?.data || reqResponse || {}) as IntakeRequirementsResponse;
  const valuesFromReq = reqData.values;
  const fieldsList: IntakeFieldSpec[] = Array.isArray(reqData.fields) ? reqData.fields : [];
  const documentsList: DocumentSpec[] = Array.isArray(reqData.documents) ? reqData.documents : [];
  const notesList: string[] = Array.isArray(reqData.notes) ? reqData.notes : [];

  const accountType = (reqData.accountType || reqData.account_type || profileQuery.data?.data?.accountType || 'business').toLowerCase();
  const isBusiness = accountType === 'business';

  const kycResponse = kycStatusQuery.data as any;
  const kycData: KycStatusResponseData = (kycResponse?.data || kycResponse || {}) as KycStatusResponseData;

  // Determine stage strictly based on GET /kyc/status backend contract
  const stage: KycStage = useMemo(() => {
    if (kycData?.stage) {
      return kycData.stage as KycStage;
    }
    const identityStatus = (kycData?.identity?.status || '').toLowerCase();
    const intakeStatus = (kycData?.intake?.status || '').toLowerCase();
    const rawStatus = (kycData?.kyc_status || kycData?.kycStatus || kycData?.status || '').toLowerCase();

    if (identityStatus === 'approved' || rawStatus === 'approved') return 'approved';
    if (identityStatus === 'resubmit') return 'resubmit';
    if (identityStatus === 'rejected' || rawStatus === 'rejected') return 'rejected';
    if (identityStatus === 'in_review' || ['submitted', 'under_review', 'processing'].includes(rawStatus)) return 'in_review';
    if (identityStatus === 'in_progress') return 'identity_started';
    if (intakeStatus === 'submitted') return 'submitted';
    if (intakeStatus === 'draft') return 'draft';
    return 'not_started';
  }, [kycData]);

  // Dynamic Intake Form State - initialized dynamically from backend schema & saved values
  const [intakeForm, setIntakeForm] = useState<Record<string, any>>({});

  const isImporter = Boolean(intakeForm.isImporter ?? intakeForm.is_importer);

  // Calculate uploadable documents dynamically to determine if flow is 2 or 3 steps
  const uploadableDocuments = useMemo(() => {
    return documentsList.filter((d) => {
      if (d.key === 'idv_liveness' || d.key === 'idvLiveness') return false;
      const appliesTo = d.appliesTo || d.applies_to;
      if (appliesTo === 'importers' && !isImporter) return false;
      return true;
    });
  }, [documentsList, isImporter]);

  const hasDocuments = uploadableDocuments.length > 0;
  const totalSteps = hasDocuments ? 3 : 2;
  const livenessStepNumber = hasDocuments ? 3 : 2;

  // Set default mainStep based on initial stage & document requirement
  useEffect(() => {
    if (stage === 'submitted' || stage === 'identity_started' || stage === 'resubmit') {
      setMainStep(livenessStepNumber);
    } else if (stage === 'draft' || stage === 'not_started') {
      setMainStep(1);
    }
  }, [stage, livenessStepNumber]);

  // Keep mainStep clamped within total steps bounds
  useEffect(() => {
    if (mainStep > livenessStepNumber) {
      setMainStep(livenessStepNumber);
    }
  }, [mainStep, livenessStepNumber]);

  // Sync existing uploaded documents from GET /kyc/documents
  useEffect(() => {
    const docsResponse = kycDocsQuery.data as any;
    const list = Array.isArray(docsResponse?.data)
      ? docsResponse.data
      : Array.isArray(docsResponse)
      ? docsResponse
      : [];

    if (list.length > 0) {
      const docMap: Record<string, string> = {};
      list.forEach((item: any) => {
        const docType = item.docType || item.doc_type;
        const docUrl = item.docUrl || item.doc_url;
        if (docType && docUrl) {
          docMap[docType] = docUrl;
        }
      });
      setUploadedDocUrls((prev) => ({ ...docMap, ...prev }));
    }
  }, [kycDocsQuery.data]);

  // Auto-launch Sumsub verification when entering Step 3 if not launched yet
  useEffect(() => {
    if (mainStep === livenessStepNumber && !verificationLaunched && !initKycMutation.isPending) {
      initKycMutation.mutate();
    }
  }, [mainStep, livenessStepNumber, verificationLaunched]);

  // Group fields dynamically by group and sort by order
  const { groupedFields, groupKeys } = useMemo(() => {
    const groups: Record<string, IntakeFieldSpec[]> = {};
    fieldsList.forEach((field) => {
      const g = field.group || 'identity';
      if (!groups[g]) groups[g] = [];
      groups[g].push(field);
    });

    Object.keys(groups).forEach((gKey) => {
      groups[gKey].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    const preferredOrder = ['identity', 'address', 'contact', 'financial'];
    const present = Object.keys(groups);
    const ordered = preferredOrder.filter((g) => present.includes(g));
    const extra = present.filter((g) => !preferredOrder.includes(g));

    const finalKeys = [...ordered, ...extra];
    if (finalKeys.length === 0) {
      finalKeys.push('identity');
    }

    return { groupedFields: groups, groupKeys: finalKeys };
  }, [fieldsList]);

  // Stable serialized dependency keys for prefill effect
  const serializedValues = useMemo(() => JSON.stringify(valuesFromReq || {}), [valuesFromReq]);
  const serializedFields = useMemo(() => JSON.stringify(fieldsList || []), [fieldsList]);

  // Prefill intake form dynamically from backend requirements values, fields spec, and profile data
  useEffect(() => {
    setIntakeForm((prev) => {
      let updated = { ...prev };
      let hasChanges = false;

      // 1. Map values and fields by evaluating exact, camelCase, and snake_case keys
      fieldsList.forEach((field) => {
        const camelKey = field.key.replace(/([-_][a-z])/g, (g) => g.toUpperCase().replace('-', '').replace('_', ''));
        const snakeKey = field.key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

        const existingVal = getValueForKey(valuesFromReq, field.key) ?? getValueForKey(prev, field.key);

        let finalVal = existingVal;
        if (finalVal !== undefined && finalVal !== null) {
          if (typeof finalVal === 'string' && finalVal.includes('T') && (field.type === 'date' || field.key.toLowerCase().includes('date'))) {
            finalVal = finalVal.split('T')[0];
          }
        } else {
          if (field.type === 'boolean') {
            finalVal = false;
          } else if (field.type === 'repeatable' || field.type === 'counterparties' || field.key.toLowerCase().includes('counterpart')) {
            finalVal = [{ country: '', purpose: '', relationship: '' }];
          } else if (field.type === 'select' && field.options && field.options.length > 0) {
            const firstOpt = typeof field.options[0] === 'string' ? field.options[0] : (field.options[0] as any)?.value;
            finalVal = firstOpt || '';
          } else {
            finalVal = '';
          }
        }

        [field.key, camelKey, snakeKey].forEach((k) => {
          if (JSON.stringify(updated[k]) !== JSON.stringify(finalVal)) {
            updated[k] = finalVal;
            hasChanges = true;
          }
        });
      });

      // 2. Merge any leftover saved values from backend (/kyc/requirements)
      if (valuesFromReq && typeof valuesFromReq === 'object') {
        Object.entries(valuesFromReq).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            let finalVal = val;
            if (typeof finalVal === 'string' && finalVal.includes('T') && key.toLowerCase().includes('date')) {
              finalVal = finalVal.split('T')[0];
            }
            const camelKey = key.replace(/([-_][a-z])/g, (g) => g.toUpperCase().replace('-', '').replace('_', ''));
            const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

            [key, camelKey, snakeKey].forEach((k) => {
              if (JSON.stringify(updated[k]) !== JSON.stringify(finalVal)) {
                updated[k] = finalVal;
                hasChanges = true;
              }
            });
          }
        });
      }

      // 3. Fallback prefill from user profile for common basic fields
      if (profileQuery.data?.success && profileQuery.data.data) {
        const p = profileQuery.data.data;
        if (!getValueForKey(updated, 'contact_email') && p.email) {
          updated.contact_email = p.email;
          updated.contactEmail = p.email;
          hasChanges = true;
        }
        if (!getValueForKey(updated, 'contact_phone') && p.phoneNumber) {
          updated.contact_phone = p.phoneNumber;
          updated.contactPhone = p.phoneNumber;
          hasChanges = true;
        }
        if (!getValueForKey(updated, 'nationality') && p.nationality) {
          updated.nationality = p.nationality;
          hasChanges = true;
        }
        if (!getValueForKey(updated, 'date_of_birth') && p.dateOfBirth) {
          let dob = p.dateOfBirth;
          if (typeof dob === 'string' && dob.includes('T')) dob = dob.split('T')[0];
          updated.date_of_birth = dob;
          updated.dateOfBirth = dob;
          hasChanges = true;
        }
      }

      return hasChanges ? updated : prev;
    });
  }, [serializedValues, serializedFields, profileQuery.data]);

  // Draft save mutation (PUT /kyc/intake/draft)
  const saveDraftMutation = useMutation({
    mutationFn: (valuesToSave: Record<string, any>) => kycService.saveIntakeDraft(valuesToSave),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kycRequirements'] });
    },
    onError: (err: any) => {
      console.error('Draft save error:', err);
    }
  });

  const handleManualSaveDraft = () => {
    saveDraftMutation.mutate(intakeForm, {
      onSuccess: () => {
        toast.success('Draft progress saved successfully!');
      },
      onError: (err: any) => {
        const rawError = err.response?.data?.error;
        const msg = typeof rawError === 'object' ? rawError.message : (rawError || err.message || 'Failed to save draft.');
        toast.error(msg);
      }
    });
  };

  // Submit intake mutation (POST /kyc/intake)
  const submitIntakeMutation = useMutation({
    mutationFn: (payload: KYCIntakePayload) => kycService.submitIntake(payload),
    onSuccess: (res) => {
      toast.success(res?.message || 'Intake fields saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['kycRequirements'] });
      queryClient.invalidateQueries({ queryKey: ['kycStatus'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (err: any) => {
      console.error('Intake submission error:', err);
      const rawError = err.response?.data?.error;
      const msg = typeof rawError === 'object' ? (rawError.message || JSON.stringify(rawError)) : (rawError || err.message || 'Failed to submit intake fields.');
      toast.error(msg);
    }
  });

  const handleSaveOrSubmitIntake = (advanceToNextStep = false) => {
    submitIntakeMutation.mutate(intakeForm, {
      onSuccess: () => {
        if (advanceToNextStep) {
          setMainStep(2);
        }
      }
    });
  };

  // Document upload handler
  const handleDocumentUploadComplete = async (docKey: string, fileUrl: string) => {
    setDocUploadingKey(docKey);
    try {
      await kycService.submitDocument({
        doc_type: docKey as any,
        doc_url: fileUrl
      });
      setUploadedDocUrls((prev) => ({ ...prev, [docKey]: fileUrl }));
      toast.success('Document uploaded successfully!');
      queryClient.invalidateQueries({ queryKey: ['kycDocuments'] });
      queryClient.invalidateQueries({ queryKey: ['kycStatus'] });
    } catch (err: any) {
      console.error('Document submission error:', err);
      toast.error('Failed to submit document. Please try again.');
    } finally {
      setDocUploadingKey(null);
    }
  };

  // Sumsub SDK Launch & Initialization (POST /kyc/init)
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
        () => kycService.initKyc().then((res) => res.data?.token || res?.token)
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

  const initKycMutation = useMutation({
    mutationFn: () => kycService.initKyc(),
    onSuccess: (res) => {
      const accessToken = res?.data?.token || res?.data?.identityAccess || res?.token || res?.identityAccess;
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

  // Metrics calculation
  const requiredFields = fieldsList.filter((f) => f.required);
  const filledRequiredCount = requiredFields.filter((f) => {
    const val = intakeForm[f.key];
    if (f.type === 'boolean') return val !== undefined && val !== null;
    if (f.type === 'repeatable' || f.type === 'counterparties') {
      return Array.isArray(val) && val.some((c: IntakeCounterparty) => c.country || c.purpose || c.relationship);
    }
    return Boolean(val && String(val).trim() !== '');
  }).length;
  const totalRequiredCount = requiredFields.length > 0 ? requiredFields.length : 1;
  const completionPercentage = Math.min(100, Math.round((filledRequiredCount / totalRequiredCount) * 100));

  const isLocked = stage === 'in_review' || stage === 'approved' || stage === 'rejected';

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

      {/* Loading Skeleton */}
      {kycStatusQuery.isLoading || kycRequirementsQuery.isLoading ? (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-12 w-full flex flex-col items-center justify-center space-y-3 text-center animate-pulse min-h-[220px]">
          <RefreshCw className="h-8 w-8 text-primary-400 animate-spin" />
          <span className="text-xs text-slate-400 font-semibold">{t('settings.verification.loadingRecords')}</span>
        </div>
      ) : (
        <>
          {/* Stage Status Banners (Approved, In Review, Rejected, Resubmit) */}
          <StageBanner
            stage={stage}
            kycData={kycData}
            onRefreshStatus={handleRefreshStatus}
            isFetchingStatus={kycStatusQuery.isFetching}
          />

          {/* Active Verification Journey Flow (Unlocked) */}
          {!isLocked && (
            <div className="space-y-6 w-full">
              {/* Dynamic 2 or 3 Step Navigation Bar */}
              <StepNavigation
                mainStep={mainStep}
                setMainStep={setMainStep}
                totalSteps={totalSteps}
                hasDocuments={hasDocuments}
                livenessStepNumber={livenessStepNumber}
                completionPercentage={completionPercentage}
                stage={stage}
              />

              {/* STEP 1: Intake Information Fields */}
              {mainStep === 1 && (
                <IntakeFieldsStep
                  groupKeys={groupKeys}
                  groupedFields={groupedFields}
                  activeGroupIndex={activeGroupIndex}
                  setActiveGroupIndex={setActiveGroupIndex}
                  intakeForm={intakeForm}
                  setIntakeForm={setIntakeForm}
                  notesList={notesList}
                  isBusiness={isBusiness}
                  isSavingDraft={saveDraftMutation.isPending}
                  isSubmitting={submitIntakeMutation.isPending}
                  onSaveDraft={handleManualSaveDraft}
                  onSaveAndProceed={handleSaveOrSubmitIntake}
                  hasDocuments={hasDocuments}
                />
              )}

              {/* STEP 2: Compliance Documents (If required by backend) */}
              {mainStep === 2 && hasDocuments && (
                <ComplianceDocumentsStep
                  uploadableDocuments={uploadableDocuments}
                  uploadedDocUrls={uploadedDocUrls}
                  docUploadingKey={docUploadingKey}
                  onDocumentUploadComplete={handleDocumentUploadComplete}
                  onProceedToBiometrics={() => setMainStep(livenessStepNumber)}
                  onBackToFields={() => setMainStep(1)}
                />
              )}

              {/* STEP 3 / LIVENESS: Identity & Biometrics (Sumsub) */}
              {mainStep === livenessStepNumber && (
                <SumsubLivenessStep
                  stage={stage}
                  livenessStepNumber={livenessStepNumber}
                  verificationLaunched={verificationLaunched}
                  isInitializing={initKycMutation.isPending}
                  onStartVerification={() => initKycMutation.mutate()}
                  onBack={() => setMainStep(hasDocuments ? 2 : 1)}
                />
              )}
            </div>
          )}
        </>
      )}

      {/* History Document Preview Dialog */}
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
