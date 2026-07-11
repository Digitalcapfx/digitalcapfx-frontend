import { BaseService } from './base.service';

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  currency: string;
  country: string;
  createdAt?: string;
}

export interface BeneficiariesResponse {
  success: boolean;
  data: Beneficiary[];
}

export interface CreateBeneficiaryRequest {
  name: string;
  accountNumber: string;
  bankName: string;
  currency: string;
  country: string;
}

export interface WithdrawalQuoteRequest {
  amount: number;
  currency: string;
}

export interface WithdrawalQuoteData {
  quoteId: string;
  fee: number;
  rate: number;
  totalAmount: number;
  expiryAt: string;
}

export interface WithdrawalQuoteResponse {
  success: boolean;
  data: WithdrawalQuoteData;
}

export interface InitiateWithdrawalRequest {
  amount: number;
  currency: string;
  beneficiaryId: string;
}

export interface Hub2TransferRequest {
  amount: number;
  currency: 'XOF' | 'XAF';
  phone: string;
  operator: string;
}

export interface InternalTransferRequest {
  amount: number;
  currency: string;
  receiverPhone: string;
}

export class WithdrawalService extends BaseService {
  async getBeneficiaries(): Promise<BeneficiariesResponse> {
    const response = await this.api.get('/withdrawals/beneficiaries');
    return response.data;
  }

  async createBeneficiary(payload: CreateBeneficiaryRequest): Promise<{ success: boolean; data: Beneficiary }> {
    const response = await this.api.post('/withdrawals/beneficiaries', payload);
    return response.data;
  }

  async deleteBeneficiary(id: string): Promise<{ success: boolean }> {
    const response = await this.api.delete(`/withdrawals/beneficiaries/${id}`);
    return response.data;
  }

  async createWithdrawalQuote(payload: WithdrawalQuoteRequest): Promise<WithdrawalQuoteResponse> {
    const response = await this.api.post('/withdrawals/quote', payload);
    return response.data;
  }

  async initiateWithdrawal(payload: InitiateWithdrawalRequest): Promise<{ success: boolean; data: { reference: string; status: string } }> {
    const response = await this.api.post('/withdrawals', payload);
    return response.data;
  }

  async transferHub2(payload: Hub2TransferRequest): Promise<{ success: boolean; data: { reference: string; status: string } }> {
    const response = await this.api.post('/transfers/hub2', payload);
    return response.data;
  }

  async transferInternal(payload: InternalTransferRequest): Promise<{ success: boolean; data: { reference: string; status: string } }> {
    const response = await this.api.post('/transfers/internal', payload);
    return response.data;
  }

  async getWithdrawalDetails(id: string): Promise<{ success: boolean; data: any }> {
    const response = await this.api.get(`/withdrawals/${id}`);
    return response.data;
  }
}

export const withdrawalService = new WithdrawalService();
