# Login Flow Implementation - ABDM Compliant

## 🔐 Identity-Based Login System

The Sign In screen now supports **multiple identity types** based on ABDM standards, allowing different roles to authenticate using their appropriate credentials.

---

## 📱 Sign In Screen Features

### Identity Type Selector (Dropdown)
Users can select from three identity types:

| Identity Type | Used By | Format | Registry |
|---------------|---------|--------|----------|
| **ABHA** | Patients | 14-digit number | ABHA Registry |
| **HPR** | Doctors | Alphanumeric ID | HPR Registry |
| **HFR** | Hospitals/Labs | Alphanumeric ID | HFR Registry |

### UI Components

```
┌─────────────────────────────┐
│         Sign In             │
│                             │
│      Login with             │
│                             │
│  ┌────────────────────┐     │
│  │  ABHA-          ▼  │     │ ← Dropdown Button
│  └────────────────────┘     │
│                             │
│  ┌────────────────────┐     │
│  │ Enter ABHA Number  │     │ ← Input Field
│  └────────────────────┘     │
│                             │
│  ┌────────────────────┐     │
│  │     Proceed        │     │ ← Action Button
│  └────────────────────┘     │
└─────────────────────────────┘
```

---

## 🎯 Login Flow by Identity Type

### 1. **ABHA Login** (Patient Flow)
```
User selects: ABHA
  ↓
Enters: 14-digit ABHA number
  ↓
Validates: Must be exactly 14 digits
  ↓
Developer Mode:
  → ABHASuccess screen (3 pages)
  → Role Selection
  → Patient Dashboard

Production Mode:
  → OTP verification
  → ABHA authentication via API
  → Patient Dashboard
```

**Use Case**: Patients accessing their health records

---

### 2. **HPR Login** (Doctor Flow)
```
User selects: HPR
  ↓
Enters: HPR ID (alphanumeric)
  ↓
Validates: Minimum 5 characters
  ↓
Developer Mode:
  → Direct to Doctor Dashboard

Production Mode:
  → HPR ID verification
  → OTP to registered mobile
  → Doctor Dashboard
```

**Use Case**: Doctors accessing patient records (with consent)

---

### 3. **HFR Login** (Hospital/Lab Flow)
```
User selects: HFR
  ↓
Enters: HFR ID (alphanumeric)
  ↓
Validates: Minimum 5 characters
  ↓
Developer Mode:
  → Role Selection (Hospital/Lab)
  → Appropriate Dashboard

Production Mode:
  → HFR ID verification
  → Admin credentials
  → Role-based dashboard
```

**Use Case**: Hospital admins, Lab technicians

---

## 🔄 Multi-Role Scenario

### Example: Doctor who is also a Patient

**Mobile Number**: +91 98765 43210

**Linked Identities**:
- ABHA ID: `12-3456-7890-1234` (Patient)
- HPR ID: `HPR-DOC-12345` (Doctor)

**Login Options**:
1. **As Patient**: Select ABHA → Enter ABHA number → Patient Dashboard
2. **As Doctor**: Select HPR → Enter HPR ID → Doctor Dashboard

**Role Switcher**: Once logged in, can switch between roles without re-login

---

## 🛡️ Security Architecture

### Identity Separation
```
Mobile Number (Account Container)
   ├── ABHA Identity
   │   ├── Token: abha_token_xyz
   │   ├── Role: Patient
   │   └── Permissions: [view_own_records, grant_consent]
   │
   ├── HPR Identity
   │   ├── Token: hpr_token_abc
   │   ├── Role: Doctor
   │   └── Permissions: [view_patient_records*, create_prescription]
   │
   └── HFR Identity
       ├── Token: hfr_token_def
       ├── Role: Hospital Admin
       └── Permissions: [manage_staff, view_analytics]
```

*Requires patient consent

---

## 📋 Validation Rules

### ABHA (Patient)
- **Format**: 14 digits
- **Example**: `12345678901234`
- **Keyboard**: Numeric
- **Registry**: ABHA Registry
- **Verification**: OTP to linked mobile

### HPR (Doctor)
- **Format**: Alphanumeric, 5-20 characters
- **Example**: `HPR-DOC-12345`
- **Keyboard**: Default
- **Registry**: HPR Registry
- **Verification**: HPR credentials + OTP

### HFR (Hospital/Lab)
- **Format**: Alphanumeric, 5-20 characters
- **Example**: `HFR-HOSP-6789`
- **Keyboard**: Default
- **Registry**: HFR Registry
- **Verification**: Admin credentials + OTP

---

## 🚫 What's NOT Allowed

### ❌ Incorrect Usage
1. **Using ABHA for Doctor login**
   - ABHA = Citizen identity only
   - Violates ABDM architecture

2. **Using HPR for Hospital login**
   - HPR = Individual practitioner
   - HFR = Facility/organization

3. **Single "super login" for all roles**
   - Each role needs separate authentication
   - Maintains audit trail

4. **Sharing sessions across roles**
   - Security risk
   - Breaks consent model

---

## 🔐 Production Implementation

### Step 1: Mobile Number Verification
```
1. User enters mobile number
2. OTP sent to mobile
3. User verifies OTP
4. Account created/authenticated
```

### Step 2: Identity Linking
```
For Patient:
  → Link ABHA via OTP/QR
  
For Doctor:
  → Verify HPR ID
  → OTP to HPR-registered mobile
  
For Hospital/Lab:
  → Verify HFR ID
  → Admin approval flow
```

### Step 3: Role-Based Access
```
Each identity gets:
  ✓ Separate JWT token
  ✓ Role-specific permissions
  ✓ Independent audit log
  ✓ Consent checks (where applicable)
```

---

## 💻 Developer Mode (Current)

For testing without backend:

### ABHA Login
- Enter any 14-digit number
- Proceeds to ABHASuccess → Role Selection
- Full patient flow demonstration

### HPR Login
- Enter any 5+ character ID (e.g., `HPR123`)
- Direct to Doctor Dashboard
- Simulates verified doctor

### HFR Login
- Enter any 5+ character ID (e.g., `HFR456`)
- Goes to Role Selection
- Choose Hospital or Lab dashboard

---

## 🎨 UI Implementation Details

### Dropdown Modal
- **Trigger**: Tap on identity type button
- **Display**: Modal overlay with 3 options
- **Selection**: Tap option to select
- **Visual**: Active option highlighted
- **Description**: Each option shows "For [role]"

### Input Field
- **Dynamic Placeholder**: Changes based on selected identity
- **Keyboard Type**: Numeric for ABHA, default for HPR/HFR
- **Max Length**: 14 for ABHA, 20 for HPR/HFR
- **Validation**: Real-time length check

### Proceed Button
- **Visibility**: Shows only when input is valid
- **Fallback**: "New here? Create account" link when invalid
- **Action**: Routes to appropriate flow based on identity type

---

## 📊 Login Analytics (Future)

Track these metrics:
- Login attempts by identity type
- Successful authentications
- Failed verifications
- Multi-role usage patterns
- Peak login times

---

## 🔄 Migration from Old System

### Before (ABHA-only)
```tsx
<TextInput placeholder="Enter ABHA number" />
```

### After (Multi-identity)
```tsx
<Dropdown options={[ABHA, HPR, HFR]} />
<TextInput 
  placeholder={selectedIdentity.placeholder}
  keyboardType={selectedIdentity.keyboardType}
/>
```

---

## 🧪 Testing Scenarios

### Test Case 1: Patient Login
```
1. Open Sign In screen
2. Verify ABHA is default selection
3. Enter: 12345678901234
4. Tap Proceed
5. Verify: ABHASuccess screen appears
```

### Test Case 2: Doctor Login
```
1. Open Sign In screen
2. Tap ABHA dropdown
3. Select HPR
4. Enter: HPR12345
5. Tap Proceed
6. Verify: Doctor Dashboard appears
```

### Test Case 3: Hospital Login
```
1. Open Sign In screen
2. Tap ABHA dropdown
3. Select HFR
4. Enter: HFR67890
5. Tap Proceed
6. Verify: Role Selection appears
7. Select Hospital
8. Verify: Hospital Dashboard appears
```

### Test Case 4: Invalid Input
```
1. Select ABHA
2. Enter: 123 (incomplete)
3. Verify: Proceed button NOT shown
4. Verify: "New here?" link shown instead
```

---

## 🎯 Compliance Checklist

- ✅ Separate identity types per ABDM guidelines
- ✅ ABHA for patients only
- ✅ HPR for doctors
- ✅ HFR for facilities
- ✅ No identity mixing
- ✅ Role-based routing
- ✅ Multi-role support architecture
- ✅ Consent-first design
- ✅ Audit trail ready

---

## 📚 Related Files

- `/src/screens/SignInScreen.tsx` - Main implementation
- `/Notes/Login identity.txt` - Requirements document
- `/ROLE_FEATURES.md` - Role-based features
- `/QUICK_REFERENCE.md` - Quick reference guide

---

**Status**: ✅ Implemented - Ready for Testing
**Date**: January 12, 2026
**Compliance**: ABDM-aligned, DPDP Act ready
