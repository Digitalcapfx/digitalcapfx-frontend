import { create } from 'zustand';

export interface BalanceMatrix {
  XOF: number;
  XAF: number;
  EUR: number;
  USD: number;
  GBP: number;
  USDT: number;
  USDC: number;
}

export interface KYCState {
  step: 'country_selection' | 'document_upload' | 'selfie_scan' | 'verifying' | 'completed';
  selectedCountry: string; // WAEMU/CEMAC only (e.g. Senegal, Ivory Coast, Cameroon, etc.)
  documentType: 'passport' | 'id_card' | 'electoral_card' | null;
  verificationStatus: 'idle' | 'pending' | 'success' | 'failed';
}

interface WebStore {
  balances: BalanceMatrix;
  activeCurrency: keyof BalanceMatrix;
  kyc: KYCState;
  
  // Actions
  setBalances: (balances: Partial<BalanceMatrix>) => void;
  setActiveCurrency: (currency: keyof BalanceMatrix) => void;
  updateKYC: (kyc: Partial<KYCState>) => void;
  resetKYC: () => void;
}

export const useWebStore = create<WebStore>((set) => ({
  balances: {
    XOF: 250000,
    XAF: 0,
    EUR: 150,
    USD: 85,
    GBP: 0,
    USDT: 450,
    USDC: 120,
  },
  activeCurrency: 'XOF',
  kyc: {
    step: 'country_selection',
    selectedCountry: '',
    documentType: null,
    verificationStatus: 'idle',
  },

  setBalances: (newBalances) =>
    set((state) => ({ balances: { ...state.balances, ...newBalances } })),
    
  setActiveCurrency: (currency) =>
    set({ activeCurrency: currency }),
    
  updateKYC: (newKyc) =>
    set((state) => ({ kyc: { ...state.kyc, ...newKyc } })),
    
  resetKYC: () =>
    set({
      kyc: {
        step: 'country_selection',
        selectedCountry: '',
        documentType: null,
        verificationStatus: 'idle',
      },
    }),
}));
