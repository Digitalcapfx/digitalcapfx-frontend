import React from 'react'
import { Check } from 'lucide-react'

interface BusinessStepperProps {
  currentStepIndex: number;
}

export const BusinessStepper: React.FC<BusinessStepperProps> = ({ currentStepIndex }) => {
  const steps = ['Account', 'Business', 'Owner', 'Documents', 'Review', 'Done'];
  return (
    <div className="flex items-center justify-between w-full max-w-lg mx-auto py-4 select-none">
      {steps.map((label, idx) => {
        const isCompleted = idx < currentStepIndex;
        const isActive = idx === currentStepIndex;
        return (
          <React.Fragment key={label}>
            {idx > 0 && (
              <div className={`flex-grow h-[1px] mx-2 ${idx <= currentStepIndex ? 'bg-primary-500' : 'bg-white/10'}`}></div>
            )}
            <div className="flex flex-col items-center space-y-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition duration-300 ${
                isCompleted 
                  ? 'bg-primary-500 text-white' 
                  : isActive 
                  ? 'bg-transparent border border-primary-500 text-primary-500 ring-4 ring-primary-500/10' 
                  : 'bg-transparent border border-white/20 text-slate-500'
              }`}>
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : idx + 1}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${
                isActive ? 'text-primary-400' : 'text-slate-500'
              }`}>
                {label}
              </span>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  );
};
