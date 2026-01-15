// Notifications & Communication Service - Category 14
// Mock implementation for notifications, messaging, and communication preferences

import { Config } from '../../src/config/env';
import {
    NotificationSettings,
    Notification,
    NotificationCategory,
    NotificationChannel,
    NotificationPriority,
    Message,
    Conversation,
    ConversationParticipant,
    MessageTemplate,
    PushNotificationRequest,
    SendMessageRequest,
    NotificationStatistics,
    MessageStatistics,
    UpdateNotificationPreferencesRequest,
    NotificationBadge,
} from '../types/notifications';

// Mock Data
const mockNotificationSettings: NotificationSettings = {
    userId: 'user-001',
    channels: {
        push: true,
        sms: true,
        email: true,
        inApp: true,
    },
    categories: {
        health_record: {
            enabled: true,
            channels: ['push', 'in_app', 'email'],
            quietHours: {
                enabled: true,
                startTime: '22:00',
                endTime: '07:00',
            },
        },
        appointment: {
            enabled: true,
            channels: ['push', 'sms', 'email', 'in_app'],
            quietHours: {
                enabled: false,
                startTime: '22:00',
                endTime: '07:00',
            },
        },
        medication: {
            enabled: true,
            channels: ['push', 'in_app'],
        },
        consent_request: {
            enabled: true,
            channels: ['push', 'email', 'in_app'],
        },
        emergency: {
            enabled: true,
            channels: ['push', 'sms', 'in_app'],
        },
        insurance: {
            enabled: true,
            channels: ['push', 'in_app'],
        },
        system: {
            enabled: true,
            channels: ['in_app'],
        },
        marketing: {
            enabled: false,
            channels: [],
        },
    },
    frequency: {
        digestEnabled: false,
        maxDailyNotifications: 50,
    },
    language: 'en',
    soundEnabled: true,
    vibrationEnabled: true,
    updatedAt: new Date().toISOString(),
};

const mockNotifications: Notification[] = [
    {
        id: 'notif-001',
        userId: 'user-001',
        category: 'appointment',
        priority: 'high',
        title: 'Appointment Reminder',
        message: 'You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM',
        channels: ['push', 'in_app'],
        status: 'unread',
        sentAt: '2026-01-15T09:00:00Z',
        expiresAt: '2026-01-17T00:00:00Z',
        actionButtons: [
            { id: 'view', label: 'View Details', action: 'navigate://Appointments', type: 'primary' },
            { id: 'reschedule', label: 'Reschedule', action: 'navigate://BookAppointment', type: 'secondary' },
        ],
    },
    {
        id: 'notif-002',
        userId: 'user-001',
        category: 'medication',
        priority: 'medium',
        title: 'Medication Reminder',
        message: 'Time to take Metformin 500mg',
        channels: ['push', 'in_app'],
        status: 'unread',
        sentAt: '2026-01-15T08:30:00Z',
        actionButtons: [
            { id: 'taken', label: 'Mark as Taken', action: 'medication://mark-taken', type: 'primary' },
        ],
    },
    {
        id: 'notif-003',
        userId: 'user-001',
        category: 'consent_request',
        priority: 'high',
        title: 'Consent Request',
        message: 'Apollo Hospital requests access to your health records',
        channels: ['push', 'email', 'in_app'],
        status: 'read',
        sentAt: '2026-01-14T15:20:00Z',
        readAt: '2026-01-14T16:00:00Z',
        actionButtons: [
            { id: 'approve', label: 'Approve', action: 'consent://approve/req-123', type: 'primary' },
            { id: 'deny', label: 'Deny', action: 'consent://deny/req-123', type: 'secondary' },
        ],
    },
    {
        id: 'notif-004',
        userId: 'user-001',
        category: 'health_record',
        priority: 'medium',
        title: 'Lab Results Available',
        message: 'Your blood test results from Quest Diagnostics are now available',
        channels: ['push', 'email', 'in_app'],
        status: 'read',
        sentAt: '2026-01-13T11:00:00Z',
        readAt: '2026-01-13T12:30:00Z',
        actionButtons: [
            { id: 'view', label: 'View Results', action: 'navigate://HealthRecords', type: 'primary' },
        ],
    },
];

const mockConversations: Conversation[] = [
    {
        id: 'conv-001',
        participants: [
            {
                userId: 'user-001',
                userType: 'patient',
                name: 'Rajesh Kumar',
            },
            {
                userId: 'doctor-123',
                userType: 'doctor',
                name: 'Dr. Sarah Johnson',
                role: 'Cardiologist',
                hospital: 'Apollo Hospital',
            },
        ],
        subject: 'Post-consultation follow-up',
        category: 'appointment',
        lastMessage: {
            id: 'msg-003',
            conversationId: 'conv-001',
            senderId: 'doctor-123',
            senderType: 'doctor',
            senderName: 'Dr. Sarah Johnson',
            recipientId: 'user-001',
            recipientType: 'patient',
            content: 'Please take the prescribed medication twice daily and schedule a follow-up in 2 weeks.',
            isEncrypted: true,
            status: 'read',
            sentAt: '2026-01-14T16:45:00Z',
            deliveredAt: '2026-01-14T16:45:30Z',
            readAt: '2026-01-14T17:00:00Z',
        },
        unreadCount: 0,
        isArchived: false,
        isPinned: true,
        createdAt: '2026-01-10T10:00:00Z',
        updatedAt: '2026-01-14T16:45:00Z',
    },
    {
        id: 'conv-002',
        participants: [
            {
                userId: 'user-001',
                userType: 'patient',
                name: 'Rajesh Kumar',
            },
            {
                userId: 'hpr-456',
                userType: 'hpr',
                name: 'Fortis Hospital',
                hospital: 'Fortis Healthcare',
            },
        ],
        subject: 'Appointment scheduling query',
        category: 'appointment',
        lastMessage: {
            id: 'msg-005',
            conversationId: 'conv-002',
            senderId: 'hpr-456',
            senderType: 'hpr',
            senderName: 'Fortis Hospital',
            recipientId: 'user-001',
            recipientType: 'patient',
            content: 'We have availability on Monday, January 20th at 3:00 PM. Would that work for you?',
            isEncrypted: true,
            status: 'delivered',
            sentAt: '2026-01-15T10:30:00Z',
            deliveredAt: '2026-01-15T10:30:15Z',
        },
        unreadCount: 1,
        isArchived: false,
        isPinned: false,
        createdAt: '2026-01-15T09:00:00Z',
        updatedAt: '2026-01-15T10:30:00Z',
    },
];

const mockMessages: Message[] = [
    {
        id: 'msg-001',
        conversationId: 'conv-001',
        senderId: 'user-001',
        senderType: 'patient',
        senderName: 'Rajesh Kumar',
        recipientId: 'doctor-123',
        recipientType: 'doctor',
        content: 'Hello Doctor, I wanted to follow up on my blood pressure readings.',
        isEncrypted: true,
        status: 'read',
        sentAt: '2026-01-14T14:00:00Z',
        deliveredAt: '2026-01-14T14:00:15Z',
        readAt: '2026-01-14T15:30:00Z',
    },
    {
        id: 'msg-002',
        conversationId: 'conv-001',
        senderId: 'doctor-123',
        senderType: 'doctor',
        senderName: 'Dr. Sarah Johnson',
        recipientId: 'user-001',
        recipientType: 'patient',
        content: 'Thank you for sharing. Your recent readings look good. Continue with the current medication.',
        isEncrypted: true,
        status: 'read',
        sentAt: '2026-01-14T16:30:00Z',
        deliveredAt: '2026-01-14T16:30:20Z',
        readAt: '2026-01-14T16:40:00Z',
    },
];

class NotificationsService {
    private baseUrl = `${Config.getBaseUrl()}/notifications`;

    // Get Notification Settings
    async getNotificationSettings(): Promise<NotificationSettings> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return mockNotificationSettings;
        }

        const response = await fetch(`${this.baseUrl}/settings`);
        return response.json();
    }

    // Update Notification Settings
    async updateNotificationSettings(request: UpdateNotificationPreferencesRequest): Promise<NotificationSettings> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            
            const updated: NotificationSettings = {
                ...mockNotificationSettings,
                ...request,
                updatedAt: new Date().toISOString(),
            };

            if (request.channels) {
                updated.channels = { ...mockNotificationSettings.channels, ...request.channels };
            }

            if (request.frequency) {
                updated.frequency = { ...mockNotificationSettings.frequency, ...request.frequency };
            }

            if (request.category) {
                updated.categories = {
                    ...mockNotificationSettings.categories,
                    [request.category.category]: {
                        ...mockNotificationSettings.categories[request.category.category],
                        ...request.category.settings,
                    },
                };
            }

            return updated;
        }

        const response = await fetch(`${this.baseUrl}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        return response.json();
    }

    // Get Notifications
    async getNotifications(status?: 'unread' | 'read' | 'archived', limit?: number): Promise<Notification[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            
            let filtered = mockNotifications;
            if (status) {
                filtered = filtered.filter(n => n.status === status);
            }
            
            return limit ? filtered.slice(0, limit) : filtered;
        }

        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (limit) params.append('limit', limit.toString());

        const response = await fetch(`${this.baseUrl}?${params.toString()}`);
        return response.json();
    }

    // Mark Notification as Read
    async markAsRead(notificationId: string): Promise<{ success: boolean }> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
            const notif = mockNotifications.find(n => n.id === notificationId);
            if (notif) {
                notif.status = 'read';
                notif.readAt = new Date().toISOString();
            }
            return { success: true };
        }

        const response = await fetch(`${this.baseUrl}/${notificationId}/read`, {
            method: 'POST',
        });
        return response.json();
    }

    // Archive Notification
    async archiveNotification(notificationId: string): Promise<{ success: boolean }> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
            return { success: true };
        }

        const response = await fetch(`${this.baseUrl}/${notificationId}/archive`, {
            method: 'POST',
        });
        return response.json();
    }

    // Get Notification Badge
    async getNotificationBadge(): Promise<NotificationBadge> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 200));
            
            const unread = mockNotifications.filter(n => n.status === 'unread');
            const urgent = unread.filter(n => n.priority === 'urgent' || n.priority === 'high');
            
            return {
                total: mockNotifications.length,
                unread: unread.length,
                urgent: urgent.length,
                byCategory: {
                    appointment: unread.filter(n => n.category === 'appointment').length,
                    medication: unread.filter(n => n.category === 'medication').length,
                    consent_request: unread.filter(n => n.category === 'consent_request').length,
                },
            };
        }

        const response = await fetch(`${this.baseUrl}/badge`);
        return response.json();
    }

    // Get Conversations
    async getConversations(): Promise<Conversation[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return mockConversations;
        }

        const response = await fetch(`${this.baseUrl}/conversations`);
        return response.json();
    }

    // Get Messages
    async getMessages(conversationId: string, limit?: number): Promise<Message[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            const filtered = mockMessages.filter(m => m.conversationId === conversationId);
            return limit ? filtered.slice(0, limit) : filtered;
        }

        const url = limit 
            ? `${this.baseUrl}/conversations/${conversationId}/messages?limit=${limit}`
            : `${this.baseUrl}/conversations/${conversationId}/messages`;
        
        const response = await fetch(url);
        return response.json();
    }

    // Send Message
    async sendMessage(request: SendMessageRequest): Promise<Message> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 800));
            
            const newMessage: Message = {
                id: `msg-${Date.now()}`,
                conversationId: request.conversationId || `conv-${Date.now()}`,
                senderId: 'user-001',
                senderType: 'patient',
                senderName: 'Rajesh Kumar',
                recipientId: request.recipientId,
                recipientType: request.recipientType,
                content: request.content,
                isEncrypted: true,
                status: 'sent',
                sentAt: new Date().toISOString(),
                replyToId: request.replyToId,
            };

            return newMessage;
        }

        const response = await fetch(`${this.baseUrl}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        return response.json();
    }

    // Get Notification Statistics
    async getNotificationStatistics(): Promise<NotificationStatistics> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            
            return {
                totalSent: 156,
                totalRead: 142,
                totalArchived: 98,
                byCategory: {
                    health_record: 35,
                    appointment: 42,
                    medication: 28,
                    consent_request: 15,
                    emergency: 3,
                    insurance: 18,
                    system: 12,
                    marketing: 3,
                },
                byChannel: {
                    push: 120,
                    sms: 45,
                    email: 78,
                    in_app: 156,
                },
                readRate: 91.0,
                averageReadTime: 15,
            };
        }

        const response = await fetch(`${this.baseUrl}/statistics`);
        return response.json();
    }

    // Get Message Statistics
    async getMessageStatistics(): Promise<MessageStatistics> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            
            return {
                totalConversations: 8,
                activeConversations: 3,
                unreadMessages: 2,
                totalMessages: 47,
                responseRate: 85.0,
                averageResponseTime: 120,
            };
        }

        const response = await fetch(`${this.baseUrl}/messages/statistics`);
        return response.json();
    }

    // Send Push Notification (for testing)
    async sendPushNotification(request: PushNotificationRequest): Promise<{ success: boolean; notificationId: string }> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return {
                success: true,
                notificationId: `notif-${Date.now()}`,
            };
        }

        const response = await fetch(`${this.baseUrl}/push`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        return response.json();
    }
}

export const notificationsService = new NotificationsService();
