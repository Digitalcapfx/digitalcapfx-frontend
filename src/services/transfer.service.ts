import { BaseService } from './base.service';

export interface SendCryptoRequest {
  receiverPhone?: string;
  receiver_phone?: string;
  recipientAddress?: string;
  recipient_address?: string;
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

import { ActivityItem, ActivityListResponse } from './activity.service';

export type TransactionActivity = ActivityItem;
export type ActivityResponse = ActivityListResponse;

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
    const body: Record<string, any> = {
      amount: String(payload.amount),
      token: payload.token || 'USDC',
    };

    const phone = payload.receiverPhone || payload.receiver_phone;
    const address = payload.recipientAddress || payload.recipient_address;

    if (phone && phone.trim()) {
      body.receiver_phone = phone.trim();
      body.receiverPhone = phone.trim();
    } else if (address && address.trim()) {
      body.recipient_address = address.trim();
      body.recipientAddress = address.trim();
    }

    const response = await this.api.post('/crypto/send', body);
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
