// Emergency & Safety Features - Category 7
// Critical safety features for healthcare emergencies

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string; // Mother, Father, Spouse, Sibling, Friend
  phone: string;
  email?: string;
  isPrimary: boolean;
  notifyOnEmergency: boolean;
  canAccessRecords: boolean; // Emergency access permission
}

export interface EmergencyCard {
  id: string;
  userId: string;
  abhaNumber: string;
  abhaAddress: string;
  
  // Personal Info
  fullName: string;
  dateOfBirth: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  bloodGroup: string; // A+, B+, AB+, O+, A-, B-, AB-, O-
  photo?: string;
  
  // Critical Medical Info
  allergies: string[]; // Drug allergies, food allergies
  chronicConditions: string[]; // Diabetes, Hypertension, etc.
  currentMedications: string[];
  implants?: string[]; // Pacemaker, stents, etc.
  organDonor: boolean;
  
  // Emergency Contacts
  emergencyContacts: EmergencyContact[];
  
  // Access Info
  qrCode: string; // QR code for quick access
  shortCode: string; // 6-digit code for manual entry
  
  // Metadata
  lastUpdated: string;
  version: number;
  expiresAt: string; // Auto-expire for security (e.g., 6 months)
  isActive: boolean;
}

export interface SOSRequest {
  id: string;
  userId: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  type: 'medical' | 'accident' | 'panic' | 'fall-detection';
  severity: 'critical' | 'high' | 'medium';
  
  // Auto-collected data
  heartRate?: number;
  bloodPressure?: string;
  oxygenLevel?: number;
  deviceBattery?: number;
  
  // Response tracking
  status: 'triggered' | 'dispatched' | 'arrived' | 'resolved' | 'cancelled';
  ambulanceETA?: string;
  ambulanceId?: string;
  responderId?: string; // First responder/paramedic
  
  // Notifications sent
  contactsNotified: string[]; // Contact IDs
  facilitiesNotified: string[]; // Nearby hospital IDs
  
  // Notes
  userNote?: string;
  responderNotes?: string;
}

export interface NearbyFacility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'ambulance';
  address: string;
  phone: string;
  distance: number; // in kilometers
  estimatedTime: number; // in minutes
  availability: 'open-24x7' | 'open-now' | 'closed';
  hasEmergency: boolean; // Has emergency department
  hasICU: boolean;
  hasBloodBank: boolean;
  acceptsInsurance: boolean;
  rating?: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface SafetyCheckIn {
  id: string;
  userId: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  message: string; // "I'm safe", "Need help", etc.
  mood?: 'safe' | 'worried' | 'distressed' | 'emergency';
  sharedWith: string[]; // Contact IDs who can see check-in
}

export interface FallDetectionEvent {
  id: string;
  userId: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  severity: 'high' | 'medium' | 'low';
  impact: number; // G-force
  resolved: boolean;
  falseAlarm: boolean;
  
  // Auto-response
  countdownStarted: boolean; // User has X seconds to cancel
  countdownDuration: number; // seconds
  autoSOSTriggered: boolean;
  
  userResponse?: 'im-ok' | 'need-help' | 'no-response';
  responseTime?: number; // seconds
}

export interface EmergencyAccessLog {
  id: string;
  userId: string; // Patient whose data was accessed
  accessedBy: string; // Doctor/Paramedic who accessed
  accessedByRole: 'doctor' | 'paramedic' | 'nurse' | 'hospital-staff';
  timestamp: string;
  reason: string; // Emergency treatment, accident, etc.
  location?: string;
  
  // Access details
  dataAccessed: string[]; // Medical history, allergies, etc.
  emergencyCardViewed: boolean;
  sosRequestId?: string; // Linked SOS request if any
  
  // Audit
  ipAddress?: string;
  deviceInfo?: string;
  verified: boolean; // OTP/biometric verification done
}

export interface QuickAccessSettings {
  userId: string;
  
  // Emergency Card Access
  allowEmergencyCardAccess: boolean;
  requireOTPForAccess: boolean;
  autoExpireCard: boolean;
  expiryDuration: number; // months
  
  // SOS Settings
  sosEnabled: boolean;
  sosShortcut: 'triple-tap' | 'power-button' | 'shake' | 'volume-buttons';
  autoCallEmergency: boolean; // Auto-dial 108/102
  autoNotifyContacts: boolean;
  autoShareLocation: boolean;
  
  // Fall Detection
  fallDetectionEnabled: boolean;
  fallDetectionSensitivity: 'high' | 'medium' | 'low';
  fallCountdownDuration: number; // seconds before auto-SOS
  
  // Safety Check-in
  safetyCheckInEnabled: boolean;
  checkInFrequency?: 'daily' | 'twice-daily' | 'weekly';
  checkInReminder: boolean;
  missedCheckInAction: 'notify-contacts' | 'do-nothing';
}

// API Request/Response types

export interface CreateEmergencyCardRequest {
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  implants?: string[];
  organDonor: boolean;
  emergencyContacts: Omit<EmergencyContact, 'id'>[];
}

export interface TriggerSOSRequest {
  type: 'medical' | 'accident' | 'panic' | 'fall-detection';
  location?: {
    latitude: number;
    longitude: number;
  };
  userNote?: string;
}

export interface AddEmergencyContactRequest {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
  notifyOnEmergency: boolean;
  canAccessRecords: boolean;
}

export interface UpdateQuickAccessSettingsRequest {
  allowEmergencyCardAccess?: boolean;
  requireOTPForAccess?: boolean;
  sosEnabled?: boolean;
  sosShortcut?: 'triple-tap' | 'power-button' | 'shake' | 'volume-buttons';
  autoCallEmergency?: boolean;
  autoNotifyContacts?: boolean;
  fallDetectionEnabled?: boolean;
  fallDetectionSensitivity?: 'high' | 'medium' | 'low';
}

export interface NearbyFacilitiesRequest {
  location: {
    latitude: number;
    longitude: number;
  };
  radius: number; // kilometers
  type?: 'hospital' | 'clinic' | 'pharmacy' | 'ambulance';
  hasEmergency?: boolean;
}
