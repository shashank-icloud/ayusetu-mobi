import axios from 'axios';
import { Config } from '../../src/config/env';
import type {
    DiseaseTracker,
    EarlyRiskIndicator,
    HealthInsight,
    HealthSummary,
    HealthTrend,
    LabResultFlag,
    LifestyleEntry,
    LifestyleSummary,
    Medication,
    MedicationAdherence,
    MedicationLog,
    SymptomEntry,
    SymptomPattern,
} from '../types/insights';

/**
 * Health Insights & Intelligence Service (Category 5)
 * 
 * Non-diagnostic, assistive features for patient health awareness.
 * All insights are informational and comply with medical device regulations.
 * 
 * ⚠️ COMPLIANCE: All features are non-diagnostic and for informational purposes only.
 */

const insightsApi = axios.create({
    baseURL: Config.getBaseUrl(),
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
});

const mockDelay = (ms: number = 1000) => new Promise<void>(resolve => setTimeout(resolve, ms));

// ============================================
// Mock Data (DEV Mode)
// ============================================

const mockHealthSummary: HealthSummary = {
    id: 'summary-001',
    generatedDate: new Date().toISOString(),
    overallScore: 78,
    scoreCategory: 'good',
    keyInsights: [
        'Blood pressure trends are improving over the last 30 days',
        'Medication adherence is excellent at 95%',
        'Sleep quality has decreased slightly this week',
        'Exercise frequency is below your weekly goal',
    ],
    recentActivity: [
        'Recorded BP: 128/82 mmHg (Jan 14)',
        'Took morning medications on time (Today)',
        'Logged 6,500 steps yesterday',
        'Slept 6.5 hours last night',
    ],
    upcomingReminders: [
        'BP medication due at 9:00 PM today',
        'Lab test scheduled for Jan 18',
        'Dr. appointment on Jan 22',
    ],
    areasOfConcern: [
        'Sleep duration below recommended 7-8 hours',
        'Exercise frequency: Only 2 days this week (Goal: 5 days)',
    ],
    positiveIndicators: [
        'Perfect medication adherence for 7 days',
        'Blood sugar levels within target range',
        'Stress levels improving',
    ],
};

const mockTrends: HealthTrend[] = [
    {
        metric: 'bp_systolic',
        displayName: 'Blood Pressure (Systolic)',
        unit: 'mmHg',
        dataPoints: [
            { date: '2026-01-08', value: 135, unit: 'mmHg', source: 'Manual Entry' },
            { date: '2026-01-10', value: 132, unit: 'mmHg', source: 'Manual Entry' },
            { date: '2026-01-12', value: 128, unit: 'mmHg', source: 'Manual Entry' },
            { date: '2026-01-14', value: 125, unit: 'mmHg', source: 'Manual Entry' },
        ],
        trend: 'improving',
        trendPercentage: -7.4,
        normalRange: { min: 90, max: 120 },
        currentValue: 125,
        insight: 'Your blood pressure is showing an improving trend. Keep up with your medications and lifestyle changes.',
    },
    {
        metric: 'blood_sugar',
        displayName: 'Blood Sugar (Fasting)',
        unit: 'mg/dL',
        dataPoints: [
            { date: '2026-01-08', value: 118, unit: 'mg/dL', source: 'Lab Report' },
            { date: '2026-01-10', value: 112, unit: 'mg/dL', source: 'Manual Entry' },
            { date: '2026-01-12', value: 108, unit: 'mg/dL', source: 'Manual Entry' },
            { date: '2026-01-14', value: 105, unit: 'mg/dL', source: 'Manual Entry' },
        ],
        trend: 'improving',
        trendPercentage: -11.0,
        normalRange: { min: 70, max: 100 },
        currentValue: 105,
        insight: 'Blood sugar levels are improving but still slightly above normal. Continue monitoring.',
    },
    {
        metric: 'weight',
        displayName: 'Body Weight',
        unit: 'kg',
        dataPoints: [
            { date: '2026-01-01', value: 78.5, unit: 'kg', source: 'Manual Entry' },
            { date: '2026-01-05', value: 78.2, unit: 'kg', source: 'Manual Entry' },
            { date: '2026-01-10', value: 77.8, unit: 'kg', source: 'Manual Entry' },
            { date: '2026-01-14', value: 77.5, unit: 'kg', source: 'Manual Entry' },
        ],
        trend: 'improving',
        trendPercentage: -1.3,
        currentValue: 77.5,
        insight: 'Gradual weight loss is on track. Aim for 0.5-1 kg per week for healthy progress.',
    },
];

const mockLabFlags: LabResultFlag[] = [
    {
        id: 'flag-001',
        testName: 'HbA1c',
        value: 6.8,
        unit: '%',
        normalRange: { min: 4.0, max: 5.6 },
        status: 'high',
        flagType: 'warning',
        date: '2026-01-10',
        suggestion: 'Slightly elevated. Indicates prediabetes range. Discuss with your doctor about lifestyle modifications.',
    },
    {
        id: 'flag-002',
        testName: 'Vitamin D',
        value: 18,
        unit: 'ng/mL',
        normalRange: { min: 30, max: 100 },
        status: 'low',
        flagType: 'warning',
        date: '2026-01-10',
        suggestion: 'Low vitamin D levels. Consider supplementation and increased sun exposure as advised by your doctor.',
    },
];

const mockRiskIndicators: EarlyRiskIndicator[] = [
    {
        id: 'risk-001',
        riskType: 'diabetes',
        riskLevel: 'moderate',
        confidence: 72,
        factors: [
            'HbA1c level at 6.8% (prediabetes range)',
            'Family history of diabetes',
            'BMI slightly above normal range',
        ],
        recommendations: [
            'Regular blood sugar monitoring',
            'Increase physical activity to 150 minutes/week',
            'Reduce refined carbohydrate intake',
            'Schedule follow-up with endocrinologist',
        ],
        dataPoints: ['HbA1c: 6.8%', 'Fasting glucose: 105 mg/dL'],
        disclaimer: 'This is an informational risk assessment only. Consult your healthcare provider for proper diagnosis and treatment.',
    },
];

let mockDiseaseTrackers: DiseaseTracker[] = [
    {
        id: 'tracker-001',
        disease: 'hypertension',
        displayName: 'High Blood Pressure',
        startDate: '2025-06-01',
        status: 'active',
        goals: [
            {
                id: 'goal-001',
                description: 'Systolic BP below 130 mmHg',
                targetValue: 130,
                currentValue: 125,
                unit: 'mmHg',
                progress: 100,
                achieved: true,
            },
            {
                id: 'goal-002',
                description: 'Exercise 5 days per week',
                targetValue: 5,
                currentValue: 3,
                unit: 'days',
                progress: 60,
                achieved: false,
            },
        ],
        metrics: [
            { name: 'Systolic BP', value: 125, unit: 'mmHg', status: 'good', lastRecorded: '2026-01-14' },
            { name: 'Diastolic BP', value: 82, unit: 'mmHg', status: 'good', lastRecorded: '2026-01-14' },
        ],
        adherenceScore: 85,
        lastUpdated: '2026-01-14',
    },
];

let mockMedications: Medication[] = [
    {
        id: 'med-001',
        name: 'Amlodipine',
        dosage: '5mg',
        frequency: 'Once daily in the morning',
        startDate: '2025-06-01',
        prescribedBy: 'Dr. Rajesh Kumar',
        purpose: 'Blood pressure control',
        activeIngredient: 'Amlodipine besylate',
        sideEffects: ['Swelling of ankles', 'Dizziness', 'Flushing'],
        instructions: 'Take with or without food. Swallow whole.',
        reminderTimes: ['09:00'],
    },
    {
        id: 'med-002',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily with meals',
        startDate: '2025-08-15',
        prescribedBy: 'Dr. Priya Sharma',
        purpose: 'Blood sugar management',
        activeIngredient: 'Metformin hydrochloride',
        sideEffects: ['Nausea', 'Diarrhea', 'Upset stomach'],
        instructions: 'Take with meals. Do not crush or chew.',
        reminderTimes: ['09:00', '21:00'],
    },
];

const mockMedicationAdherence: MedicationAdherence[] = [
    {
        medicationId: 'med-001',
        medicationName: 'Amlodipine 5mg',
        totalDoses: 30,
        takenDoses: 29,
        missedDoses: 1,
        adherencePercentage: 96.7,
        lastTaken: '2026-01-14T09:15:00Z',
        nextDue: '2026-01-15T09:00:00Z',
        streak: 14,
    },
    {
        medicationId: 'med-002',
        medicationName: 'Metformin 500mg',
        totalDoses: 60,
        takenDoses: 57,
        missedDoses: 3,
        adherencePercentage: 95.0,
        lastTaken: '2026-01-14T21:10:00Z',
        nextDue: '2026-01-15T09:00:00Z',
        streak: 7,
    },
];

let mockLifestyleEntries: LifestyleEntry[] = [
    {
        id: 'life-001',
        date: '2026-01-14',
        category: 'exercise',
        data: {
            type: 'Walking',
            duration: 30,
            intensity: 'moderate',
            caloriesBurned: 150,
            notes: 'Morning walk in the park',
        },
    },
    {
        id: 'life-002',
        date: '2026-01-14',
        category: 'sleep',
        data: {
            duration: 6.5,
            quality: 'fair',
            bedTime: '23:30',
            wakeTime: '06:00',
            notes: 'Woke up twice during the night',
        },
    },
];

let mockSymptoms: SymptomEntry[] = [
    {
        id: 'symp-001',
        date: '2026-01-14',
        symptom: 'Headache',
        severity: 4,
        bodyPart: 'Forehead',
        duration: 2,
        durationUnit: 'hours',
        triggers: ['Stress', 'Screen time'],
        relief: ['Rest', 'Hydration'],
        notes: 'Mild tension headache after long work session',
    },
    {
        id: 'symp-002',
        date: '2026-01-12',
        symptom: 'Joint pain',
        severity: 3,
        bodyPart: 'Right knee',
        duration: 4,
        durationUnit: 'hours',
        triggers: ['Cold weather'],
        notes: 'Improved with warm compress',
    },
];

// ============================================
// Service Methods
// ============================================

export const insightsService = {
    // ========================================
    // AI-Assisted Insights
    // ========================================

    async getHealthSummary(): Promise<HealthSummary> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            return {
                ...mockHealthSummary,
                generatedDate: new Date().toISOString(),
            };
        }

        const response = await insightsApi.get('/v1/insights/summary');
        return response.data;
    },

    async getHealthTrends(metrics?: string[]): Promise<HealthTrend[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            if (metrics && metrics.length > 0) {
                return mockTrends.filter(t => metrics.includes(t.metric));
            }
            return mockTrends;
        }

        const response = await insightsApi.get('/v1/insights/trends', {
            params: { metrics: metrics?.join(',') },
        });
        return response.data;
    },

    async getLabResultFlags(): Promise<LabResultFlag[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            return mockLabFlags;
        }

        const response = await insightsApi.get('/v1/insights/lab-flags');
        return response.data;
    },

    async getEarlyRiskIndicators(): Promise<EarlyRiskIndicator[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            return mockRiskIndicators;
        }

        const response = await insightsApi.get('/v1/insights/risk-indicators');
        return response.data;
    },

    async getHealthInsights(category?: string): Promise<HealthInsight[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            const insights: HealthInsight[] = [
                {
                    id: 'insight-001',
                    type: 'positive',
                    category: 'medication',
                    title: 'Perfect Medication Adherence!',
                    description: "You've taken all medications on time for 7 consecutive days. Great job!",
                    actionable: false,
                    priority: 'low',
                    createdDate: '2026-01-14',
                    dismissed: false,
                },
                {
                    id: 'insight-002',
                    type: 'actionable',
                    category: 'activity',
                    title: 'Increase Physical Activity',
                    description: 'Your exercise frequency is below your weekly goal of 5 days.',
                    actionable: true,
                    suggestedAction: 'Try to add 2 more exercise sessions this week',
                    priority: 'medium',
                    createdDate: '2026-01-14',
                    dismissed: false,
                },
            ];

            if (category) {
                return insights.filter(i => i.category === category);
            }
            return insights;
        }

        const response = await insightsApi.get('/v1/insights/insights', {
            params: { category },
        });
        return response.data;
    },

    // ========================================
    // Disease Trackers
    // ========================================

    async getDiseaseTrackers(): Promise<DiseaseTracker[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            return mockDiseaseTrackers;
        }

        const response = await insightsApi.get('/v1/insights/trackers');
        return response.data;
    },

    async createDiseaseTracker(
        disease: DiseaseTracker['disease'],
        displayName: string
    ): Promise<DiseaseTracker> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(800);
            const newTracker: DiseaseTracker = {
                id: `tracker-${Date.now()}`,
                disease,
                displayName,
                startDate: new Date().toISOString().split('T')[0],
                status: 'active',
                goals: [],
                metrics: [],
                adherenceScore: 0,
                lastUpdated: new Date().toISOString(),
            };
            mockDiseaseTrackers.push(newTracker);
            return newTracker;
        }

        const response = await insightsApi.post('/v1/insights/trackers', {
            disease,
            displayName,
        });
        return response.data;
    },

    async updateTrackerMetric(
        trackerId: string,
        metricName: string,
        value: number
    ): Promise<DiseaseTracker> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(600);
            const tracker = mockDiseaseTrackers.find(t => t.id === trackerId);
            if (tracker) {
                const metric = tracker.metrics.find(m => m.name === metricName);
                if (metric) {
                    metric.value = value;
                    metric.lastRecorded = new Date().toISOString().split('T')[0];
                }
                tracker.lastUpdated = new Date().toISOString();
            }
            return tracker!;
        }

        const response = await insightsApi.put(`/v1/insights/trackers/${trackerId}/metrics`, {
            metricName,
            value,
        });
        return response.data;
    },

    // ========================================
    // Medication Adherence
    // ========================================

    async getMedications(): Promise<Medication[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            return mockMedications;
        }

        const response = await insightsApi.get('/v1/insights/medications');
        return response.data;
    },

    async addMedication(medication: Omit<Medication, 'id'>): Promise<Medication> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(800);
            const newMed: Medication = {
                ...medication,
                id: `med-${Date.now()}`,
            };
            mockMedications.push(newMed);
            return newMed;
        }

        const response = await insightsApi.post('/v1/insights/medications', medication);
        return response.data;
    },

    async getMedicationAdherence(): Promise<MedicationAdherence[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            return mockMedicationAdherence;
        }

        const response = await insightsApi.get('/v1/insights/medications/adherence');
        return response.data;
    },

    async logMedicationTaken(medicationId: string, takenTime?: string): Promise<MedicationLog> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(500);
            const log: MedicationLog = {
                id: `log-${Date.now()}`,
                medicationId,
                scheduledTime: new Date().toISOString(),
                takenTime: takenTime || new Date().toISOString(),
                status: 'taken',
            };
            return log;
        }

        const response = await insightsApi.post(`/v1/insights/medications/${medicationId}/log`, {
            takenTime,
            status: 'taken',
        });
        return response.data;
    },

    // ========================================
    // Lifestyle Tracking
    // ========================================

    async getLifestyleEntries(startDate?: string, endDate?: string): Promise<LifestyleEntry[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            return mockLifestyleEntries;
        }

        const response = await insightsApi.get('/v1/insights/lifestyle', {
            params: { startDate, endDate },
        });
        return response.data;
    },

    async addLifestyleEntry(entry: Omit<LifestyleEntry, 'id'>): Promise<LifestyleEntry> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(600);
            const newEntry: LifestyleEntry = {
                ...entry,
                id: `life-${Date.now()}`,
            };
            mockLifestyleEntries.push(newEntry);
            return newEntry;
        }

        const response = await insightsApi.post('/v1/insights/lifestyle', entry);
        return response.data;
    },

    async getLifestyleSummary(date: string): Promise<LifestyleSummary> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            return {
                date,
                totalCaloriesConsumed: 1800,
                totalCaloriesBurned: 350,
                waterIntake: 2000,
                sleepDuration: 6.5,
                exerciseDuration: 30,
                stressLevel: 4,
                habitsCompleted: 4,
                habitsTotal: 6,
            };
        }

        const response = await insightsApi.get(`/v1/insights/lifestyle/summary/${date}`);
        return response.data;
    },

    // ========================================
    // Symptom Journaling
    // ========================================

    async getSymptoms(startDate?: string, endDate?: string): Promise<SymptomEntry[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            return mockSymptoms;
        }

        const response = await insightsApi.get('/v1/insights/symptoms', {
            params: { startDate, endDate },
        });
        return response.data;
    },

    async addSymptom(symptom: Omit<SymptomEntry, 'id'>): Promise<SymptomEntry> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(600);
            const newSymptom: SymptomEntry = {
                ...symptom,
                id: `symp-${Date.now()}`,
            };
            mockSymptoms.push(newSymptom);
            return newSymptom;
        }

        const response = await insightsApi.post('/v1/insights/symptoms', symptom);
        return response.data;
    },

    async getSymptomPatterns(): Promise<SymptomPattern[]> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            return [
                {
                    symptom: 'Headache',
                    frequency: 8,
                    averageSeverity: 4.2,
                    commonTriggers: ['Stress', 'Screen time', 'Lack of sleep'],
                    trend: 'stable',
                    insight: 'Headaches occur about 2 times per week, often related to work stress. Consider stress management techniques.',
                },
            ];
        }

        const response = await insightsApi.get('/v1/insights/symptoms/patterns');
        return response.data;
    },
};
