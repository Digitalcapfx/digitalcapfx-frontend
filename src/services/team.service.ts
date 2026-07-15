import { BaseService } from './base.service';

export interface TeamMember {
  id: string;
  businessUserId: string;
  staffUserId?: string;
  email: string;
  role: 'manager' | 'developer' | 'viewer';
  status: 'pending' | 'active';
  inviteToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMembersResponse {
  success: boolean;
  data: TeamMember[];
  error?: any;
}

export interface TeamInviteResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    role: string;
    status: string;
    inviteToken: string;
  };
  error?: any;
}

export class TeamService extends BaseService {
  async getTeamMembers(): Promise<TeamMembersResponse> {
    const response = await this.api.get('/team');
    return response.data;
  }

  async inviteTeamMember(email: string, role: string): Promise<TeamInviteResponse> {
    const response = await this.api.post('/team/invite', { email, role });
    return response.data;
  }

  async updateMemberRole(id: string, role: string): Promise<any> {
    const response = await this.api.put(`/team/${id}/role`, { role });
    return response.data;
  }

  async removeTeamMember(id: string): Promise<any> {
    const response = await this.api.delete(`/team/${id}`);
    return response.data;
  }
}

export const teamService = new TeamService();
