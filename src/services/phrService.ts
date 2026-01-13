/**
 * PHR (Personal Health Records) Service
 * Manages patient health records, consent, and data sharing
 * ABDM Compliant - Patient-First Architecture
 */

import axios from 'axios';
import { Config } from '../config/env';

// Types
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

    // Grouping metadata (PHR Core)
    conditionName?: string; // condition-wise grouping (e.g., Diabetes)
    visitId?: string; // visit-wise grouping (OPD/ER encounter)
    providerId?: string; // provider-wise grouping (HPR/HFR reference)
    providerName?: string; // user-facing provider label
    episodeId?: string; // episode-of-care grouping
    episodeTitle?: string;

    // Content / links
    fileUrl?: string;
    thumbnail?: string;

    // Imaging (DICOM)
    dicomStudyUrl?: string; // viewer link (no DICOM stored in-app)

    // Mental health controls
    sensitivity?: 'standard' | 'sensitive';
    requiresExplicitUnlock?: boolean;

    category: string;
    tags: string[];
    isLocal: boolean; // User uploaded vs ABDM fetched
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

export interface HealthTimeline {
    date: string;
    events: TimelineEvent[];
}

export interface TimelineEvent {
    id: string;
    type: 'consultation' | 'test' | 'prescription' | 'admission' | 'vaccination';
    title: string;
    description: string;
    location: string;
    recordId?: string;
}

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

// Mock data for development
const mockDelay = (ms: number = 1000) => new Promise<void>(resolve => setTimeout(resolve, ms));

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
        tags: ['fever', 'antibiotics'],
        isLocal: false,
    },
    {
        id: 'rec-003',
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
        id: 'rec-004',
        type: 'vaccination',
        title: 'COVID-19 Booster Dose',
        date: '2025-11-20',
        hospitalName: 'Government Hospital',
        providerId: 'hfr-govt-001',
        providerName: 'Government Hospital',
        visitId: 'visit-2025-11-20-govt-vax-1',
        episodeId: 'episode-immunization-2025',
        episodeTitle: 'Immunization (2025)',
        conditionName: 'Preventive Care',
        category: 'Immunization',
        tags: ['vaccination', 'covid'],
        isLocal: false,
    },
    {
        id: 'rec-005',
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
        dicomStudyUrl: 'https://dicom.example.org/viewer/studies/1.2.840.113619.2.55.3.604688433.781.1700000000.467',
        category: 'Radiology',
        tags: ['x-ray', 'dicom'],
        isLocal: false,
    },
    {
        id: 'rec-006',
        type: 'surgery_note',
        title: 'Operative Note: Laparoscopic Appendectomy',
        date: '2025-12-12',
        hospitalName: 'Fortis Hospital',
        doctorName: 'Dr. Priya Sharma',
        providerId: 'hfr-fortis-001',
        providerName: 'Fortis Hospital',
        visitId: 'visit-2025-12-10-fortis-ipd-1',
        episodeId: 'episode-appendectomy-2025-12',
        episodeTitle: 'Appendectomy (Dec 2025)',
        conditionName: 'Appendicitis',
        category: 'Surgery',
        tags: ['operative note', 'laparoscopy'],
        isLocal: false,
    },
    {
        id: 'rec-007',
        type: 'emergency_visit',
        title: 'Emergency Visit Summary',
        date: '2025-10-05',
        hospitalName: 'City Emergency Center',
        doctorName: 'Dr. Neha Singh',
        providerId: 'hfr-er-001',
        providerName: 'City Emergency Center',
        visitId: 'visit-2025-10-05-er-1',
        episodeId: 'episode-dehydration-2025-10',
        episodeTitle: 'Acute Dehydration (Oct 2025)',
        conditionName: 'Dehydration',
        category: 'Emergency',
        tags: ['er', 'iv fluids'],
        isLocal: false,
    },
    {
        id: 'rec-008',
        type: 'dental_record',
        title: 'Dental Procedure Note: Filling',
        date: '2025-09-12',
        hospitalName: 'Smile Dental Clinic',
        doctorName: 'Dr. Anil Mehta',
        providerId: 'hfr-dental-001',
        providerName: 'Smile Dental Clinic',
        visitId: 'visit-2025-09-12-dental-1',
        episodeId: 'episode-dental-caries-2025',
        episodeTitle: 'Dental Caries (2025)',
        conditionName: 'Dental Caries',
        category: 'Dental',
        tags: ['dental', 'restoration'],
        isLocal: false,
    },
    {
        id: 'rec-009',
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
        sensitivity: 'sensitive',
        requiresExplicitUnlock: true,
        category: 'Mental Health',
        tags: ['mental health', 'confidential'],
        isLocal: false,
    },
];

const mockConsentRequests: ConsentRequest[] = [
    {
        id: 'consent-001',
        requesterId: 'hpr-dr-001',
        requesterName: 'Dr. Sarah Johnson',
        requesterType: 'doctor',
        purpose: 'treatment',
        dataTypes: ['Prescriptions', 'Lab Reports', 'Imaging'],
        fromDate: '2026-01-01',
        toDate: '2026-06-30',
        expiryDate: '2026-06-30',
        status: 'pending',
        requestDate: '2026-01-13',
    },
    {
        id: 'consent-002',
        requesterId: 'hfr-hosp-001',
        requesterName: 'Apollo Hospital',
        requesterType: 'hospital',
        purpose: 'treatment',
        dataTypes: ['All Records'],
        fromDate: '2026-01-10',
        toDate: '2026-12-31',
        expiryDate: '2026-12-31',
        status: 'pending',
        requestDate: '2026-01-12',
    },
];

const mockActiveConsents: ConsentArtifact[] = [
    {
        id: 'artifact-001',
        consentId: 'consent-100',
        status: 'active',
        grantedDate: '2025-12-01',
        expiryDate: '2026-06-01',
        purpose: 'treatment',
        requesterName: 'Dr. Rajesh Kumar',
        dataTypes: ['Prescriptions', 'Lab Reports'],
        accessCount: 5,
        lastAccessedDate: '2026-01-08',
    },
];

export const phrService = {
    // ========================================
    // Health Records Management
    // ========================================

    /**
     * Fetch all health records for the patient
     */
    async getHealthRecords(abhaNumber: string): Promise<HealthRecord[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(800);
            console.log('🔧 DEV MODE: Fetching health records for:', abhaNumber);
            return mockHealthRecords;
        }

        try {
            // Real ABDM API call
            const response = await axios.get(`${Config.getBaseUrl()}/v1/patients/health-records`, {
                headers: { 'X-ABHA-Number': abhaNumber },
            });
            return response.data.records;
        } catch (error) {
            console.error('Error fetching health records:', error);
            throw error;
        }
    },

    /**
     * Get records by category
     */
    async getRecordsByCategory(category: string): Promise<HealthRecord[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(500);
            const filtered = mockHealthRecords.filter(r => r.category === category);
            return filtered;
        }

        // Real API implementation
        return [];
    },

    /**
     * Get records by type
     */
    async getRecordsByType(type: HealthRecord['type']): Promise<HealthRecord[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(500);
            const filtered = mockHealthRecords.filter(r => r.type === type);
            return filtered;
        }

        // Real API implementation
        return [];
    },

    /**
     * Upload a new health record
     */
    async uploadRecord(
        abhaNumber: string,
        file: any,
        metadata: Partial<HealthRecord>
    ): Promise<HealthRecord> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(1500);
            console.log('🔧 DEV MODE: Uploading record:', metadata);
            return {
                id: 'rec-' + Date.now(),
                type: metadata.type || 'other',
                title: metadata.title || 'Uploaded Document',
                date: new Date().toISOString().split('T')[0],
                hospitalName: metadata.hospitalName || 'Self Uploaded',
                category: metadata.category || 'General',
                tags: metadata.tags || [],
                isLocal: true,
            };
        }

        // Real API implementation with file upload
        return {} as HealthRecord;
    },

    /**
     * Delete a health record
     */
    async deleteRecord(recordId: string): Promise<boolean> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(500);
            console.log('🔧 DEV MODE: Deleting record:', recordId);
            return true;
        }

        // Real API implementation
        return false;
    },

    /**
     * Download a health record
     */
    async downloadRecord(recordId: string): Promise<string> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(1000);
            console.log('🔧 DEV MODE: Downloading record:', recordId);
            return 'mock-file-url';
        }

        // Real API implementation
        return '';
    },

    // ========================================
    // Consent Management (Critical for ABDM)
    // ========================================

    /**
     * Get pending consent requests
     */
    async getConsentRequests(abhaNumber: string): Promise<ConsentRequest[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(800);
            console.log('🔧 DEV MODE: Fetching consent requests');
            return mockConsentRequests;
        }

        try {
            const response = await axios.get(`${Config.getBaseUrl()}/v1/consents/requests`, {
                headers: { 'X-ABHA-Number': abhaNumber },
            });
            return response.data.requests;
        } catch (error) {
            console.error('Error fetching consent requests:', error);
            throw error;
        }
    },

    /**
     * Approve a consent request
     */
    async approveConsent(
        consentId: string,
        customizations?: {
            dataTypes?: string[];
            expiryDate?: string;
        }
    ): Promise<ConsentArtifact> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(1000);
            console.log('🔧 DEV MODE: Approving consent:', consentId);
            return {
                id: 'artifact-' + Date.now(),
                consentId,
                status: 'active',
                grantedDate: new Date().toISOString().split('T')[0],
                expiryDate: customizations?.expiryDate || '2026-12-31',
                purpose: 'treatment',
                requesterName: 'Healthcare Provider',
                dataTypes: customizations?.dataTypes || ['All Records'],
                accessCount: 0,
            };
        }

        // Real ABDM API call
        return {} as ConsentArtifact;
    },

    /**
     * Deny a consent request
     */
    async denyConsent(consentId: string, reason?: string): Promise<boolean> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(800);
            console.log('🔧 DEV MODE: Denying consent:', consentId, reason);
            return true;
        }

        // Real API implementation
        return false;
    },

    /**
     * Get active consent artifacts
     */
    async getActiveConsents(abhaNumber: string): Promise<ConsentArtifact[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(600);
            return mockActiveConsents;
        }

        try {
            const response = await axios.get(`${Config.getBaseUrl()}/v1/consents/artifacts`, {
                headers: { 'X-ABHA-Number': abhaNumber },
            });
            return response.data.consents;
        } catch (error) {
            console.error('Error fetching active consents:', error);
            throw error;
        }
    },

    /**
     * Revoke an active consent
     */
    async revokeConsent(consentId: string): Promise<boolean> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(800);
            console.log('🔧 DEV MODE: Revoking consent:', consentId);
            return true;
        }

        // Real ABDM API call
        return false;
    },

    // ========================================
    // Health Timeline
    // ========================================

    /**
     * Get chronological health timeline
     */
    async getHealthTimeline(abhaNumber: string, year?: number): Promise<HealthTimeline[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(1000);
            console.log('🔧 DEV MODE: Building lifetime timeline for:', abhaNumber, year ? `year=${year}` : '');

            const base = year
                ? mockHealthRecords.filter(r => r.date.startsWith(String(year)))
                : mockHealthRecords;

            return buildTimelineFromRecords(base);
        }

        // Real API implementation
        return [];
    },

    // ========================================
    // Search & Filter
    // ========================================

    /**
     * Search health records
     */
    async searchRecords(query: string): Promise<HealthRecord[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(500);
            const results = mockHealthRecords.filter(
                r =>
                    r.title.toLowerCase().includes(query.toLowerCase()) ||
                    r.hospitalName.toLowerCase().includes(query.toLowerCase()) ||
                    r.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            );
            return results;
        }

        // Real API implementation
        return [];
    },

    // ========================================
    // Family Management
    // ========================================

    /**
     * Link family member ABHA
     */
    async linkFamilyMember(
        primaryAbha: string,
        familyAbha: string,
        relationship: string
    ): Promise<boolean> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(1000);
            console.log('🔧 DEV MODE: Linking family member:', familyAbha, relationship);
            return true;
        }

        // Real API implementation
        return false;
    },

    /**
     * Get linked family members
     */
    async getFamilyMembers(abhaNumber: string): Promise<any[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(600);
            return [
                {
                    abhaNumber: '98-7654-3210-9876',
                    name: 'John Doe Jr.',
                    relationship: 'child',
                    age: 8,
                },
            ];
        }

        // Real API implementation
        return [];
    },

    // ========================================
    // Emergency Access (Break-Glass)
    // ========================================

    /**
     * Set emergency contacts
     */
    async setEmergencyContacts(abhaNumber: string, contacts: any[]): Promise<boolean> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(500);
            console.log('🔧 DEV MODE: Setting emergency contacts:', contacts);
            return true;
        }

        // Real API implementation
        return false;
    },

    /**
     * Grant temporary emergency access
     */
    async grantEmergencyAccess(
        abhaNumber: string,
        providerId: string,
        duration: number
    ): Promise<boolean> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(800);
            console.log('🔧 DEV MODE: Granting emergency access:', providerId, duration);
            return true;
        }

        // Real API implementation
        return false;
    },

    // ========================================
    // Notifications
    // ========================================

    /**
     * Get notifications
     */
    async getNotifications(abhaNumber: string): Promise<any[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(500);
            return [
                {
                    id: 'notif-001',
                    type: 'consent_request',
                    title: 'New Consent Request',
                    message: 'Dr. Sarah Johnson has requested access to your health records',
                    date: '2026-01-13',
                    read: false,
                },
                {
                    id: 'notif-002',
                    type: 'new_record',
                    title: 'New Lab Report Available',
                    message: 'Your CBC report from Apollo Hospital is now available',
                    date: '2026-01-10',
                    read: true,
                },
            ];
        }

        // Real API implementation
        return [];
    },
};
