import { BaseService } from './base.service';

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  nationality?: string;
  avatar_url?: string;
  bio?: string;
}

export interface ProfileResponseData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  is_email_verified: boolean;
  kyc_status: 'idle' | 'pending' | 'approved' | 'rejected';
  date_of_birth?: string;
  nationality?: string;
  avatar_url?: string;
  bio?: string;
}

export class ProfileService extends BaseService {
  async getProfile() {
    const response = await this.api.get('/profile');
    return response.data;
  }

  async updateProfile(payload: UpdateProfileRequest) {
    const response = await this.api.patch('/profile', payload);
    return response.data;
  }
}

export const profileService = new ProfileService();
