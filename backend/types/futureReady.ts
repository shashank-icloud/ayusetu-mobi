// Future-Ready Types - Category 16
// AI health assistant, wearables integration, predictive insights, telemedicine

export type AIInsightType = 'general' | 'trend' | 'recommendation' | 'alert' | 'educational';

export type InsightPriority = 'low' | 'medium' | 'high' | 'urgent';

export type WearableDeviceType =
    | 'fitness_tracker'
    | 'smartwatch'
    | 'blood_pressure_monitor'
    | 'glucose_monitor'
    | 'heart_rate_monitor'
    | 'sleep_tracker'
    | 'smart_scale';

export type WearableDataType =
    | 'steps'
    | 'heart_rate'
    | 'blood_pressure'
    | 'blood_glucose'
    | 'sleep'
    | 'weight'
    | 'calories'
    | 'activity'
    | 'oxygen_saturation';

export type SyncStatus = 'synced' | 'syncing' | 'failed' | 'pending';

export type PredictionCategory =
    | 'cardiovascular'
    | 'diabetes'
    | 'respiratory'
    | 'mental_health'
    | 'lifestyle'
    | 'preventive';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'very_high';

export type ConsultationStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export type ConsultationType = 'video' | 'audio' | 'chat';

// AI Health Assistant
export interface AIInsight {
    id: string;
    type: AIInsightType;
    priority: InsightPriority;
    title: string;
    description: string;
    generatedAt: string;
    relatedData?: {
        vitalType?: string;
        value?: number;
        trend?: 'increasing' | 'decreasing' | 'stable';
        dateRange?: {
            start: string;
            end: string;
        };
    };
    recommendation?: string;
    actionItems?: string[];
    disclaimerShown: boolean;
}

export interface AIQuery {
    question: string;
    context?: Record<string, any>;
}

export interface AIResponse {
    id: string;
    query: string;
    answer: string;
    confidence: number; // 0-1
    sources?: string[];
    relatedInsights?: string[]; // insight IDs
    disclaimer: string;
    timestamp: string;
}

export interface HealthTrendAnalysis {
    metric: string;
    currentValue: number;
    averageValue: number;
    trend: 'improving' | 'stable' | 'declining';
    changePercentage: number;
    dataPoints: Array<{
        date: string;
        value: number;
    }>;
    insights: string[];
}

// Wearables Integration
export interface WearableDevice {
    id: string;
    name: string;
    type: WearableDeviceType;
    manufacturer: string;
    model: string;
    isConnected: boolean;
    lastSyncedAt?: string;
    batteryLevel?: number;
    supportedDataTypes: WearableDataType[];
}

export interface WearableData {
    id: string;
    deviceId: string;
    dataType: WearableDataType;
    value: number;
    unit: string;
    timestamp: string;
    metadata?: Record<string, any>;
}

export interface SyncSettings {
    deviceId: string;
    autoSync: boolean;
    syncFrequency: 'realtime' | 'hourly' | 'daily';
    dataTypesToSync: WearableDataType[];
    wifiOnly: boolean;
}

export interface WearableStatistics {
    totalDevices: number;
    connectedDevices: number;
    lastSyncDate?: string;
    totalDataPoints: number;
    dataByType: Record<WearableDataType, number>;
}

export interface ActivitySummary {
    date: string;
    steps: number;
    caloriesBurned: number;
    activeMinutes: number;
    distance: number; // in km
    floors?: number;
    heartRateZones?: {
        resting: number; // minutes
        fat_burn: number;
        cardio: number;
        peak: number;
    };
}

export interface SleepSummary {
    date: string;
    totalSleepTime: number; // minutes
    deepSleep: number; // minutes
    lightSleep: number; // minutes
    remSleep: number; // minutes
    awakeTime: number; // minutes
    sleepQuality: number; // 0-100
    bedtime: string;
    wakeupTime: string;
}

// Predictive Insights
export interface PredictiveInsight {
    id: string;
    category: PredictionCategory;
    title: string;
    description: string;
    riskLevel: RiskLevel;
    probability: number; // 0-1
    timeframe: string; // e.g., "next 6 months"
    basedOn: string[]; // data sources used
    preventiveActions: string[];
    generatedAt: string;
    confidence: number; // 0-1
}

export interface RiskAssessment {
    category: PredictionCategory;
    riskLevel: RiskLevel;
    riskScore: number; // 0-100
    factors: Array<{
        name: string;
        contribution: number; // percentage
        value: string;
        isModifiable: boolean;
    }>;
    recommendations: string[];
    estimatedImpact?: string;
}

export interface HealthScore {
    overall: number; // 0-100
    categories: {
        cardiovascular: number;
        metabolic: number;
        fitness: number;
        sleep: number;
        stress: number;
        nutrition: number;
    };
    trend: 'improving' | 'stable' | 'declining';
    lastCalculated: string;
}

export interface PersonalizedRecommendation {
    id: string;
    category: string;
    title: string;
    description: string;
    priority: InsightPriority;
    expectedBenefit: string;
    difficulty: 'easy' | 'moderate' | 'challenging';
    timeCommitment: string;
    resources?: Array<{
        type: 'article' | 'video' | 'app' | 'service';
        title: string;
        url?: string;
    }>;
}

// Telemedicine
export interface Doctor {
    id: string;
    name: string;
    specialization: string;
    qualifications: string[];
    experience: number; // years
    rating: number;
    reviewCount: number;
    languages: string[];
    consultationFee: number;
    availableSlots?: Array<{
        date: string;
        slots: string[]; // time slots
    }>;
    isABDMVerified: boolean;
    profilePicture?: string;
    hospital?: string;
}

export interface TelemedicineConsultation {
    id: string;
    doctorId: string;
    patientId: string;
    status: ConsultationStatus;
    type: ConsultationType;
    scheduledDate: string;
    scheduledTime: string;
    duration: number; // minutes
    fee: number;
    symptoms?: string;
    notes?: string;
    prescription?: {
        id: string;
        medications: Array<{
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
        }>;
        advice: string;
    };
    followUpDate?: string;
    recordingUrl?: string;
    meetingLink?: string;
}

export interface ConsultationRequest {
    doctorId: string;
    patientId: string;
    type: ConsultationType;
    scheduledDate: string;
    scheduledTime: string;
    symptoms: string;
    urgency: 'routine' | 'urgent' | 'emergency';
}

export interface ConsultationHistory {
    consultations: TelemedicineConsultation[];
    totalConsultations: number;
    upcomingCount: number;
    completedCount: number;
}

export interface VideoCallSettings {
    cameraEnabled: boolean;
    microphoneEnabled: boolean;
    speakerEnabled: boolean;
    screenShareEnabled: boolean;
    recordingEnabled: boolean;
    quality: 'low' | 'medium' | 'high' | 'auto';
}

// Analytics and Statistics
export interface FutureReadyStatistics {
    aiInsightsGenerated: number;
    aiQueriesProcessed: number;
    wearableDevicesConnected: number;
    wearableDataPoints: number;
    predictiveInsightsGenerated: number;
    telemedicineConsultations: number;
    averageHealthScore: number;
}

// Disclaimers and Compliance
export interface AIDisclaimer {
    text: string;
    acknowledgedAt?: string;
    version: string;
}

export const AI_HEALTH_DISCLAIMER = `
⚠️ IMPORTANT DISCLAIMER:

This AI health assistant provides informational insights only and is NOT a substitute for professional medical advice, diagnosis, or treatment.

• AI insights are based on patterns in your data and may not be accurate
• Always consult qualified healthcare professionals for medical decisions
• In case of emergency, call emergency services immediately
• Do not use AI insights to self-diagnose or self-treat
• The AI does not have access to your complete medical history

By using this feature, you acknowledge that this is an educational tool and not medical advice.
`;

export const TELEMEDICINE_DISCLAIMER = `
⚠️ TELEMEDICINE DISCLAIMER:

• Telemedicine consultations are for non-emergency conditions only
• In case of emergency, call emergency services (108/112) immediately
• Video/audio quality may affect diagnosis accuracy
• Doctor's recommendations are based on information provided by you
• Follow-up in-person visits may be required
• All consultations are ABDM compliant and encrypted
`;
