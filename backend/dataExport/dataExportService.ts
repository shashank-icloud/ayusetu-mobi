// Data Export & Portability Service - Category 13
// Mock implementation for ABDM-compliant data export and health reports

import { Config } from '../../src/config/env';
import {
    ExportRequest,
    ExportHistory,
    ExportStatus,
    FHIRExportResponse,
    FHIRBundleEntry,
    ReportTemplate,
    CustomReportRequest,
    GeneratedReport,
    ShareExportRequest,
    ShareLink,
    ExportStatistics,
    DataExportConsent,
    RecordType,
    ExportFormat,
} from '../types/dataExport';

// Mock Data
const mockExportHistory: ExportHistory[] = [
    {
        id: 'exp-001',
        userId: 'user-001',
        format: 'pdf',
        recordTypes: ['medical_records', 'lab_results'],
        dateRange: {
            startDate: '2025-01-01',
            endDate: '2026-01-15',
        },
        status: 'completed',
        fileSize: 2457600, // 2.4 MB
        downloadUrl: 'https://storage.example.com/exports/exp-001.pdf',
        expiresAt: '2026-01-22T00:00:00Z',
        createdAt: '2026-01-15T10:30:00Z',
        completedAt: '2026-01-15T10:31:45Z',
    },
    {
        id: 'exp-002',
        userId: 'user-001',
        format: 'fhir',
        recordTypes: ['all'],
        dateRange: {
            startDate: '2024-01-01',
            endDate: '2025-12-31',
        },
        status: 'completed',
        fileSize: 5242880, // 5 MB
        downloadUrl: 'https://storage.example.com/exports/exp-002.json',
        expiresAt: '2026-01-20T00:00:00Z',
        createdAt: '2026-01-13T14:20:00Z',
        completedAt: '2026-01-13T14:23:15Z',
    },
    {
        id: 'exp-003',
        userId: 'user-001',
        format: 'csv',
        recordTypes: ['lab_results'],
        dateRange: {
            startDate: '2025-06-01',
            endDate: '2025-12-31',
        },
        status: 'expired',
        fileSize: 102400, // 100 KB
        expiresAt: '2026-01-10T00:00:00Z',
        createdAt: '2026-01-03T09:15:00Z',
        completedAt: '2026-01-03T09:15:30Z',
    },
];

const mockReportTemplates: ReportTemplate[] = [
    {
        id: 'template-diabetes',
        name: 'Diabetes Management Report',
        description: 'Comprehensive diabetes tracking with glucose trends and HbA1c',
        category: 'diabetes',
        icon: '🩺',
        color: '#e91e63',
        sections: [
            {
                id: 'sec-glucose',
                title: 'Blood Glucose Trends',
                type: 'trends',
                dataPoints: ['fasting_glucose', 'pp_glucose', 'random_glucose'],
                chartType: 'line',
                includeByDefault: true,
            },
            {
                id: 'sec-hba1c',
                title: 'HbA1c Levels',
                type: 'lab_results',
                dataPoints: ['hba1c'],
                chartType: 'line',
                includeByDefault: true,
            },
            {
                id: 'sec-medications',
                title: 'Current Medications',
                type: 'medications',
                dataPoints: ['diabetes_medications'],
                includeByDefault: true,
            },
        ],
    },
    {
        id: 'template-cardiac',
        name: 'Cardiac Health Report',
        description: 'Heart health monitoring with BP, cholesterol, and ECG results',
        category: 'cardiac',
        icon: '❤️',
        color: '#f44336',
        sections: [
            {
                id: 'sec-bp',
                title: 'Blood Pressure Trends',
                type: 'vitals',
                dataPoints: ['systolic_bp', 'diastolic_bp'],
                chartType: 'line',
                includeByDefault: true,
            },
            {
                id: 'sec-lipid',
                title: 'Lipid Profile',
                type: 'lab_results',
                dataPoints: ['total_cholesterol', 'ldl', 'hdl', 'triglycerides'],
                chartType: 'bar',
                includeByDefault: true,
            },
            {
                id: 'sec-ecg',
                title: 'ECG Results',
                type: 'lab_results',
                dataPoints: ['ecg'],
                includeByDefault: false,
            },
        ],
    },
    {
        id: 'template-annual',
        name: 'Annual Health Summary',
        description: 'Complete health overview for the year',
        category: 'annual',
        icon: '📊',
        color: '#2196f3',
        sections: [
            {
                id: 'sec-vitals-annual',
                title: 'Vital Statistics',
                type: 'vitals',
                dataPoints: ['weight', 'bmi', 'bp', 'heart_rate'],
                chartType: 'line',
                includeByDefault: true,
            },
            {
                id: 'sec-labs-annual',
                title: 'Lab Test Summary',
                type: 'lab_results',
                dataPoints: ['all_labs'],
                chartType: 'table',
                includeByDefault: true,
            },
            {
                id: 'sec-appointments',
                title: 'Medical Consultations',
                type: 'summary',
                dataPoints: ['appointments', 'diagnoses'],
                includeByDefault: true,
            },
        ],
    },
];

const mockFHIRBundle: FHIRExportResponse = {
    resourceType: 'Bundle',
    type: 'collection',
    total: 3,
    timestamp: new Date().toISOString(),
    entry: [
        {
            resource: {
                resourceType: 'Patient',
                id: 'patient-001',
                meta: {
                    lastUpdated: '2026-01-15T00:00:00Z',
                },
                identifier: [
                    {
                        system: 'https://healthid.ndhm.gov.in',
                        value: '91-1234-5678-9012',
                    },
                ],
                name: [
                    {
                        text: 'Rajesh Kumar',
                        family: 'Kumar',
                        given: ['Rajesh'],
                    },
                ],
                gender: 'male',
                birthDate: '1984-05-15',
            },
            fullUrl: 'urn:uuid:patient-001',
        },
        {
            resource: {
                resourceType: 'Observation',
                id: 'obs-001',
                meta: {
                    lastUpdated: '2026-01-10T00:00:00Z',
                },
                status: 'final',
                category: [
                    {
                        coding: [
                            {
                                system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                                code: 'vital-signs',
                            },
                        ],
                    },
                ],
                code: {
                    coding: [
                        {
                            system: 'http://loinc.org',
                            code: '85354-9',
                            display: 'Blood pressure',
                        },
                    ],
                },
                subject: {
                    reference: 'Patient/patient-001',
                },
                effectiveDateTime: '2026-01-10T09:30:00Z',
                component: [
                    {
                        code: {
                            coding: [
                                {
                                    system: 'http://loinc.org',
                                    code: '8480-6',
                                    display: 'Systolic blood pressure',
                                },
                            ],
                        },
                        valueQuantity: {
                            value: 120,
                            unit: 'mmHg',
                        },
                    },
                    {
                        code: {
                            coding: [
                                {
                                    system: 'http://loinc.org',
                                    code: '8462-4',
                                    display: 'Diastolic blood pressure',
                                },
                            ],
                        },
                        valueQuantity: {
                            value: 80,
                            unit: 'mmHg',
                        },
                    },
                ],
            },
            fullUrl: 'urn:uuid:obs-001',
        },
    ],
};

class DataExportService {
    private baseUrl = `${Config.getBaseUrl()}/data-export`;

    // Request Data Export
    async requestExport(request: ExportRequest): Promise<ExportHistory> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 1500));

            const newExport: ExportHistory = {
                id: `exp-${Date.now()}`,
                userId: 'user-001',
                format: request.format,
                recordTypes: request.recordTypes,
                dateRange: request.dateRange,
                status: 'processing',
                createdAt: new Date().toISOString(),
            };

            // Simulate processing completion after 3 seconds
            setTimeout(() => {
                newExport.status = 'completed';
                newExport.completedAt = new Date().toISOString();
                newExport.fileSize = Math.floor(Math.random() * 5000000) + 1000000; // 1-6 MB
                newExport.downloadUrl = `https://storage.example.com/exports/${newExport.id}.${request.format}`;
                newExport.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
            }, 3000);

            return newExport;
        }

        const response = await fetch(`${this.baseUrl}/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        return response.json();
    }

    // Get Export History
    async getExportHistory(limit?: number): Promise<ExportHistory[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return limit ? mockExportHistory.slice(0, limit) : mockExportHistory;
        }

        const url = limit ? `${this.baseUrl}/history?limit=${limit}` : `${this.baseUrl}/history`;
        const response = await fetch(url);
        return response.json();
    }

    // Get Export Status
    async getExportStatus(exportId: string): Promise<ExportHistory> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
            const found = mockExportHistory.find(e => e.id === exportId);
            if (found) return found;

            // Return a processing export
            return {
                id: exportId,
                userId: 'user-001',
                format: 'pdf',
                recordTypes: ['all'],
                dateRange: { startDate: '2025-01-01', endDate: '2026-01-15' },
                status: 'processing',
                createdAt: new Date().toISOString(),
            };
        }

        const response = await fetch(`${this.baseUrl}/status/${exportId}`);
        return response.json();
    }

    // Download Export
    async downloadExport(exportId: string): Promise<{ url: string; expiresAt: string }> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            const found = mockExportHistory.find(e => e.id === exportId);

            return {
                url: found?.downloadUrl || `https://storage.example.com/exports/${exportId}.pdf`,
                expiresAt: found?.expiresAt || new Date(Date.now() + 3600000).toISOString(), // 1 hour
            };
        }

        const response = await fetch(`${this.baseUrl}/download/${exportId}`);
        return response.json();
    }

    // Delete Export
    async deleteExport(exportId: string): Promise<{ success: boolean }> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return { success: true };
        }

        const response = await fetch(`${this.baseUrl}/${exportId}`, {
            method: 'DELETE',
        });
        return response.json();
    }

    // Export as FHIR
    async exportFHIR(recordTypes: RecordType[], dateRange?: { startDate: string; endDate: string }): Promise<FHIRExportResponse> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
            return mockFHIRBundle;
        }

        const response = await fetch(`${this.baseUrl}/fhir`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recordTypes, dateRange }),
        });
        return response.json();
    }

    // Get Report Templates
    async getReportTemplates(category?: string): Promise<ReportTemplate[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return category
                ? mockReportTemplates.filter(t => t.category === category)
                : mockReportTemplates;
        }

        const url = category ? `${this.baseUrl}/templates?category=${category}` : `${this.baseUrl}/templates`;
        const response = await fetch(url);
        return response.json();
    }

    // Generate Custom Report
    async generateReport(request: CustomReportRequest): Promise<GeneratedReport> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 2500));

            const report: GeneratedReport = {
                id: `report-${Date.now()}`,
                userId: 'user-001',
                title: request.title,
                templateId: request.templateId,
                format: request.format,
                fileSize: Math.floor(Math.random() * 3000000) + 500000, // 500KB - 3.5MB
                downloadUrl: `https://storage.example.com/reports/report-${Date.now()}.${request.format}`,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
                createdAt: new Date().toISOString(),
                metadata: {
                    totalPages: request.format === 'pdf' ? Math.floor(Math.random() * 10) + 5 : undefined,
                    sections: request.sections.length,
                    dataPoints: request.sections.reduce((sum, s) => sum + s.dataPoints.length, 0),
                    dateRange: request.sections[0]?.dateRange || {
                        startDate: '2025-01-01',
                        endDate: '2026-01-15',
                    },
                },
            };

            return report;
        }

        const response = await fetch(`${this.baseUrl}/reports/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        return response.json();
    }

    // Share Export
    async shareExport(request: ShareExportRequest): Promise<ShareLink> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

            const link: ShareLink = {
                id: `share-${Date.now()}`,
                exportId: request.exportId,
                url: `https://ayusetu.app/shared/${Date.now()}`,
                expiresAt: new Date(Date.now() + (request.expiresIn || 24) * 60 * 60 * 1000).toISOString(),
                password: request.requirePassword ? 'ABC123' : undefined,
                accessCount: 0,
                maxAccessCount: request.recipientEmail ? 1 : undefined,
                createdAt: new Date().toISOString(),
            };

            return link;
        }

        const response = await fetch(`${this.baseUrl}/share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        return response.json();
    }

    // Get Export Statistics
    async getExportStatistics(): Promise<ExportStatistics> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

            return {
                totalExports: 15,
                exportsByFormat: {
                    fhir: 3,
                    pdf: 8,
                    csv: 2,
                    json: 2,
                },
                exportsByType: {
                    medical_records: 5,
                    prescriptions: 3,
                    lab_results: 4,
                    imaging: 1,
                    appointments: 2,
                    immunizations: 1,
                    care_plans: 1,
                    all: 8,
                },
                totalSize: 45678901, // ~43 MB
                lastExport: mockExportHistory[0].createdAt,
                mostUsedTemplate: 'template-diabetes',
            };
        }

        const response = await fetch(`${this.baseUrl}/statistics`);
        return response.json();
    }

    // Grant Data Export Consent
    async grantConsent(consent: Omit<DataExportConsent, 'id' | 'grantedAt' | 'status'>): Promise<DataExportConsent> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

            return {
                ...consent,
                id: `consent-${Date.now()}`,
                grantedAt: new Date().toISOString(),
                status: 'active',
            };
        }

        const response = await fetch(`${this.baseUrl}/consent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(consent),
        });
        return response.json();
    }

    // Revoke Data Export Consent
    async revokeConsent(consentId: string): Promise<{ success: boolean }> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return { success: true };
        }

        const response = await fetch(`${this.baseUrl}/consent/${consentId}/revoke`, {
            method: 'POST',
        });
        return response.json();
    }
}

export const dataExportService = new DataExportService();
