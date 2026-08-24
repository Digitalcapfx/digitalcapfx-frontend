import { BaseService } from './base.service';

export interface BalanceTrendItem {
  date: string;
  fiat_usd?: number;
  crypto_usd?: number;
  total_usd?: number;
  fiatUsd?: number;
  cryptoUsd?: number;
  totalUsd?: number;
}

export interface AssetAllocationDetails {
  fiat_usd?: number;
  fiat_formatted?: string;
  fiat_pct?: number;
  crypto_usd?: number;
  crypto_formatted?: string;
  crypto_pct?: number;
  total_usd?: number;
  total_formatted?: string;

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
  fiat_amount?: number;
  crypto_amount?: number;
  total_amount?: number;
  fiatAmount: number;
  cryptoAmount: number;
  totalAmount: number;
}

export interface InsightsSummary {
  total_balance?: number;
  total_formatted?: string;
  income_month?: number;
  income_formatted?: string;
  spending_month?: number;
  spending_formatted?: string;
  net_flow?: number;
  net_formatted?: string;

  totalBalance: number;
  totalFormatted: string;
  incomeMonth: number;
  incomeFormatted: string;
  spendingMonth: number;
  spendingFormatted: string;
  netFlow: number;
  netFormatted: string;
}

export interface InsightsData {
  period: string;
  summary: InsightsSummary;
  fiatBalance: number;
  fiat_balance?: number;
  cryptoBalance: number;
  crypto_balance?: number;
  trendChange: number;
  trend_change?: number;
  trendFormatted: string;
  trend_formatted?: string;
  balanceTrends: BalanceTrendItem[];
  balance_trends?: BalanceTrendItem[];
  assetAllocation: AssetAllocationDetails;
  asset_allocation?: AssetAllocationDetails;
  monthlyFlow: MonthlyFlowItem[];
  monthly_flow?: MonthlyFlowItem[];
  netFlow: number;
  net_flow?: number;
  netFormatted: string;
  net_formatted?: string;
  spendingByType: SpendingByTypeItem[];
  spending_by_type?: SpendingByTypeItem[];
  totalActivity: number;
  total_activity?: number;
  totalActivityFormatted: string;
  total_activity_formatted?: string;
}

export interface InsightsResponse {
  success: boolean;
  data: InsightsData;
}

export function normalizeInsightsData(data: any): InsightsData {
  if (!data) {
    return {
      period: '1m',
      summary: {
        totalBalance: 0,
        totalFormatted: '$0',
        incomeMonth: 0,
        incomeFormatted: '$0',
        spendingMonth: 0,
        spendingFormatted: '$0',
        netFlow: 0,
        netFormatted: '$0',
      },
      fiatBalance: 0,
      cryptoBalance: 0,
      trendChange: 0,
      trendFormatted: '+0.0%',
      balanceTrends: [],
      assetAllocation: {
        fiatUsd: 0,
        fiatFormatted: '$0',
        fiatPct: 0,
        cryptoUsd: 0,
        cryptoFormatted: '$0',
        cryptoPct: 0,
        totalUsd: 0,
        totalFormatted: '$0',
      },
      monthlyFlow: [],
      netFlow: 0,
      netFormatted: '$0',
      spendingByType: [],
      totalActivity: 0,
      totalActivityFormatted: '$0',
    };
  }

  const summaryRaw = data.summary || {};
  const summary: InsightsSummary = {
    total_balance: summaryRaw.total_balance ?? summaryRaw.totalBalance ?? 0,
    total_formatted: summaryRaw.total_formatted ?? summaryRaw.totalFormatted ?? '$0',
    income_month: summaryRaw.income_month ?? summaryRaw.incomeMonth ?? 0,
    income_formatted: summaryRaw.income_formatted ?? summaryRaw.incomeFormatted ?? '$0',
    spending_month: summaryRaw.spending_month ?? summaryRaw.spendingMonth ?? 0,
    spending_formatted: summaryRaw.spending_formatted ?? summaryRaw.spendingFormatted ?? '$0',
    net_flow: summaryRaw.net_flow ?? summaryRaw.netFlow ?? 0,
    net_formatted: summaryRaw.net_formatted ?? summaryRaw.netFormatted ?? '$0',

    totalBalance: summaryRaw.total_balance ?? summaryRaw.totalBalance ?? 0,
    totalFormatted: summaryRaw.total_formatted ?? summaryRaw.totalFormatted ?? '$0',
    incomeMonth: summaryRaw.income_month ?? summaryRaw.incomeMonth ?? 0,
    incomeFormatted: summaryRaw.income_formatted ?? summaryRaw.incomeFormatted ?? '$0',
    spendingMonth: summaryRaw.spending_month ?? summaryRaw.spendingMonth ?? 0,
    spendingFormatted: summaryRaw.spending_formatted ?? summaryRaw.spendingFormatted ?? '$0',
    netFlow: summaryRaw.net_flow ?? summaryRaw.netFlow ?? 0,
    netFormatted: summaryRaw.net_formatted ?? summaryRaw.netFormatted ?? '$0',
  };

  const assetRaw = data.asset_allocation || data.assetAllocation || {};
  const assetAllocation: AssetAllocationDetails = {
    fiat_usd: assetRaw.fiat_usd ?? assetRaw.fiatUsd ?? 0,
    fiat_formatted: assetRaw.fiat_formatted ?? assetRaw.fiatFormatted ?? '$0',
    fiat_pct: assetRaw.fiat_pct ?? assetRaw.fiatPct ?? 0,
    crypto_usd: assetRaw.crypto_usd ?? assetRaw.cryptoUsd ?? 0,
    crypto_formatted: assetRaw.crypto_formatted ?? assetRaw.cryptoFormatted ?? '$0',
    crypto_pct: assetRaw.crypto_pct ?? assetRaw.cryptoPct ?? 0,
    total_usd: assetRaw.total_usd ?? assetRaw.totalUsd ?? 0,
    total_formatted: assetRaw.total_formatted ?? assetRaw.totalFormatted ?? '$0',

    fiatUsd: assetRaw.fiat_usd ?? assetRaw.fiatUsd ?? 0,
    fiatFormatted: assetRaw.fiat_formatted ?? assetRaw.fiatFormatted ?? '$0',
    fiatPct: assetRaw.fiat_pct ?? assetRaw.fiatPct ?? 0,
    cryptoUsd: assetRaw.crypto_usd ?? assetRaw.cryptoUsd ?? 0,
    cryptoFormatted: assetRaw.crypto_formatted ?? assetRaw.cryptoFormatted ?? '$0',
    cryptoPct: assetRaw.crypto_pct ?? assetRaw.cryptoPct ?? 0,
    totalUsd: assetRaw.total_usd ?? assetRaw.totalUsd ?? 0,
    totalFormatted: assetRaw.total_formatted ?? assetRaw.totalFormatted ?? '$0',
  };

  const balanceTrends: BalanceTrendItem[] = (data.balance_trends || data.balanceTrends || []).map((b: any) => ({
    date: b.date || '',
    fiat_usd: b.fiat_usd ?? b.fiatUsd ?? 0,
    crypto_usd: b.crypto_usd ?? b.cryptoUsd ?? 0,
    total_usd: b.total_usd ?? b.totalUsd ?? 0,
    fiatUsd: b.fiat_usd ?? b.fiatUsd ?? 0,
    cryptoUsd: b.crypto_usd ?? b.cryptoUsd ?? 0,
    totalUsd: b.total_usd ?? b.totalUsd ?? 0,
  }));

  const spendingByType: SpendingByTypeItem[] = (data.spending_by_type || data.spendingByType || []).map((s: any) => ({
    type: s.type || '',
    label: s.label || '',
    fiat_amount: s.fiat_amount ?? s.fiatAmount ?? 0,
    crypto_amount: s.crypto_amount ?? s.cryptoAmount ?? 0,
    total_amount: s.total_amount ?? s.totalAmount ?? 0,
    fiatAmount: s.fiat_amount ?? s.fiatAmount ?? 0,
    cryptoAmount: s.crypto_amount ?? s.cryptoAmount ?? 0,
    totalAmount: s.total_amount ?? s.totalAmount ?? 0,
  }));

  const fiatBalance = data.fiat_balance ?? data.fiatBalance ?? 0;
  const cryptoBalance = data.crypto_balance ?? data.cryptoBalance ?? 0;
  const trendChange = data.trend_change ?? data.trendChange ?? 0;
  const trendFormatted = data.trend_formatted ?? data.trendFormatted ?? '+0.0%';
  const netFlow = data.net_flow ?? data.netFlow ?? 0;
  const netFormatted = data.net_formatted ?? data.netFormatted ?? '$0';
  const totalActivity = data.total_activity ?? data.totalActivity ?? 0;
  const totalActivityFormatted = data.total_activity_formatted ?? data.totalActivityFormatted ?? '$0';

  return {
    period: data.period || '1m',
    summary,
    fiatBalance,
    fiat_balance: fiatBalance,
    cryptoBalance,
    crypto_balance: cryptoBalance,
    trendChange,
    trend_change: trendChange,
    trendFormatted,
    trend_formatted: trendFormatted,
    balanceTrends,
    balance_trends: balanceTrends,
    assetAllocation,
    asset_allocation: assetAllocation,
    monthlyFlow: data.monthly_flow || data.monthlyFlow || [],
    monthly_flow: data.monthly_flow || data.monthlyFlow || [],
    netFlow,
    net_flow: netFlow,
    netFormatted,
    net_formatted: netFormatted,
    spendingByType,
    spending_by_type: spendingByType,
    totalActivity,
    total_activity: totalActivity,
    totalActivityFormatted,
    total_activity_formatted: totalActivityFormatted,
  };
}

export class InsightsService extends BaseService {
  async getInsights(period?: '1w' | '1m' | '3m' | '6m'): Promise<InsightsResponse> {
    const response = await this.api.get('/insights', { params: { period } });
    if (response.data && response.data.data) {
      response.data.data = normalizeInsightsData(response.data.data);
    }
    return response.data;
  }
}

export const insightsService = new InsightsService();

