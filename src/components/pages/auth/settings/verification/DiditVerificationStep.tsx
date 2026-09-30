'use client'

import React, { useEffect } from 'react'
import { UserCheck, Shield, Lock, CheckCircle2, ArrowLeft, RefreshCw, ExternalLink, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { KycStage } from '@/services/kyc.service'
import { useLanguageStore } from '@/store/languageStore'

interface DiditVerificationStepProps {
  stage: KycStage;
  livenessStepNumber: number;
  verificationLaunched: boolean;
  isInitializing: boolean;
  verificationUrl?: string;
  onStartVerification: () => void;
  onAutoApprove?: () => void;
  isAutoApproving?: boolean;
  onBack: () => void;
}

const DEFAULT_DIDIT_URL = 'https://verify.didit.me/u/ygyeSJcjQaSlwL6YV3xlxA';

export const DiditVerificationStep: React.FC<DiditVerificationStepProps> = ({
  stage,
  livenessStepNumber,
  verificationLaunched,
  isInitializing,
  verificationUrl,
  onStartVerification,
  onAutoApprove,
  isAutoApproving = false,
  onBack,
}) => {
  const { t } = useLanguageStore();
  const isSubmittedOrStarted = stage === 'submitted' || stage === 'identity_started' || stage === 'resubmit';
  const effectiveUrl = verificationUrl || DEFAULT_DIDIT_URL;

  // Listen to postMessage from Didit iframe for automatic completion detection
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Didit sends status updates or completion events
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (
          data?.type === 'DIDIT_VERIFICATION_COMPLETED' ||
          data?.event === 'status.updated' ||
          data?.status === 'Approved' ||
          data?.status === 'APPROVED' ||
          data?.status === 'In Review'
        ) {
          if (onAutoApprove) {
            onAutoApprove();
          }
        }
      } catch {
        // Not a JSON message, ignore
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAutoApprove]);

  const handleOpenNewTab = () => {
    window.open(effectiveUrl, '_blank', 'noopener,noreferrer');
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

        {verificationLaunched || isSubmittedOrStarted ? (
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

                {onAutoApprove && (
                  <Button
                    type="button"
                    onClick={onAutoApprove}
                    isLoading={isAutoApproving}
                    className="rounded-xl text-xs font-bold h-9 px-4 shrink-0 bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                    leftIcon={<Sparkles className="h-3.5 w-3.5" />}
                  >
                    {t('settings.verification.step3.autoApproveBtn') || "J'ai terminé — Auto-valider"}
                  </Button>
                )}
              </div>
            </div>

            {/* Embedded Didit Verification Iframe */}
            <div className="relative w-full min-h-[620px] rounded-2xl overflow-hidden border border-white/10 bg-[#070b14] shadow-2xl">
              <iframe
                src={effectiveUrl}
                title="Didit KYC Identity Verification"
                className="w-full h-full min-h-[620px] border-0"
                allow="camera; microphone; fullscreen; accelerometer; gyroscope; payment"
                loading="lazy"
              />
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Une fois vos pièces scannées sur Didit, le système valide automatiquement votre compte.</span>
              </div>
              {onAutoApprove && (
                <button
                  type="button"
                  onClick={onAutoApprove}
                  className="text-emerald-400 hover:text-emerald-300 font-bold underline ml-2 shrink-0 cursor-pointer"
                >
                  Valider maintenant
                </button>
              )}
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

            <div className="pt-2">
              <Button
                type="button"
                onClick={onStartVerification}
                isLoading={isInitializing}
                className="rounded-xl text-xs font-bold px-8 h-12 bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl"
              >
                {t('settings.verification.startSumsub')}
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
