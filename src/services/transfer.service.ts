import { BaseService } from './base.service';

export interface SendCryptoRequest {
  receiverPhone: string;
  amount: string;
  token?: 'USDC' | 'USDT';
}

export interface SendCryptoResponse {
  success: boolean;
  data?: {
    transactionHash: string;
    reference: string;
  };
  error?: any;
}

export interface FundAccountRequest {
  amount: number;
  currency: 'XOF' | 'XAF';
  operator: string;
  phone: string;
  token?: 'USDC' | 'USDT';
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
  amount: string;
  payoutMobile: string;
  payoutNetwork: string;
  token?: 'USDC' | 'USDT';
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
  createdAt: string;
}

export interface ActivityResponse {
  success: boolean;
  data: TransactionActivity[];
}

class TransferService extends BaseService {
  async initiateDeposit(payload: FundAccountRequest & { isStablecoin?: boolean }): Promise<FundAccountResponse> {
    const endpoint = payload.isStablecoin ? '/crypto/fund' : '/wallets/deposit';
    const response = await this.api.post(endpoint, {
      amount: payload.amount,
      currency: payload.currency,
      operator: payload.operator,
      phone: payload.phone
    });
    return response.data;
  }

  async sendCrypto(payload: SendCryptoRequest): Promise<SendCryptoResponse> {
    const response = await this.api.post('/crypto/send', payload);
    return response.data;
  }

  async getActivity(): Promise<ActivityResponse> {
    const response = await this.api.get('/activity');
    return response.data;
  }

  async transferWaaS(payload: { amount: string; currency: string; network: string; toAddress: string }): Promise<any> {
    const response = await this.api.post('/wallets/transfer', payload);
    return response.data;
  }
}

export const transferService = new TransferService();
