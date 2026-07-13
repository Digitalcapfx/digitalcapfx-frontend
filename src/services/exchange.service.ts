import { BaseService } from './base.service';

export interface ExchangeRateData {
  rate: number;
  from: string;
  to: string;
}

export interface ExchangeRateResponse {
  success: boolean;
  data: ExchangeRateData;
}

export interface QuoteRequest {
  from: string;
  to: string;
  amount: number;
  side: 'SELL' | 'BUY';
}

export interface QuoteData {
  quoteId: string;
  rate: number;
  sourceAmount: number;
  targetAmount: number;
  fee: number;
  expiresAt: string;
}

export interface QuoteResponse {
  success: boolean;
  data?: QuoteData;
  error?: any;
}

export interface ExecuteExchangeRequest {
  from: string;
  to: string;
  amount: number;
  side: 'SELL' | 'BUY';
  quoteId?: string;
}

export interface ExecuteExchangeResponse {
  success: boolean;
  data?: {
    transactionId: string;
    status: string;
  };
  error?: any;
}

class ExchangeService extends BaseService {
  async getRate(from: string, to: string): Promise<ExchangeRateResponse> {
    const response = await this.api.get('/exchange/rate', {
      params: { from, to },
    });
    return response.data;
  }

  async createQuote(payload: QuoteRequest): Promise<QuoteResponse> {
    const response = await this.api.post('/exchange/quote', payload);
    return response.data;
  }

  async executeExchange(payload: ExecuteExchangeRequest): Promise<ExecuteExchangeResponse> {
    const response = await this.api.post('/exchange/execute', payload);
    return response.data;
  }

  async getExchangeHistory(): Promise<any> {
    const response = await this.api.get('/exchange/history');
    return response.data;
  }
}

export const exchangeService = new ExchangeService();
