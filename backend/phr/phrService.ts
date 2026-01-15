import axios from 'axios';
import { Config } from '../../src/config/env';
import type {
  ConsentArtifact,
  ConsentAuditEntry,
  ConsentRequest,
  ConsentRiskWarning,
  ConsentTemplate,
  EmergencyAccess,
  GranularDataSelection,
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

// Advanced Consent Mock Data (Category 4)
let mockConsentTemplates: ConsentTemplate[] = [
  {
    id: 'tmpl-001',
    name: 'Standard Treatment Consent',
    description: 'Default consent for treatment purposes with common data types',
    purpose: 'treatment',
    dataTypes: ['opd_prescription', 'lab_report', 'imaging'],
    defaultDuration: 30,
    granularSelection: false,
    autoApprove: false,
    requiresReview: true,
    createdDate: '2025-12-01',
    usageCount: 5,
  },
  {
    id: 'tmpl-002',
    name: 'Insurance Claim - Basic',
    description: 'Minimal data sharing for insurance claims',
    purpose: 'insurance',
    dataTypes: ['ipd_discharge_summary', 'lab_report'],
    defaultDuration: 60,
    granularSelection: true,
    autoApprove: false,
    requiresReview: true,
    createdDate: '2025-11-15',
    usageCount: 2,
  },
  {
    id: 'tmpl-003',
    name: 'Emergency Access',
    description: 'Quick emergency consent with full data access',
    purpose: 'emergency',
    dataTypes: ['opd_prescription', 'lab_report', 'imaging', 'ipd_discharge_summary', 'vaccination'],
    defaultDuration: 7,
    granularSelection: false,
    autoApprove: true,
    requiresReview: false,
    createdDate: '2026-01-01',
    usageCount: 1,
  },
];

let mockConsentAuditTrail: ConsentAuditEntry[] = [
  {
    id: 'audit-001',
    consentId: 'cons-art-001',
    action: 'created',
    timestamp: '2025-11-01T10:30:00Z',
    actor: 'Patient',
    actorType: 'patient',
    details: 'Consent request received from Apollo Hospital',
  },
  {
    id: 'audit-002',
    consentId: 'cons-art-001',
    action: 'approved',
    timestamp: '2025-11-01T14:45:00Z',
    actor: 'Patient',
    actorType: 'patient',
    details: 'Consent approved for treatment purpose',
  },
  {
    id: 'audit-003',
    consentId: 'cons-art-001',
    action: 'accessed',
    timestamp: '2025-11-05T09:15:00Z',
    actor: 'Apollo Hospital',
    actorType: 'provider',
    details: 'Health records accessed for treatment',
    dataAccessed: ['Discharge Summaries', 'Lab Reports'],
  },
  {
    id: 'audit-004',
    consentId: 'cons-art-001',
    action: 'accessed',
    timestamp: '2025-12-10T11:20:00Z',
    actor: 'Apollo Hospital',
    actorType: 'provider',
    details: 'Health records accessed for treatment',
    dataAccessed: ['Lab Reports'],
  },
  {
    id: 'audit-005',
    consentId: 'cons-art-001',
    action: 'accessed',
    timestamp: '2026-01-02T16:30:00Z',
    actor: 'Apollo Hospital',
    actorType: 'provider',
    details: 'Health records accessed for treatment',
    dataAccessed: ['Discharge Summaries'],
  },
];

let mockEmergencyAccess: EmergencyAccess = {
  id: 'emergency-001',
  enabled: true,
  emergencyContacts: [
    {
      id: 'ec-001',
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+91-9876543210',
      email: 'jane.doe@example.com',
      canAccessEmergencyData: true,
    },
    {
      id: 'ec-002',
      name: 'Dr. Emergency Services',
      relationship: 'Emergency Contact',
      phone: '+91-9123456789',
      canAccessEmergencyData: true,
    },
  ],
  accessLevel: 'basic',
  dataTypes: ['opd_prescription', 'lab_report', 'vaccination', 'surgery_note'],
  autoExpiry: true,
  expiryHours: 24,
  requiresOTP: true,
  auditTrail: [],
};


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

  // ========================================
  // ADVANCED CONSENT FEATURES (Category 4)
  // ========================================

  // Consent Templates
  async getConsentTemplates(): Promise<ConsentTemplate[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return mockConsentTemplates;
    }

    const response = await phrApi.get('/v1/phr/consent/templates');
    return response.data;
  },

  async createConsentTemplate(template: Omit<ConsentTemplate, 'id' | 'createdDate' | 'usageCount'>): Promise<ConsentTemplate> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(600);
      const newTemplate: ConsentTemplate = {
        ...template,
        id: `tmpl-${Date.now()}`,
        createdDate: new Date().toISOString(),
        usageCount: 0,
      };
      mockConsentTemplates.push(newTemplate);
      return newTemplate;
    }

    const response = await phrApi.post('/v1/phr/consent/templates', template);
    return response.data;
  },

  async deleteConsentTemplate(templateId: string): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(500);
      const index = mockConsentTemplates.findIndex(t => t.id === templateId);
      if (index !== -1) {
        mockConsentTemplates.splice(index, 1);
      }
      return true;
    }

    await phrApi.delete(`/v1/phr/consent/templates/${encodeURIComponent(templateId)}`);
    return true;
  },

  // Risk Analysis
  async analyzeConsentRisk(consentRequest: ConsentRequest): Promise<ConsentRiskWarning> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(800);

      // Mock risk analysis logic
      let level: ConsentRiskWarning['level'] = 'low';
      const reasons: string[] = [];
      const recommendations: string[] = [];

      // Check for sensitive data
      if (consentRequest.dataTypes.some(dt => dt.toLowerCase().includes('mental'))) {
        level = 'high';
        reasons.push('Includes sensitive mental health records');
        recommendations.push('Review data carefully before approval');
      }

      // Check expiry duration
      const expiryDate = new Date(consentRequest.expiryDate);
      const requestDate = new Date(consentRequest.requestDate);
      const durationDays = Math.ceil((expiryDate.getTime() - requestDate.getTime()) / (1000 * 60 * 60 * 24));

      if (durationDays > 90) {
        if (level === 'low') level = 'medium';
        reasons.push(`Long access duration (${durationDays} days)`);
        recommendations.push('Consider shorter consent duration');
      }

      // Check requester type
      if (consentRequest.requesterType === 'insurance') {
        if (level === 'low') level = 'medium';
        reasons.push('Sharing with insurance provider');
        recommendations.push('Verify necessity of all requested data types');
      }

      if (level === 'low') {
        return {
          level: 'low',
          message: 'This consent request appears safe',
          reasons: ['Standard data types', 'Reasonable duration', 'Trusted requester type'],
          recommendations: ['Review and approve if expected'],
        };
      }

      return {
        level,
        message: level === 'high'
          ? 'High risk - Review carefully before approval'
          : 'Medium risk - Please review the details',
        reasons,
        recommendations,
      };
    }

    const response = await phrApi.post('/v1/phr/consent/analyze-risk', { consentRequest });
    return response.data;
  },

  // Granular Consent Approval
  async approveConsentWithGranularSelection(
    consentId: string,
    selection: GranularDataSelection
  ): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(800);

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
          dataTypes: selection.dataTypes.map(dt =>
            dt.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          ),
          accessCount: 0,
        };
        mockConsentArtifacts = [art, ...mockConsentArtifacts];
        req.status = 'approved';

        // Add audit entry
        mockConsentAuditTrail.push({
          id: `audit-${Date.now()}`,
          consentId: art.id,
          action: 'approved',
          timestamp: new Date().toISOString(),
          actor: 'Patient',
          actorType: 'patient',
          details: `Approved with granular selection: ${selection.recordIds.length} records, ${selection.dataTypes.length} data types`,
        });
      }
      return true;
    }

    await phrApi.post(`/v1/phr/consent/${encodeURIComponent(consentId)}/approve-granular`, { selection });
    return true;
  },

  // Audit Trail
  async getConsentAuditTrail(consentId?: string): Promise<ConsentAuditEntry[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      if (consentId) {
        return mockConsentAuditTrail.filter(entry => entry.consentId === consentId);
      }
      return mockConsentAuditTrail;
    }

    const url = consentId
      ? `/v1/phr/consent/${encodeURIComponent(consentId)}/audit`
      : '/v1/phr/consent/audit';
    const response = await phrApi.get(url);
    return response.data;
  },

  // Emergency Access
  async getEmergencyAccessConfig(): Promise<EmergencyAccess> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return mockEmergencyAccess;
    }

    const response = await phrApi.get('/v1/phr/emergency-access');
    return response.data;
  },

  async updateEmergencyAccessConfig(config: Partial<EmergencyAccess>): Promise<EmergencyAccess> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(600);
      mockEmergencyAccess = {
        ...mockEmergencyAccess,
        ...config,
      };

      // Add audit entry
      mockConsentAuditTrail.push({
        id: `audit-${Date.now()}`,
        consentId: 'emergency',
        action: 'modified',
        timestamp: new Date().toISOString(),
        actor: 'Patient',
        actorType: 'patient',
        details: 'Updated emergency access configuration',
      });

      return mockEmergencyAccess;
    }

    const response = await phrApi.put('/v1/phr/emergency-access', config);
    return response.data;
  },

  async triggerEmergencyAccess(contactId: string, reason: string): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(1000);

      // Add audit entry for emergency access
      mockConsentAuditTrail.push({
        id: `audit-${Date.now()}`,
        consentId: 'emergency',
        action: 'accessed',
        timestamp: new Date().toISOString(),
        actor: contactId,
        actorType: 'system',
        details: `Emergency break-glass access triggered. Reason: ${reason}`,
      });

      return true;
    }

    await phrApi.post('/v1/phr/emergency-access/trigger', { contactId, reason });
    return true;
  },

  // Auto-Expiry Alerts
  async getExpiringConsents(daysThreshold: number = 7): Promise<ConsentArtifact[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      const today = new Date();
      const threshold = new Date(today);
      threshold.setDate(threshold.getDate() + daysThreshold);

      return mockConsentArtifacts.filter(consent => {
        if (consent.status !== 'active') return false;
        const expiryDate = new Date(consent.expiryDate);
        return expiryDate >= today && expiryDate <= threshold;
      });
    }

    const response = await phrApi.get(`/v1/phr/consent/expiring?days=${daysThreshold}`);
    return response.data;
  },
};
