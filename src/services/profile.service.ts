import { BaseService } from './base.service';

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  nationality?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface ProfileResponseData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  kycStatus: 'idle' | 'pending' | 'approved' | 'rejected';
  accountType?: 'individual' | 'business';
  companyLegalName?: string;
  dateOfBirth?: string;
  nationality?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface ProfileResponse {
  success: boolean;
  data?: ProfileResponseData;
  error?: any;
}

export class ProfileService extends BaseService {
  async getProfile(): Promise<ProfileResponse> {
    const response = await this.api.get('/profile');
    return response.data;
  }

  async updateProfile(payload: UpdateProfileRequest): Promise<ProfileResponse> {
    const response = await this.api.patch('/profile', payload);
    return response.data;
  }
}

export const profileService = new ProfileService();
