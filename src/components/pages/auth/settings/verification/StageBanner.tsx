import React from 'react'
import { Shield, Clock, AlertCircle, RefreshCw, AlertTriangle, Headphones } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { KycStage, KycStatusResponseData } from '@/services/kyc.service'
import { useLanguageStore } from '@/store/languageStore'
import Link from 'next/link'

interface StageBannerProps {
  stage: KycStage;
  kycData?: KycStatusResponseData;
  onRefreshStatus?: () => void;
  isFetchingStatus?: boolean;
}

export const StageBanner: React.FC<StageBannerProps> = ({
  stage,
  kycData,
  onRefreshStatus,
  isFetchingStatus = false,
}) => {
  const { t } = useLanguageStore();

  if (stage === 'approved') {
    return (
      <div className="bg-[#0C1224] border border-emerald-500/20 rounded-3xl p-8 space-y-6 w-full shadow-2xl">
        <div className="flex items-start space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Shield className="h-7 w-7 stroke-[2.5]" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border bg-emerald-500/15 border-emerald-500/20 text-emerald-400 tracking-wider font-mono">
              {t('settings.verification.status.verified')}
            </span>
            <h4 className="font-satoshi font-black text-xl text-white">
              {t('settings.verification.status.complete')}
            </h4>
            <p className="text-slate-350 text-xs leading-relaxed max-w-2xl">
              {t('settings.verification.status.approvedDesc')} All your currency accounts (USD, EUR, GBP, NGN, USDC) and trading features are fully active.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'in_review') {
    return (
      <div className="bg-[#0C1224] border border-orange-500/20 rounded-3xl p-8 space-y-6 w-full shadow-2xl">
        <div className="flex items-start space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
            <Clock className="h-7 w-7 stroke-[2.5]" />
          </div>
          <div className="space-y-4 w-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border bg-orange-500/15 border-orange-500/20 text-orange-400 tracking-wider font-mono">
                UNDER REVIEW
              </span>
              {onRefreshStatus && (
                <button
                  type="button"
                  onClick={onRefreshStatus}
                  disabled={isFetchingStatus}
                  className="text-xs font-bold text-primary-400 hover:underline flex items-center space-x-1.5 cursor-pointer"
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', isFetchingStatus && 'animate-spin')} />
                  <span>{t('settings.verification.refreshStatus')}</span>
                </button>
              )}
            </div>
            <div className="space-y-1">
              <h4 className="font-satoshi font-black text-xl text-white">
                {t('settings.verification.status.inProgress')}
              </h4>
              <p className="text-slate-350 text-xs leading-relaxed max-w-2xl">
                {t('settings.verification.status.pendingDesc')} Our automated identity verification engine and compliance team are processing your details.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'rejected') {
    const moderationComment = (kycData as any)?.identity?.moderation_comment || (kycData as any)?.rejectionReason || (kycData as any)?.rejection_reason;
    const rejectLabels = (kycData as any)?.identity?.reject_labels;

    return (
      <div className="bg-[#0C1224] border border-rose-500/30 rounded-3xl p-8 space-y-6 w-full shadow-2xl">
        <div className="flex items-start space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-455 shrink-0">
            <AlertCircle className="h-7 w-7 stroke-[2.5]" />
          </div>
          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border bg-rose-500/15 border-rose-500/20 text-rose-455 tracking-wider font-mono">
                FINAL REJECTION
              </span>
              <h4 className="font-satoshi font-black text-xl text-white">
                {t('settings.verification.status.rejected')}
              </h4>
              <p className="text-slate-350 text-xs leading-relaxed max-w-2xl">
                {moderationComment || 'Your application was rejected during compliance review.'}
              </p>
            </div>

            {Array.isArray(rejectLabels) && rejectLabels.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {rejectLabels.map((label: string, i: number) => (
                  <span key={i} className="text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-md">
                    {label}
                  </span>
                ))}
              </div>
            )}

            <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl text-xs text-slate-400 leading-relaxed">
              This decision is final. You cannot re-open identity verification self-service. If you believe this is an error, please contact our support desk directly.
            </div>

            <div className="pt-2">
              <Link href="/support">
                <Button className="rounded-xl text-xs font-bold px-6 h-11" leftIcon={<Headphones className="h-4 w-4" />}>
                  Contact Customer Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'resubmit') {
    const moderationComment = (kycData as any)?.identity?.moderation_comment;
    const rejectLabels = (kycData as any)?.identity?.reject_labels;

    return (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-3">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
          <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Resubmission Requested
          </h5>
        </div>
        <p className="text-xs text-slate-350 leading-relaxed">
          {moderationComment || 'Your previous document scan or selfie requires a quick adjustment.'}
        </p>
        {Array.isArray(rejectLabels) && rejectLabels.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {rejectLabels.map((label: string, i: number) => (
              <span key={i} className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};
