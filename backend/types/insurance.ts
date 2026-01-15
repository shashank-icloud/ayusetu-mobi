// Insurance & Financial Health Types - Category 11
// Policy vault, claim tracking, cashless flow, cost estimation

export type InsuranceProvider = 'star-health' | 'max-bupa' | 'hdfc-ergo' | 'icici-lombard' | 'care-health' | 'bajaj-allianz' | 'other';

export type PolicyType = 'health' | 'critical-illness' | 'personal-accident' | 'family-floater' | 'senior-citizen';

export type PolicyStatus = 'active' | 'expired' | 'grace-period' | 'lapsed' | 'pending-renewal';

export type ClaimStatus = 'draft' | 'submitted' | 'under-review' | 'approved' | 'settled' | 'rejected' | 'reimbursed';

export type ClaimType = 'cashless' | 'reimbursement' | 'pre-authorization';

export interface InsurancePolicy {
    id: string;
    policyNumber: string;
    provider: InsuranceProvider;
    providerName: string;
    policyType: PolicyType;
    status: PolicyStatus;

    // Coverage details
    sumInsured: number; // in INR
    coverageAmount: number;
    usedAmount: number;
    remainingAmount: number;

    // Dates
    startDate: Date;
    endDate: Date;
    renewalDate: Date;
    gracePeriodDays: number;

    // Members covered
    membersCovered: PolicyMember[];
    isPrimary: boolean;

    // Policy features
    cashlessHospitals: number;
    roomRentLimit: number; // per day
    preExistingWaitingPeriod: number; // in months
    coPaymentPercentage: number;

    // Documents
    policyDocument?: string;
    policyCardUrl?: string;

    // Premium
    premiumAmount: number;
    premiumFrequency: 'monthly' | 'quarterly' | 'yearly';
    nextPremiumDue: Date;
}

export interface PolicyMember {
    name: string;
    relation: 'self' | 'spouse' | 'child' | 'parent' | 'sibling';
    age: number;
    sumInsured: number;
}

export interface Claim {
    id: string;
    claimNumber: string;
    policyId: string;
    policyNumber: string;
    provider: string;

    // Claim details
    claimType: ClaimType;
    status: ClaimStatus;
    claimAmount: number;
    approvedAmount?: number;
    settledAmount?: number;
    deductedAmount?: number;

    // Medical details
    patientName: string;
    hospitalName: string;
    hospitalAddress: string;
    admissionDate: Date;
    dischargeDate?: Date;
    diagnosis: string;
    treatmentType: string;

    // Dates
    claimDate: Date;
    lastUpdatedDate: Date;
    settlementDate?: Date;

    // Documents
    documents: ClaimDocument[];

    // Status tracking
    statusHistory: ClaimStatusHistory[];

    // Rejection details
    rejectionReason?: string;
    canAppeal: boolean;
}

export interface ClaimDocument {
    id: string;
    type: 'discharge-summary' | 'bills' | 'prescriptions' | 'lab-reports' | 'consultation' | 'pre-auth' | 'other';
    name: string;
    url: string;
    uploadedAt: Date;
    size: number;
}

export interface ClaimStatusHistory {
    status: ClaimStatus;
    date: Date;
    remarks?: string;
    updatedBy: string;
}

export interface CashlessHospital {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email?: string;

    // Location
    latitude?: number;
    longitude?: number;
    distance?: number; // in km

    // Specializations
    specializations: string[];

    // Ratings
    rating?: number;
    reviewCount?: number;

    // Coverage
    providers: InsuranceProvider[];
    hasEmergency: boolean;
    hasICU: boolean;
    bedCount?: number;
}

export interface CostEstimation {
    id: string;
    procedureName: string;
    hospitalName: string;

    // Cost breakdown
    estimatedCost: number;
    insuranceCovered: number;
    coPayment: number;
    outOfPocket: number;

    // Details
    breakdown: CostBreakdown[];

    // Policy details
    policyId: string;
    policyNumber: string;
    availableCoverage: number;

    // Validity
    validUntil: Date;
    createdAt: Date;
}

export interface CostBreakdown {
    category: string;
    description: string;
    estimatedAmount: number;
    insuredAmount: number;
    patientLiability: number;
}

export interface PreAuthorization {
    id: string;
    authNumber: string;
    policyId: string;
    claimId?: string;

    status: 'pending' | 'approved' | 'rejected' | 'expired';

    // Treatment details
    hospitalName: string;
    doctorName: string;
    proposedTreatment: string;
    estimatedCost: number;
    approvedAmount?: number;

    // Dates
    requestDate: Date;
    approvalDate?: Date;
    validUntil?: Date;

    // Documents
    documents: ClaimDocument[];
}

export interface FinancialSummary {
    // Total insurance coverage
    totalCoverage: number;
    totalUsed: number;
    totalRemaining: number;

    // Claims
    totalClaims: number;
    claimsApproved: number;
    claimsSettled: number;
    claimsPending: number;
    claimsRejected: number;

    // Financial
    totalClaimAmount: number;
    totalSettledAmount: number;
    totalReimbursed: number;
    totalPremiumPaid: number;

    // By year
    yearlyBreakdown: YearlyFinancialBreakdown[];
}

export interface YearlyFinancialBreakdown {
    year: number;
    premiumPaid: number;
    claimsSettled: number;
    claimCount: number;
}

// Request/Response types

export interface GetPoliciesRequest {
    status?: PolicyStatus;
    includeExpired?: boolean;
}

export interface AddPolicyRequest {
    policyNumber: string;
    provider: InsuranceProvider;
    policyType: PolicyType;
    sumInsured: number;
    startDate: Date;
    endDate: Date;
    premiumAmount: number;
    members: PolicyMember[];
}

export interface GetClaimsRequest {
    policyId?: string;
    status?: ClaimStatus;
    startDate?: Date;
    endDate?: Date;
}

export interface SubmitClaimRequest {
    policyId: string;
    claimType: ClaimType;
    hospitalName: string;
    admissionDate: Date;
    diagnosis: string;
    estimatedAmount: number;
    documents: File[];
}

export interface UpdateClaimRequest {
    claimId: string;
    documents?: File[];
    additionalInfo?: string;
}

export interface SearchCashlessHospitalsRequest {
    city?: string;
    pincode?: string;
    specialization?: string;
    provider?: InsuranceProvider;
    latitude?: number;
    longitude?: number;
    radius?: number; // in km
}

export interface GetCostEstimationRequest {
    procedureName: string;
    hospitalId?: string;
    policyId: string;
}

export interface RequestPreAuthRequest {
    policyId: string;
    hospitalName: string;
    doctorName: string;
    proposedTreatment: string;
    estimatedCost: number;
    plannedAdmissionDate: Date;
    documents: File[];
}

export interface GetFinancialSummaryRequest {
    startYear?: number;
    endYear?: number;
}
