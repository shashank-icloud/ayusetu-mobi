// Compliance & Audit Transparency - Category 9
// Full transparency and audit trail for ABDM/ABHA compliance

export type AuditAction =
    | 'view'
    | 'download'
    | 'share'
    | 'consent-granted'
    | 'consent-revoked'
    | 'record-uploaded'
    | 'record-deleted'
    | 'profile-updated'
    | 'emergency-access'
    | 'export';

export type AccessSource = 'patient' | 'hip' | 'hiu' | 'doctor' | 'hospital' | 'lab' | 'pharmacy' | 'emergency';

export type DataCategory =
    | 'prescription'
    | 'diagnostic-report'
    | 'discharge-summary'
    | 'op-consultation'
    | 'immunization'
    | 'wellness-record'
    | 'health-document';

// Data Access Log Entry
export interface DataAccessLog {
    id: string;
    timestamp: string;
    action: AuditAction;
    dataCategory: DataCategory;
    recordId?: string;
    recordTitle?: string;
    accessedBy: {
        type: AccessSource;
        id: string;
        name: string;
        facilityId?: string;
        facilityName?: string;
    };
    purpose?: string;
    consentId?: string;
    ipAddress?: string;
    location?: string;
    deviceInfo?: string;
    duration?: number; // seconds
    success: boolean;
    failureReason?: string;
}

// Consent Audit Entry
export interface ConsentAuditLog {
    id: string;
    consentId: string;
    timestamp: string;
    action: 'created' | 'granted' | 'denied' | 'revoked' | 'expired' | 'used' | 'modified';
    requestedBy: {
        type: AccessSource;
        id: string;
        name: string;
        facilityName?: string;
    };
    purpose: string;
    dataTypes: DataCategory[];
    dateRange?: {
        from: string;
        to: string;
    };
    expiryDate?: string;
    hiuId?: string;
    hipId?: string;
    details?: string;
    userAction?: 'approved' | 'rejected' | 'auto-expired' | 'manual-revoke';
}

// ABDM Gateway Interaction Log
export interface ABDMGatewayLog {
    id: string;
    timestamp: string;
    transactionId: string;
    requestType: 'consent-request' | 'data-transfer' | 'link-records' | 'discovery' | 'authentication';
    direction: 'inbound' | 'outbound';
    gatewayId: string;
    hipId?: string;
    hiuId?: string;
    status: 'success' | 'failed' | 'pending';
    errorCode?: string;
    errorMessage?: string;
    responseTime?: number; // milliseconds
    metadata?: Record<string, any>;
}

// Compliance Dashboard Metrics
export interface ComplianceDashboard {
    userId: string;
    generatedAt: string;

    // Consent metrics
    totalConsents: number;
    activeConsents: number;
    revokedConsents: number;
    expiredConsents: number;

    // Access metrics
    totalDataAccesses: number;
    accessesBySource: Record<AccessSource, number>;
    accessesByCategory: Record<DataCategory, number>;
    accessesLast30Days: number;

    // ABDM metrics
    linkedFacilities: number;
    totalDataTransfers: number;
    failedTransfers: number;

    // Privacy metrics
    recordsShared: number;
    recordsViewed: number;
    downloadsCount: number;
    emergencyAccesses: number;

    // Compliance score
    complianceScore: number; // 0-100
    complianceLevel: 'excellent' | 'good' | 'needs-attention';
    recommendations: string[];

    // Recent activity summary
    recentActivity: {
        date: string;
        accessCount: number;
        consentActions: number;
    }[];
}

// User Activity Log (Patient's own actions)
export interface UserActivityLog {
    id: string;
    userId: string;
    timestamp: string;
    action: AuditAction;
    category: 'record' | 'consent' | 'profile' | 'security' | 'export';
    description: string;
    recordsAffected?: number;
    metadata?: Record<string, any>;
    deviceInfo?: string;
    location?: string;
}

// Downloadable Audit Report
export interface AuditReportRequest {
    userId: string;
    dateRange: {
        from: string;
        to: string;
    };
    includeDataAccess: boolean;
    includeConsents: boolean;
    includeABDMTransactions: boolean;
    includeUserActivity: boolean;
    format: 'pdf' | 'csv' | 'json';
}

export interface AuditReport {
    id: string;
    userId: string;
    generatedAt: string;
    dateRange: {
        from: string;
        to: string;
    };

    summary: {
        totalLogs: number;
        dataAccessLogs: number;
        consentLogs: number;
        abdmLogs: number;
        userActivityLogs: number;
    };

    downloadUrl: string;
    expiresAt: string;
    format: 'pdf' | 'csv' | 'json';
    sizeBytes: number;
}

// Access Pattern Analysis (for user transparency)
export interface AccessPattern {
    source: AccessSource;
    sourceName: string;
    totalAccesses: number;
    firstAccess: string;
    lastAccess: string;
    mostAccessedCategory: DataCategory;
    averageAccessDuration?: number;
    consentBased: boolean;
    emergencyAccesses: number;
}

// Consent Timeline Entry
export interface ConsentTimelineEntry {
    id: string;
    consentId: string;
    timestamp: string;
    eventType: 'created' | 'approved' | 'used' | 'revoked' | 'expired';
    description: string;
    requestedBy?: string;
    usedBy?: string;
    recordsAccessed?: number;
    expiryDate?: string;
}

// API Request/Response Types
export interface GetDataAccessLogsRequest {
    userId: string;
    dateRange?: { from: string; to: string };
    source?: AccessSource;
    category?: DataCategory;
    limit?: number;
    offset?: number;
}

export interface GetConsentAuditRequest {
    userId: string;
    consentId?: string;
    dateRange?: { from: string; to: string };
    action?: ConsentAuditLog['action'];
    limit?: number;
    offset?: number;
}

export interface GetABDMLogsRequest {
    userId: string;
    dateRange?: { from: string; to: string };
    requestType?: ABDMGatewayLog['requestType'];
    status?: ABDMGatewayLog['status'];
    limit?: number;
    offset?: number;
}

export interface GetUserActivityRequest {
    userId: string;
    dateRange?: { from: string; to: string };
    category?: UserActivityLog['category'];
    limit?: number;
    offset?: number;
}

export interface GetAccessPatternsRequest {
    userId: string;
    dateRange?: { from: string; to: string };
}

export interface GetConsentTimelineRequest {
    userId: string;
    consentId?: string;
    limit?: number;
}
