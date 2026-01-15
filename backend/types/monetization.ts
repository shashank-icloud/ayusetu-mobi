// Monetization Types - Category 15
// ABDM-compliant monetization: No data selling, no health data ads, transparent pricing

export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'family';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trial';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export type StorageTier = 'free' | 'standard' | 'premium' | 'unlimited';

export type BackupFrequency = 'manual' | 'daily' | 'weekly' | 'realtime';

export type PartnerServiceType = 
    | 'lab_testing'
    | 'pharmacy'
    | 'ambulance'
    | 'home_healthcare'
    | 'diagnostics'
    | 'wellness'
    | 'telemedicine';

export type ServiceStatus = 'active' | 'inactive' | 'maintenance';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

// Premium Features
export interface PremiumFeature {
    id: string;
    name: string;
    description: string;
    icon: string;
    tier: SubscriptionTier;
    isAvailable: boolean;
    category: 'storage' | 'analytics' | 'support' | 'family' | 'export' | 'security';
}

export interface SubscriptionPlan {
    id: string;
    tier: SubscriptionTier;
    name: string;
    description: string;
    price: number;
    currency: string;
    billingPeriod: 'monthly' | 'yearly';
    features: string[];
    savings?: number; // For yearly plans
    isPopular?: boolean;
    maxFamilyMembers?: number;
    storageLimit: number; // in GB
    exportLimit: number; // exports per month
    supportLevel: 'community' | 'email' | 'priority' | '24x7';
}

export interface UserSubscription {
    id: string;
    userId: string;
    planId: string;
    tier: SubscriptionTier;
    status: SubscriptionStatus;
    startDate: string;
    endDate: string;
    autoRenew: boolean;
    paymentMethod?: PaymentMethod;
    nextBillingDate?: string;
    trialEndsAt?: string;
}

export interface PaymentTransaction {
    id: string;
    userId: string;
    subscriptionId: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    transactionDate: string;
    orderId: string;
    receiptUrl?: string;
    failureReason?: string;
}

// Cloud Storage
export interface CloudStorage {
    userId: string;
    tier: StorageTier;
    totalStorage: number; // in bytes
    usedStorage: number; // in bytes
    availableStorage: number; // in bytes
    fileCount: number;
    lastBackupDate?: string;
    nextBackupDate?: string;
}

export interface StorageBreakdown {
    category: 'medical_records' | 'prescriptions' | 'lab_results' | 'imaging' | 'documents' | 'other';
    size: number; // in bytes
    fileCount: number;
    percentage: number;
}

export interface BackupSettings {
    enabled: boolean;
    frequency: BackupFrequency;
    autoBackup: boolean;
    includeAttachments: boolean;
    backupTime?: string; // HH:mm format for scheduled backups
    wifiOnly: boolean;
    encryptBackups: boolean;
}

export interface BackupHistory {
    id: string;
    userId: string;
    backupDate: string;
    size: number; // in bytes
    fileCount: number;
    status: 'completed' | 'failed' | 'partial';
    duration: number; // in seconds
    errorMessage?: string;
}

export interface StoragePlan {
    id: string;
    tier: StorageTier;
    name: string;
    storage: number; // in GB
    price: number;
    currency: string;
    billingPeriod: 'monthly' | 'yearly';
    features: string[];
}

// Partner Services
export interface PartnerService {
    id: string;
    name: string;
    type: PartnerServiceType;
    description: string;
    logo: string;
    rating: number;
    reviewCount: number;
    status: ServiceStatus;
    isABDMVerified: boolean;
    isPopular?: boolean;
    locations?: string[];
    operatingHours?: {
        open: string;
        close: string;
    };
    contactNumber?: string;
    email?: string;
    website?: string;
}

export interface LabTest {
    id: string;
    partnerId: string;
    name: string;
    description: string;
    category: string;
    price: number;
    discountedPrice?: number;
    preparationRequired: boolean;
    sampleType: 'blood' | 'urine' | 'stool' | 'saliva' | 'other';
    reportDelivery: string; // e.g., "24 hours"
    isPopular?: boolean;
    isFasting?: boolean;
}

export interface PharmacyProduct {
    id: string;
    partnerId: string;
    name: string;
    genericName?: string;
    manufacturer: string;
    category: string;
    price: number;
    discountedPrice?: number;
    stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
    prescriptionRequired: boolean;
    packSize: string;
    expiryDate?: string;
}

export interface AmbulanceService {
    id: string;
    partnerId: string;
    vehicleType: 'basic' | 'advanced' | 'air';
    equipmentLevel: 'BLS' | 'ALS' | 'ICU';
    availability: 'available' | 'busy' | 'offline';
    basePrice: number;
    perKmCharge: number;
    estimatedArrival?: number; // in minutes
    features: string[];
}

export interface ServiceBooking {
    id: string;
    userId: string;
    partnerId: string;
    serviceType: PartnerServiceType;
    status: BookingStatus;
    bookingDate: string;
    scheduledDate: string;
    scheduledTime?: string;
    details: {
        items?: Array<{ id: string; name: string; quantity: number; price: number }>;
        totalAmount: number;
        address?: {
            line1: string;
            line2?: string;
            city: string;
            state: string;
            pincode: string;
        };
        notes?: string;
    };
    paymentStatus: PaymentStatus;
    confirmationId?: string;
    cancellationReason?: string;
}

export interface PartnerOffer {
    id: string;
    partnerId: string;
    title: string;
    description: string;
    discountPercentage?: number;
    discountAmount?: number;
    validFrom: string;
    validUntil: string;
    termsAndConditions: string[];
    minOrderAmount?: number;
    maxDiscount?: number;
    code?: string;
}

// Analytics and Statistics
export interface MonetizationStatistics {
    subscriptionRevenue: number;
    storageRevenue: number;
    partnerCommission: number;
    totalRevenue: number;
    activeSubscriptions: number;
    totalUsers: number;
    conversionRate: number; // percentage
    churnRate: number; // percentage
    averageRevenuePerUser: number;
}

export interface UserSpendingAnalytics {
    userId: string;
    totalSpent: number;
    subscriptionSpent: number;
    storageSpent: number;
    servicesSpent: number;
    lastPaymentDate?: string;
    lifetimeValue: number;
    savingsFromOffers: number;
}

// Compliance and Privacy
export interface DataUsageConsent {
    userId: string;
    consentForAnonymizedAnalytics: boolean;
    consentForServiceRecommendations: boolean;
    consentForPartnerOffers: boolean;
    consentDate: string;
    lastUpdated: string;
}

export interface ABDMComplianceReport {
    compliantWithDataPrivacy: boolean;
    noDataSelling: boolean;
    noHealthDataAds: boolean;
    transparentPricing: boolean;
    userDataControlled: boolean;
    encryptedTransactions: boolean;
    lastAuditDate: string;
    certificationId?: string;
}
