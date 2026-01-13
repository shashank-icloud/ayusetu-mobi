/**
 * PHR (Personal Health Records) Service
 * Manages patient health records, consent, and data sharing
 * ABDM Compliant - Patient-First Architecture
 */

import axios from 'axios';
import { Config } from '../config/env';

// Types
export interface HealthRecord {
    id: string;
    type: 'prescription' | 'lab_report' | 'discharge_summary' | 'imaging' | 'vaccination' | 'other';
    title: string;
    date: string;
    hospitalName: string;
    doctorName?: string;
    fileUrl?: string;
    thumbnail?: string;
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
        category: 'Pathology',
        tags: ['blood test', 'routine'],
        isLocal: false,
    },
    {
        id: 'rec-002',
        type: 'prescription',
        title: 'Consultation Prescription',
        date: '2026-01-08',
        hospitalName: 'Max Healthcare',
        doctorName: 'Dr. Rajesh Kumar',
        category: 'General Medicine',
        tags: ['fever', 'antibiotics'],
        isLocal: false,
    },
    {
        id: 'rec-003',
        type: 'discharge_summary',
        title: 'Hospital Discharge Summary',
        date: '2025-12-15',
        hospitalName: 'Fortis Hospital',
        doctorName: 'Dr. Priya Sharma',
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
        category: 'Immunization',
        tags: ['vaccination', 'covid'],
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
            const mockTimeline: HealthTimeline[] = [
                {
                    date: '2026-01-10',
                    events: [
                        {
                            id: 'evt-001',
                            type: 'test',
                            title: 'Blood Test',
                            description: 'Complete Blood Count (CBC)',
                            location: 'Apollo Hospital',
                            recordId: 'rec-001',
                        },
                    ],
                },
                {
                    date: '2026-01-08',
                    events: [
                        {
                            id: 'evt-002',
                            type: 'consultation',
                            title: 'Doctor Consultation',
                            description: 'General check-up for fever',
                            location: 'Max Healthcare',
                            recordId: 'rec-002',
                        },
                    ],
                },
            ];
            return mockTimeline;
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
