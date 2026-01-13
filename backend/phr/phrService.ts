import axios from 'axios';
import { Config } from '../../src/config/env';
import type {
  ConsentArtifact,
  ConsentRequest,
  HealthRecord,
  HealthRecordType,
  HealthTimeline,
  TimelineEvent,
} from '../types/phr';

/**
 * PHR (Personal Health Records) Service
 * Backend/service-layer version of the in-app implementation.
 *
 * NOTE:
 * - In DEV mode, returns deterministic mock data.
 * - In non-DEV mode, calls placeholder endpoints (to be wired to ABDM HIU/CM flows).
 */

const phrApi = axios.create({
  baseURL: Config.getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

const mockDelay = (ms: number = 1000) => new Promise<void>(resolve => setTimeout(resolve, ms));

const mapRecordToTimelineEventType = (recordType: HealthRecordType): TimelineEvent['type'] => {
  switch (recordType) {
    case 'opd_prescription':
      return 'prescription';
    case 'lab_report':
      return 'test';
    case 'ipd_discharge_summary':
      return 'admission';
    case 'vaccination':
      return 'vaccination';
    case 'imaging':
      return 'test';
    case 'surgery_note':
      return 'admission';
    case 'emergency_visit':
      return 'admission';
    case 'dental_record':
      return 'consultation';
    case 'mental_health_record':
      return 'consultation';
    default:
      return 'consultation';
  }
};

const buildTimelineFromRecords = (records: HealthRecord[]): HealthTimeline[] => {
  const byDate = new Map<string, TimelineEvent[]>();

  for (const r of records) {
    const date = r.date;
    const events = byDate.get(date) ?? [];

    const evt: TimelineEvent = {
      id: `evt-${r.id}`,
      type: mapRecordToTimelineEventType(r.type),
      title:
        r.type === 'opd_prescription'
          ? 'OPD Prescription'
          : r.type === 'ipd_discharge_summary'
            ? 'IPD Discharge'
            : r.type === 'lab_report'
              ? 'Lab Report'
              : r.type === 'imaging'
                ? 'Imaging'
                : r.type === 'vaccination'
                  ? 'Vaccination'
                  : r.type === 'surgery_note'
                    ? 'Surgery Note'
                    : r.type === 'emergency_visit'
                      ? 'Emergency Visit'
                      : r.type === 'dental_record'
                        ? 'Dental Record'
                        : r.type === 'mental_health_record'
                          ? 'Mental Health'
                          : 'Health Record',
      description: r.title,
      location: r.providerName || r.hospitalName,
      recordId: r.id,
    };

    events.push(evt);
    byDate.set(date, events);
  }

  return Array.from(byDate.entries())
    .map(([date, events]) => ({
      date,
      events: events.sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
};

export interface FamilyMember {
  abhaNumber: string;
  name: string;
  relationship: string;
  age: number;
}

// DEV MODE mock records (expanded sample so HealthRecordsScreen has meaningful data)
const mockHealthRecords: HealthRecord[] = [
  {
    id: 'rec-001',
    type: 'lab_report',
    title: 'Complete Blood Count (CBC)',
    date: '2026-01-10',
    hospitalName: 'Apollo Hospital',
    doctorName: 'Dr. Sarah Johnson',
    providerId: 'hfr-apollo-001',
    providerName: 'Apollo Hospital',
    visitId: 'visit-2026-01-10-apollo-opd-1',
    episodeId: 'episode-viral-fever-2026-01',
    episodeTitle: 'Viral Fever (Jan 2026)',
    conditionName: 'Fever',
    category: 'Pathology',
    tags: ['blood test', 'routine'],
    isLocal: false,
  },
  {
    id: 'rec-002',
    type: 'opd_prescription',
    title: 'OPD Prescription',
    date: '2026-01-08',
    hospitalName: 'Max Healthcare',
    doctorName: 'Dr. Rajesh Kumar',
    providerId: 'hfr-max-001',
    providerName: 'Max Healthcare',
    visitId: 'visit-2026-01-08-max-opd-1',
    episodeId: 'episode-viral-fever-2026-01',
    episodeTitle: 'Viral Fever (Jan 2026)',
    conditionName: 'Fever',
    category: 'General Medicine',
    tags: ['fever', 'medications'],
    isLocal: false,
  },
  {
    id: 'rec-003',
    type: 'imaging',
    title: 'X-Ray Chest (PA View)',
    date: '2026-01-09',
    hospitalName: 'Apollo Hospital',
    doctorName: 'Dr. Sarah Johnson',
    providerId: 'hfr-apollo-001',
    providerName: 'Apollo Hospital',
    visitId: 'visit-2026-01-10-apollo-opd-1',
    episodeId: 'episode-viral-fever-2026-01',
    episodeTitle: 'Viral Fever (Jan 2026)',
    conditionName: 'Cough',
    dicomStudyUrl:
      'https://dicom.example.org/viewer/studies/1.2.840.113619.2.55.3.604688433.781.1700000000.467',
    category: 'Radiology',
    tags: ['x-ray', 'dicom'],
    isLocal: false,
  },
  {
    id: 'rec-004',
    type: 'ipd_discharge_summary',
    title: 'IPD Discharge Summary',
    date: '2025-12-15',
    hospitalName: 'Fortis Hospital',
    doctorName: 'Dr. Priya Sharma',
    providerId: 'hfr-fortis-001',
    providerName: 'Fortis Hospital',
    visitId: 'visit-2025-12-10-fortis-ipd-1',
    episodeId: 'episode-appendectomy-2025-12',
    episodeTitle: 'Appendectomy (Dec 2025)',
    conditionName: 'Appendicitis',
    category: 'Surgery',
    tags: ['surgery', 'recovery'],
    isLocal: false,
  },
  {
    id: 'rec-005',
    type: 'mental_health_record',
    title: 'Mental Health Note (Confidential)',
    date: '2025-08-20',
    hospitalName: 'MindCare Clinic',
    doctorName: 'Dr. Kavya Rao',
    providerId: 'hfr-mh-001',
    providerName: 'MindCare Clinic',
    visitId: 'visit-2025-08-20-mh-1',
    episodeId: 'episode-anxiety-2025',
    episodeTitle: 'Anxiety (2025)',
    conditionName: 'Anxiety',
    category: 'Mental Health',
    tags: ['confidential'],
    sensitivity: 'sensitive',
    requiresExplicitUnlock: true,
    isLocal: false,
  },
];

const mockConsentRequests: ConsentRequest[] = [
  {
    id: 'cons-req-001',
    requesterId: 'hpr-doc-001',
    requesterName: 'Dr. Rajesh Kumar',
    requesterType: 'doctor',
    purpose: 'treatment',
    dataTypes: ['OPD Prescriptions', 'Lab Reports'],
    fromDate: '2025-12-01',
    toDate: '2026-01-31',
    expiryDate: '2026-02-15',
    status: 'pending',
    requestDate: '2026-01-12',
  },
];

let mockConsentArtifacts: ConsentArtifact[] = [
  {
    id: 'cons-art-001',
    consentId: 'cons-req-000',
    status: 'active',
    grantedDate: '2025-11-01',
    expiryDate: '2026-03-01',
    purpose: 'treatment',
    requesterName: 'Apollo Hospital',
    dataTypes: ['Discharge Summaries', 'Lab Reports'],
    accessCount: 3,
    lastAccessedDate: '2026-01-02',
  },
];

let mockFamilyMembers: FamilyMember[] = [
  { abhaNumber: '98-7654-3210-0001', name: 'Emma Doe', relationship: 'child', age: 7 },
  { abhaNumber: '98-7654-3210-0002', name: 'Jane Doe', relationship: 'spouse', age: 32 },
];

export const phrService = {
  // ========================================
  // Health Records (Category 2)
  // ========================================
  async getHealthRecords(_abhaNumber?: string): Promise<HealthRecord[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return mockHealthRecords;
    }

    const response = await phrApi.get('/v1/phr/records');
    return response.data;
  },

  async getHealthTimeline(abhaNumber?: string): Promise<HealthTimeline[]> {
    const records = await this.getHealthRecords(abhaNumber);
    return buildTimelineFromRecords(records);
  },

  // ========================================
  // Consent Management (Category 2)
  // ========================================
  async getConsentRequests(_abhaNumber?: string): Promise<ConsentRequest[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return mockConsentRequests;
    }

    const response = await phrApi.get('/v1/phr/consent/requests');
    return response.data;
  },

  async getActiveConsents(_abhaNumber?: string): Promise<ConsentArtifact[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return mockConsentArtifacts.filter(c => c.status === 'active');
    }

    const response = await phrApi.get('/v1/phr/consent/artifacts');
    return response.data;
  },

  // Kept for backward compatibility if older screens call this name
  async getConsentArtifacts(_abhaNumber?: string): Promise<ConsentArtifact[]> {
    return this.getActiveConsents(_abhaNumber);
  },

  async approveConsent(consentId: string): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(600);

      // move from request -> artifact
      const req = mockConsentRequests.find(r => r.id === consentId);
      if (req) {
        const art: ConsentArtifact = {
          id: `cons-art-${Date.now()}`,
          consentId: req.id,
          status: 'active',
          grantedDate: new Date().toISOString().slice(0, 10),
          expiryDate: req.expiryDate,
          purpose: req.purpose,
          requesterName: req.requesterName,
          dataTypes: req.dataTypes,
          accessCount: 0,
        };
        mockConsentArtifacts = [art, ...mockConsentArtifacts];
        // mark request approved locally
        req.status = 'approved';
      }
      return true;
    }

    await phrApi.post(`/v1/phr/consent/${encodeURIComponent(consentId)}/approve`);
    return true;
  },

  async denyConsent(consentId: string, reason?: string): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(600);
      const req = mockConsentRequests.find(r => r.id === consentId);
      if (req) req.status = 'denied';
      return true;
    }

    await phrApi.post(`/v1/phr/consent/${encodeURIComponent(consentId)}/deny`, { reason });
    return true;
  },

  async revokeConsent(consentId: string): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(600);
      mockConsentArtifacts = mockConsentArtifacts.map(a =>
        a.id === consentId || a.consentId === consentId ? { ...a, status: 'revoked' } : a
      );
      return true;
    }

    await phrApi.post(`/v1/phr/consent/${encodeURIComponent(consentId)}/revoke`);
    return true;
  },

  // ========================================
  // Family Management (Category 1/2 supporting)
  // ========================================
  async getFamilyMembers(_abhaNumber?: string): Promise<FamilyMember[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return mockFamilyMembers;
    }

    const response = await phrApi.get('/v1/phr/family');
    return response.data;
  },

  async linkFamilyMember(_abhaNumber: string, memberAbhaNumber: string, relationship: string): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(800);
      mockFamilyMembers = [
        ...mockFamilyMembers,
        {
          abhaNumber: memberAbhaNumber,
          name: 'Linked Member',
          relationship,
          age: 30,
        },
      ];
      return true;
    }

    await phrApi.post('/v1/phr/family/link', { memberAbhaNumber, relationship });
    return true;
  },
};
