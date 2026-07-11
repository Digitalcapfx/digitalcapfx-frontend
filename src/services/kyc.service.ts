import { BaseService } from './base.service';

export interface DocumentUploadRequest {
  doc_type: 'national_id' | 'passport' | 'selfie' | 'proof_of_address';
  doc_url: string;
}

export interface KycStatusResponseData {
  status: 'idle' | 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
}

export class KycService extends BaseService {
  async submitDocument(payload: DocumentUploadRequest) {
    const response = await this.api.post('/kyc/documents', payload);
    return response.data;
  }

  async getKycStatus() {
    const response = await this.api.get('/kyc/status');
    return response.data;
  }

  async getKycDocuments(): Promise<{ success: boolean; data: any[] }> {
    const response = await this.api.get('/kyc/documents');
    return response.data;
  }

  async initMetaMap() {
    const response = await this.api.post('/kyc/metamap/init');
    return response.data;
  }
}

export const kycService = new KycService();
