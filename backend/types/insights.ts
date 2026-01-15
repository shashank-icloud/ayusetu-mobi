/**
 * Backend Types for Health Insights & Intelligence (Category 5)
 * 
 * Non-diagnostic, assistive-only features for patient health awareness.
 * All insights are informational and do not constitute medical advice.
 */

// ============================================
// AI-Assisted Insights
// ============================================

export interface HealthSummary {
    id: string;
    generatedDate: string;
    overallScore: number; // 0-100, informational only
    scoreCategory: 'excellent' | 'good' | 'fair' | 'needs-attention';
    keyInsights: string[];
    recentActivity: string[];
    upcomingReminders: string[];
    areasOfConcern: string[];
    positiveIndicators: string[];
}

export interface TrendDataPoint {
    date: string;
    value: number;
    unit: string;
    source?: string; // e.g., "Lab Report", "Manual Entry"
}

export interface HealthTrend {
    metric: 'bp_systolic' | 'bp_diastolic' | 'blood_sugar' | 'weight' | 'bmi' | 'heart_rate' | 'spo2';
    displayName: string;
    unit: string;
    dataPoints: TrendDataPoint[];
    trend: 'improving' | 'stable' | 'declining' | 'fluctuating';
    trendPercentage: number; // e.g., +5% or -3%
    normalRange?: { min: number; max: number };
    currentValue?: number;
    insight: string;
}

export interface LabResultFlag {
    id: string;
    testName: string;
    value: number;
    unit: string;
    normalRange: { min: number; max: number };
    status: 'normal' | 'low' | 'high' | 'critical';
    flagType: 'info' | 'warning' | 'alert';
    date: string;
    suggestion: string;
}

export interface EarlyRiskIndicator {
    id: string;
    riskType: 'diabetes' | 'hypertension' | 'cardiac' | 'obesity' | 'other';
    riskLevel: 'low' | 'moderate' | 'high';
    confidence: number; // 0-100
    factors: string[];
    recommendations: string[];
    dataPoints: string[]; // References to supporting data
    disclaimer: string;
}

// ============================================
// Chronic Care Support
// ============================================

export interface DiseaseTracker {
    id: string;
    disease: 'diabetes' | 'hypertension' | 'asthma' | 'arthritis' | 'thyroid' | 'cholesterol' | 'other';
    displayName: string;
    startDate: string;
    status: 'active' | 'managed' | 'inactive';
    goals: HealthGoal[];
    metrics: TrackerMetric[];
    adherenceScore: number; // 0-100
    lastUpdated: string;
}

export interface HealthGoal {
    id: string;
    description: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    deadline?: string;
    progress: number; // 0-100
    achieved: boolean;
}

export interface TrackerMetric {
    name: string;
    value: number;
    unit: string;
    status: 'good' | 'fair' | 'poor';
    lastRecorded: string;
}

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string; // e.g., "Twice daily", "Once at night"
    startDate: string;
    endDate?: string;
    prescribedBy: string;
    purpose: string;
    activeIngredient?: string;
    sideEffects?: string[];
    instructions: string;
    reminderTimes: string[]; // e.g., ["09:00", "21:00"]
}

export interface MedicationAdherence {
    medicationId: string;
    medicationName: string;
    totalDoses: number;
    takenDoses: number;
    missedDoses: number;
    adherencePercentage: number;
    lastTaken?: string;
    nextDue?: string;
    streak: number; // consecutive days of perfect adherence
}

export interface MedicationLog {
    id: string;
    medicationId: string;
    scheduledTime: string;
    takenTime?: string;
    status: 'taken' | 'missed' | 'skipped' | 'pending';
    note?: string;
}

export interface LifestyleEntry {
    id: string;
    date: string;
    category: 'diet' | 'exercise' | 'sleep' | 'water' | 'stress' | 'habit';
    data: DietEntry | ExerciseEntry | SleepEntry | WaterEntry | StressEntry | HabitEntry;
}

export interface DietEntry {
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods: string[];
    calories?: number;
    notes?: string;
}

export interface ExerciseEntry {
    type: string; // e.g., "Walking", "Yoga", "Gym"
    duration: number; // minutes
    intensity: 'light' | 'moderate' | 'vigorous';
    caloriesBurned?: number;
    notes?: string;
}

export interface SleepEntry {
    duration: number; // hours
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    bedTime: string;
    wakeTime: string;
    notes?: string;
}

export interface WaterEntry {
    glasses: number; // 250ml per glass
    totalML: number;
}

export interface StressEntry {
    level: number; // 1-10
    triggers?: string[];
    copingMechanism?: string;
    notes?: string;
}

export interface HabitEntry {
    habitName: string;
    completed: boolean;
    notes?: string;
}

export interface LifestyleSummary {
    date: string;
    totalCaloriesConsumed: number;
    totalCaloriesBurned: number;
    waterIntake: number; // ml
    sleepDuration: number; // hours
    exerciseDuration: number; // minutes
    stressLevel: number; // 1-10 average
    habitsCompleted: number;
    habitsTotal: number;
}

export interface SymptomEntry {
    id: string;
    date: string;
    symptom: string;
    severity: number; // 1-10
    bodyPart?: string;
    duration?: number; // minutes/hours
    durationUnit?: 'minutes' | 'hours' | 'days';
    triggers?: string[];
    relief?: string[];
    notes?: string;
    attachments?: string[]; // photo URLs
}

export interface SymptomPattern {
    symptom: string;
    frequency: number; // occurrences in last 30 days
    averageSeverity: number;
    commonTriggers: string[];
    trend: 'increasing' | 'stable' | 'decreasing';
    insight: string;
}

// ============================================
// Analytics & Insights
// ============================================

export interface HealthInsight {
    id: string;
    type: 'positive' | 'neutral' | 'actionable' | 'warning';
    category: 'activity' | 'medication' | 'vitals' | 'lifestyle' | 'symptoms';
    title: string;
    description: string;
    actionable: boolean;
    suggestedAction?: string;
    priority: 'low' | 'medium' | 'high';
    createdDate: string;
    expiryDate?: string;
    dismissed: boolean;
}

export interface ComplianceDisclaimer {
    text: string;
    category: 'general' | 'risk-indicator' | 'health-score' | 'trend-analysis';
    required: boolean;
}

// Standard disclaimer for all non-diagnostic features
export const COMPLIANCE_DISCLAIMER: ComplianceDisclaimer = {
    text: '⚠️ This information is for awareness only and does not constitute medical advice. Always consult your healthcare provider for medical decisions.',
    category: 'general',
    required: true,
};
