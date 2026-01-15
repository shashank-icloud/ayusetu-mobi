// Future-Ready Service - Category 16
// AI health assistant, wearables, predictive insights, telemedicine

import { Config } from '../../src/config/env';
import {
    AIInsight,
    AIQuery,
    AIResponse,
    HealthTrendAnalysis,
    WearableDevice,
    WearableData,
    SyncSettings,
    ActivitySummary,
    SleepSummary,
    PredictiveInsight,
    RiskAssessment,
    HealthScore,
    PersonalizedRecommendation,
    Doctor,
    TelemedicineConsultation,
    ConsultationRequest,
    ConsultationHistory,
    AI_HEALTH_DISCLAIMER,
    TELEMEDICINE_DISCLAIMER,
} from '../types/futureReady';

// Mock AI Insights
const mockAIInsights: AIInsight[] = [
    {
        id: 'ai-001',
        type: 'trend',
        priority: 'medium',
        title: 'Blood Pressure Trending Higher',
        description: 'Your average blood pressure has increased by 8% over the past 2 weeks',
        generatedAt: '2026-01-15T08:00:00Z',
        relatedData: {
            vitalType: 'blood_pressure',
            value: 135,
            trend: 'increasing',
            dateRange: {
                start: '2026-01-01T00:00:00Z',
                end: '2026-01-15T00:00:00Z',
            },
        },
        recommendation: 'Consider reducing salt intake and monitoring stress levels',
        actionItems: [
            'Track blood pressure daily',
            'Reduce sodium to <2000mg/day',
            'Practice relaxation techniques',
            'Consult doctor if readings remain high',
        ],
        disclaimerShown: true,
    },
    {
        id: 'ai-002',
        type: 'recommendation',
        priority: 'low',
        title: 'Sleep Quality Improving',
        description: 'Your sleep quality has improved by 15% this week compared to last week',
        generatedAt: '2026-01-14T06:00:00Z',
        relatedData: {
            vitalType: 'sleep',
            value: 85,
            trend: 'increasing',
        },
        recommendation: 'Maintain current sleep schedule for continued improvement',
        actionItems: [
            'Continue consistent bedtime routine',
            'Keep bedroom temperature cool',
            'Limit screen time before bed',
        ],
        disclaimerShown: true,
    },
    {
        id: 'ai-003',
        type: 'alert',
        priority: 'high',
        title: 'Low Physical Activity Detected',
        description: 'Your step count has been below recommended levels for 5 consecutive days',
        generatedAt: '2026-01-13T18:00:00Z',
        relatedData: {
            vitalType: 'steps',
            value: 4200,
            trend: 'decreasing',
        },
        recommendation: 'Aim for at least 7,000 steps per day for better health',
        actionItems: [
            'Set daily step goal',
            'Take short walking breaks every hour',
            'Use stairs instead of elevator',
            'Go for evening walks',
        ],
        disclaimerShown: true,
    },
];

// Mock Wearable Devices
const mockWearableDevices: WearableDevice[] = [
    {
        id: 'device-001',
        name: 'Fitbit Charge 5',
        type: 'fitness_tracker',
        manufacturer: 'Fitbit',
        model: 'Charge 5',
        isConnected: true,
        lastSyncedAt: '2026-01-15T07:30:00Z',
        batteryLevel: 68,
        supportedDataTypes: ['steps', 'heart_rate', 'sleep', 'calories', 'activity'],
    },
    {
        id: 'device-002',
        name: 'Apple Watch Series 9',
        type: 'smartwatch',
        manufacturer: 'Apple',
        model: 'Series 9',
        isConnected: true,
        lastSyncedAt: '2026-01-15T08:15:00Z',
        batteryLevel: 82,
        supportedDataTypes: ['steps', 'heart_rate', 'sleep', 'calories', 'activity', 'oxygen_saturation'],
    },
];

// Mock Activity Summary
const mockActivitySummary: ActivitySummary = {
    date: '2026-01-15',
    steps: 8542,
    caloriesBurned: 2145,
    activeMinutes: 65,
    distance: 6.2,
    floors: 12,
    heartRateZones: {
        resting: 1200,
        fat_burn: 45,
        cardio: 15,
        peak: 5,
    },
};

// Mock Sleep Summary
const mockSleepSummary: SleepSummary = {
    date: '2026-01-14',
    totalSleepTime: 442, // 7h 22m
    deepSleep: 98,
    lightSleep: 275,
    remSleep: 69,
    awakeTime: 18,
    sleepQuality: 85,
    bedtime: '23:15:00',
    wakeupTime: '06:37:00',
};

// Mock Predictive Insights
const mockPredictiveInsights: PredictiveInsight[] = [
    {
        id: 'pred-001',
        category: 'cardiovascular',
        title: 'Moderate Cardiovascular Risk',
        description: 'Based on your current health metrics, you have a moderate risk of cardiovascular issues in the next 10 years',
        riskLevel: 'moderate',
        probability: 0.18,
        timeframe: 'next 10 years',
        basedOn: ['Blood pressure trends', 'Cholesterol levels', 'Family history', 'Activity levels'],
        preventiveActions: [
            'Maintain regular exercise routine (150 min/week)',
            'Monitor blood pressure weekly',
            'Keep cholesterol in check through diet',
            'Annual cardiovascular check-ups',
        ],
        generatedAt: '2026-01-15T09:00:00Z',
        confidence: 0.75,
    },
    {
        id: 'pred-002',
        category: 'diabetes',
        title: 'Low Diabetes Risk',
        description: 'Your current health metrics indicate a low risk of developing type 2 diabetes',
        riskLevel: 'low',
        probability: 0.08,
        timeframe: 'next 5 years',
        basedOn: ['Blood glucose levels', 'BMI', 'Activity levels', 'Family history'],
        preventiveActions: [
            'Continue balanced diet',
            'Maintain healthy weight',
            'Regular physical activity',
            'Annual HbA1c testing',
        ],
        generatedAt: '2026-01-15T09:00:00Z',
        confidence: 0.82,
    },
];

// Mock Health Score
const mockHealthScore: HealthScore = {
    overall: 78,
    categories: {
        cardiovascular: 74,
        metabolic: 82,
        fitness: 76,
        sleep: 85,
        stress: 68,
        nutrition: 72,
    },
    trend: 'improving',
    lastCalculated: '2026-01-15T00:00:00Z',
};

// Mock Doctors
const mockDoctors: Doctor[] = [
    {
        id: 'doc-001',
        name: 'Dr. Priya Sharma',
        specialization: 'General Physician',
        qualifications: ['MBBS', 'MD Internal Medicine'],
        experience: 12,
        rating: 4.8,
        reviewCount: 1247,
        languages: ['English', 'Hindi', 'Marathi'],
        consultationFee: 500,
        availableSlots: [
            {
                date: '2026-01-16',
                slots: ['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
            },
            {
                date: '2026-01-17',
                slots: ['09:00 AM', '10:30 AM', '03:00 PM'],
            },
        ],
        isABDMVerified: true,
        hospital: 'Apollo Hospital, Delhi',
    },
    {
        id: 'doc-002',
        name: 'Dr. Rajesh Kumar',
        specialization: 'Cardiologist',
        qualifications: ['MBBS', 'MD Cardiology', 'DM'],
        experience: 18,
        rating: 4.9,
        reviewCount: 892,
        languages: ['English', 'Hindi'],
        consultationFee: 800,
        availableSlots: [
            {
                date: '2026-01-16',
                slots: ['11:00 AM', '03:00 PM'],
            },
        ],
        isABDMVerified: true,
        hospital: 'Fortis Hospital, Mumbai',
    },
    {
        id: 'doc-003',
        name: 'Dr. Anjali Patel',
        specialization: 'Endocrinologist',
        qualifications: ['MBBS', 'MD', 'DM Endocrinology'],
        experience: 10,
        rating: 4.7,
        reviewCount: 654,
        languages: ['English', 'Hindi', 'Gujarati'],
        consultationFee: 700,
        isABDMVerified: true,
        hospital: 'Max Hospital, Bangalore',
    },
];

// Mock Consultation History
const mockConsultationHistory: TelemedicineConsultation[] = [
    {
        id: 'consult-001',
        doctorId: 'doc-001',
        patientId: 'user-123',
        status: 'completed',
        type: 'video',
        scheduledDate: '2026-01-10',
        scheduledTime: '10:00 AM',
        duration: 15,
        fee: 500,
        symptoms: 'Fever and cough for 3 days',
        notes: 'Patient advised to rest and take prescribed medications',
        prescription: {
            id: 'rx-001',
            medications: [
                {
                    name: 'Paracetamol 500mg',
                    dosage: '1 tablet',
                    frequency: 'Thrice daily',
                    duration: '3 days',
                },
                {
                    name: 'Cetirizine 10mg',
                    dosage: '1 tablet',
                    frequency: 'Once daily at night',
                    duration: '5 days',
                },
            ],
            advice: 'Drink plenty of fluids, rest well. Follow up if fever persists beyond 3 days.',
        },
    },
];

class FutureReadyService {
    // AI Health Assistant
    async getAIInsights(userId: string): Promise<AIInsight[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return mockAIInsights;
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/ai/insights/${userId}`);
        return response.json();
    }

    async askAI(query: AIQuery): Promise<AIResponse> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 1500));
            return {
                id: `ai-resp-${Date.now()}`,
                query: query.question,
                answer: `Based on your health data, here's what I found: ${query.question.toLowerCase().includes('blood pressure') ? 'Your blood pressure has been within normal range (120/80 mmHg) for the past week. Continue monitoring regularly and maintain a healthy lifestyle.' : 'I can provide insights about your health trends, but please consult a healthcare professional for medical advice.'}`,
                confidence: 0.85,
                sources: ['Health records', 'Vital trends', 'Medical guidelines'],
                disclaimer: AI_HEALTH_DISCLAIMER,
                timestamp: new Date().toISOString(),
            };
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/ai/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(query),
        });
        return response.json();
    }

    async getHealthTrends(userId: string, metric: string): Promise<HealthTrendAnalysis> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 600));
            return {
                metric,
                currentValue: 135,
                averageValue: 125,
                trend: 'declining',
                changePercentage: 8,
                dataPoints: [
                    { date: '2026-01-01', value: 120 },
                    { date: '2026-01-05', value: 128 },
                    { date: '2026-01-10', value: 132 },
                    { date: '2026-01-15', value: 135 },
                ],
                insights: [
                    'Blood pressure has increased by 12.5% in 2 weeks',
                    'Average reading is now in pre-hypertension range',
                    'Consider lifestyle modifications',
                ],
            };
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/ai/trends/${userId}/${metric}`);
        return response.json();
    }

    // Wearables Integration
    async getWearableDevices(userId: string): Promise<WearableDevice[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 400));
            return mockWearableDevices;
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/wearables/devices/${userId}`);
        return response.json();
    }

    async connectWearableDevice(userId: string, deviceType: string): Promise<WearableDevice> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
            return {
                id: `device-${Date.now()}`,
                name: `New ${deviceType}`,
                type: deviceType as any,
                manufacturer: 'Generic',
                model: 'Model X',
                isConnected: true,
                lastSyncedAt: new Date().toISOString(),
                batteryLevel: 100,
                supportedDataTypes: ['steps', 'heart_rate'],
            };
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/wearables/connect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, deviceType }),
        });
        return response.json();
    }

    async syncWearableData(deviceId: string): Promise<{ success: boolean; dataPointsSynced: number }> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 3000));
            return { success: true, dataPointsSynced: 147 };
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/wearables/sync/${deviceId}`, {
            method: 'POST',
        });
        return response.json();
    }

    async getActivitySummary(userId: string, date: string): Promise<ActivitySummary> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 400));
            return mockActivitySummary;
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/wearables/activity/${userId}?date=${date}`);
        return response.json();
    }

    async getSleepSummary(userId: string, date: string): Promise<SleepSummary> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 400));
            return mockSleepSummary;
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/wearables/sleep/${userId}?date=${date}`);
        return response.json();
    }

    // Predictive Insights
    async getPredictiveInsights(userId: string): Promise<PredictiveInsight[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 700));
            return mockPredictiveInsights;
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/predictive/insights/${userId}`);
        return response.json();
    }

    async getRiskAssessment(userId: string, category: string): Promise<RiskAssessment> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 800));
            return {
                category: category as any,
                riskLevel: 'moderate',
                riskScore: 35,
                factors: [
                    {
                        name: 'Blood Pressure',
                        contribution: 30,
                        value: '135/85 mmHg (High Normal)',
                        isModifiable: true,
                    },
                    {
                        name: 'Family History',
                        contribution: 25,
                        value: 'Positive for cardiovascular disease',
                        isModifiable: false,
                    },
                    {
                        name: 'Physical Activity',
                        contribution: 20,
                        value: 'Moderate (120 min/week)',
                        isModifiable: true,
                    },
                    {
                        name: 'BMI',
                        contribution: 15,
                        value: '24.5 (Normal)',
                        isModifiable: true,
                    },
                    {
                        name: 'Age',
                        contribution: 10,
                        value: '45 years',
                        isModifiable: false,
                    },
                ],
                recommendations: [
                    'Increase physical activity to 180 min/week',
                    'Monitor blood pressure daily',
                    'Reduce sodium intake to <2000mg/day',
                    'Annual cardiovascular screening',
                ],
                estimatedImpact: 'Following recommendations could reduce risk by 15-20%',
            };
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/predictive/risk/${userId}/${category}`);
        return response.json();
    }

    async getHealthScore(userId: string): Promise<HealthScore> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return mockHealthScore;
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/predictive/health-score/${userId}`);
        return response.json();
    }

    async getPersonalizedRecommendations(userId: string): Promise<PersonalizedRecommendation[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 600));
            return [
                {
                    id: 'rec-001',
                    category: 'Physical Activity',
                    title: 'Start Morning Walks',
                    description: 'Begin with 20-minute morning walks to boost cardiovascular health',
                    priority: 'high',
                    expectedBenefit: 'Reduce cardiovascular risk by 10-15%',
                    difficulty: 'easy',
                    timeCommitment: '20 minutes daily',
                    resources: [
                        {
                            type: 'app',
                            title: 'Step Counter App',
                        },
                        {
                            type: 'article',
                            title: 'Benefits of Morning Walks',
                            url: 'https://health.example.com/morning-walks',
                        },
                    ],
                },
                {
                    id: 'rec-002',
                    category: 'Nutrition',
                    title: 'Reduce Sodium Intake',
                    description: 'Limit salt consumption to less than 2000mg per day',
                    priority: 'medium',
                    expectedBenefit: 'Lower blood pressure by 5-10 mmHg',
                    difficulty: 'moderate',
                    timeCommitment: 'Ongoing lifestyle change',
                },
            ];
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/predictive/recommendations/${userId}`);
        return response.json();
    }

    // Telemedicine
    async getDoctors(specialization?: string): Promise<Doctor[]> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            if (specialization) {
                return mockDoctors.filter(d => d.specialization.toLowerCase().includes(specialization.toLowerCase()));
            }
            return mockDoctors;
        }
        const url = specialization
            ? `${Config.getBaseUrl()}/api/telemedicine/doctors?specialization=${specialization}`
            : `${Config.getBaseUrl()}/api/telemedicine/doctors`;
        const response = await fetch(url);
        return response.json();
    }

    async bookConsultation(request: ConsultationRequest): Promise<TelemedicineConsultation> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
            return {
                id: `consult-${Date.now()}`,
                doctorId: request.doctorId,
                patientId: request.patientId,
                status: 'scheduled',
                type: request.type,
                scheduledDate: request.scheduledDate,
                scheduledTime: request.scheduledTime,
                duration: 15,
                fee: 500,
                symptoms: request.symptoms,
                meetingLink: `https://telemedicine.ayusetu.in/room/${Date.now()}`,
            };
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/telemedicine/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        return response.json();
    }

    async getConsultationHistory(userId: string): Promise<ConsultationHistory> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 400));
            return {
                consultations: mockConsultationHistory,
                totalConsultations: 1,
                upcomingCount: 0,
                completedCount: 1,
            };
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/telemedicine/history/${userId}`);
        return response.json();
    }

    async cancelConsultation(consultationId: string, reason: string): Promise<{ success: boolean }> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
            return { success: true };
        }
        const response = await fetch(`${Config.getBaseUrl()}/api/telemedicine/cancel/${consultationId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason }),
        });
        return response.json();
    }
}

export const futureReadyService = new FutureReadyService();
