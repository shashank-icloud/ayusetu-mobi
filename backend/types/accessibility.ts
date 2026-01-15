// India-First & Accessibility Types - Category 10
// Multi-language, voice navigation, elder-friendly UI, offline mode

export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa' | 'or';

export type TextSize = 'small' | 'medium' | 'large' | 'extra-large';

export type ThemeMode = 'light' | 'dark' | 'high-contrast' | 'elder-friendly';

export type BandwidthMode = 'auto' | 'low' | 'medium' | 'high';

export type VoiceGender = 'male' | 'female';

export type VoiceSpeed = 'slow' | 'normal' | 'fast';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  isRTL: boolean;
  isEnabled: boolean;
  downloadedForOffline: boolean;
  downloadSize?: string;
}

export interface AccessibilitySettings {
  // Text & Display
  textSize: TextSize;
  themeMode: ThemeMode;
  highContrast: boolean;
  boldText: boolean;
  reducedMotion: boolean;
  
  // Voice & Audio
  voiceNavigationEnabled: boolean;
  voiceGender: VoiceGender;
  voiceSpeed: VoiceSpeed;
  screenReaderEnabled: boolean;
  audioFeedbackEnabled: boolean;
  
  // Elder-friendly features
  elderlyMode: boolean;
  simplifiedNavigation: boolean;
  largerTouchTargets: boolean;
  confirmationDialogs: boolean;
  
  // Input assistance
  autoCorrectDisabled: boolean;
  keyboardPrediction: boolean;
  voiceInputEnabled: boolean;
  
  // Visual assistance
  colorBlindMode: boolean;
  reduceTransparency: boolean;
  buttonShapes: boolean;
  
  // Regional
  preferredLanguage: LanguageCode;
  secondaryLanguage?: LanguageCode;
}

export interface OfflineSettings {
  offlineModeEnabled: boolean;
  autoSyncEnabled: boolean;
  syncFrequency: 'hourly' | 'daily' | 'weekly' | 'manual';
  wifiOnlySync: boolean;
  
  // Data syncing
  syncHealthRecords: boolean;
  syncAppointments: boolean;
  syncMedications: boolean;
  syncLabReports: boolean;
  syncPrescriptions: boolean;
  
  // Bandwidth optimization
  bandwidthMode: BandwidthMode;
  compressImages: boolean;
  downloadHighQuality: boolean;
  streamVideos: boolean;
  
  // Storage
  cacheSize: number; // in MB
  maxCacheSize: number;
  autoDeleteOldData: boolean;
  dataRetentionDays: number;
}

export interface OfflineData {
  id: string;
  type: 'health-record' | 'appointment' | 'medication' | 'lab-report' | 'prescription' | 'consent';
  title: string;
  syncedAt: Date;
  expiresAt?: Date;
  size: number; // in bytes
  isAvailable: boolean;
  lastAccessedAt?: Date;
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSyncAt?: Date;
  nextSyncAt?: Date;
  syncProgress: number; // 0-100
  totalItems: number;
  syncedItems: number;
  failedItems: number;
  errors: string[];
}

export interface VoiceCommand {
  id: string;
  command: string;
  action: string;
  category: 'navigation' | 'action' | 'read' | 'control';
  examples: string[];
}

export interface TranslationPack {
  language: LanguageCode;
  version: string;
  downloadedAt?: Date;
  size: number; // in MB
  isAvailable: boolean;
  translations: Record<string, string>;
}

export interface BandwidthUsage {
  date: Date;
  uploadBytes: number;
  downloadBytes: number;
  totalBytes: number;
  isWifi: boolean;
}

export interface RegionalSettings {
  language: LanguageCode;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  currency: 'INR' | 'USD';
  measurementSystem: 'metric' | 'imperial';
  phoneNumberFormat: string;
}

// Request/Response types

export interface GetLanguagesRequest {
  includeOfflineStatus?: boolean;
}

export interface UpdateLanguageRequest {
  language: LanguageCode;
  downloadForOffline?: boolean;
}

export interface GetAccessibilitySettingsRequest {
  userId?: string;
}

export interface UpdateAccessibilitySettingsRequest {
  settings: Partial<AccessibilitySettings>;
}

export interface GetOfflineSettingsRequest {
  userId?: string;
}

export interface UpdateOfflineSettingsRequest {
  settings: Partial<OfflineSettings>;
}

export interface SyncOfflineDataRequest {
  dataTypes?: Array<'health-record' | 'appointment' | 'medication' | 'lab-report' | 'prescription'>;
  force?: boolean;
}

export interface GetOfflineDataRequest {
  type?: 'health-record' | 'appointment' | 'medication' | 'lab-report' | 'prescription' | 'consent';
  limit?: number;
}

export interface DeleteOfflineDataRequest {
  dataIds: string[];
}

export interface GetVoiceCommandsRequest {
  category?: 'navigation' | 'action' | 'read' | 'control';
  language?: LanguageCode;
}

export interface ExecuteVoiceCommandRequest {
  command: string;
  language?: LanguageCode;
}

export interface GetBandwidthUsageRequest {
  startDate?: Date;
  endDate?: Date;
}

export interface DownloadTranslationPackRequest {
  language: LanguageCode;
}
