import { BaseService } from './base.service';

export interface SendCryptoRequest {
  receiver_phone: string;
  amount: string;
}

export interface SendCryptoResponse {
  success: boolean;
  data?: {
    transaction_hash: string;
    reference: string;
  };
  error?: any;
}

export interface FundAccountRequest {
  amount: number;
  currency: 'XOF' | 'XAF';
  operator: string;
  phone: string;
}

export interface FundAccountResponse {
  success: boolean;
  data?: {
    reference: string;
    status: string;
  };
  error?: any;
}

export interface WithdrawRequest {
  amount: number;
  phone: string;
}

export interface WithdrawResponse {
  success: boolean;
  data?: {
    reference: string;
    status: string;
  };
  error?: any;
}

export interface TransactionActivity {
  id: string;
  type: string;
  amount: string;
  currency: string;
  status: string;
  reference: string;
  description: string;
  created_at: string;
}

export interface ActivityResponse {
  success: boolean;
  data: TransactionActivity[];
}

class TransferService extends BaseService {
  async sendCrypto(payload: SendCryptoRequest): Promise<SendCryptoResponse> {
    const response = await this.api.post('/crypto/send', payload);
    return response.data;
  }

  async fundAccount(payload: FundAccountRequest): Promise<FundAccountResponse> {
    const response = await this.api.post('/crypto/fund', payload);
    return response.data;
  }

  async withdraw(payload: WithdrawRequest): Promise<WithdrawResponse> {
    const response = await this.api.post('/crypto/withdraw', payload);
    return response.data;
  }

  async getActivity(): Promise<ActivityResponse> {
    const response = await this.api.get('/activity');
    return response.data;
  }
}

export const transferService = new TransferService();
