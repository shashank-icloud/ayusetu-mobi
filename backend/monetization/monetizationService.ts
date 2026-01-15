// Monetization Service - Category 15
// ABDM-compliant monetization with no data selling or health data ads

import { Config } from '../../src/config/env';
import {
    SubscriptionPlan,
    UserSubscription,
    PremiumFeature,
    CloudStorage,
    StorageBreakdown,
    BackupSettings,
    BackupHistory,
    StoragePlan,
    PartnerService,
    LabTest,
    PharmacyProduct,
    AmbulanceService,
    ServiceBooking,
    PartnerOffer,
    PaymentTransaction,
    UserSpendingAnalytics,
    DataUsageConsent,
} from '../types/monetization';

// Mock data for development
const mockSubscriptionPlans: SubscriptionPlan[] = [
    {
        id: 'plan-free',
        tier: 'free',
        name: 'Free',
        description: 'Basic health record management',
        price: 0,
        currency: 'INR',
        billingPeriod: 'monthly',
        features: [
            '5 GB cloud storage',
            'Basic health records',
            'Manual data export',
            'Community support',
            'ABDM integration',
        ],
        storageLimit: 5,
        exportLimit: 5,
        supportLevel: 'community',
    },
    {
        id: 'plan-basic',
        tier: 'basic',
        name: 'Basic',
        description: 'Enhanced features for individuals',
        price: 99,
        currency: 'INR',
        billingPeriod: 'monthly',
        features: [
            '50 GB cloud storage',
            'Automatic backups',
            'Unlimited exports',
            'Email support',
            'Health analytics',
            'Medication reminders',
        ],
        storageLimit: 50,
        exportLimit: -1, // unlimited
        supportLevel: 'email',
    },
    {
        id: 'plan-premium',
        tier: 'premium',
        name: 'Premium',
        description: 'Advanced features for power users',
        price: 199,
        currency: 'INR',
        billingPeriod: 'monthly',
        features: [
            '200 GB cloud storage',
            'Real-time sync',
            'AI health insights',
            'Priority support',
            'Advanced analytics',
            'Telemedicine integration',
            'Custom reports',
        ],
        isPopular: true,
        storageLimit: 200,
        exportLimit: -1,
        supportLevel: 'priority',
    },
    {
        id: 'plan-family',
        tier: 'family',
        name: 'Family',
        description: 'Complete solution for families',
        price: 399,
        currency: 'INR',
        billingPeriod: 'monthly',
        features: [
            '500 GB shared storage',
            'Up to 6 family members',
            'All Premium features',
            '24x7 support',
            'Family health dashboard',
            'Vaccination tracking',
            'Emergency access',
        ],
        maxFamilyMembers: 6,
        storageLimit: 500,
        exportLimit: -1,
        supportLevel: '24x7',
    },
];

const mockCurrentSubscription: UserSubscription = {
    id: 'sub-001',
    userId: 'user-123',
    planId: 'plan-free',
    tier: 'free',
    status: 'active',
    startDate: '2026-01-01T00:00:00Z',
    endDate: '2027-01-01T00:00:00Z',
    autoRenew: false,
};

const mockPremiumFeatures: PremiumFeature[] = [
    {
        id: 'feature-storage',
        name: 'Enhanced Storage',
        description: 'Store up to 500GB of health records securely',
        icon: '💾',
        tier: 'basic',
        isAvailable: true,
        category: 'storage',
    },
    {
        id: 'feature-analytics',
        name: 'AI Health Insights',
        description: 'Get personalized health insights powered by AI',
        icon: '🤖',
        tier: 'premium',
        isAvailable: true,
        category: 'analytics',
    },
    {
        id: 'feature-support',
        name: 'Priority Support',
        description: '24x7 priority customer support',
        icon: '🎧',
        tier: 'premium',
        isAvailable: true,
        category: 'support',
    },
    {
        id: 'feature-family',
        name: 'Family Health Management',
        description: 'Manage health records for up to 6 family members',
        icon: '👨‍👩‍👧‍👦',
        tier: 'family',
        isAvailable: true,
        category: 'family',
    },
    {
        id: 'feature-export',
        name: 'Unlimited Exports',
        description: 'Export health data in any format, anytime',
        icon: '📤',
        tier: 'basic',
        isAvailable: true,
        category: 'export',
    },
    {
        id: 'feature-encryption',
        name: 'Advanced Encryption',
        description: 'Military-grade encryption for all your data',
        icon: '🔐',
        tier: 'premium',
        isAvailable: true,
        category: 'security',
    },
];

const mockCloudStorage: CloudStorage = {
    userId: 'user-123',
    tier: 'free',
    totalStorage: 5368709120, // 5 GB in bytes
    usedStorage: 2147483648, // 2 GB in bytes
    availableStorage: 3221225472, // 3 GB in bytes
    fileCount: 156,
    lastBackupDate: '2026-01-14T10:30:00Z',
    nextBackupDate: '2026-01-21T10:30:00Z',
};

const mockStorageBreakdown: StorageBreakdown[] = [
    {
        category: 'medical_records',
        size: 1073741824, // 1 GB
        fileCount: 45,
        percentage: 50,
    },
    {
        category: 'prescriptions',
        size: 536870912, // 512 MB
        fileCount: 67,
        percentage: 25,
    },
    {
        category: 'lab_results',
        size: 322122547, // 307 MB
        fileCount: 28,
        percentage: 15,
    },
    {
        category: 'imaging',
        size: 161061274, // 153 MB
        fileCount: 8,
        percentage: 7.5,
    },
    {
        category: 'documents',
        size: 53687091, // 51 MB
        fileCount: 8,
        percentage: 2.5,
    },
];

const mockBackupSettings: BackupSettings = {
    enabled: true,
    frequency: 'weekly',
    autoBackup: true,
    includeAttachments: true,
    backupTime: '02:00',
    wifiOnly: true,
    encryptBackups: true,
};

const mockBackupHistory: BackupHistory[] = [
    {
        id: 'backup-001',
        userId: 'user-123',
        backupDate: '2026-01-14T02:00:00Z',
        size: 2147483648,
        fileCount: 156,
        status: 'completed',
        duration: 120,
    },
    {
        id: 'backup-002',
        userId: 'user-123',
        backupDate: '2026-01-07T02:00:00Z',
        size: 2095104000,
        fileCount: 152,
        status: 'completed',
        duration: 115,
    },
    {
        id: 'backup-003',
        userId: 'user-123',
        backupDate: '2025-12-31T02:00:00Z',
        size: 2042724352,
        fileCount: 148,
        status: 'completed',
        duration: 110,
    },
];

const mockStoragePlans: StoragePlan[] = [
    {
        id: 'storage-free',
        tier: 'free',
        name: 'Free Storage',
        storage: 5,
        price: 0,
        currency: 'INR',
        billingPeriod: 'monthly',
        features: ['Manual backups', 'Basic encryption', '30-day retention'],
    },
    {
        id: 'storage-standard',
        tier: 'standard',
        name: 'Standard Storage',
        storage: 50,
        price: 49,
        currency: 'INR',
        billingPeriod: 'monthly',
        features: ['Auto backups', 'Advanced encryption', '90-day retention', 'Version history'],
    },
    {
        id: 'storage-premium',
        tier: 'premium',
        name: 'Premium Storage',
        storage: 200,
        price: 149,
        currency: 'INR',
        billingPeriod: 'monthly',
        features: ['Real-time sync', 'Military-grade encryption', 'Unlimited retention', 'Multi-device sync'],
    },
    {
        id: 'storage-unlimited',
        tier: 'unlimited',
        name: 'Unlimited Storage',
        storage: -1, // unlimited
        price: 299,
        currency: 'INR',
        billingPeriod: 'monthly',
        features: ['Unlimited storage', 'Instant sync', 'Lifetime retention', 'Priority bandwidth'],
    },
];

const mockPartnerServices: PartnerService[] = [
    {
        id: 'partner-lab-001',
        name: 'Dr. Lal PathLabs',
        type: 'lab_testing',
        description: 'India\'s leading diagnostic chain with 200+ tests',
        logo: '🧪',
        rating: 4.5,
        reviewCount: 12450,
        status: 'active',
        isABDMVerified: true,
        isPopular: true,
        locations: ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad'],
        operatingHours: { open: '07:00', close: '21:00' },
        contactNumber: '+91-1800-123-4567',
        website: 'www.lalpathlabs.com',
    },
    {
        id: 'partner-pharma-001',
        name: 'Apollo Pharmacy',
        type: 'pharmacy',
        description: 'Trusted pharmacy with 5000+ medicines and health products',
        logo: '💊',
        rating: 4.7,
        reviewCount: 45230,
        status: 'active',
        isABDMVerified: true,
        isPopular: true,
        locations: ['Pan India'],
        operatingHours: { open: '00:00', close: '23:59' },
        contactNumber: '+91-1860-500-0101',
        website: 'www.apollopharmacy.in',
    },
    {
        id: 'partner-ambulance-001',
        name: 'Ziqitza Healthcare',
        type: 'ambulance',
        description: '24x7 emergency ambulance services across India',
        logo: '🚑',
        rating: 4.8,
        reviewCount: 8920,
        status: 'active',
        isABDMVerified: true,
        locations: ['Pan India'],
        operatingHours: { open: '00:00', close: '23:59' },
        contactNumber: '108',
        website: 'www.zhl.org.in',
    },
    {
        id: 'partner-homecare-001',
        name: 'Portea Medical',
        type: 'home_healthcare',
        description: 'Home healthcare services including nursing, physiotherapy, diagnostics',
        logo: '🏥',
        rating: 4.6,
        reviewCount: 6540,
        status: 'active',
        isABDMVerified: true,
        locations: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Pune'],
        operatingHours: { open: '08:00', close: '20:00' },
        contactNumber: '+91-1800-121-2323',
        website: 'www.portea.com',
    },
];

const mockLabTests: LabTest[] = [
    {
        id: 'test-001',
        partnerId: 'partner-lab-001',
        name: 'Complete Blood Count (CBC)',
        description: 'Comprehensive blood analysis for overall health assessment',
        category: 'Blood Tests',
        price: 500,
        discountedPrice: 350,
        preparationRequired: false,
        sampleType: 'blood',
        reportDelivery: '6 hours',
        isPopular: true,
        isFasting: false,
    },
    {
        id: 'test-002',
        partnerId: 'partner-lab-001',
        name: 'Lipid Profile',
        description: 'Cholesterol and triglycerides test for heart health',
        category: 'Cardiac Tests',
        price: 800,
        discountedPrice: 600,
        preparationRequired: true,
        sampleType: 'blood',
        reportDelivery: '12 hours',
        isPopular: true,
        isFasting: true,
    },
    {
        id: 'test-003',
        partnerId: 'partner-lab-001',
        name: 'HbA1c (Diabetes)',
        description: 'Average blood sugar levels over past 3 months',
        category: 'Diabetes Tests',
        price: 600,
        discountedPrice: 450,
        preparationRequired: false,
        sampleType: 'blood',
        reportDelivery: '24 hours',
        isFasting: false,
    },
];

const mockPartnerOffers: PartnerOffer[] = [
    {
        id: 'offer-001',
        partnerId: 'partner-lab-001',
        title: '30% Off on Full Body Checkup',
        description: 'Comprehensive health package with 60+ tests',
        discountPercentage: 30,
        validFrom: '2026-01-01T00:00:00Z',
        validUntil: '2026-01-31T23:59:59Z',
        termsAndConditions: [
            'Valid for first-time users only',
            'Cannot be combined with other offers',
            'Home sample collection available',
        ],
        minOrderAmount: 2000,
        maxDiscount: 1000,
        code: 'HEALTH30',
    },
    {
        id: 'offer-002',
        partnerId: 'partner-pharma-001',
        title: 'Flat ₹200 Off on Medicines',
        description: 'Get flat discount on orders above ₹999',
        discountAmount: 200,
        validFrom: '2026-01-10T00:00:00Z',
        validUntil: '2026-01-25T23:59:59Z',
        termsAndConditions: [
            'Valid on prescription medicines',
            'Free delivery on all orders',
            'Valid once per user',
        ],
        minOrderAmount: 999,
        code: 'MEDS200',
    },
];

class MonetizationService {
    // Subscription Plans
    async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return mockSubscriptionPlans;
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/monetization/plans`);
        return response.json();
    }

    async getCurrentSubscription(userId: string): Promise<UserSubscription> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
            return mockCurrentSubscription;
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/monetization/subscription/${userId}`);
        return response.json();
    }

    async upgradePlan(userId: string, planId: string): Promise<UserSubscription> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
            return {
                ...mockCurrentSubscription,
                planId,
                tier: mockSubscriptionPlans.find(p => p.id === planId)?.tier || 'free',
                status: 'active',
            };
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/monetization/upgrade`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, planId }),
        });
        return response.json();
    }

    async getPremiumFeatures(): Promise<PremiumFeature[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
            return mockPremiumFeatures;
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/monetization/features`);
        return response.json();
    }

    // Cloud Storage
    async getCloudStorage(userId: string): Promise<CloudStorage> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 400));
            return mockCloudStorage;
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/storage/${userId}`);
        return response.json();
    }

    async getStorageBreakdown(userId: string): Promise<StorageBreakdown[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
            return mockStorageBreakdown;
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/storage/${userId}/breakdown`);
        return response.json();
    }

    async getBackupSettings(userId: string): Promise<BackupSettings> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 200));
            return mockBackupSettings;
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/storage/${userId}/backup-settings`);
        return response.json();
    }

    async updateBackupSettings(userId: string, settings: Partial<BackupSettings>): Promise<BackupSettings> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return { ...mockBackupSettings, ...settings };
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/storage/${userId}/backup-settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
        });
        return response.json();
    }

    async getBackupHistory(userId: string): Promise<BackupHistory[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
            return mockBackupHistory;
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/storage/${userId}/backup-history`);
        return response.json();
    }

    async triggerManualBackup(userId: string): Promise<BackupHistory> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
            return {
                id: `backup-${Date.now()}`,
                userId,
                backupDate: new Date().toISOString(),
                size: mockCloudStorage.usedStorage,
                fileCount: mockCloudStorage.fileCount,
                status: 'completed',
                duration: 95,
            };
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/storage/${userId}/backup`, {
            method: 'POST',
        });
        return response.json();
    }

    async getStoragePlans(): Promise<StoragePlan[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
            return mockStoragePlans;
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/storage/plans`);
        return response.json();
    }

    // Partner Services
    async getPartnerServices(type?: string): Promise<PartnerService[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 400));
            if (type) {
                return mockPartnerServices.filter(s => s.type === type);
            }
            return mockPartnerServices;
        }
        const url = type 
            ? `${Config.getBaseUrl()}/api/partners/services?type=${type}`
            : `${Config.getBaseUrl()}/api/partners/services`;
        const response = await fetch(url);
        return response.json();
    }

    async getLabTests(partnerId?: string): Promise<LabTest[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
            if (partnerId) {
                return mockLabTests.filter(t => t.partnerId === partnerId);
            }
            return mockLabTests;
        }
        const url = partnerId
            ? `${Config.getBaseUrl()}/api/partners/lab-tests?partnerId=${partnerId}`
            : `${Config.getBaseUrl()}/api/partners/lab-tests`;
        const response = await fetch(url);
        return response.json();
    }

    async getPartnerOffers(partnerId?: string): Promise<PartnerOffer[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
            if (partnerId) {
                return mockPartnerOffers.filter(o => o.partnerId === partnerId);
            }
            return mockPartnerOffers;
        }
        const url = partnerId
            ? `${Config.getBaseUrl()}/api/partners/offers?partnerId=${partnerId}`
            : `${Config.getBaseUrl()}/api/partners/offers`;
        const response = await fetch(url);
        return response.json();
    }

    async bookService(booking: Omit<ServiceBooking, 'id' | 'bookingDate' | 'confirmationId'>): Promise<ServiceBooking> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
            return {
                ...booking,
                id: `booking-${Date.now()}`,
                bookingDate: new Date().toISOString(),
                confirmationId: `CONF${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            };
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/partners/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booking),
        });
        return response.json();
    }

    async getUserSpending(userId: string): Promise<UserSpendingAnalytics> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
            return {
                userId,
                totalSpent: 2547,
                subscriptionSpent: 0,
                storageSpent: 0,
                servicesSpent: 2547,
                lastPaymentDate: '2026-01-10T14:30:00Z',
                lifetimeValue: 2547,
                savingsFromOffers: 823,
            };
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/monetization/spending/${userId}`);
        return response.json();
    }
}

export const monetizationService = new MonetizationService();
