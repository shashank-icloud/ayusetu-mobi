// Security & Privacy Controls - Category 8
// Authentication, authorization, and privacy protection features

export interface SecuritySettings {
  userId: string;
  
  // Authentication
  pinEnabled: boolean;
  pinHash?: string; // Hashed PIN, never store plain text
  biometricEnabled: boolean;
  biometricType?: 'fingerprint' | 'face-id' | 'iris';
  
  // Device Management
  deviceBindingEnabled: boolean;
  trustedDevices: TrustedDevice[];
  maxTrustedDevices: number;
  requireApprovalForNewDevice: boolean;
  
  // Session Management
  sessionTimeout: number; // minutes of inactivity
  autoLockEnabled: boolean;
  autoLockDuration: number; // minutes
  logoutOnScreenLock: boolean;
  
  // Privacy Controls
  screenshotPrevention: boolean;
  screenRecordingPrevention: boolean;
  hideNotificationContent: boolean;
  
  // Data Visibility Toggles
  dataVisibility: DataVisibilitySettings;
  
  // App Lock (per section)
  sectionLocks: SectionLockSettings;
  
  // Security Notifications
  loginAlerts: boolean;
  newDeviceAlerts: boolean;
  suspiciousActivityAlerts: boolean;
  
  // Advanced
  requireReAuthForSensitiveActions: boolean;
  twoFactorEnabled: boolean;
}

export interface TrustedDevice {
  id: string;
  deviceName: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  platform: 'iOS' | 'Android' | 'Web';
  deviceId: string; // Unique device identifier
  firstSeen: string;
  lastSeen: string;
  ipAddress?: string;
  location?: string;
  isCurrent: boolean;
  isVerified: boolean;
}

export interface DataVisibilitySettings {
  // Control what data is visible in the app
  showMedicalRecords: boolean;
  showLabReports: boolean;
  showPrescriptions: boolean;
  showVaccinations: boolean;
  showAllergies: boolean;
  showChronicConditions: boolean;
  showMedications: boolean;
  showInsuranceInfo: boolean;
  showEmergencyCard: boolean;
  
  // Partial masking options
  maskSensitiveDiagnoses: boolean;
  maskMentalHealthRecords: boolean;
  maskReproductiveHealthRecords: boolean;
}

export interface SectionLockSettings {
  // Require authentication for specific sections
  lockHealthRecords: boolean;
  lockLabReports: boolean;
  lockPrescriptions: boolean;
  lockInsurance: boolean;
  lockConsentManagement: boolean;
  lockEmergencyCard: boolean;
  lockSettings: boolean;
}

export interface LoginSession {
  id: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  platform: string;
  ipAddress: string;
  location?: string;
  loginTime: string;
  lastActivity: string;
  isActive: boolean;
  expiresAt: string;
}

export interface SecurityEvent {
  id: string;
  userId: string;
  eventType: 'login' | 'logout' | 'failed-login' | 'new-device' | 'device-removed' | 'settings-changed' | 'suspicious-activity';
  timestamp: string;
  deviceId?: string;
  deviceName?: string;
  ipAddress?: string;
  location?: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
  acknowledged: boolean;
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometricType?: 'fingerprint' | 'face-id' | 'iris';
}

export interface PINValidationResult {
  valid: boolean;
  attemptsRemaining?: number;
  lockedUntil?: string;
}

export interface DeviceApprovalRequest {
  id: string;
  requestedBy: string; // Device ID
  deviceName: string;
  deviceType: string;
  platform: string;
  ipAddress: string;
  location?: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// API Request/Response types

export interface SetPINRequest {
  pin: string; // Will be hashed on client before sending
  confirmPin: string;
}

export interface ValidatePINRequest {
  pin: string; // Will be hashed on client before sending
}

export interface EnableBiometricRequest {
  biometricType: 'fingerprint' | 'face-id' | 'iris';
}

export interface UpdateSecuritySettingsRequest {
  pinEnabled?: boolean;
  biometricEnabled?: boolean;
  deviceBindingEnabled?: boolean;
  sessionTimeout?: number;
  autoLockEnabled?: boolean;
  autoLockDuration?: number;
  screenshotPrevention?: boolean;
  loginAlerts?: boolean;
  newDeviceAlerts?: boolean;
  requireReAuthForSensitiveActions?: boolean;
}

export interface UpdateDataVisibilityRequest {
  showMedicalRecords?: boolean;
  showLabReports?: boolean;
  showPrescriptions?: boolean;
  maskSensitiveDiagnoses?: boolean;
  maskMentalHealthRecords?: boolean;
}

export interface UpdateSectionLocksRequest {
  lockHealthRecords?: boolean;
  lockLabReports?: boolean;
  lockPrescriptions?: boolean;
  lockInsurance?: boolean;
  lockConsentManagement?: boolean;
}

export interface AddTrustedDeviceRequest {
  deviceName: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  platform: 'iOS' | 'Android' | 'Web';
  deviceId: string;
}

export interface RemoveTrustedDeviceRequest {
  deviceId: string;
}

export interface TerminateSessionRequest {
  sessionId: string;
}

// Privacy Shield Score
export interface PrivacyShieldScore {
  score: number; // 0-100
  level: 'low' | 'medium' | 'high' | 'maximum';
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  lastCalculated: string;
}
