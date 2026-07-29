import { BaseService } from './base.service';

export interface DocumentUploadRequest {
  doc_type: 'national_id' | 'passport' | 'selfie' | 'proof_of_address';
  doc_url: string;
}

export type KycStatus = 'pending' | 'submitted' | 'under_review' | 'processing' | 'approved' | 'rejected' | 'idle';

export type KycStage =
  | 'not_started'
  | 'draft'
  | 'submitted'
  | 'identity_started'
  | 'in_review'
  | 'approved'
  | 'resubmit'
  | 'rejected';

export interface KycIntakeStatus {
  status: 'not_started' | 'draft' | 'submitted' | string;
  submitted_at?: string;
}

export interface KycIdentityStatus {
  status: 'not_started' | 'in_progress' | 'in_review' | 'approved' | 'rejected' | 'resubmit' | string;
  applicant_id?: string;
  review_answer?: 'GREEN' | 'RED' | string;
  reject_labels?: string[];
  moderation_comment?: string;
}

export interface KycStatusResponseData {
  status?: KycStatus;
  kycStatus?: KycStatus;
  kyc_status?: KycStatus;
  stage?: KycStage;
  intake?: KycIntakeStatus;
  identity?: KycIdentityStatus;
  rejectionReason?: string;
  rejection_reason?: string;
}

export interface IntakeCounterparty {
  country?: string;
  purpose?: string;
  relationship?: string;
}

export interface KYCIntakePayload {
  date_of_birth?: string;
  nationality?: string;
  bvn?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
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
  type: 'text' | 'date' | 'select' | 'country' | 'boolean' | 'repeatable' | 'counterparties' | string;
  required?: boolean;
  group?: 'identity' | 'address' | 'contact' | 'financial' | string;
  order?: number;
  options?: string[];
}

export interface DocumentSpec {
  key: string;
  label: string;
  help?: string;
  appliesTo?: string;
  applies_to?: string;
  required?: boolean;
  scope?: string;
  maxAgeMonths?: number;
  max_age_months?: number;
}

export interface IntakeRequirementsResponse {
  accountType?: 'business' | 'individual' | string;
  account_type?: 'business' | 'individual' | string;
  intakeStatus?: 'not_started' | 'draft' | 'submitted' | string;
  intake_status?: 'not_started' | 'draft' | 'submitted' | string;
  completed?: boolean;
  values?: Record<string, any>;
  fields?: IntakeFieldSpec[];
  documents?: DocumentSpec[];
  notes?: string[];
}

export class KycService extends BaseService {
  async submitDocument(payload: DocumentUploadRequest) {
    const response = await this.api.post('/kyc/documents', payload);
    return response.data;
  }

  async getKycStatus(): Promise<{ success: boolean; data: KycStatusResponseData }> {
    const response = await this.api.get('/kyc/status');
    return response.data;
  }

  async getKycRequirements(): Promise<{ success: boolean; data: IntakeRequirementsResponse }> {
    const response = await this.api.get('/kyc/requirements');
    return response.data;
  }

  async saveIntakeDraft(values: Record<string, any>) {
    const response = await this.api.put('/kyc/intake/draft', { values });
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

