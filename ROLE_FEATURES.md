# Role-Based Features Implementation

## Overview
This document outlines the complete implementation of role-based features in the Ayusetu healthcare app, based on ABDM compliance and multi-role support.

---

## 📋 Roles & Features

### 👤 **PATIENT (ABHA Owner)**

**UX Philosophy**: Simple, Trust-focused, Consent-first

**Dashboard Features**:
- ✅ **ABHA Card with QR Code** - Display and download ABHA card
- ✅ **Emergency Button** - Quick access to ambulance services
- ✅ **Upcoming Appointments** - View scheduled consultations
- ✅ **Health Records** - View prescriptions & lab reports
- ✅ **Manage Consent** - Grant/revoke data access permissions
- ✅ **Book Appointments** - Schedule doctor/lab visits
- ✅ **Medicine Reminders** - Set medication alerts
- ✅ **Request Ambulance** - Emergency ambulance booking
- ✅ **Health Timeline** - Complete medical history view
- ✅ **Download Records** - Export health data

**Restrictions**:
- 🚫 Cannot edit medical records (read-only access)
- 🚫 Cannot access other patients' data

---

### 🧑‍⚕️ **DOCTOR (HPR Verified)**

**UX Philosophy**: Clinical, Fast workflows, Minimal clicks

**Dashboard Features**:
- ✅ **Today's Appointments** - View daily schedule
- ✅ **Consent Requests** - Pending patient data access requests
- ✅ **Pending Reports** - Lab results awaiting review
- ✅ **View Patient Records** - Access with patient consent
- ✅ **Create Prescriptions** - Generate FHIR-compliant prescriptions
- ✅ **Order Lab Tests** - Request diagnostic tests
- ✅ **Teleconsultation** - Video/audio consultations
- ✅ **Upload Clinical Notes** - Document patient visits
- ✅ **Digital Signature** - Sign prescriptions & reports
- ✅ **Refer Patient** - Transfer to specialists

**Restrictions**:
- 🚫 No permanent patient access (consent-based only)
- 🚫 No administrative powers
- 🚫 Cannot access data without consent

---

### 🏥 **HOSPITAL/CLINIC (HFR Registered)**

**UX Philosophy**: Operational, Multi-user, Structured

**Dashboard Features**:
- ✅ **OPD/IPD Overview** - Patient flow management
- ✅ **Staff Management** - Manage doctors & staff
- ✅ **Consent Analytics** - Track consent requests
- ✅ **Register Care Contexts** - Link patient visits
- ✅ **Assign Doctors** - Allocate patients to doctors
- ✅ **Upload Discharge Summaries** - Patient discharge documentation
- ✅ **Manage OPD/IPD Flow** - Queue & bed management
- ✅ **Billing** - Non-clinical financial operations
- ✅ **Role-Based Staff Access** - Permission management
- ✅ **Consent Request Management** - Handle data access

**Restrictions**:
- 🚫 Admins cannot read clinical notes (doctor-only)
- 🚫 Cannot access patient data without proper role
- 🚫 Cannot modify clinical records

---

### 🧪 **DIAGNOSTIC LAB (HFR Registered)**

**UX Philosophy**: Task-based, Report-focused

**Dashboard Features**:
- ✅ **Test Orders** - Incoming test requests
- ✅ **Pending Samples** - Sample collection tracking
- ✅ **Uploaded Reports** - Published test results
- ✅ **Receive Test Orders** - Accept from doctors/hospitals
- ✅ **Upload Lab Reports** - Publish results (FHIR format)
- ✅ **Notify Patient & Doctor** - Send report notifications
- ✅ **View Limited Patient Info** - Minimal demographic data
- ✅ **Report History** - Past test records

**Restrictions**:
- 🚫 Cannot see diagnosis or clinical notes
- 🚫 Cannot access prescriptions
- 🚫 Limited patient data (only test-related info)

---

### 💊 **PHARMACY**

**UX Philosophy**: Prescription-first, Minimal data

**Dashboard Features**:
- ✅ **New Prescriptions** - Incoming prescription orders
- ✅ **Dispensed Medicines** - Fulfillment tracking
- ✅ **View Prescriptions** - Access after patient consent
- ✅ **Verify Authenticity** - Validate prescription legitimacy
- ✅ **Dispense Medicines** - Record medicine distribution
- ✅ **Upload Dispense Record** - Document fulfillment
- ✅ **Notify Patient** - Send pickup/delivery alerts

**Restrictions**:
- 🚫 No diagnosis access
- 🚫 No lab reports access
- 🚫 Only prescription-related data visible

---

### 🚑 **AMBULANCE SERVICE**

**UX Philosophy**: Emergency-centric, Fast actions

**Dashboard Features**:
- ✅ **Active Requests** - Live emergency calls
- ✅ **Navigation** - Route to pickup/drop locations
- ✅ **Receive Emergency Requests** - Accept emergency calls
- ✅ **Pickup & Drop Location** - Address management
- ✅ **Patient Contact** - Call patient/requester
- ✅ **Status Updates** - Real-time trip updates

**Restrictions**:
- 🚫 No ABHA access
- 🚫 No medical records access
- 🚫 Location & contact info only

---

## 🔄 Multiple Roles Support

### Allowed Combinations
- ✅ **Doctor + Hospital** - Doctor working at a hospital
- ✅ **Patient + Doctor** - Dual identity (own health + practice)
- ✅ **Hospital + Lab** - Hospital with in-house lab
- ✅ **Hospital Staff Roles** - Multiple hospital roles

### Role Switcher Component
- **Location**: Top of dashboard (after header)
- **UI**: Compact button showing current role
- **Action**: Modal with all available roles
- **Navigation**: Auto-switches to appropriate dashboard

**Implementation**:
```tsx
<RoleSwitcher
    currentRole={role}
    availableRoles={availableRoles}
    onRoleChange={handleRoleChange}
/>
```

### Backend Rules
- Each role has separate permission set
- No data crossover between roles
- Short-lived tokens per role
- Every access is logged for audit

---

## 🔐 Security & Access Control

### UI Access Control
| Role      | Dashboard Access       |
|-----------|------------------------|
| Patient   | Full patient UI        |
| Doctor    | Clinical UI            |
| Hospital  | Admin + staff UI       |
| Lab       | Lab-only UI            |
| Pharmacy  | Prescription UI        |
| Ambulance | Emergency UI           |

### Wrong Role Handling
- 📌 **Wrong role = Locked UI + Verification prompt**
- User must verify credentials for new roles
- HPR verification required for Doctor
- HFR verification required for Hospital/Lab/Pharmacy

---

## 🧩 Technical Implementation

### Frontend
- **Route Guards**: Role-based navigation protection
- **Component-Level Checks**: Hide/show features by role
- **Permission Checks**: Before every sensitive action

### Backend (Recommended)
- **RBAC Middleware**: Role-based access control
- **Consent Check**: Middleware for patient data access
- **Audit Logging**: All data access logged
- **Token Management**: Short-lived, role-specific JWT tokens

### State Management
```tsx
// User state
{
  abhaNumber: string;
  currentRole: string;
  availableRoles: Role[];
  permissions: Permission[];
  tokens: { [role: string]: string };
}
```

---

## ❌ What NOT to Do

1. ❌ **Don't** let anyone access doctor UI without HPR verification
2. ❌ **Don't** skip HPR/HFR verification for role assignment
3. ❌ **Don't** use same dashboard for all roles
4. ❌ **Don't** issue permanent access tokens
5. ❌ **Don't** allow admin to see patient clinical data
6. ❌ **Don't** share data between roles without proper consent
7. ❌ **Don't** allow role switching without re-authentication

---

## 📱 UI/UX Guidelines

### Design Principles
1. **Role-Appropriate Icons**: Each role has distinct visual identity
2. **Color Coding**: Consistent colors per role throughout app
3. **Minimal Clicks**: Fast workflows for clinical roles (Doctor, Ambulance)
4. **Trust Indicators**: Consent badges, verification checkmarks
5. **Emergency First**: Red emergency buttons for Patient & Ambulance

### Navigation Flow
```
Intro → SignIn/SignUp → ABHA Creation → Role Selection → Dashboard
                           ↓
                    [If existing ABHA]
                           ↓
                    ABHA Success → Role Selection → Dashboard
```

---

## 🚀 Next Steps

### Phase 1: Current (Completed)
- ✅ All dashboard screens created
- ✅ Role-specific quick actions
- ✅ Role switcher component
- ✅ Basic navigation flow

### Phase 2: Data Integration
- [ ] Connect to ABDM APIs
- [ ] Implement consent management
- [ ] Real patient data flow
- [ ] FHIR-compliant data formats

### Phase 3: Advanced Features
- [ ] Teleconsultation integration
- [ ] Digital signatures (eSign)
- [ ] Real-time notifications
- [ ] Offline mode support

### Phase 4: Security & Compliance
- [ ] HPR/HFR verification flows
- [ ] Certificate pinning
- [ ] Encryption at rest
- [ ] Audit trail implementation
- [ ] Penetration testing

---

## 📚 Related Documentation
- `ABDM_INTEGRATION.md` - ABDM API integration guide
- `Notes/roles UI/UX.txt` - Detailed UX specifications
- `Notes/roles UI/Multiroles.txt` - Multiple role handling
- `Notes/roles UI/UIacces.txt` - Access control matrix

---

**Last Updated**: January 12, 2026
**Status**: Phase 1 Complete - Ready for Testing
