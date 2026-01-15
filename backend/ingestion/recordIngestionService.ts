import axios from 'axios';
import { Config } from '../../src/config/env';
import { mockDelay } from '../http/client';
import type {
  AutoSyncStatus,
  RecordFolder,
  RecordSource,
  UploadedRecord,
  UploadFileType,
} from '../types/recordIngestion';

/**
 * Record Ingestion & Management Service (Category 3)
 * Handles auto-fetch, manual upload, smart processing
 */

const ingestionApi = axios.create({
  baseURL: Config.getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// DEV MODE mock data
let mockUploadedRecords: UploadedRecord[] = [
  {
    id: 'upload-001',
    fileName: 'lab_report_CBC_2026.pdf',
    fileType: 'pdf',
    fileSize: 245678,
    uploadedAt: '2026-01-12T10:30:00Z',
    source: 'manual_upload',
    processingStatus: 'completed',
    ocrText: 'Complete Blood Count (CBC)\nHemoglobin: 14.2 g/dL\nWBC: 7500/µL\nPlatelets: 250,000/µL',
    summary: 'CBC report showing normal hemoglobin, WBC, and platelet counts.',
    keywords: ['CBC', 'hemoglobin', 'blood test', 'normal'],
    tags: ['lab', 'routine'],
    folder: 'folder-001',
  },
];

let mockFolders: RecordFolder[] = [
  {
    id: 'folder-001',
    name: 'Lab Reports',
    color: '#4CAF50',
    recordCount: 5,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'folder-002',
    name: 'Prescriptions',
    color: '#2196F3',
    recordCount: 3,
    createdAt: '2026-01-01T00:00:00Z',
  },
];

let mockAutoSyncStatus: AutoSyncStatus[] = [
  {
    providerId: 'hfr-apollo-001',
    providerName: 'Apollo Hospital',
    providerType: 'hospital',
    isEnabled: true,
    lastSyncAt: '2026-01-12T08:00:00Z',
    recordCount: 12,
  },
  {
    providerId: 'lab-thyrocare-001',
    providerName: 'Thyrocare Labs',
    providerType: 'lab',
    isEnabled: true,
    lastSyncAt: '2026-01-10T14:00:00Z',
    recordCount: 5,
  },
];

export const recordIngestionService = {
  // ========================================
  // Auto-Fetch (ABDM Gateway Integration)
  // ========================================
  async getAutoSyncProviders(abhaNumber?: string): Promise<AutoSyncStatus[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return mockAutoSyncStatus;
    }

    const response = await ingestionApi.get('/v1/ingestion/auto-sync/providers', {
      params: { abhaNumber },
    });
    return response.data;
  },

  async enableAutoSync(providerId: string, enable: boolean): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(600);
      mockAutoSyncStatus = mockAutoSyncStatus.map(p =>
        p.providerId === providerId ? { ...p, isEnabled: enable } : p
      );
      return true;
    }

    await ingestionApi.post('/v1/ingestion/auto-sync/toggle', { providerId, enable });
    return true;
  },

  async triggerManualSync(providerId: string): Promise<{ recordsFetched: number }> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(2000);
      const count = Math.floor(Math.random() * 5) + 1;
      const provider = mockAutoSyncStatus.find(p => p.providerId === providerId);
      if (provider) {
        provider.lastSyncAt = new Date().toISOString();
        provider.recordCount += count;
      }
      return { recordsFetched: count };
    }

    const response = await ingestionApi.post('/v1/ingestion/auto-sync/trigger', { providerId });
    return response.data;
  },

  // ========================================
  // Manual Upload
  // ========================================
  async uploadFile(
    file: { uri: string; name: string; type: string },
    metadata?: { tags?: string[]; folder?: string; notes?: string }
  ): Promise<UploadedRecord> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(1500);

      const fileType: UploadFileType = file.type.includes('pdf')
        ? 'pdf'
        : file.type.includes('image')
          ? 'image'
          : 'dicom';

      const newRecord: UploadedRecord = {
        id: `upload-${Date.now()}`,
        fileName: file.name,
        fileType,
        fileSize: Math.floor(Math.random() * 500000) + 100000,
        uploadedAt: new Date().toISOString(),
        source: 'manual_upload',
        processingStatus: 'pending',
        tags: metadata?.tags,
        folder: metadata?.folder,
        notes: metadata?.notes,
      };

      mockUploadedRecords = [newRecord, ...mockUploadedRecords];

      // Simulate async processing
      setTimeout(() => {
        const idx = mockUploadedRecords.findIndex(r => r.id === newRecord.id);
        if (idx !== -1) {
          mockUploadedRecords[idx].processingStatus = 'completed';
          mockUploadedRecords[idx].ocrText = 'Sample OCR extracted text...';
          mockUploadedRecords[idx].summary = 'AI-generated summary of the document.';
          mockUploadedRecords[idx].keywords = ['health', 'report', 'test'];
        }
      }, 3000);

      return newRecord;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);
    if (metadata?.tags) formData.append('tags', JSON.stringify(metadata.tags));
    if (metadata?.folder) formData.append('folder', metadata.folder);
    if (metadata?.notes) formData.append('notes', metadata.notes);

    const response = await ingestionApi.post('/v1/ingestion/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async bulkUpload(files: Array<{ uri: string; name: string; type: string }>): Promise<UploadedRecord[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(2000);
      const results: UploadedRecord[] = [];
      for (const file of files) {
        const rec = await this.uploadFile(file);
        results.push(rec);
      }
      return results;
    }

    const formData = new FormData();
    files.forEach((file, idx) => {
      formData.append(`files[${idx}]`, {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
    });

    const response = await ingestionApi.post('/v1/ingestion/bulk-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ========================================
  // Record Management
  // ========================================
  async getUploadedRecords(abhaNumber?: string): Promise<UploadedRecord[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return mockUploadedRecords;
    }

    const response = await ingestionApi.get('/v1/ingestion/uploads', { params: { abhaNumber } });
    return response.data;
  },

  async updateRecordMetadata(
    recordId: string,
    updates: { tags?: string[]; notes?: string; folder?: string }
  ): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(500);
      mockUploadedRecords = mockUploadedRecords.map(r =>
        r.id === recordId ? { ...r, ...updates } : r
      );
      return true;
    }

    await ingestionApi.patch(`/v1/ingestion/uploads/${encodeURIComponent(recordId)}`, updates);
    return true;
  },

  async deleteUploadedRecord(recordId: string): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(500);
      mockUploadedRecords = mockUploadedRecords.filter(r => r.id !== recordId);
      return true;
    }

    await ingestionApi.delete(`/v1/ingestion/uploads/${encodeURIComponent(recordId)}`);
    return true;
  },

  // ========================================
  // Folder Management
  // ========================================
  async getFolders(abhaNumber?: string): Promise<RecordFolder[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return mockFolders;
    }

    const response = await ingestionApi.get('/v1/ingestion/folders', { params: { abhaNumber } });
    return response.data;
  },

  async createFolder(name: string, color?: string): Promise<RecordFolder> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(500);
      const newFolder: RecordFolder = {
        id: `folder-${Date.now()}`,
        name,
        color: color || '#9E9E9E',
        recordCount: 0,
        createdAt: new Date().toISOString(),
      };
      mockFolders = [newFolder, ...mockFolders];
      return newFolder;
    }

    const response = await ingestionApi.post('/v1/ingestion/folders', { name, color });
    return response.data;
  },

  async deleteFolder(folderId: string): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(500);
      mockFolders = mockFolders.filter(f => f.id !== folderId);
      // Also unlink records from this folder
      mockUploadedRecords = mockUploadedRecords.map(r =>
        r.folder === folderId ? { ...r, folder: undefined } : r
      );
      return true;
    }

    await ingestionApi.delete(`/v1/ingestion/folders/${encodeURIComponent(folderId)}`);
    return true;
  },

  // ========================================
  // Smart Processing
  // ========================================
  async searchRecords(query: string, abhaNumber?: string): Promise<UploadedRecord[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(800);
      const lowerQuery = query.toLowerCase();
      return mockUploadedRecords.filter(
        r =>
          r.fileName.toLowerCase().includes(lowerQuery) ||
          r.ocrText?.toLowerCase().includes(lowerQuery) ||
          r.summary?.toLowerCase().includes(lowerQuery) ||
          r.keywords?.some(k => k.toLowerCase().includes(lowerQuery)) ||
          r.tags?.some(t => t.toLowerCase().includes(lowerQuery))
      );
    }

    const response = await ingestionApi.get('/v1/ingestion/search', {
      params: { query, abhaNumber },
    });
    return response.data;
  },

  async detectDuplicates(abhaNumber?: string): Promise<Array<{ original: string; duplicates: string[] }>> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(1200);
      // Simulate duplicate detection (in real scenario, use file hash or AI similarity)
      return [];
    }

    const response = await ingestionApi.get('/v1/ingestion/duplicates', { params: { abhaNumber } });
    return response.data;
  },

  async reprocessRecord(recordId: string): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(1500);
      const rec = mockUploadedRecords.find(r => r.id === recordId);
      if (rec) {
        rec.processingStatus = 'processing';
        setTimeout(() => {
          rec.processingStatus = 'completed';
          rec.ocrText = 'Reprocessed OCR text...';
          rec.summary = 'Updated AI summary...';
        }, 2000);
      }
      return true;
    }

    await ingestionApi.post(`/v1/ingestion/uploads/${encodeURIComponent(recordId)}/reprocess`);
    return true;
  },
};
