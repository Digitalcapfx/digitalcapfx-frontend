import { BaseService } from './base.service';

export interface ManualMomoAccount {
  id: string;
  provider: string;
  display_name: string;
  phone_number: string;
  account_name?: string | null;
  currency: 'XOF' | 'XAF';
  country?: string | null;
  instructions?: string | null;
  is_active: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SubmitMomoDepositRequest {
  momo_account_id: string;
  amount: number;
  reference?: string;
  sender_phone?: string;
  sender_name?: string;
  note?: string;
}

export interface SubmitMomoDepositResponse {
  success: boolean;
  data?: {
    id: string;
    status: string;
    amount: number;
    currency: string;
    created_at: string;
  };
  error?: any;
}

export interface ManualMomoDepositClaim {
  id: string;
  user_id: string;
  momo_account_id: string;
  amount: number;
  currency: string;
  reference?: string;
  sender_phone?: string;
  sender_name?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  note?: string;
  credited_amount?: number;
  created_at: string;
  updated_at?: string;
  momo_account?: ManualMomoAccount;
}

export interface RequestMomoWithdrawalPayload {
  currency: 'XOF' | 'XAF';
  amount: number;
  provider: string;
  recipient_phone: string;
  recipient_name?: string;
  note?: string;
}

class MomoService extends BaseService {
  async getMomoAccounts(): Promise<{ success: boolean; data: ManualMomoAccount[] }> {
    const response = await this.api.get('/momo/accounts');
    return response.data;
  }

  async submitDepositClaim(payload: SubmitMomoDepositRequest): Promise<SubmitMomoDepositResponse> {
    const response = await this.api.post('/momo/deposits', payload);
    return response.data;
  }

  async getMyDeposits(page = 1, perPage = 20): Promise<{ success: boolean; data: ManualMomoDepositClaim[] }> {
    const response = await this.api.get(`/momo/deposits?page=${page}&per_page=${perPage}`);
    return response.data;
  }

  async requestWithdrawal(payload: RequestMomoWithdrawalPayload): Promise<{ success: boolean; data?: any; error?: any }> {
    const response = await this.api.post('/momo/withdrawals', payload);
    return response.data;
  }

  async getMyWithdrawals(page = 1, perPage = 20): Promise<{ success: boolean; data: any[] }> {
    const response = await this.api.get(`/momo/withdrawals?page=${page}&per_page=${perPage}`);
    return response.data;
  }
}

export const momoService = new MomoService();
