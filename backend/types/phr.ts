export type HealthRecordType =
  | 'opd_prescription'
  | 'ipd_discharge_summary'
  | 'lab_report'
  | 'imaging'
  | 'vaccination'
  | 'surgery_note'
  | 'emergency_visit'
  | 'dental_record'
  | 'mental_health_record'
  | 'other';

export interface HealthRecord {
  id: string;
  type: HealthRecordType;
  title: string;
  date: string; // ISO YYYY-MM-DD

  hospitalName: string;
  doctorName?: string;

  conditionName?: string;
  visitId?: string;
  providerId?: string;
  providerName?: string;
  episodeId?: string;
  episodeTitle?: string;

  fileUrl?: string;
  thumbnail?: string;

  dicomStudyUrl?: string;

  sensitivity?: 'standard' | 'sensitive';
  requiresExplicitUnlock?: boolean;

  category: string;
  tags: string[];
  isLocal: boolean;
}

export interface TimelineEvent {
  id: string;
  type: 'consultation' | 'test' | 'prescription' | 'admission' | 'vaccination';
  title: string;
  description: string;
  location: string;
  recordId?: string;
}

export interface HealthTimeline {
  date: string;
  events: TimelineEvent[];
}

export interface ConsentRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterType: 'doctor' | 'hospital' | 'lab' | 'insurance';
  purpose: 'treatment' | 'insurance' | 'research' | 'emergency';
  dataTypes: string[];
  fromDate: string;
  toDate: string;
  expiryDate: string;
  status: 'pending' | 'approved' | 'denied' | 'expired' | 'revoked';
  requestDate: string;
}

export interface ConsentArtifact {
  id: string;
  consentId: string;
  status: 'active' | 'expired' | 'revoked';
  grantedDate: string;
  expiryDate: string;
  purpose: string;
  requesterName: string;
  dataTypes: string[];
  accessCount: number;
  lastAccessedDate?: string;
}
