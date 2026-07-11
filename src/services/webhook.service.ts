import { BaseService } from './base.service';

export class WebhookService extends BaseService {
  async triggerHub2Webhook(payload: any): Promise<{ success: boolean }> {
    const response = await this.api.post('/webhooks/hub2', payload);
    return response.data;
  }

  async triggerMetaMapWebhook(payload: any): Promise<{ success: boolean }> {
    const response = await this.api.post('/webhooks/metamap', payload);
    return response.data;
  }

  async triggerPaymentsWebhook(payload: any): Promise<{ success: boolean }> {
    const response = await this.api.post('/webhooks/payments', payload);
    return response.data;
  }
}

export const webhookService = new WebhookService();
