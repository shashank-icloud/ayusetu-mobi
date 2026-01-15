import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroScreen from '../screens/IntroScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ConsentScreen from '../screens/ConsentScreen';
import ChooseMethodScreen from '../screens/ChooseMethodScreen';
import AadhaarInputScreen from '../screens/AadhaarInputScreen';
import MobileInputScreen from '../screens/MobileInputScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import ABHASuccessScreen from '../screens/ABHASuccessScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import PatientDashboard from '../screens/dashboards/PatientDashboard';
import DoctorDashboard from '../screens/dashboards/DoctorDashboard';
import HospitalDashboard from '../screens/dashboards/HospitalDashboard';
import PharmacyDashboard from '../screens/dashboards/PharmacyDashboard';
import LabDashboard from '../screens/dashboards/LabDashboard';
import AmbulanceDashboard from '../screens/dashboards/AmbulanceDashboard';
import HealthRecordsScreen from '../screens/patient/HealthRecordsScreen';
import ConsentManagementScreen from '../screens/patient/ConsentManagementScreen';
import ProfileScreen from '../screens/patient/ProfileScreen';
import ABHAAddressManagementScreen from '../screens/patient/ABHAAddressManagementScreen';
import ABHARecoveryScreen from '../screens/patient/ABHARecoveryScreen';
import FamilyManagementScreen from '../screens/patient/FamilyManagementScreen';
import EmailInputScreen from '../screens/EmailInputScreen';
import ChildAccountManagementScreen from '../screens/patient/ChildAccountManagementScreen';
import ElderlyCareDelegationScreen from '../screens/patient/ElderlyCareDelegationScreen';
import AutoSyncScreen from '../screens/patient/AutoSyncScreen';
import ManualUploadScreen from '../screens/patient/ManualUploadScreen';
import RecordManagementScreen from '../screens/patient/RecordManagementScreen';
import ConsentInboxScreen from '../screens/patient/ConsentInboxScreen';
import ConsentTemplatesScreen from '../screens/patient/ConsentTemplatesScreen';
import ConsentAuditScreen from '../screens/patient/ConsentAuditScreen';
import EmergencyAccessScreen from '../screens/patient/EmergencyAccessScreen';
import { HealthSummaryScreen } from '../screens/HealthSummaryScreen';
import { TrendAnalysisScreen } from '../screens/TrendAnalysisScreen';
import { DiseaseTrackersScreen } from '../screens/DiseaseTrackersScreen';
import { MedicationAdherenceScreen } from '../screens/MedicationAdherenceScreen';
import { LifestyleTrackingScreen } from '../screens/LifestyleTrackingScreen';
import { SymptomJournalScreen } from '../screens/SymptomJournalScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import CarePlansScreen from '../screens/CarePlansScreen';
import EmergencyCardScreen from '../screens/EmergencyCardScreen';
import SOSScreen from '../screens/SOSScreen';
import EmergencySettingsScreen from '../screens/EmergencySettingsScreen';

export type RootStackParamList = {
    Intro: undefined;
    SignIn: undefined;
    SignUp: undefined;
    Consent: undefined;
    ChooseMethod: undefined;
    AadhaarInput: undefined;
    MobileInput: undefined;
    EmailInput: undefined;
    OTPVerification: {
        method: 'aadhaar' | 'mobile';
        value: string;
        txnId?: string;
    };
    ABHASuccess: {
        abhaNumber: string;
        abhaAddress: string;
    };
    RoleSelection: {
        identityType?: 'hfr' | 'abha';
    };
    PatientDashboard: undefined;
    DoctorDashboard: undefined;
    HospitalDashboard: undefined;
    PharmacyDashboard: undefined;
    LabDashboard: undefined;
    AmbulanceDashboard: undefined;
    HealthRecords: { initialView?: 'list' | 'timeline' } | undefined;
    ConsentManagement: undefined;
    Profile: undefined;
    ABHAAddressManagement: undefined;
    ABHARecovery: undefined;
    FamilyManagement: undefined;
    ChildAccountManagement: undefined;
    ElderlyCareDelegation: undefined;
    // Category 3: Record Ingestion & Management
    AutoSync: undefined;
    ManualUpload: undefined;
    // Category 5: Health Insights & Intelligence
    HealthSummary: undefined;
    TrendAnalysis: undefined;
    DiseaseTrackers: undefined;
    MedicationAdherence: undefined;
    LifestyleTracking: undefined;
    SymptomJournal: undefined;
    RecordManagement: undefined;
    // Category 4: Advanced Consent & Data Sharing
    ConsentInbox: undefined;
    ConsentTemplates: undefined;
    ConsentAudit: undefined;
    EmergencyAccess: undefined;
    // Category 6: Appointments & Care Journey
    Appointments: undefined;
    BookAppointment: { type?: 'doctor' | 'lab' | 'hospital' } | undefined;
    CarePlans: undefined;
    // Category 7: Emergency & Safety Features
    EmergencyCard: undefined;
    CreateEmergencyCard: undefined;
    SOS: undefined;
    EmergencySettings: undefined;
};

export type AppStackParamList = RootStackParamList;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Intro" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Intro" component={IntroScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Consent" component={ConsentScreen} />
            <Stack.Screen name="ChooseMethod" component={ChooseMethodScreen} />
            <Stack.Screen name="AadhaarInput" component={AadhaarInputScreen} />
            <Stack.Screen name="MobileInput" component={MobileInputScreen} />
            <Stack.Screen name="EmailInput" component={EmailInputScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            <Stack.Screen name="ABHASuccess" component={ABHASuccessScreen} />
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
            <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
            <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} />
            <Stack.Screen name="HospitalDashboard" component={HospitalDashboard} />
            <Stack.Screen name="PharmacyDashboard" component={PharmacyDashboard} />
            <Stack.Screen name="LabDashboard" component={LabDashboard} />
            <Stack.Screen name="AmbulanceDashboard" component={AmbulanceDashboard} />
            <Stack.Screen name="HealthRecords" component={HealthRecordsScreen} />
            <Stack.Screen name="ConsentManagement" component={ConsentManagementScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="ABHAAddressManagement" component={ABHAAddressManagementScreen} />
            <Stack.Screen name="ABHARecovery" component={ABHARecoveryScreen} />
            <Stack.Screen name="FamilyManagement" component={FamilyManagementScreen} />
            <Stack.Screen name="ChildAccountManagement" component={ChildAccountManagementScreen} />
            <Stack.Screen name="ElderlyCareDelegation" component={ElderlyCareDelegationScreen} />
            <Stack.Screen name="HealthSummary" component={HealthSummaryScreen} />
            <Stack.Screen name="TrendAnalysis" component={TrendAnalysisScreen} />
            <Stack.Screen name="DiseaseTrackers" component={DiseaseTrackersScreen} />
            <Stack.Screen name="MedicationAdherence" component={MedicationAdherenceScreen} />
            <Stack.Screen name="LifestyleTracking" component={LifestyleTrackingScreen} />
            <Stack.Screen name="SymptomJournal" component={SymptomJournalScreen} />
            <Stack.Screen name="AutoSync" component={AutoSyncScreen} />
            <Stack.Screen name="ManualUpload" component={ManualUploadScreen} />
            <Stack.Screen name="RecordManagement" component={RecordManagementScreen} />
            <Stack.Screen name="ConsentInbox" component={ConsentInboxScreen} />
            <Stack.Screen name="ConsentTemplates" component={ConsentTemplatesScreen} />
            <Stack.Screen name="ConsentAudit" component={ConsentAuditScreen} />
            <Stack.Screen name="EmergencyAccess" component={EmergencyAccessScreen} />
            <Stack.Screen name="Appointments" component={AppointmentsScreen} />
            <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
            <Stack.Screen name="CarePlans" component={CarePlansScreen} />
            <Stack.Screen name="EmergencyCard" component={EmergencyCardScreen} />
            <Stack.Screen name="SOS" component={SOSScreen} />
            <Stack.Screen name="EmergencySettings" component={EmergencySettingsScreen} />
        </Stack.Navigator>
    );
}
