// Compliance & Audit Transparency Service - Category 9
// Full transparency into data access, consent usage, and ABDM transactions

import Config from '../../src/config/env';
import {
  DataAccessLog,
  ConsentAuditLog,
  ABDMGatewayLog,
  ComplianceDashboard,
  UserActivityLog,
  AuditReportRequest,
  AuditReport,
  AccessPattern,
  ConsentTimelineEntry,
  GetDataAccessLogsRequest,
  GetConsentAuditRequest,
  GetABDMLogsRequest,
  GetUserActivityRequest,
  GetAccessPatternsRequest,
  GetConsentTimelineRequest,
} from '../types/compliance';

class ComplianceService {
  private baseUrl = `${Config.API_URL}/compliance`;

  // ============================================
  // Data Access Logs
  // ============================================

  async getDataAccessLogs(request: GetDataAccessLogsRequest): Promise<DataAccessLog[]> {
    if (Config.DEVELOPER_MODE) {
      return [
        {
          id: 'access-001',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          action: 'view',
          dataCategory: 'diagnostic-report',
          recordId: 'report-123',
          recordTitle: 'Blood Test Report - Nov 2025',
          accessedBy: {
            type: 'doctor',
            id: 'doc-001',
            name: 'Dr. Rajesh Kumar',
            facilityId: 'hosp-001',
            facilityName: 'Apollo Hospital, Delhi',
          },
          purpose: 'Consultation',
          consentId: 'consent-001',
          ipAddress: '103.45.67.89',
          location: 'New Delhi, India',
          deviceInfo: 'Web Browser - Chrome 120',
          duration: 180,
          success: true,
        },
        {
          id: 'access-002',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          action: 'download',
          dataCategory: 'prescription',
          recordId: 'rx-456',
          recordTitle: 'Prescription - Dr. Sharma',
          accessedBy: {
            type: 'pharmacy',
            id: 'pharm-001',
            name: 'MedPlus Pharmacy',
            facilityId: 'pharm-branch-01',
            facilityName: 'MedPlus - Connaught Place',
          },
          purpose: 'Medicine dispensing',
          consentId: 'consent-002',
          ipAddress: '103.45.67.90',
          location: 'New Delhi, India',
          deviceInfo: 'Android App - v2.5.0',
          duration: 45,
          success: true,
        },
        {
          id: 'access-003',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          action: 'view',
          dataCategory: 'discharge-summary',
          recordId: 'discharge-789',
          recordTitle: 'Discharge Summary - Cardiac Surgery',
          accessedBy: {
            type: 'doctor',
            id: 'doc-002',
            name: 'Dr. Priya Mehta',
            facilityId: 'hosp-002',
            facilityName: 'Max Hospital, Gurgaon',
          },
          purpose: 'Follow-up consultation',
          consentId: 'consent-003',
          ipAddress: '103.45.67.91',
          location: 'Gurgaon, India',
          deviceInfo: 'iOS App - v2.5.1',
          duration: 240,
          success: true,
        },
        {
          id: 'access-004',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          action: 'emergency-access',
          dataCategory: 'health-document',
          recordTitle: 'Emergency Medical Card',
          accessedBy: {
            type: 'emergency',
            id: 'emerg-001',
            name: 'Emergency Personnel',
            facilityId: 'amb-001',
            facilityName: 'Emergency Services',
          },
          purpose: 'Emergency treatment',
          ipAddress: '103.45.67.92',
          location: 'Unknown',
          deviceInfo: 'Mobile Scanner',
          duration: 60,
          success: true,
        },
      ];
    }

    const params = new URLSearchParams();
    if (request.dateRange) {
      params.append('from', request.dateRange.from);
      params.append('to', request.dateRange.to);
    }
    if (request.source) params.append('source', request.source);
    if (request.category) params.append('category', request.category);
    if (request.limit) params.append('limit', request.limit.toString());
    if (request.offset) params.append('offset', request.offset.toString());

    const response = await fetch(`${this.baseUrl}/data-access-logs?${params}`);
    if (!response.ok) throw new Error('Failed to fetch data access logs');
    return response.json();
  }

  // ============================================
  // Consent Audit Logs
  // ============================================

  async getConsentAuditLogs(request: GetConsentAuditRequest): Promise<ConsentAuditLog[]> {
    if (Config.DEVELOPER_MODE) {
      return [
        {
          id: 'consent-audit-001',
          consentId: 'consent-001',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          action: 'granted',
          requestedBy: {
            type: 'hospital',
            id: 'hosp-001',
            name: 'Dr. Rajesh Kumar',
            facilityName: 'Apollo Hospital, Delhi',
          },
          purpose: 'Consultation',
          dataTypes: ['diagnostic-report', 'prescription'],
          dateRange: {
            from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
            to: new Date().toISOString(),
          },
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          hiuId: 'HIU-APOLLO-01',
          hipId: 'HIP-APOLLO-01',
          userAction: 'approved',
        },
        {
          id: 'consent-audit-002',
          consentId: 'consent-001',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          action: 'used',
          requestedBy: {
            type: 'hospital',
            id: 'hosp-001',
            name: 'Dr. Rajesh Kumar',
            facilityName: 'Apollo Hospital, Delhi',
          },
          purpose: 'Consultation',
          dataTypes: ['diagnostic-report'],
          hiuId: 'HIU-APOLLO-01',
          details: 'Data accessed for consultation',
        },
        {
          id: 'consent-audit-003',
          consentId: 'consent-005',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          action: 'revoked',
          requestedBy: {
            type: 'lab',
            id: 'lab-001',
            name: 'Dr. Lal PathLabs',
            facilityName: 'PathLabs - Delhi',
          },
          purpose: 'Lab report sharing',
          dataTypes: ['diagnostic-report'],
          expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          hiuId: 'HIU-PATHLABS-01',
          userAction: 'manual-revoke',
          details: 'User manually revoked consent',
        },
      ];
    }

    const params = new URLSearchParams();
    if (request.consentId) params.append('consentId', request.consentId);
    if (request.dateRange) {
      params.append('from', request.dateRange.from);
      params.append('to', request.dateRange.to);
    }
    if (request.action) params.append('action', request.action);
    if (request.limit) params.append('limit', request.limit.toString());
    if (request.offset) params.append('offset', request.offset.toString());

    const response = await fetch(`${this.baseUrl}/consent-audit?${params}`);
    if (!response.ok) throw new Error('Failed to fetch consent audit logs');
    return response.json();
  }

  // ============================================
  // ABDM Gateway Logs
  // ============================================

  async getABDMGatewayLogs(request: GetABDMLogsRequest): Promise<ABDMGatewayLog[]> {
    if (Config.DEVELOPER_MODE) {
      return [
        {
          id: 'abdm-001',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          transactionId: 'TXN-20260115-001',
          requestType: 'data-transfer',
          direction: 'outbound',
          gatewayId: 'ABDM-GATEWAY-PROD',
          hipId: 'HIP-APOLLO-01',
          hiuId: 'HIU-MAX-01',
          status: 'success',
          responseTime: 1250,
          metadata: {
            recordsTransferred: 3,
            dataSize: '2.5 MB',
          },
        },
        {
          id: 'abdm-002',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          transactionId: 'TXN-20260115-002',
          requestType: 'consent-request',
          direction: 'inbound',
          gatewayId: 'ABDM-GATEWAY-PROD',
          hiuId: 'HIU-APOLLO-01',
          status: 'success',
          responseTime: 850,
          metadata: {
            purpose: 'Consultation',
            requester: 'Dr. Rajesh Kumar',
          },
        },
        {
          id: 'abdm-003',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          transactionId: 'TXN-20260114-003',
          requestType: 'link-records',
          direction: 'inbound',
          gatewayId: 'ABDM-GATEWAY-PROD',
          hipId: 'HIP-FORTIS-01',
          status: 'failed',
          errorCode: 'TIMEOUT',
          errorMessage: 'Connection timeout',
          responseTime: 30000,
        },
      ];
    }

    const params = new URLSearchParams();
    if (request.dateRange) {
      params.append('from', request.dateRange.from);
      params.append('to', request.dateRange.to);
    }
    if (request.requestType) params.append('requestType', request.requestType);
    if (request.status) params.append('status', request.status);
    if (request.limit) params.append('limit', request.limit.toString());
    if (request.offset) params.append('offset', request.offset.toString());

    const response = await fetch(`${this.baseUrl}/abdm-logs?${params}`);
    if (!response.ok) throw new Error('Failed to fetch ABDM logs');
    return response.json();
  }

  // ============================================
  // User Activity Logs
  // ============================================

  async getUserActivityLogs(request: GetUserActivityRequest): Promise<UserActivityLog[]> {
    if (Config.DEVELOPER_MODE) {
      return [
        {
          id: 'activity-001',
          userId: 'user-001',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          action: 'record-uploaded',
          category: 'record',
          description: 'Uploaded lab report - Blood Test',
          recordsAffected: 1,
          deviceInfo: 'iOS App v2.5.1',
          location: 'New Delhi, India',
        },
        {
          id: 'activity-002',
          userId: 'user-001',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          action: 'consent-granted',
          category: 'consent',
          description: 'Granted consent to Apollo Hospital for consultation',
          metadata: {
            consentId: 'consent-001',
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          deviceInfo: 'iOS App v2.5.1',
          location: 'New Delhi, India',
        },
        {
          id: 'activity-003',
          userId: 'user-001',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          action: 'download',
          category: 'export',
          description: 'Downloaded health summary PDF',
          deviceInfo: 'Web Browser - Chrome 120',
          location: 'New Delhi, India',
        },
      ];
    }

    const params = new URLSearchParams();
    if (request.dateRange) {
      params.append('from', request.dateRange.from);
      params.append('to', request.dateRange.to);
    }
    if (request.category) params.append('category', request.category);
    if (request.limit) params.append('limit', request.limit.toString());
    if (request.offset) params.append('offset', request.offset.toString());

    const response = await fetch(`${this.baseUrl}/user-activity?${params}`);
    if (!response.ok) throw new Error('Failed to fetch user activity logs');
    return response.json();
  }

  // ============================================
  // Compliance Dashboard
  // ============================================

  async getComplianceDashboard(userId: string): Promise<ComplianceDashboard> {
    if (Config.DEVELOPER_MODE) {
      return {
        userId: 'user-001',
        generatedAt: new Date().toISOString(),
        
        totalConsents: 12,
        activeConsents: 5,
        revokedConsents: 4,
        expiredConsents: 3,
        
        totalDataAccesses: 48,
        accessesBySource: {
          patient: 15,
          hip: 8,
          hiu: 12,
          doctor: 10,
          hospital: 8,
          lab: 3,
          pharmacy: 2,
          emergency: 0,
        },
        accessesByCategory: {
          prescription: 12,
          'diagnostic-report': 18,
          'discharge-summary': 5,
          'op-consultation': 8,
          immunization: 3,
          'wellness-record': 2,
          'health-document': 0,
        },
        accessesLast30Days: 28,
        
        linkedFacilities: 6,
        totalDataTransfers: 24,
        failedTransfers: 2,
        
        recordsShared: 35,
        recordsViewed: 48,
        downloadsCount: 12,
        emergencyAccesses: 0,
        
        complianceScore: 92,
        complianceLevel: 'excellent',
        recommendations: [
          'Review and revoke unused consents',
          'Enable two-factor authentication for enhanced security',
        ],
        
        recentActivity: [
          { date: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toISOString(), accessCount: 3, consentActions: 1 },
          { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), accessCount: 5, consentActions: 0 },
          { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), accessCount: 2, consentActions: 1 },
          { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), accessCount: 4, consentActions: 2 },
          { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), accessCount: 1, consentActions: 0 },
          { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), accessCount: 3, consentActions: 0 },
          { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), accessCount: 2, consentActions: 1 },
        ],
      };
    }

    const response = await fetch(`${this.baseUrl}/dashboard/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch compliance dashboard');
    return response.json();
  }

  // ============================================
  // Access Patterns
  // ============================================

  async getAccessPatterns(request: GetAccessPatternsRequest): Promise<AccessPattern[]> {
    if (Config.DEVELOPER_MODE) {
      return [
        {
          source: 'doctor',
          sourceName: 'Healthcare Providers',
          totalAccesses: 22,
          firstAccess: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          lastAccess: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          mostAccessedCategory: 'diagnostic-report',
          averageAccessDuration: 180,
          consentBased: true,
          emergencyAccesses: 0,
        },
        {
          source: 'lab',
          sourceName: 'Diagnostic Centers',
          totalAccesses: 8,
          firstAccess: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          lastAccess: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          mostAccessedCategory: 'diagnostic-report',
          averageAccessDuration: 90,
          consentBased: true,
          emergencyAccesses: 0,
        },
        {
          source: 'pharmacy',
          sourceName: 'Pharmacies',
          totalAccesses: 5,
          firstAccess: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastAccess: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          mostAccessedCategory: 'prescription',
          averageAccessDuration: 45,
          consentBased: true,
          emergencyAccesses: 0,
        },
      ];
    }

    const params = new URLSearchParams();
    if (request.dateRange) {
      params.append('from', request.dateRange.from);
      params.append('to', request.dateRange.to);
    }

    const response = await fetch(`${this.baseUrl}/access-patterns/${request.userId}?${params}`);
    if (!response.ok) throw new Error('Failed to fetch access patterns');
    return response.json();
  }

  // ============================================
  // Consent Timeline
  // ============================================

  async getConsentTimeline(request: GetConsentTimelineRequest): Promise<ConsentTimelineEntry[]> {
    if (Config.DEVELOPER_MODE) {
      return [
        {
          id: 'timeline-001',
          consentId: 'consent-001',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          eventType: 'created',
          description: 'Consent request received from Apollo Hospital',
          requestedBy: 'Dr. Rajesh Kumar - Apollo Hospital',
        },
        {
          id: 'timeline-002',
          consentId: 'consent-001',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
          eventType: 'approved',
          description: 'Consent approved by patient',
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'timeline-003',
          consentId: 'consent-001',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          eventType: 'used',
          description: 'Data accessed for consultation',
          usedBy: 'Dr. Rajesh Kumar',
          recordsAccessed: 3,
        },
      ];
    }

    const params = new URLSearchParams();
    if (request.consentId) params.append('consentId', request.consentId);
    if (request.limit) params.append('limit', request.limit.toString());

    const response = await fetch(`${this.baseUrl}/consent-timeline/${request.userId}?${params}`);
    if (!response.ok) throw new Error('Failed to fetch consent timeline');
    return response.json();
  }

  // ============================================
  // Audit Report Generation
  // ============================================

  async generateAuditReport(request: AuditReportRequest): Promise<AuditReport> {
    if (Config.DEVELOPER_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        id: `report-${Date.now()}`,
        userId: request.userId,
        generatedAt: new Date().toISOString(),
        dateRange: request.dateRange,
        summary: {
          totalLogs: 125,
          dataAccessLogs: 48,
          consentLogs: 35,
          abdmLogs: 24,
          userActivityLogs: 18,
        },
        downloadUrl: 'https://ayusetu-reports.s3.ap-south-1.amazonaws.com/audit-report-123.pdf',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        format: request.format,
        sizeBytes: 2458624, // ~2.4 MB
      };
    }

    const response = await fetch(`${this.baseUrl}/generate-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to generate audit report');
    return response.json();
  }

  async downloadAuditReport(reportId: string): Promise<Blob> {
    if (Config.DEVELOPER_MODE) {
      // Return mock PDF blob
      const mockPDF = new Blob(['Mock PDF content'], { type: 'application/pdf' });
      return mockPDF;
    }

    const response = await fetch(`${this.baseUrl}/download-report/${reportId}`);
    if (!response.ok) throw new Error('Failed to download audit report');
    return response.blob();
  }
}

export const complianceService = new ComplianceService();
