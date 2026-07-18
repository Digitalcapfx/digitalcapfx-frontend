import { BaseService } from './base.service';

export interface BalanceTrendItem {
  date: string;
  fiatUsd: number;
  cryptoUsd: number;
  totalUsd: number;
}

export interface AssetAllocationDetails {
  fiatUsd: number;
  fiatFormatted: string;
  fiatPct: number;
  cryptoUsd: number;
  cryptoFormatted: string;
  cryptoPct: number;
  totalUsd: number;
  totalFormatted: string;
}

export interface MonthlyFlowItem {
  month: string;
  income: number;
  spending: number;
}

export interface SpendingByTypeItem {
  type: string;
  label: string;
  fiatAmount: number;
  cryptoAmount: number;
  totalAmount: number;
}

export interface InsightsResponse {
  success: boolean;
  data: {
    period: string;
    summary: {
      totalBalance: number;
      totalFormatted: string;
      incomeMonth: number;
      incomeFormatted: string;
      spendingMonth: number;
      spendingFormatted: string;
      netFlow: number;
      netFormatted: string;
    };
    fiatBalance: number;
    cryptoBalance: number;
    trendChange: number;
    trendFormatted: string;
    balanceTrends: BalanceTrendItem[];
    assetAllocation: AssetAllocationDetails;
    monthlyFlow: MonthlyFlowItem[];
    netFlow: number;
    netFormatted: string;
    spendingByType: SpendingByTypeItem[];
    totalActivity: number;
    totalActivityFormatted: string;
  };
}

export class InsightsService extends BaseService {
  async getInsights(period?: '1w' | '1m' | '3m' | '6m'): Promise<InsightsResponse> {
    const response = await this.api.get('/insights', { params: { period } });
    return response.data;
  }
}

export const insightsService = new InsightsService();
