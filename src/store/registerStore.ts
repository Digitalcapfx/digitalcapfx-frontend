import { create } from 'zustand'

export type SignupStep = 'account-type' | 'business-details' | 'credentials' | 'verify' | 'done';

interface RegisterState {
  step: SignupStep;
  accountType: 'individual' | 'business' | null;

  // Business details
  companyName: string;
  companyRegNo: string;
  industry: string;
  countryOfIncorp: string;
  annualRevenue: string;
  website: string;

  // Personal / Creator details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneError: string;
  pin: string;
  country: string;
  agree: boolean;

  // OTP
  code: string;

  // Actions
  setStep: (step: SignupStep) => void;
  setAccountType: (type: 'individual' | 'business' | null) => void;
  updateBusinessDetails: (details: Partial<Omit<RegisterState, 'step' | 'accountType' | 'setStep' | 'setAccountType' | 'updateBusinessDetails' | 'updateCredentials' | 'setCode' | 'setPhoneError' | 'reset'>>) => void;
  updateCredentials: (credentials: Partial<Omit<RegisterState, 'step' | 'accountType' | 'setStep' | 'setAccountType' | 'updateBusinessDetails' | 'updateCredentials' | 'setCode' | 'setPhoneError' | 'reset'>>) => void;
  setCode: (code: string) => void;
  setPhoneError: (error: string) => void;
  reset: () => void;
}

const initialState = {
  step: 'account-type' as SignupStep,
  accountType: null,
  companyName: '',
  companyRegNo: '',
  industry: '',
  countryOfIncorp: '',
  annualRevenue: '',
  website: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  phoneError: '',
  pin: '',
  country: '',
  agree: false,
  code: '',
};

export const useRegisterStore = create<RegisterState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setAccountType: (accountType) => set({ accountType }),
  updateBusinessDetails: (details) => set((state) => ({ ...state, ...details })),
  updateCredentials: (credentials) => set((state) => ({ ...state, ...credentials })),
  setCode: (code) => set({ code }),
  setPhoneError: (phoneError) => set({ phoneError }),
  reset: () => set(initialState),
}));
