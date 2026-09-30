'use client'

import React from 'react'
import { DiditVerificationStep } from './DiditVerificationStep'
import { KycStage } from '@/services/kyc.service'

interface SumsubLivenessStepProps {
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

export const SumsubLivenessStep: React.FC<SumsubLivenessStepProps> = (props) => {
  return <DiditVerificationStep {...props} />;
};

export { DiditVerificationStep };
