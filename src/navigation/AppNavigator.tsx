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

export type RootStackParamList = {
    Intro: undefined;
    SignIn: undefined;
    SignUp: undefined;
    Consent: undefined;
    ChooseMethod: undefined;
    AadhaarInput: undefined;
    MobileInput: undefined;
    OTPVerification: {
        method: 'aadhaar' | 'mobile';
        value: string;
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
    HealthRecords: undefined;
    ConsentManagement: undefined;
};

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
        </Stack.Navigator>
    );
}
