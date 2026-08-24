import { BaseService } from './base.service';

export interface ActivityItem {
  id: string;
  source?: string; // e.g. "caas", "fiat"
  type: string; // e.g. "sent", "received", "exchanged", "transfer", "deposit"
  title?: string; // e.g. "Sent USDT"
  subtitle?: string; // e.g. "2:55 PM · 0x7d6b..."
  asset?: string; // e.g. "USDT", "USD", "USDC"
  amount_formatted?: string; // e.g. "-30.00 USDT", "+$5.00"
  amountFormatted?: string;
  amount_sign?: string; // e.g. "-", "+"
  amountSign?: string;
  status: string; // e.g. "completed", "pending", "failed"
  icon_type?: string; // e.g. "sent_crypto", "sent_fiat", "received_fiat", "received_crypto", "exchanged"
  iconType?: string;
  created_at?: string; // e.g. "2026-08-23T14:55:42.775831Z"
  createdAt?: string;

  // Legacy & Fallback fields
  amount?: string;
  currency?: string;
  reference?: string;
  description?: string;
}

export interface ActivityGroup {
  day_label?: string;
  dayLabel?: string;
  date: string;
  items: ActivityItem[];
  count: number;
}

export interface ActivityResponseData {
  groups?: ActivityGroup[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ActivityListResponse {
  success: boolean;
  data: ActivityResponseData | ActivityItem[];
}

export function normalizeActivityItem(item: ActivityItem): ActivityItem {
  const createdAt = item.created_at || item.createdAt || new Date().toISOString();
  const title = item.title || item.description || `${item.type || 'Transaction'}`;
  const subtitle = item.subtitle || item.reference || '';
  const asset = item.asset || item.currency || '';
  
  let amountFormatted = item.amount_formatted || item.amountFormatted;
  if (!amountFormatted && item.amount) {
    const sign = item.amount_sign || item.amountSign || '';
    amountFormatted = `${sign}${item.amount} ${asset}`.trim();
  }

  const iconType = item.icon_type || item.iconType || '';
  const amountSign = item.amount_sign || item.amountSign || '';

  return {
    ...item,
    created_at: createdAt,
    createdAt: createdAt,
    title,
    description: item.description || title,
    subtitle,
    reference: item.reference || subtitle,
    asset,
    currency: item.currency || asset,
    amount_formatted: amountFormatted || '',
    amountFormatted: amountFormatted || '',
    amount_sign: amountSign,
    amountSign: amountSign,
    icon_type: iconType,
    iconType: iconType,
  };
}

export function extractActivityGroupsAndItems(dataResponse?: ActivityListResponse['data']): {
  groups: ActivityGroup[];
  items: ActivityItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} {
  if (!dataResponse) {
    return { groups: [], items: [], total: 0, page: 1, limit: 20, totalPages: 1 };
  }

  // Handle flat array response
  if (Array.isArray(dataResponse)) {
    const items = dataResponse.map(normalizeActivityItem);
    return {
      groups: items.length > 0 ? [{ day_label: 'All Activity', dayLabel: 'All Activity', date: '', items, count: items.length }] : [],
      items,
      total: items.length,
      page: 1,
      limit: items.length || 20,
      totalPages: 1,
    };
  }

  // Handle grouped object response
  if (dataResponse.groups && Array.isArray(dataResponse.groups)) {
    const groups: ActivityGroup[] = dataResponse.groups.map((g: any) => ({
      ...g,
      day_label: g.day_label || g.dayLabel || '',
      dayLabel: g.dayLabel || g.day_label || '',
      items: (g.items || []).map(normalizeActivityItem),
    }));
    const items: ActivityItem[] = groups.flatMap((g) => g.items);
    const total = dataResponse.total ?? items.length;
    const page = dataResponse.page ?? 1;
    const limit = dataResponse.limit ?? 20;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return { groups, items, total, page, limit, totalPages };
  }

  return { groups: [], items: [], total: 0, page: 1, limit: 20, totalPages: 1 };
}

export interface ActivityFeedParams {
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class ActivityService extends BaseService {
  async getActivityFeed(params?: ActivityFeedParams): Promise<ActivityListResponse> {
    const queryParams: Record<string, any> = {};
    if (params?.type && params.type !== 'all') {
      queryParams.type = params.type;
    }
    if (params?.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
    if (params?.page) {
      queryParams.page = params.page;
    }
    if (params?.limit) {
      queryParams.limit = params.limit;
    }

    const response = await this.api.get('/activity', { params: queryParams });
    return response.data;
  }
}

export const activityService = new ActivityService();

