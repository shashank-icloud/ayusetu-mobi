// Notifications & Communication Types - Category 14
// Push notifications, messaging, and communication preferences

export type NotificationCategory =
    | 'health_record'
    | 'appointment'
    | 'medication'
    | 'consent_request'
    | 'emergency'
    | 'insurance'
    | 'system'
    | 'marketing';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationChannel = 'push' | 'sms' | 'email' | 'in_app';

export type NotificationStatus = 'unread' | 'read' | 'archived';

// Notification Settings
export interface NotificationSettings {
    userId: string;
    channels: {
        push: boolean;
        sms: boolean;
        email: boolean;
        inApp: boolean;
    };
    categories: {
        [key in NotificationCategory]: {
            enabled: boolean;
            channels: NotificationChannel[];
            quietHours?: {
                enabled: boolean;
                startTime: string; // HH:mm format
                endTime: string;
            };
        };
    };
    frequency: {
        digestEnabled: boolean;
        digestTime?: string; // HH:mm format
        maxDailyNotifications?: number;
    };
    language: string;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    updatedAt: string;
}

// Notification
export interface Notification {
    id: string;
    userId: string;
    category: NotificationCategory;
    priority: NotificationPriority;
    title: string;
    message: string;
    data?: Record<string, any>;
    channels: NotificationChannel[];
    status: NotificationStatus;
    sentAt: string;
    readAt?: string;
    archivedAt?: string;
    expiresAt?: string;
    actionButtons?: NotificationAction[];
}

export interface NotificationAction {
    id: string;
    label: string;
    action: string; // Deep link or action identifier
    type: 'primary' | 'secondary' | 'dismiss';
}

// Message
export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderType: 'patient' | 'doctor' | 'hpr' | 'system';
    senderName: string;
    recipientId: string;
    recipientType: 'patient' | 'doctor' | 'hpr';
    content: string;
    attachments?: MessageAttachment[];
    isEncrypted: boolean;
    status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
    sentAt: string;
    deliveredAt?: string;
    readAt?: string;
    replyToId?: string;
}

export interface MessageAttachment {
    id: string;
    type: 'image' | 'document' | 'prescription' | 'lab_report';
    fileName: string;
    fileSize: number;
    url: string;
    thumbnailUrl?: string;
}

// Conversation
export interface Conversation {
    id: string;
    participants: ConversationParticipant[];
    subject?: string;
    category: 'appointment' | 'prescription' | 'general' | 'emergency';
    lastMessage?: Message;
    unreadCount: number;
    isArchived: boolean;
    isPinned: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ConversationParticipant {
    userId: string;
    userType: 'patient' | 'doctor' | 'hpr';
    name: string;
    avatar?: string;
    role?: string;
    hospital?: string;
}

// Message Template
export interface MessageTemplate {
    id: string;
    category: string;
    title: string;
    content: string;
    variables: string[]; // e.g., ['patientName', 'appointmentDate']
    language: string;
    isActive: boolean;
}

// Push Notification Request
export interface PushNotificationRequest {
    userId: string;
    title: string;
    message: string;
    category: NotificationCategory;
    priority?: NotificationPriority;
    data?: Record<string, any>;
    actionButtons?: NotificationAction[];
    scheduledFor?: string;
}

// Message Send Request
export interface SendMessageRequest {
    conversationId?: string;
    recipientId: string;
    recipientType: 'patient' | 'doctor' | 'hpr';
    content: string;
    attachments?: Omit<MessageAttachment, 'id' | 'url'>[];
    replyToId?: string;
    subject?: string;
    category?: 'appointment' | 'prescription' | 'general' | 'emergency';
}

// Notification Statistics
export interface NotificationStatistics {
    totalSent: number;
    totalRead: number;
    totalArchived: number;
    byCategory: {
        [key in NotificationCategory]: number;
    };
    byChannel: {
        [key in NotificationChannel]: number;
    };
    readRate: number; // percentage
    averageReadTime: number; // minutes
}

// Message Statistics
export interface MessageStatistics {
    totalConversations: number;
    activeConversations: number;
    unreadMessages: number;
    totalMessages: number;
    responseRate: number; // percentage
    averageResponseTime: number; // minutes
}

// Notification Preferences Update
export interface UpdateNotificationPreferencesRequest {
    channels?: Partial<NotificationSettings['channels']>;
    category?: {
        category: NotificationCategory;
        settings: Partial<NotificationSettings['categories'][NotificationCategory]>;
    };
    frequency?: Partial<NotificationSettings['frequency']>;
    soundEnabled?: boolean;
    vibrationEnabled?: boolean;
}

// Quiet Hours
export interface QuietHoursSettings {
    enabled: boolean;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    allowUrgent: boolean;
    allowEmergency: boolean;
}

// Notification Badge
export interface NotificationBadge {
    total: number;
    unread: number;
    urgent: number;
    byCategory: {
        [key in NotificationCategory]?: number;
    };
}
