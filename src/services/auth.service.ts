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
    const response = await this.api.post('/auth/forgot-pin', { email_or_phone: emailOrPhone });
    return response.data;
  }

  async resetPin(payload: { emailOrPhone: string; code: string; newPin: string }) {
    const response = await this.api.post('/auth/reset-pin', {
      email_or_phone: payload.emailOrPhone,
      code: payload.code,
      new_pin: payload.newPin
    });
    return response.data;
  }

  async login2FA(ref: string, code: string): Promise<any> {
    const response = await this.api.post('/auth/2fa/login', { ref, code });
    return response.data;
  }

  async loginGoogle(token: string): Promise<any> {
    const response = await this.api.post('/auth/google', { token });
    return response.data;
  }
}

export const authService = new AuthService();
