import { BaseService } from './base.service';

export interface DocumentUploadRequest {
  doc_type: 'national_id' | 'passport' | 'selfie' | 'proof_of_address';
  doc_url: string;
}

export type KycStatus = 'pending' | 'submitted' | 'under_review' | 'processing' | 'approved' | 'rejected' | 'idle';

export interface KycStatusResponseData {
  status?: KycStatus;
  kycStatus?: KycStatus;
  kyc_status?: KycStatus;
  rejectionReason?: string;
  rejection_reason?: string;
}

export interface IntakeCounterparty {
  country?: string;
  purpose?: string;
  relationship?: string;
}

export interface KYCIntakePayload {
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  nationality?: string;
  date_of_birth?: string;
  occupation?: string;
  source_of_funds?: string;
  purpose_of_account?: string;
  contact_email?: string;
  contact_phone?: string;
  is_importer?: boolean;
  top_3_counterparties?: IntakeCounterparty[];
  [key: string]: any;
}

export interface IntakeFieldSpec {
  key: string;
  label: string;
  help?: string;
  type: string;
  required?: boolean;
  options?: string[];
}

export interface DocumentSpec {
  key: string;
  label: string;
  help?: string;
  applies_to?: string;
  required?: boolean;
  scope?: string;
  max_age_months?: number;
}

export interface IntakeRequirementsResponse {
  account_type?: string;
  completed?: boolean;
  documents?: DocumentSpec[];
  fields?: IntakeFieldSpec[];
  notes?: string[];
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

  async getKycRequirements(): Promise<any> {
    const response = await this.api.get('/kyc/requirements');
    return response.data;
  }

  async submitIntake(payload: KYCIntakePayload) {
    const response = await this.api.post('/kyc/intake', payload);
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

  async initKyc() {
    const response = await this.api.post('/kyc/init');
    return response.data;
  }
}

export const kycService = new KycService();
