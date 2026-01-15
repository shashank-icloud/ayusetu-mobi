// Insurance & Financial Health Service - Category 11
// Policy vault, claim tracking, cashless flow, cost estimation

import { Config } from '../../src/config/env';
import {
    InsurancePolicy,
    Claim,
    CashlessHospital,
    CostEstimation,
    PreAuthorization,
    FinancialSummary,
    GetPoliciesRequest,
    AddPolicyRequest,
    GetClaimsRequest,
    SubmitClaimRequest,
    UpdateClaimRequest,
    SearchCashlessHospitalsRequest,
    GetCostEstimationRequest,
    RequestPreAuthRequest,
    GetFinancialSummaryRequest,
    ClaimStatus,
    PolicyStatus,
} from '../types/insurance';

class InsuranceService {
    private baseUrl = `${Config.getBaseUrl()}/insurance`;

    // ============================================
    // Insurance Policies
    // ============================================

    async getPolicies(request: GetPoliciesRequest = {}): Promise<InsurancePolicy[]> {
        if (Config.DEVELOPER_MODE) {
            let policies = mockPolicies;
            if (request.status) {
                policies = policies.filter(p => p.status === request.status);
            }
            if (!request.includeExpired) {
                policies = policies.filter(p => p.status !== 'expired');
            }
            return policies;
        }

        const params = new URLSearchParams();
        if (request.status) params.append('status', request.status);
        if (request.includeExpired) params.append('includeExpired', 'true');

        const response = await fetch(`${this.baseUrl}/policies?${params}`);
        if (!response.ok) throw new Error('Failed to fetch policies');
        return response.json();
    }

    async addPolicy(request: AddPolicyRequest): Promise<InsurancePolicy> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(resolve, 1000));
            return {
                id: `policy-${Date.now()}`,
                policyNumber: request.policyNumber,
                provider: request.provider,
                providerName: request.provider.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                policyType: request.policyType,
                status: 'active',
                sumInsured: request.sumInsured,
                coverageAmount: request.sumInsured,
                usedAmount: 0,
                remainingAmount: request.sumInsured,
                startDate: request.startDate,
                endDate: request.endDate,
                renewalDate: request.endDate,
                gracePeriodDays: 30,
                membersCovered: request.members,
                isPrimary: true,
                cashlessHospitals: 8500,
                roomRentLimit: 5000,
                preExistingWaitingPeriod: 24,
                coPaymentPercentage: 10,
                premiumAmount: request.premiumAmount,
                premiumFrequency: 'yearly',
                nextPremiumDue: request.endDate,
            };
        }

        const response = await fetch(`${this.baseUrl}/policies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to add policy');
        return response.json();
    }

    // ============================================
    // Claims Management
    // ============================================

    async getClaims(request: GetClaimsRequest = {}): Promise<Claim[]> {
        if (Config.DEVELOPER_MODE) {
            let claims = mockClaims;
            if (request.policyId) {
                claims = claims.filter(c => c.policyId === request.policyId);
            }
            if (request.status) {
                claims = claims.filter(c => c.status === request.status);
            }
            return claims;
        }

        const params = new URLSearchParams();
        if (request.policyId) params.append('policyId', request.policyId);
        if (request.status) params.append('status', request.status);
        if (request.startDate) params.append('startDate', request.startDate.toISOString());
        if (request.endDate) params.append('endDate', request.endDate.toISOString());

        const response = await fetch(`${this.baseUrl}/claims?${params}`);
        if (!response.ok) throw new Error('Failed to fetch claims');
        return response.json();
    }

    async submitClaim(request: SubmitClaimRequest): Promise<Claim> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(resolve, 2000));
            return {
                id: `claim-${Date.now()}`,
                claimNumber: `CLM${Date.now().toString().slice(-8)}`,
                policyId: request.policyId,
                policyNumber: 'POL123456789',
                provider: 'Star Health',
                claimType: request.claimType,
                status: 'submitted',
                claimAmount: request.estimatedAmount,
                patientName: 'John Doe',
                hospitalName: request.hospitalName,
                hospitalAddress: '123 Medical Street, Mumbai',
                admissionDate: request.admissionDate,
                diagnosis: request.diagnosis,
                treatmentType: 'Inpatient',
                claimDate: new Date(),
                lastUpdatedDate: new Date(),
                documents: [],
                statusHistory: [
                    {
                        status: 'submitted',
                        date: new Date(),
                        remarks: 'Claim submitted successfully',
                        updatedBy: 'Patient',
                    },
                ],
                canAppeal: false,
            };
        }

        const formData = new FormData();
        Object.entries(request).forEach(([key, value]) => {
            if (key !== 'documents') {
                formData.append(key, value.toString());
            }
        });
        request.documents.forEach(doc => formData.append('documents', doc));

        const response = await fetch(`${this.baseUrl}/claims`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('Failed to submit claim');
        return response.json();
    }

    async updateClaim(request: UpdateClaimRequest): Promise<Claim> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(resolve, 1000));
            const claim = mockClaims[0];
            return { ...claim, lastUpdatedDate: new Date() };
        }

        const response = await fetch(`${this.baseUrl}/claims/${request.claimId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to update claim');
        return response.json();
    }

    // ============================================
    // Cashless Hospitals
    // ============================================

    async searchCashlessHospitals(request: SearchCashlessHospitalsRequest = {}): Promise<CashlessHospital[]> {
        if (Config.DEVELOPER_MODE) {
            let hospitals = mockCashlessHospitals;
            if (request.city) {
                hospitals = hospitals.filter(h => h.city.toLowerCase().includes(request.city!.toLowerCase()));
            }
            if (request.specialization) {
                hospitals = hospitals.filter(h =>
                    h.specializations.some(s => s.toLowerCase().includes(request.specialization!.toLowerCase()))
                );
            }
            return hospitals;
        }

        const params = new URLSearchParams();
        if (request.city) params.append('city', request.city);
        if (request.pincode) params.append('pincode', request.pincode);
        if (request.specialization) params.append('specialization', request.specialization);
        if (request.provider) params.append('provider', request.provider);
        if (request.latitude) params.append('latitude', request.latitude.toString());
        if (request.longitude) params.append('longitude', request.longitude.toString());
        if (request.radius) params.append('radius', request.radius.toString());

        const response = await fetch(`${this.baseUrl}/cashless-hospitals?${params}`);
        if (!response.ok) throw new Error('Failed to search hospitals');
        return response.json();
    }

    // ============================================
    // Cost Estimation
    // ============================================

    async getCostEstimation(request: GetCostEstimationRequest): Promise<CostEstimation> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(resolve, 1500));
            return mockCostEstimation;
        }

        const response = await fetch(`${this.baseUrl}/cost-estimation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to get cost estimation');
        return response.json();
    }

    // ============================================
    // Pre-Authorization
    // ============================================

    async requestPreAuth(request: RequestPreAuthRequest): Promise<PreAuthorization> {
        if (Config.DEVELOPER_MODE) {
            await new Promise<void>(resolve => setTimeout(resolve, 2000));
            return {
                id: `preauth-${Date.now()}`,
                authNumber: `PA${Date.now().toString().slice(-8)}`,
                policyId: request.policyId,
                status: 'pending',
                hospitalName: request.hospitalName,
                doctorName: request.doctorName,
                proposedTreatment: request.proposedTreatment,
                estimatedCost: request.estimatedCost,
                requestDate: new Date(),
                documents: [],
            };
        }

        const formData = new FormData();
        Object.entries(request).forEach(([key, value]) => {
            if (key !== 'documents') {
                formData.append(key, value.toString());
            }
        });
        request.documents.forEach(doc => formData.append('documents', doc));

        const response = await fetch(`${this.baseUrl}/pre-authorization`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('Failed to request pre-authorization');
        return response.json();
    }

    async getPreAuthorizations(policyId: string): Promise<PreAuthorization[]> {
        if (Config.DEVELOPER_MODE) {
            return [mockPreAuthorization];
        }

        const response = await fetch(`${this.baseUrl}/pre-authorization?policyId=${policyId}`);
        if (!response.ok) throw new Error('Failed to fetch pre-authorizations');
        return response.json();
    }

    // ============================================
    // Financial Summary
    // ============================================

    async getFinancialSummary(request: GetFinancialSummaryRequest = {}): Promise<FinancialSummary> {
        if (Config.DEVELOPER_MODE) {
            return mockFinancialSummary;
        }

        const params = new URLSearchParams();
        if (request.startYear) params.append('startYear', request.startYear.toString());
        if (request.endYear) params.append('endYear', request.endYear.toString());

        const response = await fetch(`${this.baseUrl}/financial-summary?${params}`);
        if (!response.ok) throw new Error('Failed to fetch financial summary');
        return response.json();
    }
}

// ============================================
// DEV MODE MOCK DATA
// ============================================

const mockPolicies: InsurancePolicy[] = [
    {
        id: 'policy-1',
        policyNumber: 'POL123456789',
        provider: 'star-health',
        providerName: 'Star Health Insurance',
        policyType: 'family-floater',
        status: 'active',
        sumInsured: 500000,
        coverageAmount: 500000,
        usedAmount: 125000,
        remainingAmount: 375000,
        startDate: new Date('2025-04-01'),
        endDate: new Date('2026-03-31'),
        renewalDate: new Date('2026-03-31'),
        gracePeriodDays: 30,
        membersCovered: [
            { name: 'John Doe', relation: 'self', age: 35, sumInsured: 500000 },
            { name: 'Jane Doe', relation: 'spouse', age: 32, sumInsured: 500000 },
            { name: 'Jack Doe', relation: 'child', age: 8, sumInsured: 500000 },
        ],
        isPrimary: true,
        cashlessHospitals: 8500,
        roomRentLimit: 5000,
        preExistingWaitingPeriod: 24,
        coPaymentPercentage: 10,
        premiumAmount: 18500,
        premiumFrequency: 'yearly',
        nextPremiumDue: new Date('2026-03-31'),
    },
    {
        id: 'policy-2',
        policyNumber: 'POL987654321',
        provider: 'hdfc-ergo',
        providerName: 'HDFC ERGO Health',
        policyType: 'senior-citizen',
        status: 'active',
        sumInsured: 300000,
        coverageAmount: 300000,
        usedAmount: 0,
        remainingAmount: 300000,
        startDate: new Date('2025-06-15'),
        endDate: new Date('2026-06-14'),
        renewalDate: new Date('2026-06-14'),
        gracePeriodDays: 15,
        membersCovered: [
            { name: 'Robert Doe', relation: 'parent', age: 68, sumInsured: 300000 },
        ],
        isPrimary: false,
        cashlessHospitals: 7200,
        roomRentLimit: 3000,
        preExistingWaitingPeriod: 36,
        coPaymentPercentage: 20,
        premiumAmount: 24000,
        premiumFrequency: 'yearly',
        nextPremiumDue: new Date('2026-06-14'),
    },
];

const mockClaims: Claim[] = [
    {
        id: 'claim-1',
        claimNumber: 'CLM20260112001',
        policyId: 'policy-1',
        policyNumber: 'POL123456789',
        provider: 'Star Health Insurance',
        claimType: 'cashless',
        status: 'approved',
        claimAmount: 125000,
        approvedAmount: 112500,
        settledAmount: 101250,
        deductedAmount: 11250,
        patientName: 'John Doe',
        hospitalName: 'Apollo Hospital',
        hospitalAddress: 'Jubilee Hills, Hyderabad, Telangana 500033',
        admissionDate: new Date('2025-12-20'),
        dischargeDate: new Date('2025-12-28'),
        diagnosis: 'Acute Appendicitis',
        treatmentType: 'Surgery - Appendectomy',
        claimDate: new Date('2025-12-28'),
        lastUpdatedDate: new Date('2026-01-10'),
        settlementDate: new Date('2026-01-10'),
        documents: [
            {
                id: 'doc-1',
                type: 'discharge-summary',
                name: 'Discharge_Summary.pdf',
                url: '/documents/discharge.pdf',
                uploadedAt: new Date('2025-12-28'),
                size: 245760,
            },
            {
                id: 'doc-2',
                type: 'bills',
                name: 'Hospital_Bills.pdf',
                url: '/documents/bills.pdf',
                uploadedAt: new Date('2025-12-28'),
                size: 524288,
            },
        ],
        statusHistory: [
            { status: 'submitted', date: new Date('2025-12-28'), remarks: 'Claim submitted', updatedBy: 'Patient' },
            { status: 'under-review', date: new Date('2025-12-30'), remarks: 'Under review by insurer', updatedBy: 'Star Health' },
            { status: 'approved', date: new Date('2026-01-05'), remarks: 'Claim approved', updatedBy: 'Star Health' },
            { status: 'settled', date: new Date('2026-01-10'), remarks: 'Amount settled to hospital', updatedBy: 'Star Health' },
        ],
        canAppeal: false,
    },
    {
        id: 'claim-2',
        claimNumber: 'CLM20260108002',
        policyId: 'policy-1',
        policyNumber: 'POL123456789',
        provider: 'Star Health Insurance',
        claimType: 'reimbursement',
        status: 'under-review',
        claimAmount: 35000,
        patientName: 'Jane Doe',
        hospitalName: 'Care Hospital',
        hospitalAddress: 'Banjara Hills, Hyderabad, Telangana 500034',
        admissionDate: new Date('2026-01-05'),
        dischargeDate: new Date('2026-01-07'),
        diagnosis: 'Viral Fever with Dehydration',
        treatmentType: 'Inpatient - IV Fluids',
        claimDate: new Date('2026-01-08'),
        lastUpdatedDate: new Date('2026-01-12'),
        documents: [
            {
                id: 'doc-3',
                type: 'bills',
                name: 'Medical_Bills.pdf',
                url: '/documents/bills2.pdf',
                uploadedAt: new Date('2026-01-08'),
                size: 324576,
            },
        ],
        statusHistory: [
            { status: 'submitted', date: new Date('2026-01-08'), remarks: 'Claim submitted for reimbursement', updatedBy: 'Patient' },
            { status: 'under-review', date: new Date('2026-01-10'), remarks: 'Documents under verification', updatedBy: 'Star Health' },
        ],
        canAppeal: false,
    },
];

const mockCashlessHospitals: CashlessHospital[] = [
    {
        id: 'hospital-1',
        name: 'Apollo Hospital',
        address: 'Jubilee Hills Road No. 72',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033',
        phone: '+91 40 2360 7777',
        email: 'info@apollohospitals.com',
        latitude: 17.4312,
        longitude: 78.4095,
        distance: 2.5,
        specializations: ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Gastroenterology'],
        rating: 4.5,
        reviewCount: 1250,
        providers: ['star-health', 'hdfc-ergo', 'max-bupa', 'icici-lombard'],
        hasEmergency: true,
        hasICU: true,
        bedCount: 500,
    },
    {
        id: 'hospital-2',
        name: 'Care Hospital',
        address: 'Road No. 1, Banjara Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        phone: '+91 40 6165 6565',
        latitude: 17.4189,
        longitude: 78.4489,
        distance: 3.2,
        specializations: ['Emergency Medicine', 'Critical Care', 'Pediatrics', 'Obstetrics', 'Surgery'],
        rating: 4.3,
        reviewCount: 890,
        providers: ['star-health', 'care-health', 'bajaj-allianz'],
        hasEmergency: true,
        hasICU: true,
        bedCount: 350,
    },
    {
        id: 'hospital-3',
        name: 'Yashoda Hospital',
        address: 'Raj Bhavan Road, Somajiguda',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500082',
        phone: '+91 40 2344 2222',
        latitude: 17.4292,
        longitude: 78.4569,
        distance: 4.1,
        specializations: ['Nephrology', 'Urology', 'Liver Transplant', 'Cardiology', 'Neurosurgery'],
        rating: 4.4,
        reviewCount: 1050,
        providers: ['star-health', 'hdfc-ergo', 'icici-lombard', 'max-bupa'],
        hasEmergency: true,
        hasICU: true,
        bedCount: 450,
    },
];

const mockCostEstimation: CostEstimation = {
    id: 'est-1',
    procedureName: 'Knee Replacement Surgery',
    hospitalName: 'Apollo Hospital',
    estimatedCost: 350000,
    insuranceCovered: 315000,
    coPayment: 35000,
    outOfPocket: 35000,
    breakdown: [
        {
            category: 'Surgery Charges',
            description: 'Surgeon fees and operation theater',
            estimatedAmount: 150000,
            insuredAmount: 135000,
            patientLiability: 15000,
        },
        {
            category: 'Hospitalization',
            description: 'Room rent and nursing care (5 days)',
            estimatedAmount: 75000,
            insuredAmount: 67500,
            patientLiability: 7500,
        },
        {
            category: 'Implants & Consumables',
            description: 'Knee implant and surgical materials',
            estimatedAmount: 100000,
            insuredAmount: 90000,
            patientLiability: 10000,
        },
        {
            category: 'Diagnostics',
            description: 'Pre-op tests and post-op monitoring',
            estimatedAmount: 15000,
            insuredAmount: 13500,
            patientLiability: 1500,
        },
        {
            category: 'Physiotherapy',
            description: 'Post-surgery rehabilitation (10 sessions)',
            estimatedAmount: 10000,
            insuredAmount: 9000,
            patientLiability: 1000,
        },
    ],
    policyId: 'policy-1',
    policyNumber: 'POL123456789',
    availableCoverage: 375000,
    validUntil: new Date('2026-02-15'),
    createdAt: new Date('2026-01-15'),
};

const mockPreAuthorization: PreAuthorization = {
    id: 'preauth-1',
    authNumber: 'PA20260115001',
    policyId: 'policy-1',
    status: 'approved',
    hospitalName: 'Apollo Hospital',
    doctorName: 'Dr. Rajesh Kumar',
    proposedTreatment: 'Angioplasty with Stent',
    estimatedCost: 280000,
    approvedAmount: 252000,
    requestDate: new Date('2026-01-12'),
    approvalDate: new Date('2026-01-14'),
    validUntil: new Date('2026-02-14'),
    documents: [],
};

const mockFinancialSummary: FinancialSummary = {
    totalCoverage: 800000,
    totalUsed: 125000,
    totalRemaining: 675000,
    totalClaims: 2,
    claimsApproved: 1,
    claimsSettled: 1,
    claimsPending: 1,
    claimsRejected: 0,
    totalClaimAmount: 160000,
    totalSettledAmount: 101250,
    totalReimbursed: 0,
    totalPremiumPaid: 42500,
    yearlyBreakdown: [
        {
            year: 2025,
            premiumPaid: 42500,
            claimsSettled: 101250,
            claimCount: 1,
        },
        {
            year: 2024,
            premiumPaid: 40000,
            claimsSettled: 0,
            claimCount: 0,
        },
    ],
};

export default new InsuranceService();
