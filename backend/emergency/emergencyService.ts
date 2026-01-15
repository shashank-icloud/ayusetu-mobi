// Emergency & Safety Service - Category 7
// Critical safety features for healthcare emergencies

import { Config } from '../../src/config/env';
import {
    EmergencyCard,
    EmergencyContact,
    SOSRequest,
    NearbyFacility,
    SafetyCheckIn,
    FallDetectionEvent,
    EmergencyAccessLog,
    QuickAccessSettings,
    CreateEmergencyCardRequest,
    TriggerSOSRequest,
    AddEmergencyContactRequest,
    UpdateQuickAccessSettingsRequest,
    NearbyFacilitiesRequest,
} from '../types/emergency';

class EmergencyService {
    private baseUrl = `${Config.getBaseUrl()}/emergency`;

    // ============================================
    // Emergency Card Management
    // ============================================

    async getEmergencyCard(): Promise<EmergencyCard | null> {
        if (Config.DEVELOPER_MODE) {
            // Mock emergency card
            return {
                id: 'ec-001',
                userId: 'user-001',
                abhaNumber: '91-1234-5678-9012',
                abhaAddress: 'john.doe@abdm',

                fullName: 'John Doe',
                dateOfBirth: '1988-05-15',
                age: 35,
                gender: 'M',
                bloodGroup: 'O+',
                photo: 'https://example.com/photo.jpg',

                allergies: ['Penicillin', 'Peanuts', 'Shellfish'],
                chronicConditions: ['Type 2 Diabetes', 'Hypertension'],
                currentMedications: ['Metformin 500mg (2x daily)', 'Amlodipine 5mg (1x daily)'],
                implants: ['Dental crown'],
                organDonor: true,

                emergencyContacts: [
                    {
                        id: 'contact-001',
                        name: 'Jane Doe',
                        relationship: 'Spouse',
                        phone: '+91 98765 43210',
                        email: 'jane.doe@example.com',
                        isPrimary: true,
                        notifyOnEmergency: true,
                        canAccessRecords: true,
                    },
                    {
                        id: 'contact-002',
                        name: 'Robert Doe',
                        relationship: 'Father',
                        phone: '+91 98765 43211',
                        email: 'robert.doe@example.com',
                        isPrimary: false,
                        notifyOnEmergency: true,
                        canAccessRecords: false,
                    },
                ],

                qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...',
                shortCode: 'ABC123',

                lastUpdated: new Date().toISOString(),
                version: 1,
                expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months
                isActive: true,
            };
        }

        const response = await fetch(`${this.baseUrl}/card`);
        if (!response.ok) throw new Error('Failed to fetch emergency card');
        return response.json();
    }

    async createEmergencyCard(request: CreateEmergencyCardRequest): Promise<EmergencyCard> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

            return {
                id: 'ec-new',
                userId: 'user-001',
                abhaNumber: '91-1234-5678-9012',
                abhaAddress: 'john.doe@abdm',
                fullName: 'John Doe',
                dateOfBirth: '1988-05-15',
                age: 35,
                gender: 'M',
                bloodGroup: request.bloodGroup,
                allergies: request.allergies,
                chronicConditions: request.chronicConditions,
                currentMedications: request.currentMedications,
                implants: request.implants,
                organDonor: request.organDonor,
                emergencyContacts: request.emergencyContacts.map((c, i) => ({
                    ...c,
                    id: `contact-${i + 1}`,
                })),
                qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...',
                shortCode: 'ABC123',
                lastUpdated: new Date().toISOString(),
                version: 1,
                expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
                isActive: true,
            };
        }

        const response = await fetch(`${this.baseUrl}/card`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to create emergency card');
        return response.json();
    }

    async updateEmergencyCard(request: Partial<CreateEmergencyCardRequest>): Promise<EmergencyCard> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            const existingCard = await this.getEmergencyCard();
            return {
                ...existingCard!,
                ...request,
                emergencyContacts: request.emergencyContacts?.map((contact, idx) => ({
                    id: `contact-${idx + 1}`,
                    ...contact,
                })) || existingCard!.emergencyContacts,
                lastUpdated: new Date().toISOString(),
                version: (existingCard?.version || 0) + 1,
            };
        }

        const response = await fetch(`${this.baseUrl}/card`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to update emergency card');
        return response.json();
    }

    async regenerateQRCode(): Promise<string> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...NEW';
        }

        const response = await fetch(`${this.baseUrl}/card/regenerate-qr`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to regenerate QR code');
        const data = await response.json();
        return data.qrCode;
    }

    // ============================================
    // Emergency Contacts
    // ============================================

    async addEmergencyContact(request: AddEmergencyContactRequest): Promise<EmergencyContact> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return {
                id: `contact-${Date.now()}`,
                ...request,
            };
        }

        const response = await fetch(`${this.baseUrl}/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to add emergency contact');
        return response.json();
    }

    async updateEmergencyContact(
        contactId: string,
        request: Partial<AddEmergencyContactRequest>
    ): Promise<EmergencyContact> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            const card = await this.getEmergencyCard();
            const existingContact = card?.emergencyContacts.find(c => c.id === contactId);
            return {
                ...existingContact!,
                ...request,
            };
        }

        const response = await fetch(`${this.baseUrl}/contacts/${contactId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to update emergency contact');
        return response.json();
    }

    async deleteEmergencyContact(contactId: string): Promise<void> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return;
        }

        const response = await fetch(`${this.baseUrl}/contacts/${contactId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete emergency contact');
    }

    // ============================================
    // SOS & Emergency Response
    // ============================================

    async triggerSOS(request: TriggerSOSRequest): Promise<SOSRequest> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

            return {
                id: `sos-${Date.now()}`,
                userId: 'user-001',
                timestamp: new Date().toISOString(),
                location: request.location || {
                    latitude: 28.6139,
                    longitude: 77.209,
                    address: 'Connaught Place, New Delhi',
                },
                type: request.type,
                severity: request.type === 'fall-detection' ? 'critical' : 'high',

                heartRate: 110,
                bloodPressure: '140/90',
                oxygenLevel: 94,
                deviceBattery: 45,

                status: 'dispatched',
                ambulanceETA: '8 minutes',
                ambulanceId: 'amb-101',

                contactsNotified: ['contact-001', 'contact-002'],
                facilitiesNotified: ['hospital-001', 'hospital-002'],

                userNote: request.userNote,
            };
        }

        const response = await fetch(`${this.baseUrl}/sos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to trigger SOS');
        return response.json();
    }

    async cancelSOS(sosId: string): Promise<void> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return;
        }

        const response = await fetch(`${this.baseUrl}/sos/${sosId}/cancel`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to cancel SOS');
    }

    async getSOSHistory(): Promise<SOSRequest[]> {
        if (Config.DEVELOPER_MODE) {
            return [
                {
                    id: 'sos-001',
                    userId: 'user-001',
                    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    location: {
                        latitude: 28.6139,
                        longitude: 77.209,
                        address: 'Connaught Place, New Delhi',
                    },
                    type: 'medical',
                    severity: 'critical',
                    heartRate: 115,
                    status: 'resolved',
                    ambulanceETA: '7 minutes',
                    contactsNotified: ['contact-001'],
                    facilitiesNotified: ['hospital-001'],
                },
            ];
        }

        const response = await fetch(`${this.baseUrl}/sos/history`);
        if (!response.ok) throw new Error('Failed to fetch SOS history');
        return response.json();
    }

    // ============================================
    // Nearby Facilities
    // ============================================

    async getNearbyFacilities(request: NearbyFacilitiesRequest): Promise<NearbyFacility[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

            return [
                {
                    id: 'hospital-001',
                    name: 'Apollo Hospital',
                    type: 'hospital',
                    address: 'Sarita Vihar, New Delhi',
                    phone: '+91 11 2692 5858',
                    distance: 2.5,
                    estimatedTime: 10,
                    availability: 'open-24x7',
                    hasEmergency: true,
                    hasICU: true,
                    hasBloodBank: true,
                    acceptsInsurance: true,
                    rating: 4.5,
                    location: {
                        latitude: 28.5355,
                        longitude: 77.2910,
                    },
                },
                {
                    id: 'hospital-002',
                    name: 'Fortis Hospital',
                    type: 'hospital',
                    address: 'Okhla, New Delhi',
                    phone: '+91 11 4277 6222',
                    distance: 3.2,
                    estimatedTime: 12,
                    availability: 'open-24x7',
                    hasEmergency: true,
                    hasICU: true,
                    hasBloodBank: true,
                    acceptsInsurance: true,
                    rating: 4.3,
                    location: {
                        latitude: 28.5270,
                        longitude: 77.2734,
                    },
                },
                {
                    id: 'clinic-001',
                    name: 'City Health Clinic',
                    type: 'clinic',
                    address: 'Nehru Place, New Delhi',
                    phone: '+91 11 2622 1234',
                    distance: 1.8,
                    estimatedTime: 8,
                    availability: 'open-now',
                    hasEmergency: false,
                    hasICU: false,
                    hasBloodBank: false,
                    acceptsInsurance: false,
                    rating: 4.0,
                    location: {
                        latitude: 28.5494,
                        longitude: 77.2500,
                    },
                },
            ];
        }

        const response = await fetch(`${this.baseUrl}/nearby-facilities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to fetch nearby facilities');
        return response.json();
    }

    // ============================================
    // Safety Check-in
    // ============================================

    async createSafetyCheckIn(
        message: string,
        mood: 'safe' | 'worried' | 'distressed' | 'emergency',
        location?: { latitude: number; longitude: number }
    ): Promise<SafetyCheckIn> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

            return {
                id: `checkin-${Date.now()}`,
                userId: 'user-001',
                timestamp: new Date().toISOString(),
                location: location ? {
                    ...location,
                    address: 'Current Location',
                } : undefined,
                message,
                mood,
                sharedWith: ['contact-001', 'contact-002'],
            };
        }

        const response = await fetch(`${this.baseUrl}/safety-checkin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, mood, location }),
        });
        if (!response.ok) throw new Error('Failed to create safety check-in');
        return response.json();
    }

    async getSafetyCheckInHistory(): Promise<SafetyCheckIn[]> {
        if (Config.DEVELOPER_MODE) {
            return [
                {
                    id: 'checkin-001',
                    userId: 'user-001',
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    message: "I'm safe and feeling good!",
                    mood: 'safe',
                    sharedWith: ['contact-001'],
                },
                {
                    id: 'checkin-002',
                    userId: 'user-001',
                    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
                    message: 'Feeling a bit unwell',
                    mood: 'worried',
                    sharedWith: ['contact-001', 'contact-002'],
                },
            ];
        }

        const response = await fetch(`${this.baseUrl}/safety-checkin/history`);
        if (!response.ok) throw new Error('Failed to fetch safety check-in history');
        return response.json();
    }

    // ============================================
    // Fall Detection
    // ============================================

    async reportFallDetection(
        severity: 'high' | 'medium' | 'low',
        impact: number,
        location?: { latitude: number; longitude: number }
    ): Promise<FallDetectionEvent> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

            return {
                id: `fall-${Date.now()}`,
                userId: 'user-001',
                timestamp: new Date().toISOString(),
                location,
                severity,
                impact,
                resolved: false,
                falseAlarm: false,
                countdownStarted: true,
                countdownDuration: 30,
                autoSOSTriggered: false,
            };
        }

        const response = await fetch(`${this.baseUrl}/fall-detection`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ severity, impact, location }),
        });
        if (!response.ok) throw new Error('Failed to report fall detection');
        return response.json();
    }

    async respondToFallDetection(
        fallId: string,
        response: 'im-ok' | 'need-help'
    ): Promise<void> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return;
        }

        const apiResponse = await fetch(`${this.baseUrl}/fall-detection/${fallId}/respond`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ response }),
        });
        if (!apiResponse.ok) throw new Error('Failed to respond to fall detection');
    }

    // ============================================
    // Emergency Access Logs
    // ============================================

    async getEmergencyAccessLogs(): Promise<EmergencyAccessLog[]> {
        if (Config.DEVELOPER_MODE) {
            return [
                {
                    id: 'log-001',
                    userId: 'user-001',
                    accessedBy: 'Dr. Sarah Johnson',
                    accessedByRole: 'doctor',
                    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    reason: 'Emergency treatment - road accident',
                    location: 'Apollo Hospital Emergency',
                    dataAccessed: ['Medical History', 'Allergies', 'Current Medications', 'Blood Group'],
                    emergencyCardViewed: true,
                    sosRequestId: 'sos-001',
                    verified: true,
                },
            ];
        }

        const response = await fetch(`${this.baseUrl}/access-logs`);
        if (!response.ok) throw new Error('Failed to fetch emergency access logs');
        return response.json();
    }

    // ============================================
    // Settings
    // ============================================

    async getQuickAccessSettings(): Promise<QuickAccessSettings> {
        if (Config.DEVELOPER_MODE) {
            return {
                userId: 'user-001',
                allowEmergencyCardAccess: true,
                requireOTPForAccess: false,
                autoExpireCard: true,
                expiryDuration: 6,
                sosEnabled: true,
                sosShortcut: 'triple-tap',
                autoCallEmergency: true,
                autoNotifyContacts: true,
                autoShareLocation: true,
                fallDetectionEnabled: true,
                fallDetectionSensitivity: 'medium',
                fallCountdownDuration: 30,
                safetyCheckInEnabled: false,
                checkInReminder: false,
                missedCheckInAction: 'notify-contacts',
            };
        }

        const response = await fetch(`${this.baseUrl}/settings`);
        if (!response.ok) throw new Error('Failed to fetch quick access settings');
        return response.json();
    }

    async updateQuickAccessSettings(
        request: UpdateQuickAccessSettingsRequest
    ): Promise<QuickAccessSettings> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            const existing = await this.getQuickAccessSettings();
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
        if (!response.ok) throw new Error('Failed to update quick access settings');
        return response.json();
    }
}

export const emergencyService = new EmergencyService();
