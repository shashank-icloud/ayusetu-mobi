// India-First & Accessibility Service - Category 10
// Multi-language, voice navigation, elder-friendly UI, offline mode

import { Config } from '../../src/config/env';
import {
  Language,
  AccessibilitySettings,
  OfflineSettings,
  OfflineData,
  SyncStatus,
  VoiceCommand,
  TranslationPack,
  BandwidthUsage,
  RegionalSettings,
  GetLanguagesRequest,
  UpdateLanguageRequest,
  GetAccessibilitySettingsRequest,
  UpdateAccessibilitySettingsRequest,
  GetOfflineSettingsRequest,
  UpdateOfflineSettingsRequest,
  SyncOfflineDataRequest,
  GetOfflineDataRequest,
  DeleteOfflineDataRequest,
  GetVoiceCommandsRequest,
  ExecuteVoiceCommandRequest,
  GetBandwidthUsageRequest,
  DownloadTranslationPackRequest,
  LanguageCode,
} from '../types/accessibility';

class AccessibilityService {
  private baseUrl = `${Config.getBaseUrl()}/accessibility`;

  // ============================================
  // Language Management
  // ============================================

  async getLanguages(request: GetLanguagesRequest = {}): Promise<Language[]> {
    if (Config.DEVELOPER_MODE) {
      return mockLanguages;
    }

    const params = new URLSearchParams();
    if (request.includeOfflineStatus) {
      params.append('includeOfflineStatus', 'true');
    }

    const response = await fetch(`${this.baseUrl}/languages?${params}`);
    if (!response.ok) throw new Error('Failed to fetch languages');
    return response.json();
  }

  async updateLanguage(request: UpdateLanguageRequest): Promise<{ success: boolean }> {
    if (Config.DEVELOPER_MODE) {
      await new Promise<void>(resolve => setTimeout(resolve, 500));
      return { success: true };
    }

    const response = await fetch(`${this.baseUrl}/language`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to update language');
    return response.json();
  }

  async downloadTranslationPack(request: DownloadTranslationPackRequest): Promise<TranslationPack> {
    if (Config.DEVELOPER_MODE) {
      await new Promise<void>(resolve => setTimeout(resolve, 2000));
      return {
        language: request.language,
        version: '1.0.0',
        downloadedAt: new Date(),
        size: 5.2,
        isAvailable: true,
        translations: mockTranslations,
      };
    }

    const response = await fetch(`${this.baseUrl}/download-translation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to download translation pack');
    return response.json();
  }

  // ============================================
  // Accessibility Settings
  // ============================================

  async getAccessibilitySettings(request: GetAccessibilitySettingsRequest = {}): Promise<AccessibilitySettings> {
    if (Config.DEVELOPER_MODE) {
      return mockAccessibilitySettings;
    }

    const params = new URLSearchParams();
    if (request.userId) {
      params.append('userId', request.userId);
    }

    const response = await fetch(`${this.baseUrl}/settings?${params}`);
    if (!response.ok) throw new Error('Failed to fetch accessibility settings');
    return response.json();
  }

  async updateAccessibilitySettings(request: UpdateAccessibilitySettingsRequest): Promise<AccessibilitySettings> {
    if (Config.DEVELOPER_MODE) {
      await new Promise<void>(resolve => setTimeout(resolve, 500));
      return { ...mockAccessibilitySettings, ...request.settings };
    }

    const response = await fetch(`${this.baseUrl}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to update accessibility settings');
    return response.json();
  }

  // ============================================
  // Offline Mode & Sync
  // ============================================

  async getOfflineSettings(request: GetOfflineSettingsRequest = {}): Promise<OfflineSettings> {
    if (Config.DEVELOPER_MODE) {
      return mockOfflineSettings;
    }

    const params = new URLSearchParams();
    if (request.userId) {
      params.append('userId', request.userId);
    }

    const response = await fetch(`${this.baseUrl}/offline-settings?${params}`);
    if (!response.ok) throw new Error('Failed to fetch offline settings');
    return response.json();
  }

  async updateOfflineSettings(request: UpdateOfflineSettingsRequest): Promise<OfflineSettings> {
    if (Config.DEVELOPER_MODE) {
      await new Promise<void>(resolve => setTimeout(resolve, 500));
      return { ...mockOfflineSettings, ...request.settings };
    }

    const response = await fetch(`${this.baseUrl}/offline-settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to update offline settings');
    return response.json();
  }

  async syncOfflineData(request: SyncOfflineDataRequest = {}): Promise<SyncStatus> {
    if (Config.DEVELOPER_MODE) {
      await new Promise<void>(resolve => setTimeout(resolve, 3000));
      return mockSyncStatus;
    }

    const response = await fetch(`${this.baseUrl}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to sync offline data');
    return response.json();
  }

  async getOfflineData(request: GetOfflineDataRequest = {}): Promise<OfflineData[]> {
    if (Config.DEVELOPER_MODE) {
      let data = mockOfflineData;
      if (request.type) {
        data = data.filter(item => item.type === request.type);
      }
      if (request.limit) {
        data = data.slice(0, request.limit);
      }
      return data;
    }

    const params = new URLSearchParams();
    if (request.type) params.append('type', request.type);
    if (request.limit) params.append('limit', request.limit.toString());

    const response = await fetch(`${this.baseUrl}/offline-data?${params}`);
    if (!response.ok) throw new Error('Failed to fetch offline data');
    return response.json();
  }

  async deleteOfflineData(request: DeleteOfflineDataRequest): Promise<{ success: boolean; deletedCount: number }> {
    if (Config.DEVELOPER_MODE) {
      await new Promise<void>(resolve => setTimeout(resolve, 500));
      return { success: true, deletedCount: request.dataIds.length };
    }

    const response = await fetch(`${this.baseUrl}/offline-data`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to delete offline data');
    return response.json();
  }

  // ============================================
  // Voice Navigation
  // ============================================

  async getVoiceCommands(request: GetVoiceCommandsRequest = {}): Promise<VoiceCommand[]> {
    if (Config.DEVELOPER_MODE) {
      let commands = mockVoiceCommands;
      if (request.category) {
        commands = commands.filter(cmd => cmd.category === request.category);
      }
      return commands;
    }

    const params = new URLSearchParams();
    if (request.category) params.append('category', request.category);
    if (request.language) params.append('language', request.language);

    const response = await fetch(`${this.baseUrl}/voice-commands?${params}`);
    if (!response.ok) throw new Error('Failed to fetch voice commands');
    return response.json();
  }

  async executeVoiceCommand(request: ExecuteVoiceCommandRequest): Promise<{ success: boolean; action: string; message: string }> {
    if (Config.DEVELOPER_MODE) {
      await new Promise<void>(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        action: 'navigate',
        message: `Executing command: ${request.command}`,
      };
    }

    const response = await fetch(`${this.baseUrl}/execute-voice-command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to execute voice command');
    return response.json();
  }

  // ============================================
  // Bandwidth & Usage
  // ============================================

  async getBandwidthUsage(request: GetBandwidthUsageRequest = {}): Promise<BandwidthUsage[]> {
    if (Config.DEVELOPER_MODE) {
      return mockBandwidthUsage;
    }

    const params = new URLSearchParams();
    if (request.startDate) params.append('startDate', request.startDate.toISOString());
    if (request.endDate) params.append('endDate', request.endDate.toISOString());

    const response = await fetch(`${this.baseUrl}/bandwidth-usage?${params}`);
    if (!response.ok) throw new Error('Failed to fetch bandwidth usage');
    return response.json();
  }

  async getRegionalSettings(): Promise<RegionalSettings> {
    if (Config.DEVELOPER_MODE) {
      return mockRegionalSettings;
    }

    const response = await fetch(`${this.baseUrl}/regional-settings`);
    if (!response.ok) throw new Error('Failed to fetch regional settings');
    return response.json();
  }
}

// ============================================
// DEV MODE MOCK DATA
// ============================================

const mockLanguages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    isRTL: false,
    isEnabled: true,
    downloadedForOffline: true,
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    isRTL: false,
    isEnabled: true,
    downloadedForOffline: true,
    downloadSize: '5.2 MB',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    isRTL: false,
    isEnabled: true,
    downloadedForOffline: false,
    downloadSize: '4.8 MB',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    isRTL: false,
    isEnabled: true,
    downloadedForOffline: false,
    downloadSize: '4.9 MB',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    isRTL: false,
    isEnabled: true,
    downloadedForOffline: false,
    downloadSize: '5.1 MB',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    isRTL: false,
    isEnabled: true,
    downloadedForOffline: false,
    downloadSize: '4.7 MB',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    isRTL: false,
    isEnabled: true,
    downloadedForOffline: false,
    downloadSize: '4.6 MB',
  },
];

const mockAccessibilitySettings: AccessibilitySettings = {
  textSize: 'medium',
  themeMode: 'light',
  highContrast: false,
  boldText: false,
  reducedMotion: false,
  voiceNavigationEnabled: false,
  voiceGender: 'female',
  voiceSpeed: 'normal',
  screenReaderEnabled: false,
  audioFeedbackEnabled: true,
  elderlyMode: false,
  simplifiedNavigation: false,
  largerTouchTargets: false,
  confirmationDialogs: true,
  autoCorrectDisabled: false,
  keyboardPrediction: true,
  voiceInputEnabled: true,
  colorBlindMode: false,
  reduceTransparency: false,
  buttonShapes: false,
  preferredLanguage: 'en',
};

const mockOfflineSettings: OfflineSettings = {
  offlineModeEnabled: true,
  autoSyncEnabled: true,
  syncFrequency: 'daily',
  wifiOnlySync: true,
  syncHealthRecords: true,
  syncAppointments: true,
  syncMedications: true,
  syncLabReports: true,
  syncPrescriptions: true,
  bandwidthMode: 'auto',
  compressImages: true,
  downloadHighQuality: false,
  streamVideos: false,
  cacheSize: 256,
  maxCacheSize: 512,
  autoDeleteOldData: true,
  dataRetentionDays: 30,
};

const mockOfflineData: OfflineData[] = [
  {
    id: 'offline-1',
    type: 'health-record',
    title: 'Blood Test Report - Dec 2025',
    syncedAt: new Date('2025-12-15T10:00:00'),
    size: 524288, // 512 KB
    isAvailable: true,
    lastAccessedAt: new Date('2026-01-14T15:30:00'),
  },
  {
    id: 'offline-2',
    type: 'appointment',
    title: 'Dr. Sharma - Cardiology Follow-up',
    syncedAt: new Date('2026-01-10T08:00:00'),
    expiresAt: new Date('2026-01-20T10:00:00'),
    size: 102400, // 100 KB
    isAvailable: true,
    lastAccessedAt: new Date('2026-01-13T09:00:00'),
  },
  {
    id: 'offline-3',
    type: 'medication',
    title: 'Current Medications List',
    syncedAt: new Date('2026-01-14T18:00:00'),
    size: 51200, // 50 KB
    isAvailable: true,
    lastAccessedAt: new Date('2026-01-15T07:00:00'),
  },
  {
    id: 'offline-4',
    type: 'prescription',
    title: 'Prescription - Dr. Patel',
    syncedAt: new Date('2025-12-28T14:30:00'),
    expiresAt: new Date('2026-01-28T14:30:00'),
    size: 204800, // 200 KB
    isAvailable: true,
  },
  {
    id: 'offline-5',
    type: 'lab-report',
    title: 'Lipid Profile - Jan 2026',
    syncedAt: new Date('2026-01-05T11:00:00'),
    size: 614400, // 600 KB
    isAvailable: true,
    lastAccessedAt: new Date('2026-01-06T16:00:00'),
  },
];

const mockSyncStatus: SyncStatus = {
  isSyncing: false,
  lastSyncAt: new Date('2026-01-15T06:00:00'),
  nextSyncAt: new Date('2026-01-16T06:00:00'),
  syncProgress: 100,
  totalItems: 28,
  syncedItems: 28,
  failedItems: 0,
  errors: [],
};

const mockVoiceCommands: VoiceCommand[] = [
  {
    id: 'cmd-1',
    command: 'go to health records',
    action: 'navigate:HealthRecords',
    category: 'navigation',
    examples: ['open health records', 'show my records', 'view health data'],
  },
  {
    id: 'cmd-2',
    command: 'book appointment',
    action: 'navigate:BookAppointment',
    category: 'action',
    examples: ['make appointment', 'schedule doctor visit', 'book consultation'],
  },
  {
    id: 'cmd-3',
    command: 'read last report',
    action: 'read:lastReport',
    category: 'read',
    examples: ['tell me my last report', 'read recent lab results', 'what was my last test'],
  },
  {
    id: 'cmd-4',
    command: 'emergency',
    action: 'navigate:SOS',
    category: 'action',
    examples: ['help', 'SOS', 'call emergency'],
  },
  {
    id: 'cmd-5',
    command: 'increase text size',
    action: 'control:textSize:increase',
    category: 'control',
    examples: ['make text bigger', 'larger font', 'zoom in'],
  },
];

const mockBandwidthUsage: BandwidthUsage[] = [
  {
    date: new Date('2026-01-15T00:00:00'),
    uploadBytes: 2048000, // 2 MB
    downloadBytes: 15360000, // 15 MB
    totalBytes: 17408000,
    isWifi: true,
  },
  {
    date: new Date('2026-01-14T00:00:00'),
    uploadBytes: 1536000, // 1.5 MB
    downloadBytes: 12288000, // 12 MB
    totalBytes: 13824000,
    isWifi: false,
  },
  {
    date: new Date('2026-01-13T00:00:00'),
    uploadBytes: 3072000, // 3 MB
    downloadBytes: 20480000, // 20 MB
    totalBytes: 23552000,
    isWifi: true,
  },
];

const mockRegionalSettings: RegionalSettings = {
  language: 'en',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',
  currency: 'INR',
  measurementSystem: 'metric',
  phoneNumberFormat: '+91-XXXXX-XXXXX',
};

const mockTranslations: Record<string, string> = {
  'welcome': 'स्वागत है',
  'health_records': 'स्वास्थ्य रिकॉर्ड',
  'appointments': 'अपॉइंटमेंट',
  'emergency': 'आपातकाल',
  'settings': 'सेटिंग्स',
};

export default new AccessibilityService();
