// Family & Wellness Service - Category 12
// Mock implementation for family health, vaccination, wellness tracking

import {
    FamilyMember,
    VaccinationRecord,
    VaccineSchedule,
    WellnessLog,
    PreventiveCareItem,
    HealthRiskAssessment,
    WellnessGoal,
    GetFamilyMembersRequest,
    AddFamilyMemberRequest,
    UpdateFamilyMemberRequest,
    GetVaccinationsRequest,
    RecordVaccinationRequest,
    GetWellnessLogsRequest,
    LogWellnessRequest,
    GetPreventiveCareRequest,
    CompletePreventiveCareRequest,
    GetHealthRiskAssessmentRequest,
    CreateHealthRiskAssessmentRequest,
    GetWellnessGoalsRequest,
    CreateWellnessGoalRequest,
    UpdateGoalProgressRequest,
    AgeGroup,
    RiskLevel,
} from '../types/familyWellness';

// Mock data
const mockFamilyMembers: FamilyMember[] = [
    {
        id: 'fm-001',
        name: 'Rajesh Kumar',
        relation: 'self',
        dateOfBirth: new Date('1985-06-15'),
        age: 40,
        ageGroup: 'adult',
        gender: 'male',
        bloodGroup: 'O+',
        abhaNumber: '12-3456-7890-1234',
        chronicConditions: ['Hypertension'],
        allergies: ['Penicillin'],
        currentMedications: ['Amlodipine 5mg'],
        height: 175,
        weight: 78,
        bmi: 25.5,
        lastCheckupDate: new Date('2025-11-20'),
        nextCheckupDue: new Date('2026-05-20'),
        vaccinationsUpToDate: true,
        isPrimary: true,
        hasFullAccess: true,
        linkedBy: 'user-001',
    },
    {
        id: 'fm-002',
        name: 'Priya Kumar',
        relation: 'spouse',
        dateOfBirth: new Date('1988-03-22'),
        age: 37,
        ageGroup: 'adult',
        gender: 'female',
        bloodGroup: 'A+',
        chronicConditions: [],
        allergies: [],
        currentMedications: [],
        height: 162,
        weight: 58,
        bmi: 22.1,
        lastCheckupDate: new Date('2025-12-10'),
        vaccinationsUpToDate: true,
        isPrimary: false,
        hasFullAccess: true,
        linkedBy: 'user-001',
    },
    {
        id: 'fm-003',
        name: 'Aarav Kumar',
        relation: 'child',
        dateOfBirth: new Date('2020-08-10'),
        age: 5,
        ageGroup: 'child',
        gender: 'male',
        bloodGroup: 'O+',
        chronicConditions: [],
        allergies: ['Peanuts'],
        currentMedications: [],
        height: 110,
        weight: 18,
        vaccinationsUpToDate: false,
        isPrimary: false,
        hasFullAccess: false,
        linkedBy: 'user-001',
    },
];

const mockVaccinations: VaccinationRecord[] = [
    {
        id: 'vac-001',
        familyMemberId: 'fm-003',
        vaccineName: 'DPT (Diphtheria, Pertussis, Tetanus)',
        vaccineType: 'DPT',
        doseNumber: 4,
        totalDoses: 5,
        status: 'completed',
        scheduledDate: new Date('2024-08-10'),
        administeredDate: new Date('2024-08-12'),
        hospitalName: 'Rainbow Children Hospital',
        batchNumber: 'DPT-2024-08-001',
        nextDueDate: new Date('2026-08-10'),
        ageGroup: 'child',
        isOptional: false,
        reminderSent: false,
        reminderDays: 7,
    },
    {
        id: 'vac-002',
        familyMemberId: 'fm-003',
        vaccineName: 'MMR (Measles, Mumps, Rubella)',
        vaccineType: 'MMR',
        doseNumber: 1,
        totalDoses: 2,
        status: 'due',
        scheduledDate: new Date('2026-02-10'),
        nextDueDate: new Date('2026-02-10'),
        ageGroup: 'child',
        isOptional: false,
        reminderSent: true,
        reminderDays: 7,
    },
    {
        id: 'vac-003',
        familyMemberId: 'fm-001',
        vaccineName: 'COVID-19 Booster',
        vaccineType: 'COVID-19',
        doseNumber: 3,
        totalDoses: 3,
        status: 'overdue',
        scheduledDate: new Date('2025-12-01'),
        ageGroup: 'adult',
        isOptional: true,
        reminderSent: true,
        reminderDays: 14,
    },
];

const mockVaccineSchedule: VaccineSchedule[] = [
    {
        vaccineName: 'BCG',
        vaccineType: 'BCG',
        description: 'Bacillus Calmette-Guérin vaccine for tuberculosis',
        ageGroup: 'infant',
        recommendedAge: 'At birth',
        totalDoses: 1,
        isOptional: false,
        protectsAgainst: ['Tuberculosis'],
    },
    {
        vaccineName: 'Hepatitis B',
        vaccineType: 'Hep-B',
        description: 'Protection against Hepatitis B virus',
        ageGroup: 'infant',
        recommendedAge: 'At birth, 6 weeks, 6 months',
        totalDoses: 3,
        intervalBetweenDoses: '6 weeks',
        isOptional: false,
        protectsAgainst: ['Hepatitis B'],
    },
    {
        vaccineName: 'DPT',
        vaccineType: 'DPT',
        description: 'Diphtheria, Pertussis, and Tetanus vaccine',
        ageGroup: 'child',
        recommendedAge: '6 weeks, 10 weeks, 14 weeks, 18 months, 5 years',
        totalDoses: 5,
        intervalBetweenDoses: '4 weeks',
        isOptional: false,
        protectsAgainst: ['Diphtheria', 'Pertussis', 'Tetanus'],
    },
    {
        vaccineName: 'COVID-19',
        vaccineType: 'COVID-19',
        description: 'Protection against COVID-19 virus',
        ageGroup: 'adult',
        recommendedAge: '18+ years',
        totalDoses: 3,
        intervalBetweenDoses: '12-16 weeks',
        isOptional: true,
        protectsAgainst: ['COVID-19', 'Severe COVID-19'],
    },
];

const mockWellnessLogs: WellnessLog[] = [
    {
        id: 'wl-001',
        familyMemberId: 'fm-001',
        date: new Date('2026-01-14'),
        sleepHours: 7.5,
        sleepQuality: 'good',
        sleepStartTime: new Date('2026-01-13T23:00:00'),
        sleepEndTime: new Date('2026-01-14T06:30:00'),
        steps: 8500,
        activeMinutes: 45,
        caloriesBurned: 420,
        exerciseType: ['Walking', 'Yoga'],
        activityLevel: 'moderate',
        waterIntake: 2500,
        weight: 78,
        bloodPressureSystolic: 128,
        bloodPressureDiastolic: 82,
        heartRate: 72,
        moodRating: 8,
        stressLevel: 3,
    },
    {
        id: 'wl-002',
        familyMemberId: 'fm-002',
        date: new Date('2026-01-14'),
        sleepHours: 8,
        sleepQuality: 'excellent',
        steps: 10200,
        activeMinutes: 60,
        waterIntake: 3000,
        weight: 58,
        moodRating: 9,
        stressLevel: 2,
    },
];

const mockPreventiveCare: PreventiveCareItem[] = [
    {
        id: 'pc-001',
        familyMemberId: 'fm-001',
        careType: 'screening',
        name: 'Annual Health Checkup',
        description: 'Comprehensive health screening including blood tests, BP, ECG',
        ageGroup: 'adult',
        frequency: 'yearly',
        status: 'due',
        nextDueDate: new Date('2026-02-15'),
        priority: 'high',
        reminderEnabled: true,
        reminderDaysBefore: 14,
    },
    {
        id: 'pc-002',
        familyMemberId: 'fm-001',
        careType: 'test',
        name: 'Lipid Profile',
        description: 'Cholesterol and triglyceride levels check',
        ageGroup: 'adult',
        frequency: 'yearly',
        recommendedAge: '40+',
        status: 'upcoming',
        lastCompletedDate: new Date('2025-01-10'),
        nextDueDate: new Date('2026-03-10'),
        priority: 'medium',
        riskLevel: 'moderate',
        reminderEnabled: true,
        reminderDaysBefore: 7,
    },
    {
        id: 'pc-003',
        familyMemberId: 'fm-002',
        careType: 'screening',
        name: 'Breast Cancer Screening',
        description: 'Mammography for breast cancer detection',
        ageGroup: 'adult',
        gender: 'female',
        frequency: 'yearly',
        recommendedAge: 'After 40',
        status: 'completed',
        lastCompletedDate: new Date('2025-12-05'),
        nextDueDate: new Date('2026-12-05'),
        priority: 'high',
        reminderEnabled: true,
        reminderDaysBefore: 30,
    },
];

const mockHealthRiskAssessment: HealthRiskAssessment = {
    id: 'hra-001',
    familyMemberId: 'fm-001',
    assessmentDate: new Date('2026-01-10'),
    cardiovascularRisk: 'moderate',
    diabetesRisk: 'low',
    hypertensionRisk: 'moderate',
    cancerRisk: 'low',
    overallHealthRisk: 'moderate',
    riskFactors: [
        {
            factor: 'Family history of hypertension',
            impact: 'medium',
            category: 'hereditary',
            modifiable: false,
        },
        {
            factor: 'Sedentary lifestyle',
            impact: 'medium',
            category: 'lifestyle',
            modifiable: true,
        },
        {
            factor: 'Elevated cholesterol levels',
            impact: 'high',
            category: 'behavioral',
            modifiable: true,
        },
    ],
    protectiveFactors: ['Regular exercise', 'Balanced diet', 'Non-smoker'],
    recommendations: [
        {
            id: 'rec-001',
            category: 'exercise',
            priority: 'high',
            title: 'Increase Physical Activity',
            description: 'Aim for 150 minutes of moderate exercise per week',
            actionable: true,
            dueDate: new Date('2026-02-10'),
        },
        {
            id: 'rec-002',
            category: 'diet',
            priority: 'high',
            title: 'Reduce Saturated Fat Intake',
            description: 'Lower cholesterol through diet modifications',
            actionable: true,
        },
        {
            id: 'rec-003',
            category: 'screening',
            priority: 'medium',
            title: 'Regular BP Monitoring',
            description: 'Monitor blood pressure weekly',
            actionable: true,
        },
    ],
    healthScore: 72,
    previousScore: 68,
    scoreChange: 4,
};

const mockWellnessGoals: WellnessGoal[] = [
    {
        id: 'goal-001',
        familyMemberId: 'fm-001',
        goalType: 'weight-loss',
        title: 'Lose 5 kg in 3 months',
        description: 'Reduce weight from 78kg to 73kg through diet and exercise',
        targetValue: 73,
        currentValue: 78,
        unit: 'kg',
        startDate: new Date('2026-01-01'),
        targetDate: new Date('2026-04-01'),
        status: 'in-progress',
        progressPercentage: 20,
        milestones: [
            {
                id: 'm-001',
                title: '2kg down',
                targetValue: 76,
                isAchieved: true,
                achievedDate: new Date('2026-01-12'),
            },
            {
                id: 'm-002',
                title: '4kg down',
                targetValue: 74,
                isAchieved: false,
            },
        ],
        lastUpdated: new Date('2026-01-14'),
    },
    {
        id: 'goal-002',
        familyMemberId: 'fm-002',
        goalType: 'fitness',
        title: '10,000 steps daily',
        description: 'Maintain 10,000 steps per day for better cardiovascular health',
        targetValue: 10000,
        currentValue: 8500,
        unit: 'steps',
        startDate: new Date('2025-12-01'),
        targetDate: new Date('2026-03-01'),
        status: 'in-progress',
        progressPercentage: 65,
        milestones: [],
        lastUpdated: new Date('2026-01-14'),
    },
];

class FamilyWellnessService {
    // Family Members
    async getFamilyMembers(request: GetFamilyMembersRequest = {}): Promise<FamilyMember[]> {
        // In DEV mode, return mock data
        if (process.env.MODE === 'DEV' || true) {
            return mockFamilyMembers;
        }
        
        // Production: API call
        throw new Error('Production API not implemented');
    }

    async addFamilyMember(request: AddFamilyMemberRequest): Promise<FamilyMember> {
        if (process.env.MODE === 'DEV' || true) {
            const age = new Date().getFullYear() - request.dateOfBirth.getFullYear();
            let ageGroup: AgeGroup = 'adult';
            if (age < 2) ageGroup = 'infant';
            else if (age < 5) ageGroup = 'toddler';
            else if (age < 13) ageGroup = 'child';
            else if (age < 20) ageGroup = 'teen';
            else if (age < 60) ageGroup = 'adult';
            else ageGroup = 'senior';

            const newMember: FamilyMember = {
                id: `fm-${Date.now()}`,
                name: request.name,
                relation: request.relation,
                dateOfBirth: request.dateOfBirth,
                age,
                ageGroup,
                gender: request.gender,
                bloodGroup: request.bloodGroup,
                chronicConditions: request.chronicConditions || [],
                allergies: request.allergies || [],
                currentMedications: [],
                vaccinationsUpToDate: false,
                isPrimary: false,
                hasFullAccess: false,
                linkedBy: 'user-001',
            };
            return newMember;
        }
        throw new Error('Production API not implemented');
    }

    async updateFamilyMember(request: UpdateFamilyMemberRequest): Promise<FamilyMember> {
        if (process.env.MODE === 'DEV' || true) {
            const member = mockFamilyMembers.find(m => m.id === request.memberId);
            if (!member) throw new Error('Member not found');
            
            if (request.weight && request.height) {
                const heightM = (request.height || member.height || 170) / 100;
                member.bmi = (request.weight || member.weight || 70) / (heightM * heightM);
            }
            
            return { ...member, ...request };
        }
        throw new Error('Production API not implemented');
    }

    // Vaccinations
    async getVaccinations(request: GetVaccinationsRequest = {}): Promise<VaccinationRecord[]> {
        if (process.env.MODE === 'DEV' || true) {
            let filtered = mockVaccinations;
            
            if (request.familyMemberId) {
                filtered = filtered.filter(v => v.familyMemberId === request.familyMemberId);
            }
            if (request.status) {
                filtered = filtered.filter(v => v.status === request.status);
            }
            if (request.ageGroup) {
                filtered = filtered.filter(v => v.ageGroup === request.ageGroup);
            }
            
            return filtered;
        }
        throw new Error('Production API not implemented');
    }

    async getVaccineSchedule(ageGroup?: AgeGroup): Promise<VaccineSchedule[]> {
        if (process.env.MODE === 'DEV' || true) {
            if (ageGroup) {
                return mockVaccineSchedule.filter(s => s.ageGroup === ageGroup);
            }
            return mockVaccineSchedule;
        }
        throw new Error('Production API not implemented');
    }

    async recordVaccination(request: RecordVaccinationRequest): Promise<VaccinationRecord> {
        if (process.env.MODE === 'DEV' || true) {
            const record: VaccinationRecord = {
                id: `vac-${Date.now()}`,
                familyMemberId: request.familyMemberId,
                vaccineName: request.vaccineName,
                vaccineType: request.vaccineType,
                doseNumber: request.doseNumber,
                totalDoses: 1,
                status: 'completed',
                scheduledDate: request.administeredDate,
                administeredDate: request.administeredDate,
                hospitalName: request.hospitalName,
                batchNumber: request.batchNumber,
                ageGroup: 'adult',
                isOptional: false,
                reminderSent: false,
                reminderDays: 7,
            };
            return record;
        }
        throw new Error('Production API not implemented');
    }

    // Wellness Logs
    async getWellnessLogs(request: GetWellnessLogsRequest): Promise<WellnessLog[]> {
        if (process.env.MODE === 'DEV' || true) {
            let filtered = mockWellnessLogs.filter(
                log => log.familyMemberId === request.familyMemberId
            );
            
            if (request.startDate) {
                filtered = filtered.filter(log => log.date >= request.startDate!);
            }
            if (request.endDate) {
                filtered = filtered.filter(log => log.date <= request.endDate!);
            }
            
            return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
        }
        throw new Error('Production API not implemented');
    }

    async logWellness(request: LogWellnessRequest): Promise<WellnessLog> {
        if (process.env.MODE === 'DEV' || true) {
            const log: WellnessLog = {
                id: `wl-${Date.now()}`,
                familyMemberId: request.familyMemberId,
                date: request.date,
                sleepHours: request.sleepHours,
                steps: request.steps,
                waterIntake: request.waterIntake,
                weight: request.weight,
                moodRating: request.moodRating,
            };
            return log;
        }
        throw new Error('Production API not implemented');
    }

    // Preventive Care
    async getPreventiveCare(request: GetPreventiveCareRequest = {}): Promise<PreventiveCareItem[]> {
        if (process.env.MODE === 'DEV' || true) {
            let filtered = mockPreventiveCare;
            
            if (request.familyMemberId) {
                filtered = filtered.filter(item => item.familyMemberId === request.familyMemberId);
            }
            if (request.status) {
                filtered = filtered.filter(item => item.status === request.status);
            }
            if (request.priority) {
                filtered = filtered.filter(item => item.priority === request.priority);
            }
            
            return filtered;
        }
        throw new Error('Production API not implemented');
    }

    async completePreventiveCare(request: CompletePreventiveCareRequest): Promise<PreventiveCareItem> {
        if (process.env.MODE === 'DEV' || true) {
            const item = mockPreventiveCare.find(i => i.id === request.itemId);
            if (!item) throw new Error('Item not found');
            
            item.status = 'completed';
            item.lastCompletedDate = request.completedDate;
            
            // Calculate next due date based on frequency
            const nextYear = new Date(request.completedDate);
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            item.nextDueDate = nextYear;
            
            return item;
        }
        throw new Error('Production API not implemented');
    }

    // Health Risk Assessment
    async getHealthRiskAssessment(request: GetHealthRiskAssessmentRequest): Promise<HealthRiskAssessment> {
        if (process.env.MODE === 'DEV' || true) {
            return mockHealthRiskAssessment;
        }
        throw new Error('Production API not implemented');
    }

    async createHealthRiskAssessment(
        request: CreateHealthRiskAssessmentRequest
    ): Promise<HealthRiskAssessment> {
        if (process.env.MODE === 'DEV' || true) {
            // Mock: Return sample assessment based on answers
            return mockHealthRiskAssessment;
        }
        throw new Error('Production API not implemented');
    }

    // Wellness Goals
    async getWellnessGoals(request: GetWellnessGoalsRequest): Promise<WellnessGoal[]> {
        if (process.env.MODE === 'DEV' || true) {
            let filtered = mockWellnessGoals.filter(
                goal => goal.familyMemberId === request.familyMemberId
            );
            
            if (request.status) {
                filtered = filtered.filter(goal => goal.status === request.status);
            }
            
            return filtered;
        }
        throw new Error('Production API not implemented');
    }

    async createWellnessGoal(request: CreateWellnessGoalRequest): Promise<WellnessGoal> {
        if (process.env.MODE === 'DEV' || true) {
            const goal: WellnessGoal = {
                id: `goal-${Date.now()}`,
                familyMemberId: request.familyMemberId,
                goalType: request.goalType as any,
                title: request.title,
                description: request.description,
                targetValue: request.targetValue,
                currentValue: 0,
                unit: request.unit,
                startDate: new Date(),
                targetDate: request.targetDate,
                status: 'not-started',
                progressPercentage: 0,
                milestones: [],
                lastUpdated: new Date(),
            };
            return goal;
        }
        throw new Error('Production API not implemented');
    }

    async updateGoalProgress(request: UpdateGoalProgressRequest): Promise<WellnessGoal> {
        if (process.env.MODE === 'DEV' || true) {
            const goal = mockWellnessGoals.find(g => g.id === request.goalId);
            if (!goal) throw new Error('Goal not found');
            
            goal.currentValue = request.currentValue;
            goal.progressPercentage = Math.min(
                100,
                (request.currentValue / goal.targetValue) * 100
            );
            goal.lastUpdated = new Date();
            
            if (goal.progressPercentage >= 100) {
                goal.status = 'achieved';
            } else {
                goal.status = 'in-progress';
            }
            
            return goal;
        }
        throw new Error('Production API not implemented');
    }
}

export default new FamilyWellnessService();
