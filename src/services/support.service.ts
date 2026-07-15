import { BaseService } from './base.service';

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface SupportLink {
  id: string;
  name: string;
  url: string;
}

export interface TicketMessage {
  id: string;
  senderType: 'user' | 'agent';
  body: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages?: TicketMessage[];
}

export interface FAQListResponse {
  success: boolean;
  data: FAQ[];
}

export interface LinksResponse {
  success: boolean;
  data: SupportLink[];
}

export interface TicketListResponse {
  success: boolean;
  data: {
    tickets: SupportTicket[];
    total: number;
  };
}

export interface SingleTicketResponse {
  success: boolean;
  data: SupportTicket;
}

export class SupportService extends BaseService {
  async getFAQs(category?: string): Promise<FAQListResponse> {
    const url = category ? `/support/faqs?category=${category}` : '/support/faqs';
    const response = await this.api.get(url);
    return response.data;
  }

  async getLinks(): Promise<LinksResponse> {
    const response = await this.api.get('/support/links');
    if (response.data?.success && response.data?.data) {
      const d = response.data.data;
      const linksArray: SupportLink[] = Object.entries(d).map(([key, value]) => {
        const id = key.replace(/_?url/i, '');
        const name = id
          .replace(/([A-Z])/g, ' $1')
          .split(/[\s_]+/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
          .trim();
        return {
          id,
          name,
          url: String(value)
        };
      });
      response.data.data = linksArray;
    }
    return response.data;
  }

  async getTickets(): Promise<TicketListResponse> {
    const response = await this.api.get('/support/tickets');
    return response.data;
  }

  async createTicket(payload: { subject: string; category: string; message: string }): Promise<SingleTicketResponse> {
    const response = await this.api.post('/support/tickets', {
      subject: payload.subject,
      category: payload.category,
      body: payload.message
    });
    return response.data;
  }

  async getTicketDetails(id: string): Promise<SingleTicketResponse> {
    const response = await this.api.get(`/support/tickets/${id}`);
    return response.data;
  }

  async sendTicketReply(id: string, message: string): Promise<{ success: boolean; data: TicketMessage }> {
    const response = await this.api.post(`/support/tickets/${id}/messages`, { body:message });
    return response.data;
  }
}

export const supportService = new SupportService();
