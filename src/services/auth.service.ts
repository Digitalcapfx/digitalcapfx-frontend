import { BaseService } from './base.service';

export interface RegisterRequest {
  accountType: 'individual' | 'business';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pin: string;
  country: string;
  companyLegalName?: string;
  companyRegistrationNo?: string;
  industry?: string;
  countryOfIncorporation?: string;
  annualRevenue?: string;
  businessWebsite?: string;
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

  async logout() {
    const response = await this.api.post('/auth/logout');
    return response.data;
  }

  async forgotPin(emailOrPhone: string) {
    const response = await this.api.post('/auth/forgot-pin', { emailOrPhone });
    return response.data;
  }

  async resetPin(payload: { emailOrPhone: string; code: string; newPin: string }) {
    const response = await this.api.post('/auth/reset-pin', payload);
    return response.data;
  }
}

export const authService = new AuthService();
