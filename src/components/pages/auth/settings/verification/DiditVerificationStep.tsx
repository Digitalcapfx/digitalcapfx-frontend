'use client'

import React from 'react'
import { UserCheck, Shield, Lock, CheckCircle2, ArrowLeft, RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { KycStage } from '@/services/kyc.service'
import { useLanguageStore } from '@/store/languageStore'

interface DiditVerificationStepProps {
  stage: KycStage;
  livenessStepNumber: number;
  verificationLaunched: boolean;
  isInitializing: boolean;
  /** Per-user session URL minted by the backend. Empty until it arrives. */
  verificationUrl?: string;
  initError?: string | null;
  onStartVerification: () => void;
  onBack: () => void;
}

export const DiditVerificationStep: React.FC<DiditVerificationStepProps> = ({
  stage,
  livenessStepNumber,
  verificationLaunched,
  isInitializing,
  verificationUrl,
  initError,
  onStartVerification,
  onBack,
}) => {
  const { t } = useLanguageStore();
  const isSubmittedOrStarted = stage === 'submitted' || stage === 'identity_started' || stage === 'resubmit';

  // Only a session URL issued by our backend is usable. There is deliberately no
  // fallback link: a shared hosted link carries no vendor_data, so Didit's
  // decision could not be attributed to this user.
  const hasSession = Boolean(verificationUrl);
  const showFlow = hasSession && (verificationLaunched || isSubmittedOrStarted);

  const handleOpenNewTab = () => {
    if (!verificationUrl) return;
    window.open(verificationUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 md:p-8 space-y-6 text-left shadow-xl">
        <div className="flex justify-between items-start border-b border-white/[0.04] pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-emerald-400" />
              <h4 className="text-base font-bold text-white">
                {t('settings.verification.step3.title', { step: livenessStepNumber })}
              </h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t('settings.verification.step3.desc')}
            </p>
          </div>
        </div>

        {showFlow ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{t('settings.verification.step3.active')}</span>
              </div>

              <div className="flex items-center space-x-2 flex-wrap">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleOpenNewTab}
                  className="rounded-xl text-xs font-bold h-9 px-3 shrink-0 border-white/10 hover:border-emerald-500/40 text-slate-200"
                  leftIcon={<ExternalLink className="h-3.5 w-3.5 text-cyan-400" />}
                >
                  {t('settings.verification.step3.openFullscreen') || 'Open Fullscreen'}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={onStartVerification}
                  isLoading={isInitializing}
                  className="rounded-xl text-xs font-bold h-9 px-3 shrink-0"
                  leftIcon={<RefreshCw className={cn("h-3.5 w-3.5", isInitializing && "animate-spin")} />}
                >
                  {t('settings.verification.step3.reloadWidget')}
                </Button>
              </div>
            </div>

            {/* Embedded Didit verification — per-user session URL */}
            <div className="relative w-full min-h-[620px] rounded-2xl overflow-hidden border border-white/10 bg-[#070b14] shadow-2xl">
              <iframe
                src={verificationUrl}
                title="Didit KYC Identity Verification"
                className="w-full h-full min-h-[620px] border-0"
                allow="camera; microphone; fullscreen; accelerometer; gyroscope; autoplay; encrypted-media"
                loading="lazy"
              />
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 flex items-start space-x-2 text-xs text-slate-300">
              <Shield className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                {t('settings.verification.step3.decisionPending') ||
                  "Une fois vos documents soumis, notre équipe reçoit la décision de Didit et votre statut est mis à jour automatiquement. Cela prend généralement moins d'une minute."}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-black/30 border border-white/10 rounded-2xl p-8 space-y-6 text-center">
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                <Shield className="h-6 w-6" />
              </div>
              <h5 className="font-bold text-lg text-white">{t('settings.verification.sumsubTitle')}</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('settings.verification.sumsubDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left text-xs">
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 space-y-1">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{t('settings.verification.step3.automatedScan')}</span>
                </div>
                <p className="text-[11px] text-slate-400">{t('settings.verification.step3.automatedDesc')}</p>
              </div>

              <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 space-y-1">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <Lock className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{t('settings.verification.step3.secureBiometrics')}</span>
                </div>
                <p className="text-[11px] text-slate-400">{t('settings.verification.step3.secureDesc')}</p>
              </div>
            </div>

            {initError && (
              <div className="max-w-lg mx-auto bg-red-500/5 border border-red-500/20 rounded-xl p-3.5 flex items-start space-x-2 text-xs text-red-300 text-left">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{initError}</span>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="button"
                onClick={onStartVerification}
                isLoading={isInitializing}
                className="rounded-xl text-xs font-bold px-8 h-12 bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl"
              >
                {initError
                  ? (t('settings.verification.step3.retry') || 'Réessayer')
                  : t('settings.verification.startSumsub')}
              </Button>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-white/[0.04]">
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            className="rounded-xl text-xs font-bold px-5 h-11"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            {livenessStepNumber === 3 ? t('settings.verification.step3.backToDocs') : t('settings.verification.step3.backToFields')}
          </Button>
        </div>
      </div>
    </div>
  );
};
