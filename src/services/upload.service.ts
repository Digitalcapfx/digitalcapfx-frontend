import { BaseService } from './base.service';

export interface UploadResult {
  bucket: string;
  mimeType: string;
  object: string;
  purpose: string;
  readUrl: string;
  uri: string;
}

export interface UploadResponse {
  success: boolean;
  data?: UploadResult;
  error?: any;
}

export class UploadService extends BaseService {
  async uploadFile(file: File, purpose: 'kyc' | 'avatar' | 'document' | 'business' | 'misc'): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);

    // Call the dedicated file upload API route directly
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const resData = await response.json();

    // Map snake_case response fields back to camelCase for type compatibility
    if (resData?.success && resData?.data) {
      const d = resData.data;
      resData.data = {
        bucket: d.bucket,
        mimeType: d.mime_type,
        object: d.object,
        purpose: d.purpose,
        readUrl: d.read_url,
        uri: d.uri,
      };
    }

    return resData;
  }

  async getSignedReadUrl(objectPath: string): Promise<{ success: boolean; data?: { readUrl: string } }> {
    const response = await this.api.get('/uploads/read-url', {
      params: { object: objectPath },
    });
    return response.data;
  }
}

export const uploadService = new UploadService();
