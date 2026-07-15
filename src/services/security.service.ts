import { BaseService } from './base.service';

export interface SecurityStatusResponse {
  success: boolean;
  data: {
    totpEnabled: boolean;
    biometricsEnabled: boolean;
  };
}

export interface Setup2FAResponse {
  success: boolean;
  data: {
    secret: string;
    uri: string;
  };
}

export interface DeviceSession {
  id: string;
  deviceName: string;
  deviceIp: string;
  isCurrent: boolean;
  createdAt: string;
  lastUsedAt: string;
}

export interface DeviceListResponse {
  success: boolean;
  data: DeviceSession[];
}

export class SecurityService extends BaseService {
  async getSecurityStatus(): Promise<SecurityStatusResponse> {
    const response = await this.api.get('/security');
    return response.data;
  }

  async setup2FA(): Promise<Setup2FAResponse> {
    const response = await this.api.post('/security/2fa/setup');
    return response.data;
  }

  async confirm2FA(code: string): Promise<{ success: boolean; message?: string }> {
    const response = await this.api.post('/security/2fa/confirm', { code });
    return response.data;
  }

  async disable2FA(code: string): Promise<{ success: boolean; message?: string }> {
    const response = await this.api.delete('/security/2fa', { data: { code } });
    return response.data;
  }

  async changePin(currentPin: string, newPin: string): Promise<{ success: boolean; message?: string }> {
    const response = await this.api.post('/security/pin/change', { currentPin, newPin });
    return response.data;
  }

  async getActiveDevices(): Promise<DeviceListResponse> {
    const response = await this.api.get('/auth/devices');
    return response.data;
  }

  async revokeAllOtherDevices(): Promise<{ success: boolean }> {
    const response = await this.api.delete('/auth/devices');
    return response.data;
  }

  async revokeDevice(id: string): Promise<{ success: boolean }> {
    const response = await this.api.delete(`/auth/devices/${id}`);
    return response.data;
  }
}

export const securityService = new SecurityService();
