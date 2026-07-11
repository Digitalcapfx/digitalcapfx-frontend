import { BaseService } from './base.service';

export interface ReferralDetails {
  referralCode: string;
  rewardPoints: number;
  referredUsersCount: number;
}

export interface PointsLedgerItem {
  id: string;
  points: number;
  description: string;
  type: 'credit' | 'debit';
  createdAt: string;
}

export interface ReferralResponse {
  success: boolean;
  data: ReferralDetails;
}

export interface LedgerResponse {
  success: boolean;
  data: PointsLedgerItem[];
}

export class ReferralService extends BaseService {
  async getReferralDetails(): Promise<ReferralResponse> {
    const response = await this.api.get('/referrals');
    return response.data;
  }

  async getPointsLedger(): Promise<LedgerResponse> {
    const response = await this.api.get('/referrals/points/ledger');
    return response.data;
  }
}

export const referralService = new ReferralService();
