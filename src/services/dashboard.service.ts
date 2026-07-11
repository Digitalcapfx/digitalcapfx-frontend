import { BaseService } from './base.service';

export interface DashboardResponse {
  success: boolean;
  data: any;
}

export class DashboardService extends BaseService {
  async getDashboardData(): Promise<DashboardResponse> {
    const response = await this.api.get('/dashboard');
    return response.data;
  }
}

export const dashboardService = new DashboardService();
