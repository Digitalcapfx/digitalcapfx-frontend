import React from 'react'
import { UserCheck, Shield, Lock, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { KycStage } from '@/services/kyc.service'
import { useLanguageStore } from '@/store/languageStore'

interface SumsubLivenessStepProps {
  stage: KycStage;
  livenessStepNumber: number;
  verificationLaunched: boolean;
  isInitializing: boolean;
  onStartVerification: () => void;
  onBack: () => void;
}

export const SumsubLivenessStep: React.FC<SumsubLivenessStepProps> = ({
  stage,
  livenessStepNumber,
  verificationLaunched,
  isInitializing,
  onStartVerification,
  onBack,
}) => {
  const { t } = useLanguageStore();
  const isSubmittedOrStarted = stage === 'submitted' || stage === 'identity_started' || stage === 'resubmit';

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

            {/* Sumsub WebSDK Mount Container */}
            <div id="sumsub-container" className="w-full min-h-[550px] bg-black/40 border border-white/10 rounded-2xl p-4 animate-in fade-in duration-300"></div>
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
