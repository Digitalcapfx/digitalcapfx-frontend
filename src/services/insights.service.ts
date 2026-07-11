import { BaseService } from './base.service';

export interface InsightsResponse {
  success: boolean;
  data: {
    summary: {
      totalBalance: number;
      income: number;
      spending: number;
      netFlow: number;
      transactionCount?: number;
    };
    balanceTrend?: {
      dates: string[];
      fiat: number[];
      crypto: number[];
    };
    assetAllocation?: {
      fiatPercentage: number;
      cryptoPercentage: number;
    };
    monthlyCashFlow?: {
      months: string[];
      income: number[];
      spending: number[];
    };
    spendingBreakdown?: {
      categories: string[];
      values: number[];
    };
  };
}

export class InsightsService extends BaseService {
  async getInsights(period?: '1w' | '1m' | '3m' | '6m'): Promise<InsightsResponse> {
    const response = await this.api.get('/insights', { params: { period } });
    return response.data;
  }
}

export const insightsService = new InsightsService();
