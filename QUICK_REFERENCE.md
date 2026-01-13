# Quick Reference - Ayusetu Role-Based Features

## 🚀 Quick Start

### Development Login
```
ABHA Number: Any 14 digits (e.g., 12345678901234)
Mode: Developer Mode (uses dummy data)
```

### User Flow
```
Sign In → ABHASuccess (3 pages) → Role Selection → Dashboard
```

---

## 👥 All Roles at a Glance

| Icon | Role | Color | Focus |
|------|------|-------|-------|
| 👤 | Patient | Green | Trust & Consent |
| 👨‍⚕️ | Doctor | Blue | Clinical Speed |
| 🏥 | Hospital | Purple | Operations |
| 🧪 | Lab | Orange | Reports |
| 💊 | Pharmacy | Brown | Prescriptions |
| 🚑 | Ambulance | Red | Emergency |

---

## 🎯 Feature Matrix

### Patient (8 Features)
```
🚨 Emergency         📅 Book Appointment
📄 Health Records    🔐 Manage Consent
💊 Medicines         📊 Health Timeline
📥 Download Records  🧪 Lab Tests
```

### Doctor (8 Features)
```
📝 Create Prescription    👥 View Patient Records
🧪 Order Lab Tests        💻 Teleconsultation
📋 Clinical Notes         ✍️ Digital Signature
🔄 Refer Patient          📊 Pending Reports
```

### Hospital (8 Features)
```
📋 Register Care Context  👨‍⚕️ Assign Doctors
📄 Discharge Summary      🏥 OPD/IPD Flow
💰 Billing                👥 Staff Access
🔐 Consent Management     📊 Analytics
```

### Lab (6 Features)
```
📥 Test Orders        🧪 Pending Samples
📊 Upload Reports     🔔 Notify Patient
👤 Patient Info       📋 Report History
```

### Pharmacy (6 Features)
```
📋 View Prescriptions    ✅ Verify Authenticity
💊 Dispense Medicines    📤 Upload Record
🔔 Notify Patient        📦 Inventory
```

### Ambulance (6 Features)
```
📥 Emergency Requests    📍 Pickup Location
🏥 Drop Location         📞 Patient Contact
🔄 Status Updates        🗺️ Navigation
```

---

## 🔄 Multiple Roles

### Allowed Combinations
- ✅ Patient + Doctor
- ✅ Doctor + Hospital
- ✅ Hospital + Lab
- ✅ Hospital Staff Roles

### How to Switch
1. Look for **Role Switcher** at top of dashboard
2. Tap to open modal
3. Select new role
4. Auto-navigates to new dashboard

---

## 🔐 Access Rules

### ✅ Allowed
- Patient: Own health records
- Doctor: Patient data **with consent**
- Hospital: Operational data + staff management
- Lab: Test-related patient info only
- Pharmacy: Prescription data only
- Ambulance: Location & contact only

### 🚫 Restricted
- Patient: Cannot edit records
- Doctor: No permanent patient access
- Hospital Admin: Cannot read clinical notes
- Lab: No diagnosis or prescriptions
- Pharmacy: No diagnosis or lab reports
- Ambulance: No ABHA or medical data

---

## 📱 Navigation Map

```
┌─────────────┐
│   Intro     │
└──────┬──────┘
       │
       ├──────┐
       │      │
   ┌───▼───┐ ┌▼────────┐
   │SignIn │ │ SignUp  │
   └───┬───┘ └─┬───────┘
       │       │
       │   ┌───▼────────────┐
       │   │ ABHA Creation  │
       │   │   Flow         │
       │   └───┬────────────┘
       │       │
   ┌───▼───────▼──┐
   │ ABHASuccess  │ (3 pages)
   └───────┬──────┘
           │
   ┌───────▼──────────┐
   │ Role Selection   │
   └───┬──────────────┘
       │
       ├─────┬─────┬─────┬─────┬─────┐
       │     │     │     │     │     │
   ┌───▼─┐ ┌▼──┐ ┌▼──┐ ┌▼─┐ ┌▼──┐ ┌▼────┐
   │ Pat │ │Doc│ │Hos│ │Lab│ │Pha│ │ Amb │
   │ DB  │ │DB │ │ DB│ │ DB│ │ DB│ │ DB  │
   └─────┘ └───┘ └───┘ └───┘ └───┘ └─────┘
```

---

## 🎨 UI Elements

### Common Components
- **Corner Decorations**: All screens (except success pages 2-3)
- **Sponsor Footer**: Intro, Sign In, Sign Up, ABHASuccess page 1
- **Profile Button**: All dashboards (top-right)
- **Quick Actions Grid**: 2-column layout on all dashboards

### Color Scheme
```
Primary:   #000 (Black)
Success:   #4CAF50 (Green)
Info:      #2196F3 (Blue)
Warning:   #FF9800 (Orange)
Error:     #F44336 (Red)
Purple:    #9C27B0
Background: #f8f9fa
```

---

## 🧪 Testing Commands

### Run Android
```bash
npm run android
```

### Run iOS
```bash
npm run ios
```

### TypeScript Check
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

---

## 📂 Key Files

### Dashboards
```
src/screens/dashboards/
├── PatientDashboard.tsx    # 8 actions + Role Switcher
├── DoctorDashboard.tsx     # 8 actions + Consent Requests
├── HospitalDashboard.tsx   # 8 actions + Bed Stats
├── LabDashboard.tsx        # 6 actions + Test Queue
├── PharmacyDashboard.tsx   # 6 actions + Prescriptions
└── AmbulanceDashboard.tsx  # 6 actions + Emergency Calls
```

### Components
```
src/components/
├── RoleSwitcher.tsx     # Multi-role support
├── SponsorFooter.tsx    # Footer with logo
└── TypewriterText.tsx   # Animated text
```

### Configuration
```
.env                     # ABDM API credentials
ROLE_FEATURES.md         # Complete features guide
ABDM_INTEGRATION.md      # API integration guide
```

---

## 🐛 Troubleshooting

### App won't start?
```bash
# Clean and rebuild
npm run android -- --reset-cache
```

### TypeScript errors?
```bash
# Check for errors
npx tsc --noEmit
```

### Missing dependencies?
```bash
npm install
```

### iOS issues?
```bash
cd ios && pod install && cd ..
```

---

## 📞 Quick Actions by Priority

### High Priority (Emergency)
```
🚨 Emergency (Patient)
📥 Emergency Requests (Ambulance)
```

### Daily Use
```
📅 Book Appointment (Patient)
📝 Create Prescription (Doctor)
📊 Upload Reports (Lab)
💊 Dispense Medicines (Pharmacy)
```

### Administrative
```
👥 Staff Access (Hospital)
📦 Inventory (Pharmacy)
🔐 Consent Management (Hospital/Patient)
```

---

## 🎯 Next Implementation Priority

1. **Consent Management UI** - Critical for ABDM compliance
2. **HPR/HFR Verification** - Role authentication
3. **Real Data Integration** - Connect to ABDM APIs
4. **Teleconsultation** - Video/audio calls
5. **Digital Signatures** - eSign integration

---

## 📚 Documentation Links

- **Features**: `ROLE_FEATURES.md`
- **ABDM Setup**: `ABDM_INTEGRATION.md`
- **Phase 1 Status**: `Notes/PHASE1_COMPLETE.md`
- **UX Specs**: `Notes/roles UI/UX.txt`

---

**Version**: 1.0.0
**Last Updated**: January 12, 2026
**Status**: ✅ Ready for Testing
