import { BaseService } from './base.service';

export interface PurchaseAirtimeRequest {
  amount: number;
  currency: 'XAF' | 'XOF';
  operator: string;
  phone: string;
}

export interface PurchaseDataBundleRequest {
  amount: number;
  bundleId: string;
  currency: 'XAF' | 'XOF';
  operator: string;
  phone: string;
}

export interface PayBillRequest {
  accountNumber: string;
  amount: number;
  billerId: string;
  currency: 'XAF' | 'XOF';
}

export interface VTUTransactionData {
  id: string;
  amount: string;
  currency: string;
  provider: string;
  reference: string;
  serviceType: string;
  status: string;
  targetAccount?: string;
  targetPhone?: string;
  createdAt: string;
}

export interface VTUTransactionResponse {
  success: boolean;
  data: VTUTransactionData;
  error?: {
    message?: string;
  };
}

export interface VTUTransactionListResponse {
  success: boolean;
  data: VTUTransactionData[];
}

export class VtuService extends BaseService {
  async purchaseAirtime(payload: PurchaseAirtimeRequest): Promise<VTUTransactionResponse> {
    const response = await this.api.post('/vtu/airtime', payload);
    return response.data;
  }

  async purchaseData(payload: PurchaseDataBundleRequest): Promise<VTUTransactionResponse> {
    const response = await this.api.post('/vtu/data', payload);
    return response.data;
  }

  async payBill(payload: PayBillRequest): Promise<VTUTransactionResponse> {
    const response = await this.api.post('/vtu/bills/pay', payload);
    return response.data;
  }

  async getVtuTransactions(): Promise<VTUTransactionListResponse> {
    const response = await this.api.get('/vtu/transactions');
    return response.data;
  }
}

export const vtuService = new VtuService();
