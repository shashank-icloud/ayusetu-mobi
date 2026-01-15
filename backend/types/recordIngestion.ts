export type RecordSource =
  | 'abdm_hospital'
  | 'abdm_lab'
  | 'abdm_pharmacy'
  | 'abdm_telemedicine'
  | 'abdm_insurance'
  | 'manual_upload'
  | 'camera_scan';

export type UploadFileType = 'pdf' | 'image' | 'dicom';

export interface UploadedRecord {
  id: string;
  fileName: string;
  fileType: UploadFileType;
  fileSize: number;
  uploadedAt: string;
  source: RecordSource;

  // Processing status
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  ocrText?: string;
  summary?: string;
  keywords?: string[];

  // Manual metadata
  tags?: string[];
  notes?: string;
  folder?: string;

  // Linked to health record (if converted)
  healthRecordId?: string;
}

export interface RecordFolder {
  id: string;
  name: string;
  color: string;
  recordCount: number;
  createdAt: string;
}

export interface AutoSyncStatus {
  providerId: string;
  providerName: string;
  providerType: 'hospital' | 'lab' | 'pharmacy' | 'telemedicine' | 'insurance';
  isEnabled: boolean;
  lastSyncAt?: string;
  recordCount: number;
}
