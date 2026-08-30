import { BaseService } from './base.service';

export interface MaintenanceResponse {
  maintenanceMode?: boolean;
  maintenance_mode?: boolean;
  message?: string;
}

export class MaintenanceService extends BaseService {
  async getMaintenanceStatus(): Promise<MaintenanceResponse> {
    const response = await this.api.get('/maintenance');
    return response.data;
  }
}

export const maintenanceService = new MaintenanceService();
export default maintenanceService;
