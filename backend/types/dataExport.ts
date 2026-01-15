// Data Export & Portability Types - Category 13
// ABDM-compliant data portability and health record export

export type ExportFormat = 'fhir' | 'pdf' | 'csv' | 'json';

export type RecordType = 
  | 'medical_records'
  | 'prescriptions'
  | 'lab_results'
  | 'imaging'
  | 'appointments'
  | 'immunizations'
  | 'care_plans'
  | 'all';

export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'expired';

// Data Export Request
export interface ExportRequest {
  format: ExportFormat;
  recordTypes: RecordType[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  includeAttachments?: boolean;
  password?: string; // For encrypted exports
  email?: string; // Send export link via email
}

// Export History Record
export interface ExportHistory {
  id: string;
  userId: string;
  format: ExportFormat;
  recordTypes: RecordType[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  status: ExportStatus;
  fileSize?: number; // in bytes
  downloadUrl?: string;
  expiresAt?: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

// FHIR Export Response
export interface FHIRExportResponse {
  resourceType: 'Bundle';
  type: 'collection' | 'document';
  entry: FHIRBundleEntry[];
  total: number;
  timestamp: string;
}

export interface FHIRBundleEntry {
  resource: FHIRResource;
  fullUrl?: string;
}

export interface FHIRResource {
  resourceType: string;
  id: string;
  meta?: {
    lastUpdated: string;
    versionId?: string;
  };
  [key: string]: any; // FHIR resources have dynamic structure
}

// Health Report Template
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'diabetes' | 'cardiac' | 'annual' | 'maternal' | 'pediatric' | 'custom';
  sections: ReportSection[];
  icon: string;
  color: string;
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'vitals' | 'medications' | 'lab_results' | 'trends' | 'summary' | 'custom';
  dataPoints: string[];
  chartType?: 'line' | 'bar' | 'pie' | 'table';
  includeByDefault: boolean;
}

// Custom Report Request
export interface CustomReportRequest {
  templateId?: string;
  title: string;
  sections: {
    sectionId: string;
    dataPoints: string[];
    dateRange?: {
      startDate: string;
      endDate: string;
    };
  }[];
  format: 'pdf' | 'json';
  includeCharts?: boolean;
  includeSummary?: boolean;
}

// Generated Report
export interface GeneratedReport {
  id: string;
  userId: string;
  title: string;
  templateId?: string;
  format: 'pdf' | 'json';
  fileSize: number;
  downloadUrl: string;
  expiresAt: string;
  createdAt: string;
  metadata: {
    totalPages?: number;
    sections: number;
    dataPoints: number;
    dateRange: {
      startDate: string;
      endDate: string;
    };
  };
}

// Share Export Request
export interface ShareExportRequest {
  exportId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientABHA?: string;
  expiresIn?: number; // hours
  requirePassword?: boolean;
  message?: string;
}

// Share Link
export interface ShareLink {
  id: string;
  exportId: string;
  url: string;
  expiresAt: string;
  password?: string;
  accessCount: number;
  maxAccessCount?: number;
  createdAt: string;
}

// Export Statistics
export interface ExportStatistics {
  totalExports: number;
  exportsByFormat: {
    fhir: number;
    pdf: number;
    csv: number;
    json: number;
  };
  exportsByType: {
    [key in RecordType]: number;
  };
  totalSize: number; // in bytes
  lastExport?: string;
  mostUsedTemplate?: string;
}

// Consent for Data Export
export interface DataExportConsent {
  id: string;
  userId: string;
  purpose: string;
  recipientName?: string;
  recipientId?: string;
  dataTypes: RecordType[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  grantedAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked';
  revokedAt?: string;
}
