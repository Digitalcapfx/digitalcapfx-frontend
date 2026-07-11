import { BaseService } from './base.service';

export interface RegisterRequest {
  account_type: 'individual' | 'business';
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  pin: string;
  country: string;
  company_legal_name?: string;
  company_registration_no?: string;
  industry?: string;
  country_of_incorporation?: string;
  annual_revenue?: string;
  business_website?: string;
}

export interface LoginRequest {
  phone: string;
  pin: string;
}

export class AuthService extends BaseService {
  async register(payload: RegisterRequest) {
    const response = await this.api.post('/auth/register', payload);
    return response.data;
  }

  async login(payload: LoginRequest) {
    const response = await this.api.post('/auth/login', payload);
    return response.data;
  }

  async verifyEmail(code: string) {
    const response = await this.api.post('/auth/email/verify', { code });
    return response.data;
  }

  async resendOtp() {
    const response = await this.api.post('/auth/email/resend-otp');
    return response.data;
  }
}

export const authService = new AuthService();
