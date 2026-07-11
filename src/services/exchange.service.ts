import { BaseService } from './base.service';

export interface ExchangeRateData {
  rate: number;
  source_currency: string;
  target_currency: string;
}

export interface ExchangeRateResponse {
  success: boolean;
  data: ExchangeRateData;
}

export interface QuoteRequest {
  source_currency: string;
  target_currency: string;
  amount: number;
  is_source: boolean;
}

export interface QuoteData {
  quote_id: string;
  rate: number;
  source_amount: string;
  target_amount: string;
  fee: string;
  expires_at: string;
}

export interface QuoteResponse {
  success: boolean;
  data?: QuoteData;
  error?: any;
}

export interface ExecuteExchangeRequest {
  quote_id: string;
}

export interface ExecuteExchangeResponse {
  success: boolean;
  data?: {
    transaction_id: string;
    status: string;
  };
  error?: any;
}

class ExchangeService extends BaseService {
  async getRate(source: string, target: string): Promise<ExchangeRateResponse> {
    const response = await this.api.get('/exchange/rate', {
      params: { source, target },
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
