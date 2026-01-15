import axios from 'axios';
import { Config } from '../../src/config/env';
import type {
  Appointment,
  AppointmentBookingRequest,
  AppointmentBookingResponse,
  CarePlan,
  Doctor,
  FollowUpReminder,
  Hospital,
  Lab,
  LabTest,
  Reminder,
  TeleconsultSession,
  TimeSlot,
} from '../types/appointments';

/**
 * Appointments & Care Journey Service (Category 6)
 * 
 * Handles:
 * - Doctor/Lab/Hospital appointment booking
 * - Appointment management and tracking
 * - Follow-up reminders
 * - Teleconsultation sessions
 * - Care plan tracking
 */

const appointmentsApi = axios.create({
  baseURL: Config.getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

const mockDelay = (ms: number = 1000) => new Promise<void>(resolve => setTimeout(resolve, ms));

// ============================================
// Mock Data
// ============================================

let mockDoctors: Doctor[] = [
  {
    id: 'doc-001',
    name: 'Dr. Rajesh Kumar',
    specialization: 'Cardiology',
    qualification: 'MBBS, MD (Cardiology)',
    experience: 15,
    hospitalId: 'hosp-001',
    hospitalName: 'Apollo Hospital',
    consultationFee: 800,
    rating: 4.7,
    languages: ['English', 'Hindi', 'Tamil'],
  },
  {
    id: 'doc-002',
    name: 'Dr. Priya Sharma',
    specialization: 'Endocrinology',
    qualification: 'MBBS, MD (Endocrinology)',
    experience: 12,
    hospitalId: 'hosp-001',
    hospitalName: 'Apollo Hospital',
    consultationFee: 700,
    rating: 4.8,
    languages: ['English', 'Hindi'],
  },
  {
    id: 'doc-003',
    name: 'Dr. Amit Patel',
    specialization: 'General Medicine',
    qualification: 'MBBS, MD',
    experience: 8,
    hospitalId: 'hosp-002',
    hospitalName: 'Max Healthcare',
    consultationFee: 500,
    rating: 4.5,
    languages: ['English', 'Hindi', 'Gujarati'],
  },
];

let mockHospitals: Hospital[] = [
  {
    id: 'hosp-001',
    name: 'Apollo Hospital',
    address: 'Greams Road, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600006',
    phone: '+91-44-28296000',
    type: 'private',
    departments: ['Cardiology', 'Endocrinology', 'Orthopedics', 'Neurology'],
    rating: 4.6,
  },
  {
    id: 'hosp-002',
    name: 'Max Healthcare',
    address: 'Saket, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110017',
    phone: '+91-11-26515050',
    type: 'private',
    departments: ['General Medicine', 'Surgery', 'Pediatrics', 'Oncology'],
    rating: 4.5,
  },
];

let mockLabs: Lab[] = [
  {
    id: 'lab-001',
    name: 'Thyrocare Labs',
    address: 'Multiple locations across India',
    city: 'Mumbai',
    state: 'Maharashtra',
    phone: '+91-22-67979797',
    rating: 4.3,
    homeCollectionAvailable: true,
    tests: [],
  },
  {
    id: 'lab-002',
    name: 'Dr. Lal PathLabs',
    address: 'Nehru Place, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    phone: '+91-11-30412345',
    rating: 4.4,
    homeCollectionAvailable: true,
    tests: [],
  },
];

const mockLabTests: LabTest[] = [
  {
    id: 'test-001',
    name: 'Complete Blood Count (CBC)',
    description: 'Measures different components of blood including RBC, WBC, platelets',
    price: 300,
    reportTime: '24 hours',
    category: 'blood',
    preparationInstructions: 'No fasting required',
  },
  {
    id: 'test-002',
    name: 'Lipid Profile',
    description: 'Cholesterol and triglycerides test',
    price: 500,
    reportTime: '24 hours',
    category: 'blood',
    preparationInstructions: '12 hours fasting required',
  },
  {
    id: 'test-003',
    name: 'HbA1c (Diabetes)',
    description: 'Average blood sugar levels over past 3 months',
    price: 400,
    reportTime: '24 hours',
    category: 'blood',
    preparationInstructions: 'No fasting required',
  },
  {
    id: 'test-004',
    name: 'Thyroid Profile (T3, T4, TSH)',
    description: 'Complete thyroid function test',
    price: 600,
    reportTime: '48 hours',
    category: 'blood',
    preparationInstructions: 'Morning sample preferred',
  },
];

// Assign tests to labs
mockLabs.forEach(lab => {
  lab.tests = mockLabTests;
});

let mockAppointments: Appointment[] = [
  {
    id: 'appt-001',
    type: 'doctor',
    status: 'scheduled',
    patientId: 'patient-001',
    patientName: 'John Doe',
    doctorId: 'doc-001',
    doctorName: 'Dr. Rajesh Kumar',
    specialization: 'Cardiology',
    scheduledDate: '2026-01-20',
    scheduledTime: '10:00 AM',
    duration: 30,
    consultationType: 'in-person',
    location: 'Apollo Hospital, Chennai',
    tokenNumber: 'A-12',
    fee: 800,
    paymentStatus: 'paid',
    createdAt: '2026-01-14T09:00:00Z',
    notes: 'Follow-up for BP check',
  },
  {
    id: 'appt-002',
    type: 'lab',
    status: 'confirmed',
    patientId: 'patient-001',
    patientName: 'John Doe',
    labId: 'lab-001',
    labName: 'Thyrocare Labs',
    testIds: ['test-001', 'test-002'],
    testNames: ['CBC', 'Lipid Profile'],
    homeCollection: true,
    scheduledDate: '2026-01-18',
    scheduledTime: '08:00 AM',
    duration: 15,
    consultationType: 'in-person',
    location: 'Home Collection',
    fee: 800,
    paymentStatus: 'paid',
    createdAt: '2026-01-13T14:30:00Z',
  },
];

let mockReminders: Reminder[] = [
  {
    id: 'rem-001',
    type: 'appointment',
    title: 'Dr. Rajesh Kumar - Cardiology',
    description: 'Scheduled appointment at Apollo Hospital',
    scheduledFor: '2026-01-20T10:00:00Z',
    completed: false,
    relatedId: 'appt-001',
    priority: 'high',
  },
  {
    id: 'rem-002',
    type: 'lab-test',
    title: 'Lab Test - Home Collection',
    description: 'CBC and Lipid Profile tests',
    scheduledFor: '2026-01-18T08:00:00Z',
    completed: false,
    relatedId: 'appt-002',
    priority: 'medium',
  },
];

let mockFollowUpReminders: FollowUpReminder[] = [
  {
    id: 'follow-001',
    doctorId: 'doc-002',
    doctorName: 'Dr. Priya Sharma',
    lastVisitDate: '2025-10-15',
    nextVisitDue: '2026-01-15',
    reason: '3-month diabetes checkup',
    status: 'overdue',
  },
];

let mockTeleconsultSessions: TeleconsultSession[] = [];

let mockCarePlans: CarePlan[] = [
  {
    id: 'plan-001',
    title: 'Diabetes Management Plan',
    description: 'Comprehensive care plan for managing Type 2 Diabetes',
    condition: 'Type 2 Diabetes',
    status: 'active',
    startDate: '2025-12-01',
    createdBy: 'Dr. Priya Sharma',
    createdAt: '2025-12-01T00:00:00Z',
    progressPercentage: 65,
    lastUpdated: '2026-01-14T00:00:00Z',
    goals: [
      {
        id: 'goal-001',
        description: 'Reduce HbA1c to below 7%',
        targetValue: 7.0,
        currentValue: 7.2,
        unit: '%',
        targetDate: '2026-03-01',
        achieved: false,
      },
      {
        id: 'goal-002',
        description: 'Lose 5 kg body weight',
        targetValue: 5,
        currentValue: 3.2,
        unit: 'kg',
        targetDate: '2026-02-28',
        achieved: false,
      },
    ],
    activities: [
      {
        id: 'act-001',
        type: 'medication',
        title: 'Take Metformin',
        description: '500mg twice daily with meals',
        frequency: 'Daily',
        status: 'in-progress',
      },
      {
        id: 'act-002',
        type: 'exercise',
        title: 'Brisk Walking',
        description: '30 minutes of brisk walking',
        frequency: 'Daily',
        duration: '30 minutes',
        status: 'in-progress',
      },
      {
        id: 'act-003',
        type: 'monitoring',
        title: 'Blood Sugar Monitoring',
        description: 'Check fasting and post-meal blood sugar',
        frequency: 'Twice a week',
        status: 'in-progress',
      },
    ],
  },
];

// ============================================
// Service Methods
// ============================================

export const appointmentsService = {
  // ========================================
  // Doctor Appointments
  // ========================================

  async searchDoctors(params: {
    specialization?: string;
    location?: string;
    name?: string;
  }): Promise<Doctor[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      let filtered = mockDoctors;

      if (params.specialization) {
        filtered = filtered.filter(d =>
          d.specialization.toLowerCase().includes(params.specialization!.toLowerCase())
        );
      }
      if (params.name) {
        filtered = filtered.filter(d =>
          d.name.toLowerCase().includes(params.name!.toLowerCase())
        );
      }

      return filtered;
    }

    const response = await appointmentsApi.get('/v1/appointments/doctors/search', { params });
    return response.data;
  },

  async getDoctorById(doctorId: string): Promise<Doctor> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      const doctor = mockDoctors.find(d => d.id === doctorId);
      if (!doctor) throw new Error('Doctor not found');
      return doctor;
    }

    const response = await appointmentsApi.get(`/v1/appointments/doctors/${doctorId}`);
    return response.data;
  },

  async getDoctorAvailability(doctorId: string, date: string): Promise<TimeSlot[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      // Generate mock time slots
      const slots: TimeSlot[] = [];
      const baseDate = new Date(date);

      for (let hour = 9; hour <= 17; hour++) {
        if (hour === 13) continue; // Lunch break

        slots.push({
          id: `slot-${doctorId}-${hour}`,
          startTime: new Date(baseDate.setHours(hour, 0, 0, 0)).toISOString(),
          endTime: new Date(baseDate.setHours(hour, 30, 0, 0)).toISOString(),
          isAvailable: Math.random() > 0.3, // 70% available
          consultationType: 'both',
        });
      }

      return slots;
    }

    const response = await appointmentsApi.get(`/v1/appointments/doctors/${doctorId}/availability`, {
      params: { date },
    });
    return response.data;
  },

  // ========================================
  // Hospital & Lab
  // ========================================

  async searchHospitals(city?: string): Promise<Hospital[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      if (city) {
        return mockHospitals.filter(h => h.city.toLowerCase().includes(city.toLowerCase()));
      }
      return mockHospitals;
    }

    const response = await appointmentsApi.get('/v1/appointments/hospitals/search', {
      params: { city },
    });
    return response.data;
  },

  async searchLabs(city?: string): Promise<Lab[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      if (city) {
        return mockLabs.filter(l => l.city.toLowerCase().includes(city.toLowerCase()));
      }
      return mockLabs;
    }

    const response = await appointmentsApi.get('/v1/appointments/labs/search', { params: { city } });
    return response.data;
  },

  async getLabTests(labId: string): Promise<LabTest[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return mockLabTests;
    }

    const response = await appointmentsApi.get(`/v1/appointments/labs/${labId}/tests`);
    return response.data;
  },

  // ========================================
  // Booking
  // ========================================

  async bookAppointment(request: AppointmentBookingRequest): Promise<AppointmentBookingResponse> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(1200);

      const appointment: Appointment = {
        id: `appt-${Date.now()}`,
        type: request.type,
        status: 'scheduled',
        patientId: 'patient-001',
        patientName: 'John Doe',
        scheduledDate: new Date(request.slotId).toISOString().split('T')[0],
        scheduledTime: new Date(request.slotId).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        duration: 30,
        consultationType: request.consultationType,
        fee: 0,
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        notes: request.patientNotes,
      };

      // Add type-specific fields
      if (request.type === 'doctor' && request.doctorId) {
        const doctor = mockDoctors.find(d => d.id === request.doctorId);
        appointment.doctorId = request.doctorId;
        appointment.doctorName = doctor?.name;
        appointment.specialization = doctor?.specialization;
        appointment.fee = doctor?.consultationFee || 0;
        appointment.location = doctor?.hospitalName;
      } else if (request.type === 'lab' && request.labId) {
        const lab = mockLabs.find(l => l.id === request.labId);
        appointment.labId = request.labId;
        appointment.labName = lab?.name;
        appointment.testIds = request.testIds;
        appointment.homeCollection = request.homeCollection;
        
        // Calculate total fee
        const tests = mockLabTests.filter(t => request.testIds?.includes(t.id));
        appointment.fee = tests.reduce((sum, t) => sum + t.price, 0);
      }

      mockAppointments.push(appointment);

      return {
        success: true,
        appointmentId: appointment.id,
        message: 'Appointment booked successfully',
        paymentRequired: true,
        paymentAmount: appointment.fee,
      };
    }

    const response = await appointmentsApi.post('/v1/appointments/book', request);
    return response.data;
  },

  async getMyAppointments(status?: string): Promise<Appointment[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      if (status) {
        return mockAppointments.filter(a => a.status === status);
      }
      return mockAppointments;
    }

    const response = await appointmentsApi.get('/v1/appointments/my-appointments', {
      params: { status },
    });
    return response.data;
  },

  async cancelAppointment(appointmentId: string, reason: string): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(600);
      const appointment = mockAppointments.find(a => a.id === appointmentId);
      if (appointment) {
        appointment.status = 'cancelled';
        appointment.cancellationReason = reason;
      }
      return true;
    }

    await appointmentsApi.post(`/v1/appointments/${appointmentId}/cancel`, { reason });
    return true;
  },

  // ========================================
  // Reminders
  // ========================================

  async getReminders(): Promise<Reminder[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return mockReminders;
    }

    const response = await appointmentsApi.get('/v1/appointments/reminders');
    return response.data;
  },

  async getFollowUpReminders(): Promise<FollowUpReminder[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return mockFollowUpReminders;
    }

    const response = await appointmentsApi.get('/v1/appointments/follow-ups');
    return response.data;
  },

  async snoozeReminder(reminderId: string, snoozeDuration: number): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(300);
      const reminder = mockReminders.find(r => r.id === reminderId);
      if (reminder) {
        const snoozeUntil = new Date();
        snoozeUntil.setMinutes(snoozeUntil.getMinutes() + snoozeDuration);
        reminder.snoozedUntil = snoozeUntil.toISOString();
      }
      return true;
    }

    await appointmentsApi.post(`/v1/appointments/reminders/${reminderId}/snooze`, {
      duration: snoozeDuration,
    });
    return true;
  },

  // ========================================
  // Teleconsultation
  // ========================================

  async getTeleconsultSessions(): Promise<TeleconsultSession[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return mockTeleconsultSessions;
    }

    const response = await appointmentsApi.get('/v1/appointments/teleconsult/sessions');
    return response.data;
  },

  async joinTeleconsult(sessionId: string): Promise<{ meetingLink: string }> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(500);
      return {
        meetingLink: 'https://meet.google.com/abc-defg-hij',
      };
    }

    const response = await appointmentsApi.post(`/v1/appointments/teleconsult/${sessionId}/join`);
    return response.data;
  },

  // ========================================
  // Care Plans
  // ========================================

  async getCarePlans(): Promise<CarePlan[]> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return mockCarePlans;
    }

    const response = await appointmentsApi.get('/v1/appointments/care-plans');
    return response.data;
  },

  async getCarePlanById(planId: string): Promise<CarePlan> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      const plan = mockCarePlans.find(p => p.id === planId);
      if (!plan) throw new Error('Care plan not found');
      return plan;
    }

    const response = await appointmentsApi.get(`/v1/appointments/care-plans/${planId}`);
    return response.data;
  },

  async updateActivityStatus(
    planId: string,
    activityId: string,
    status: 'pending' | 'in-progress' | 'completed' | 'skipped'
  ): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(400);
      const plan = mockCarePlans.find(p => p.id === planId);
      if (plan) {
        const activity = plan.activities.find(a => a.id === activityId);
        if (activity) {
          activity.status = status;
          if (status === 'completed') {
            activity.completedDate = new Date().toISOString();
          }
        }
      }
      return true;
    }

    await appointmentsApi.put(`/v1/appointments/care-plans/${planId}/activities/${activityId}`, {
      status,
    });
    return true;
  },
};
