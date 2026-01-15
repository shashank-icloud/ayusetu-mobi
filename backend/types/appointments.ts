/**
 * Backend Types for Appointments & Care Journey (Category 6)
 * 
 * Handles appointment booking, scheduling, reminders, teleconsultation, and care plans
 */

// ============================================
// Appointment Types
// ============================================

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number; // years
  hospitalId: string;
  hospitalName: string;
  consultationFee: number;
  rating: number; // 0-5
  photoUrl?: string;
  languages: string[];
  availableSlots?: TimeSlot[];
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  type: 'government' | 'private' | 'trust';
  departments: string[];
  rating: number;
  distance?: number; // in km
}

export interface Lab {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  tests: LabTest[];
  rating: number;
  homeCollectionAvailable: boolean;
}

export interface LabTest {
  id: string;
  name: string;
  description: string;
  price: number;
  reportTime: string; // e.g., "24 hours", "Same day"
  preparationInstructions?: string;
  category: 'blood' | 'urine' | 'imaging' | 'pathology' | 'other';
}

export interface TimeSlot {
  id: string;
  startTime: string; // ISO datetime
  endTime: string;
  isAvailable: boolean;
  consultationType: 'in-person' | 'teleconsultation' | 'both';
}

export interface Appointment {
  id: string;
  type: 'doctor' | 'lab' | 'hospital_opd';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  patientId: string;
  patientName: string;
  
  // Doctor appointment
  doctorId?: string;
  doctorName?: string;
  specialization?: string;
  
  // Lab appointment
  labId?: string;
  labName?: string;
  testIds?: string[];
  testNames?: string[];
  homeCollection?: boolean;
  
  // Hospital OPD
  hospitalId?: string;
  hospitalName?: string;
  department?: string;
  
  // Common fields
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // minutes
  consultationType: 'in-person' | 'teleconsultation';
  location?: string;
  tokenNumber?: string;
  
  // Payment
  fee: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  
  // Metadata
  createdAt: string;
  notes?: string;
  cancellationReason?: string;
}

// ============================================
// Reminders
// ============================================

export interface Reminder {
  id: string;
  type: 'appointment' | 'medication' | 'follow-up' | 'lab-test' | 'vaccination';
  title: string;
  description: string;
  scheduledFor: string;
  completed: boolean;
  snoozedUntil?: string;
  relatedId?: string; // appointment ID, medication ID, etc.
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface FollowUpReminder {
  id: string;
  doctorId: string;
  doctorName: string;
  lastVisitDate: string;
  nextVisitDue: string;
  reason: string;
  status: 'pending' | 'scheduled' | 'completed' | 'overdue';
}

// ============================================
// Teleconsultation
// ============================================

export interface TeleconsultSession {
  id: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  duration?: number; // actual duration in minutes
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  meetingLink?: string;
  meetingId?: string;
  platform: 'zoom' | 'google-meet' | 'custom' | 'whatsapp';
  recordingUrl?: string;
  prescriptionId?: string;
  notes?: string;
}

// ============================================
// Care Plans
// ============================================

export interface CarePlan {
  id: string;
  title: string;
  description: string;
  condition: string; // e.g., "Type 2 Diabetes", "Hypertension"
  status: 'active' | 'completed' | 'on-hold' | 'discontinued';
  startDate: string;
  endDate?: string;
  createdBy: string; // doctor ID or name
  createdAt: string;
  
  // Goals
  goals: CarePlanGoal[];
  
  // Activities
  activities: CarePlanActivity[];
  
  // Progress tracking
  progressPercentage: number;
  lastUpdated: string;
}

export interface CarePlanGoal {
  id: string;
  description: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  targetDate?: string;
  achieved: boolean;
  achievedDate?: string;
}

export interface CarePlanActivity {
  id: string;
  type: 'medication' | 'exercise' | 'diet' | 'monitoring' | 'appointment' | 'test';
  title: string;
  description: string;
  frequency: string; // e.g., "Daily", "Twice a week", "Monthly"
  duration?: string; // e.g., "30 minutes", "Ongoing"
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  dueDate?: string;
  completedDate?: string;
  notes?: string;
}

// ============================================
// Booking Request/Response
// ============================================

export interface AppointmentBookingRequest {
  type: 'doctor' | 'lab' | 'hospital_opd';
  doctorId?: string;
  labId?: string;
  hospitalId?: string;
  testIds?: string[];
  slotId: string;
  consultationType: 'in-person' | 'teleconsultation';
  patientNotes?: string;
  homeCollection?: boolean;
}

export interface AppointmentBookingResponse {
  success: boolean;
  appointmentId?: string;
  message: string;
  paymentRequired: boolean;
  paymentAmount?: number;
  paymentLink?: string;
}
