// Security & Privacy Service - Category 8
// Authentication, authorization, and privacy protection

import { Config } from '../../src/config/env';
import {
    SecuritySettings,
    TrustedDevice,
    LoginSession,
    SecurityEvent,
    BiometricAuthResult,
    PINValidationResult,
    DeviceApprovalRequest,
    PrivacyShieldScore,
    SetPINRequest,
    ValidatePINRequest,
    EnableBiometricRequest,
    UpdateSecuritySettingsRequest,
    UpdateDataVisibilityRequest,
    UpdateSectionLocksRequest,
    AddTrustedDeviceRequest,
    RemoveTrustedDeviceRequest,
    TerminateSessionRequest,
} from '../types/security';

class SecurityService {
    private baseUrl = `${Config.getBaseUrl()}/security`;

    // ============================================
    // Security Settings
    // ============================================

    async getSecuritySettings(): Promise<SecuritySettings> {
        if (Config.DEVELOPER_MODE) {
            return {
                userId: 'user-001',

                pinEnabled: true,
                pinHash: 'hashed_pin_value',
                biometricEnabled: true,
                biometricType: 'fingerprint',

                deviceBindingEnabled: true,
                trustedDevices: [
                    {
                        id: 'device-001',
                        deviceName: "Shashank's iPhone",
                        deviceType: 'mobile',
                        platform: 'iOS',
                        deviceId: 'ios-device-123',
                        firstSeen: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                        lastSeen: new Date().toISOString(),
                        ipAddress: '192.168.1.10',
                        location: 'New Delhi, India',
                        isCurrent: true,
                        isVerified: true,
                    },
                    {
                        id: 'device-002',
                        deviceName: "Shashank's MacBook",
                        deviceType: 'desktop',
                        platform: 'Web',
                        deviceId: 'web-device-456',
                        firstSeen: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                        lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                        ipAddress: '192.168.1.20',
                        location: 'New Delhi, India',
                        isCurrent: false,
                        isVerified: true,
                    },
                ],
                maxTrustedDevices: 5,
                requireApprovalForNewDevice: true,

                sessionTimeout: 15,
                autoLockEnabled: true,
                autoLockDuration: 5,
                logoutOnScreenLock: false,

                screenshotPrevention: true,
                screenRecordingPrevention: true,
                hideNotificationContent: true,

                dataVisibility: {
                    showMedicalRecords: true,
                    showLabReports: true,
                    showPrescriptions: true,
                    showVaccinations: true,
                    showAllergies: true,
                    showChronicConditions: true,
                    showMedications: true,
                    showInsuranceInfo: true,
                    showEmergencyCard: true,
                    maskSensitiveDiagnoses: true,
                    maskMentalHealthRecords: true,
                    maskReproductiveHealthRecords: true,
                },

                sectionLocks: {
                    lockHealthRecords: true,
                    lockLabReports: true,
                    lockPrescriptions: false,
                    lockInsurance: true,
                    lockConsentManagement: true,
                    lockEmergencyCard: false,
                    lockSettings: true,
                },

                loginAlerts: true,
                newDeviceAlerts: true,
                suspiciousActivityAlerts: true,

                requireReAuthForSensitiveActions: true,
                twoFactorEnabled: false,
            };
        }

        const response = await fetch(`${this.baseUrl}/settings`);
        if (!response.ok) throw new Error('Failed to fetch security settings');
        return response.json();
    }

    async updateSecuritySettings(request: UpdateSecuritySettingsRequest): Promise<SecuritySettings> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            const existing = await this.getSecuritySettings();
            return {
                ...existing,
                ...request,
            };
        }

        const response = await fetch(`${this.baseUrl}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to update security settings');
        return response.json();
    }

    // ============================================
    // PIN Management
    // ============================================

    async setPIN(request: SetPINRequest): Promise<void> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            if (request.pin !== request.confirmPin) {
                throw new Error('PINs do not match');
            }
            if (request.pin.length < 4 || request.pin.length > 6) {
                throw new Error('PIN must be 4-6 digits');
            }
            return;
        }

        const response = await fetch(`${this.baseUrl}/pin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to set PIN');
    }

    async validatePIN(request: ValidatePINRequest): Promise<PINValidationResult> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
            // In dev mode, accept "1234" as valid PIN
            if (request.pin === '1234') {
                return { valid: true };
            } else {
                return {
                    valid: false,
                    attemptsRemaining: 3,
                };
            }
        }

        const response = await fetch(`${this.baseUrl}/pin/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to validate PIN');
        return response.json();
    }

    async changePIN(oldPin: string, newPin: string, confirmNewPin: string): Promise<void> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            if (newPin !== confirmNewPin) {
                throw new Error('New PINs do not match');
            }
            if (oldPin !== '1234') {
                throw new Error('Current PIN is incorrect');
            }
            return;
        }

        const response = await fetch(`${this.baseUrl}/pin/change`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPin, newPin, confirmNewPin }),
        });
        if (!response.ok) throw new Error('Failed to change PIN');
    }

    async removePIN(): Promise<void> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return;
        }

        const response = await fetch(`${this.baseUrl}/pin`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to remove PIN');
    }

    // ============================================
    // Biometric Authentication
    // ============================================

    async enableBiometric(request: EnableBiometricRequest): Promise<void> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return;
        }

        const response = await fetch(`${this.baseUrl}/biometric/enable`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to enable biometric');
    }

    async disableBiometric(): Promise<void> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return;
        }

        const response = await fetch(`${this.baseUrl}/biometric/disable`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to disable biometric');
    }

    async authenticateWithBiometric(): Promise<BiometricAuthResult> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
            // Simulate biometric success
            return {
                success: true,
                biometricType: 'fingerprint',
            };
        }

        const response = await fetch(`${this.baseUrl}/biometric/authenticate`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to authenticate with biometric');
        return response.json();
    }

    // ============================================
    // Device Management
    // ============================================

    async getTrustedDevices(): Promise<TrustedDevice[]> {
        if (Config.DEVELOPER_MODE) {
            const settings = await this.getSecuritySettings();
            return settings.trustedDevices;
        }

        const response = await fetch(`${this.baseUrl}/devices`);
        if (!response.ok) throw new Error('Failed to fetch trusted devices');
        return response.json();
    }

    async addTrustedDevice(request: AddTrustedDeviceRequest): Promise<TrustedDevice> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return {
                id: `device-${Date.now()}`,
                deviceName: request.deviceName,
                deviceType: request.deviceType,
                platform: request.platform,
                deviceId: request.deviceId,
                firstSeen: new Date().toISOString(),
                lastSeen: new Date().toISOString(),
                ipAddress: '192.168.1.30',
                location: 'New Delhi, India',
                isCurrent: false,
                isVerified: true,
            };
        }

        const response = await fetch(`${this.baseUrl}/devices`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to add trusted device');
        return response.json();
    }

    async removeTrustedDevice(request: RemoveTrustedDeviceRequest): Promise<void> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return;
        }

        const response = await fetch(`${this.baseUrl}/devices/${request.deviceId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to remove trusted device');
    }

    async getPendingDeviceApprovals(): Promise<DeviceApprovalRequest[]> {
        if (Config.DEVELOPER_MODE) {
            return [
                {
                    id: 'approval-001',
                    requestedBy: 'new-device-789',
                    deviceName: 'iPad Pro',
                    deviceType: 'tablet',
                    platform: 'iOS',
                    ipAddress: '192.168.1.40',
                    location: 'Mumbai, India',
                    requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    status: 'pending',
                },
            ];
        }

        const response = await fetch(`${this.baseUrl}/device-approvals`);
        if (!response.ok) throw new Error('Failed to fetch device approvals');
        return response.json();
    }

    async approveDevice(approvalId: string): Promise<void> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return;
        }

        const response = await fetch(`${this.baseUrl}/device-approvals/${approvalId}/approve`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to approve device');
    }

    async rejectDevice(approvalId: string): Promise<void> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return;
        }

        const response = await fetch(`${this.baseUrl}/device-approvals/${approvalId}/reject`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to reject device');
    }

    // ============================================
    // Session Management
    // ============================================

    async getActiveSessions(): Promise<LoginSession[]> {
        if (Config.DEVELOPER_MODE) {
            return [
                {
                    id: 'session-001',
                    userId: 'user-001',
                    deviceId: 'ios-device-123',
                    deviceName: "Shashank's iPhone",
                    platform: 'iOS',
                    ipAddress: '192.168.1.10',
                    location: 'New Delhi, India',
                    loginTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    lastActivity: new Date().toISOString(),
                    isActive: true,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: 'session-002',
                    userId: 'user-001',
                    deviceId: 'web-device-456',
                    deviceName: "Shashank's MacBook",
                    platform: 'Web',
                    ipAddress: '192.168.1.20',
                    location: 'New Delhi, India',
                    loginTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                    isActive: true,
                    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
                },
            ];
        }

        const response = await fetch(`${this.baseUrl}/sessions`);
        if (!response.ok) throw new Error('Failed to fetch active sessions');
        return response.json();
    }

    async terminateSession(request: TerminateSessionRequest): Promise<void> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return;
        }

        const response = await fetch(`${this.baseUrl}/sessions/${request.sessionId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to terminate session');
    }

    async terminateAllOtherSessions(): Promise<void> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return;
        }

        const response = await fetch(`${this.baseUrl}/sessions/terminate-others`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to terminate other sessions');
    }

    // ============================================
    // Security Events & Audit
    // ============================================

    async getSecurityEvents(): Promise<SecurityEvent[]> {
        if (Config.DEVELOPER_MODE) {
            return [
                {
                    id: 'event-001',
                    userId: 'user-001',
                    eventType: 'login',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    deviceId: 'ios-device-123',
                    deviceName: "Shashank's iPhone",
                    ipAddress: '192.168.1.10',
                    location: 'New Delhi, India',
                    details: 'Successful login with biometric',
                    severity: 'info',
                    acknowledged: true,
                },
                {
                    id: 'event-002',
                    userId: 'user-001',
                    eventType: 'failed-login',
                    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                    deviceId: 'unknown-device',
                    ipAddress: '103.45.67.89',
                    location: 'Unknown',
                    details: 'Failed login attempt - incorrect PIN',
                    severity: 'warning',
                    acknowledged: false,
                },
                {
                    id: 'event-003',
                    userId: 'user-001',
                    eventType: 'new-device',
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    deviceId: 'web-device-456',
                    deviceName: "Shashank's MacBook",
                    ipAddress: '192.168.1.20',
                    location: 'New Delhi, India',
                    details: 'New device added to trusted devices',
                    severity: 'info',
                    acknowledged: true,
                },
            ];
        }

        const response = await fetch(`${this.baseUrl}/security-events`);
        if (!response.ok) throw new Error('Failed to fetch security events');
        return response.json();
    }

    async acknowledgeSecurityEvent(eventId: string): Promise<void> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
            return;
        }

        const response = await fetch(`${this.baseUrl}/security-events/${eventId}/acknowledge`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to acknowledge security event');
    }

    // ============================================
    // Data Visibility & Section Locks
    // ============================================

    async updateDataVisibility(request: UpdateDataVisibilityRequest): Promise<void> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return;
        }

        const response = await fetch(`${this.baseUrl}/data-visibility`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to update data visibility');
    }

    async updateSectionLocks(request: UpdateSectionLocksRequest): Promise<void> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return;
        }

        const response = await fetch(`${this.baseUrl}/section-locks`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to update section locks');
    }

    // ============================================
    // Privacy Shield Score
    // ============================================

    async getPrivacyShieldScore(): Promise<PrivacyShieldScore> {
        if (Config.DEVELOPER_MODE) {
            return {
                score: 85,
                level: 'high',
                recommendations: [
                    'Enable two-factor authentication for enhanced security',
                    'Consider enabling screenshot prevention for all sections',
                ],
                strengths: [
                    'PIN and biometric authentication enabled',
                    'Device binding active with trusted devices',
                    'Sensitive data masking enabled',
                    'Login alerts configured',
                ],
                weaknesses: [
                    'Two-factor authentication not enabled',
                    'Some sections not locked',
                ],
                lastCalculated: new Date().toISOString(),
            };
        }

        const response = await fetch(`${this.baseUrl}/privacy-shield-score`);
        if (!response.ok) throw new Error('Failed to fetch privacy shield score');
        return response.json();
    }
}

export const securityService = new SecurityService();
