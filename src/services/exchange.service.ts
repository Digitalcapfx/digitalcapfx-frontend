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

export interface RateItem {
  currency: string;
  standardRate: number;
  buyRate: number;
  sellRate: number;
  updatedAt: string;
}

export interface RatesResponse {
  success: boolean;
  data: RateItem[];
}

export interface CaasSwapRequest {
  amount: string;
  token_in: string;
  token_out: string;
}

export interface CaasSwapResponseItem {
  id: string;
  caasSwapId?: string;
  caas_swap_id?: string;
  reference?: string;
  userId?: string;
  user_id?: string;
  tokenIn?: string;
  token_in?: string;
  tokenOut?: string;
  token_out?: string;
  amountIn?: string;
  amount_in?: string;
  amountOut?: string | null;
  amount_out?: string | null;
  status: 'pending' | 'processing' | 'settled' | 'failed' | string;
  txHash?: string;
  tx_hash?: string;
  idempotencyKey?: string;
  idempotency_key?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface CaasSwapResponse {
  success: boolean;
  data?: CaasSwapResponseItem;
  error?: any;
}

export interface CaasSwapListResponse {
  success: boolean;
  data?: CaasSwapResponseItem[];
  error?: any;
}

class ExchangeService extends BaseService {
  async getRates(): Promise<RatesResponse> {
    const response = await this.api.get('/rates');
    return response.data;
  }

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

  async getWaaSSwapQuote(params: { fromChain: string; toChain: string; fromToken: string; toToken: string; amountIn: string }): Promise<any> {
    const response = await this.api.get('/wallets/swap/quote', { params });
    return response.data;
  }

  async executeWaaSSwap(payload: { fromChain: string; toChain: string; fromToken: string; toToken: string; amountIn: string; amountOutMin: string }): Promise<any> {
    const response = await this.api.post('/wallets/swap/execute', payload);
    return response.data;
  }

  async executeCaasSwap(payload: CaasSwapRequest): Promise<CaasSwapResponse> {
    const response = await this.api.post('/crypto/swaps', payload);
    return response.data;
  }

  async getCaasSwaps(page: number = 1, perPage: number = 20): Promise<CaasSwapListResponse> {
    const response = await this.api.get('/crypto/swaps', {
      params: { page, per_page: perPage },
    });
    return response.data;
  }

  async getCaasSwap(id: string): Promise<CaasSwapResponse> {
    const response = await this.api.get(`/crypto/swaps/${id}`);
    return response.data;
  }
}

export const exchangeService = new ExchangeService();

