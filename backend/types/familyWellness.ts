// Family, Lifestyle & Wellness Types - Category 12
// Family health management, vaccination tracking, wellness monitoring, preventive care

export type FamilyRelation = 'self' | 'spouse' | 'child' | 'parent' | 'sibling' | 'grandparent' | 'guardian';

export type AgeGroup = 'infant' | 'toddler' | 'child' | 'teen' | 'adult' | 'senior';

export type VaccinationStatus = 'due' | 'overdue' | 'completed' | 'upcoming' | 'skipped';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

export type SleepQuality = 'poor' | 'fair' | 'good' | 'excellent';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface FamilyMember {
    id: string;
    name: string;
    relation: FamilyRelation;
    dateOfBirth: Date;
    age: number;
    ageGroup: AgeGroup;
    gender: 'male' | 'female' | 'other';
    bloodGroup?: string;
    
    // Health profile
    abhaNumber?: string;
    profilePhoto?: string;
    
    // Medical info
    chronicConditions: string[];
    allergies: string[];
    currentMedications: string[];
    
    // Stats
    height?: number; // in cm
    weight?: number; // in kg
    bmi?: number;
    
    // Tracking
    lastCheckupDate?: Date;
    nextCheckupDue?: Date;
    vaccinationsUpToDate: boolean;
    
    // Access control
    isPrimary: boolean;
    hasFullAccess: boolean;
    linkedBy: string; // User ID who linked this member
}

export interface VaccinationRecord {
    id: string;
    familyMemberId: string;
    vaccineName: string;
    vaccineType: string; // BCG, Polio, COVID-19, Flu, etc.
    doseNumber: number;
    totalDoses: number;
    
    status: VaccinationStatus;
    scheduledDate: Date;
    administeredDate?: Date;
    
    // Location
    hospitalName?: string;
    doctorName?: string;
    batchNumber?: string;
    
    // Scheduling
    nextDueDate?: Date;
    ageGroup: AgeGroup;
    isOptional: boolean;
    
    // Documents
    certificateUrl?: string;
    
    // Reminders
    reminderSent: boolean;
    reminderDays: number; // Days before due date
}

export interface VaccineSchedule {
    vaccineName: string;
    vaccineType: string;
    description: string;
    ageGroup: AgeGroup;
    recommendedAge: string; // "Birth", "6 weeks", "18 years", etc.
    totalDoses: number;
    intervalBetweenDoses?: string; // "4 weeks", "6 months"
    isOptional: boolean;
    protectsAgainst: string[];
}

export interface WellnessLog {
    id: string;
    familyMemberId: string;
    date: Date;
    
    // Sleep tracking
    sleepHours?: number;
    sleepQuality?: SleepQuality;
    sleepStartTime?: Date;
    sleepEndTime?: Date;
    
    // Activity tracking
    steps?: number;
    activeMinutes?: number;
    caloriesBurned?: number;
    exerciseType?: string[];
    activityLevel?: ActivityLevel;
    
    // Nutrition
    waterIntake?: number; // in ml
    mealsLogged?: number;
    caloriesConsumed?: number;
    
    // Vitals
    weight?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    bloodSugar?: number;
    temperature?: number;
    oxygenLevel?: number;
    
    // Mental wellness
    moodRating?: number; // 1-10
    stressLevel?: number; // 1-10
    anxietyLevel?: number; // 1-10
    
    // Notes
    notes?: string;
    symptoms?: string[];
}

export interface PreventiveCareItem {
    id: string;
    familyMemberId: string;
    careType: 'screening' | 'checkup' | 'test' | 'vaccination' | 'consultation';
    
    // Details
    name: string;
    description: string;
    ageGroup: AgeGroup;
    gender?: 'male' | 'female' | 'other';
    
    // Frequency
    frequency: 'once' | 'yearly' | 'monthly' | 'quarterly' | 'as-needed';
    recommendedAge?: string; // "40+", "After 50", etc.
    
    // Scheduling
    status: 'due' | 'overdue' | 'completed' | 'upcoming' | 'not-applicable';
    lastCompletedDate?: Date;
    nextDueDate?: Date;
    
    // Priority
    priority: 'low' | 'medium' | 'high' | 'urgent';
    riskLevel?: RiskLevel;
    
    // Reminders
    reminderEnabled: boolean;
    reminderDaysBefore: number;
}

export interface HealthRiskAssessment {
    id: string;
    familyMemberId: string;
    assessmentDate: Date;
    
    // Risk categories
    cardiovascularRisk: RiskLevel;
    diabetesRisk: RiskLevel;
    hypertensionRisk: RiskLevel;
    cancerRisk: RiskLevel;
    overallHealthRisk: RiskLevel;
    
    // Factors
    riskFactors: RiskFactor[];
    protectiveFactors: string[];
    
    // Recommendations
    recommendations: HealthRecommendation[];
    
    // Score
    healthScore: number; // 0-100
    previousScore?: number;
    scoreChange?: number;
}

export interface RiskFactor {
    factor: string;
    impact: 'low' | 'medium' | 'high';
    category: 'lifestyle' | 'hereditary' | 'environmental' | 'behavioral';
    modifiable: boolean;
}

export interface HealthRecommendation {
    id: string;
    category: 'diet' | 'exercise' | 'screening' | 'medication' | 'lifestyle';
    priority: 'low' | 'medium' | 'high';
    title: string;
    description: string;
    actionable: boolean;
    dueDate?: Date;
}

export interface WellnessGoal {
    id: string;
    familyMemberId: string;
    goalType: 'weight-loss' | 'fitness' | 'sleep' | 'nutrition' | 'stress-management' | 'custom';
    
    // Goal details
    title: string;
    description: string;
    targetValue: number;
    currentValue: number;
    unit: string; // kg, steps, hours, etc.
    
    // Timeline
    startDate: Date;
    targetDate: Date;
    
    // Progress
    status: 'not-started' | 'in-progress' | 'achieved' | 'abandoned';
    progressPercentage: number;
    
    // Tracking
    milestones: GoalMilestone[];
    lastUpdated: Date;
}

export interface GoalMilestone {
    id: string;
    title: string;
    targetValue: number;
    achievedDate?: Date;
    isAchieved: boolean;
}

// Request/Response Types

export interface GetFamilyMembersRequest {
    includeInactive?: boolean;
}

export interface AddFamilyMemberRequest {
    name: string;
    relation: FamilyRelation;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    bloodGroup?: string;
    chronicConditions?: string[];
    allergies?: string[];
}

export interface UpdateFamilyMemberRequest {
    memberId: string;
    name?: string;
    height?: number;
    weight?: number;
    chronicConditions?: string[];
    allergies?: string[];
    currentMedications?: string[];
}

export interface GetVaccinationsRequest {
    familyMemberId?: string;
    status?: VaccinationStatus;
    ageGroup?: AgeGroup;
}

export interface RecordVaccinationRequest {
    familyMemberId: string;
    vaccineName: string;
    vaccineType: string;
    doseNumber: number;
    administeredDate: Date;
    hospitalName?: string;
    batchNumber?: string;
}

export interface GetWellnessLogsRequest {
    familyMemberId: string;
    startDate?: Date;
    endDate?: Date;
    metrics?: ('sleep' | 'activity' | 'nutrition' | 'vitals' | 'mental')[];
}

export interface LogWellnessRequest {
    familyMemberId: string;
    date: Date;
    sleepHours?: number;
    steps?: number;
    waterIntake?: number;
    weight?: number;
    moodRating?: number;
}

export interface GetPreventiveCareRequest {
    familyMemberId?: string;
    status?: 'due' | 'overdue' | 'completed' | 'upcoming';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface CompletePreventiveCareRequest {
    itemId: string;
    completedDate: Date;
    notes?: string;
    documentUrl?: string;
}

export interface GetHealthRiskAssessmentRequest {
    familyMemberId: string;
    latest?: boolean;
}

export interface CreateHealthRiskAssessmentRequest {
    familyMemberId: string;
    answers: Record<string, any>; // Assessment questionnaire answers
}

export interface GetWellnessGoalsRequest {
    familyMemberId: string;
    status?: 'not-started' | 'in-progress' | 'achieved' | 'abandoned';
}

export interface CreateWellnessGoalRequest {
    familyMemberId: string;
    goalType: string;
    title: string;
    description: string;
    targetValue: number;
    unit: string;
    targetDate: Date;
}

export interface UpdateGoalProgressRequest {
    goalId: string;
    currentValue: number;
    notes?: string;
}
