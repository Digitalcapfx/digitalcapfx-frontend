import React from 'react'
import { cn } from '@/lib/utils'
import { KycStage } from '@/services/kyc.service'
import { useLanguageStore } from '@/store/languageStore'

interface StepNavigationProps {
  mainStep: number;
  setMainStep: (step: number) => void;
  totalSteps: number;
  hasDocuments: boolean;
  livenessStepNumber: number;
  completionPercentage: number;
  stage: KycStage;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  mainStep,
  setMainStep,
  totalSteps,
  hasDocuments,
  livenessStepNumber,
  completionPercentage,
  stage,
}) => {
  const { t } = useLanguageStore();
  const isSubmittedOrStarted = stage === 'submitted' || stage === 'identity_started';

  return (
    <div className="bg-[#0C1224] border border-[#131B30] p-4 rounded-3xl space-y-4 shadow-xl">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-400">
          {t('settings.verification.nav.journey', { totalSteps })}
        </span>
        <span className="text-xs font-mono font-bold text-primary-400">
          {isSubmittedOrStarted
            ? t('settings.verification.nav.fieldsSubmitted')
            : t('settings.verification.nav.percentageFilled', { percentage: completionPercentage })}
        </span>
      </div>

      <div className={cn("grid grid-cols-1 gap-3", hasDocuments ? "md:grid-cols-3" : "md:grid-cols-2")}>
        {/* STEP 1: Intake Information Fields */}
        <button
          type="button"
          onClick={() => setMainStep(1)}
          className={cn(
            "flex items-center space-x-3 p-4 rounded-2xl transition-all text-left cursor-pointer border",
            mainStep === 1
              ? "bg-primary-500/10 border-primary-500/40 text-white shadow-lg"
              : "hover:bg-white/5 border-white/5 text-slate-400"
          )}
        >
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 font-mono",
            mainStep === 1
              ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
              : "bg-white/5 text-slate-400 border border-white/5"
          )}>
            1
          </div>
          <div className="space-y-0.5 overflow-hidden">
            <span className="text-[9px] font-extrabold uppercase tracking-wider block text-slate-500 font-mono">
              {t('settings.verification.nav.stepProgress', { current: 1, total: totalSteps })}
            </span>
            <span className="text-xs font-bold block truncate">
              {t('settings.verification.nav.step1')}
            </span>
          </div>
        </button>

        {/* STEP 2: Compliance Documents (Rendered ONLY if backend specifies documents) */}
        {hasDocuments && (
          <button
            type="button"
            onClick={() => setMainStep(2)}
            className={cn(
              "flex items-center space-x-3 p-4 rounded-2xl transition-all text-left cursor-pointer border",
              mainStep === 2
                ? "bg-cyan-500/10 border-cyan-500/40 text-white shadow-lg"
                : "hover:bg-white/5 border-white/5 text-slate-400"
            )}
          >
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 font-mono",
              mainStep === 2
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "bg-white/5 text-slate-400 border border-white/5"
            )}>
              2
            </div>
            <div className="space-y-0.5 overflow-hidden">
              <span className="text-[9px] font-extrabold uppercase tracking-wider block text-slate-500 font-mono">
                {t('settings.verification.nav.stepProgress', { current: 2, total: totalSteps })}
              </span>
              <span className="text-xs font-bold block truncate">
                {t('settings.verification.nav.step2')}
              </span>
            </div>
          </button>
        )}

        {/* STEP LIVENESS: Identity & Biometrics */}
        <button
          type="button"
          onClick={() => setMainStep(livenessStepNumber)}
          className={cn(
            "flex items-center space-x-3 p-4 rounded-2xl transition-all text-left cursor-pointer border",
            mainStep === livenessStepNumber
              ? "bg-emerald-500/10 border-emerald-500/40 text-white shadow-lg"
              : "hover:bg-white/5 border-white/5 text-slate-400"
          )}
        >
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 font-mono",
            mainStep === livenessStepNumber
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-white/5 text-slate-400 border border-white/5"
          )}>
            {livenessStepNumber}
          </div>
          <div className="space-y-0.5 overflow-hidden">
            <span className="text-[9px] font-extrabold uppercase tracking-wider block text-slate-500 font-mono">
              {t('settings.verification.nav.stepProgress', { current: livenessStepNumber, total: totalSteps })}
            </span>
            <span className="text-xs font-bold block truncate">
              {t('settings.verification.nav.step3')}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
