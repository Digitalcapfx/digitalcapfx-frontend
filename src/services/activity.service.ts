import { BaseService } from './base.service';

export interface ActivityItem {
  id: string;
  type: string; // e.g. login, transfer, swap, deposit, card_issue
  amount: string;
  currency: string;
  status: string;
  reference: string;
  description: string;
  createdAt: string;
}

export interface ActivityListResponse {
  success: boolean;
  data: ActivityItem[];
}

export class ActivityService extends BaseService {
  async getActivityFeed(): Promise<ActivityListResponse> {
    const response = await this.api.get('/activity');
    return response.data;
  }
}

export const activityService = new ActivityService();
