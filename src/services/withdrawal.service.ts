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
  source_currency?: string;
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
  phone?: string;
  operator?: string;
  beneficiaryId?: string;
  source_currency?: string;
}

export interface Hub2TransferRequest {
  amount: number;
  currency: 'XOF' | 'XAF';
  phone: string;
  operator: string;
  direction?: 'collection' | 'disbursement';
  payment_method?: string;
}

export interface InternalTransferRequest {
  amount: number;
  currency: string;
  receiverPhone: string;
}

export class WithdrawalService extends BaseService {
  async getBeneficiaries(): Promise<BeneficiariesResponse> {
    const response = await this.api.get('/withdrawals/beneficiaries');
    if (response.data?.success && Array.isArray(response.data?.data)) {
      response.data.data = response.data.data.map((d: any) => ({
        id: d.id,
        name: d.label || d.name,
        accountNumber: d.account_number || d.accountNumber,
        bankName: d.bank_name || d.bankName,
        currency: d.destination_currency || d.currency,
        country: d.country,
        createdAt: d.createdAt
      }));
    }
    return response.data;
  }

  async createBeneficiary(payload: CreateBeneficiaryRequest): Promise<{ success: boolean; data: Beneficiary }> {
    const response = await this.api.post('/withdrawals/beneficiaries', {
      label: payload.name,
      account_number: payload.accountNumber,
      bank_name: payload.bankName,
      destination_currency: payload.currency,
      country: payload.country,
      type: 'bank'
    });
    if (response.data?.success && response.data?.data) {
      const d = response.data.data;
      response.data.data = {
        id: d.id,
        name: d.label || d.name,
        accountNumber: d.account_number || d.accountNumber,
        bankName: d.bank_name || d.bankName,
        currency: d.destination_currency || d.currency,
        country: d.country,
        createdAt: d.createdAt
      };
    }
    return response.data;
  }

  async deleteBeneficiary(id: string): Promise<{ success: boolean }> {
    const response = await this.api.delete(`/withdrawals/beneficiaries/${id}`);
    return response.data;
  }

  async createWithdrawalQuote(payload: WithdrawalQuoteRequest): Promise<WithdrawalQuoteResponse> {
    const source_currency = payload.source_currency || payload.currency || 'USD';
    const destination_currency = payload.currency || 'USD';
    const response = await this.api.post('/withdrawals/quote', {
      source_amount: payload.amount,
      source_currency,
      destination_currency,
      destination_type: 'bank'
    });
    if (response.data && response.data.success !== false) {
      const d = response.data.data || response.data;
      return {
        success: true,
        data: {
          quoteId: d.quote_id || d.quoteId || '',
          fee: d.fee || 0,
          rate: d.rate || 1,
          totalAmount: d.target_amount || d.totalAmount || d.source_amount || 0,
          expiryAt: d.expires_at || d.expiryAt || ''
        }
      };
    }
    return response.data;
  }

  async initiateWithdrawal(payload: InitiateWithdrawalRequest): Promise<any> {
    const code = payload.currency.toUpperCase();
    if (code === 'IUSD' || code === 'USDC' || code === 'USDT') {
      const response = await this.api.post('/crypto/withdraw', {
        amount: payload.amount.toString(),
        payout_mobile: payload.phone || '',
        payout_network: payload.operator || 'MTN',
        token: code === 'IUSD' ? 'USDC' : code
      });
      return response.data;
    } else if (code === 'XAF' || code === 'XOF') {
      const response = await this.api.post('/wallets/withdraw', {
        amount: payload.amount,
        currency: code,
        operator: payload.operator || 'MTN',
        phone: payload.phone || ''
      });
      return response.data;
    } else {
      const response = await this.api.post('/withdrawals', {
        beneficiary_id: payload.beneficiaryId,
        source_amount: payload.amount,
        source_currency: payload.source_currency || code
      });
      return response.data;
    }
  }

  async transferHub2(payload: Hub2TransferRequest): Promise<any> {
    return this.initiateWithdrawal({
      amount: payload.amount,
      currency: payload.currency,
      phone: payload.phone,
      operator: payload.operator
    });
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
