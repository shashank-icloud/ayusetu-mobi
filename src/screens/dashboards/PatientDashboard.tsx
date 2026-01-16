import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import RoleSwitcher from '../../components/RoleSwitcher';

type Props = NativeStackScreenProps<RootStackParamList, 'PatientDashboard'>;

interface QuickAction {
    id: string;
    title: string;
    icon: string;
    color: string;
    onPress: () => void;
}

interface CategorySection {
    title: string;
    actions: QuickAction[];
}

export default function PatientDashboard({ navigation }: Props) {
    const [role, setRole] = useState<string>('patient');

    const availableRoles = [
        { id: 'patient', name: 'Patient', icon: '👤' },
        { id: 'doctor', name: 'Doctor', icon: '👨‍⚕️' },
    ];

    const handleRoleChange = (newRole: string) => {
        setRole(newRole);
        if (newRole === 'doctor') {
            navigation.navigate('DoctorDashboard');
        }
    };

    const categories: CategorySection[] = [
        {
            title: 'Emergency',
            actions: [
                { id: 'sos', title: 'SOS', icon: '🚨', color: '#ef4444', onPress: () => navigation.navigate('SOS') },
                { id: 'emergencyAccess', title: 'Emergency Access', icon: '🚑', color: '#dc2626', onPress: () => navigation.navigate('EmergencyAccess') },
                { id: 'emergencyCard', title: 'Emergency Card', icon: '🆘', color: '#b91c1c', onPress: () => navigation.navigate('EmergencyCard') },
            ],
        },
        {
            title: 'Health Records',
            actions: [
                { id: 'records', title: 'My Records', icon: '📄', color: '#3b82f6', onPress: () => navigation.navigate('HealthRecords') },
                { id: 'upload', title: 'Upload', icon: '📤', color: '#2563eb', onPress: () => navigation.navigate('ManualUpload') },
                { id: 'organize', title: 'Organize', icon: '📁', color: '#1d4ed8', onPress: () => navigation.navigate('RecordManagement') },
                { id: 'timeline', title: 'Timeline', icon: '📊', color: '#1e40af', onPress: () => navigation.navigate('HealthRecords', { initialView: 'timeline' }) },
                { id: 'labs', title: 'Lab Tests', icon: '🧪', color: '#1e3a8a', onPress: () => console.log('View Lab Results') },
            ],
        },
        {
            title: 'Appointments & Care',
            actions: [
                { id: 'bookAppointment', title: 'Book Appointment', icon: '📅', color: '#06b6d4', onPress: () => navigation.navigate('BookAppointment') },
                { id: 'myAppointments', title: 'My Appointments', icon: '🗓️', color: '#0891b2', onPress: () => navigation.navigate('Appointments') },
                { id: 'telemedicine', title: 'Telemedicine', icon: '👨‍⚕️', color: '#0e7490', onPress: () => navigation.navigate('Telemedicine') },
                { id: 'carePlans', title: 'Care Plans', icon: '📋', color: '#155e75', onPress: () => navigation.navigate('CarePlans') },
            ],
        },
        {
            title: 'Health Tracking',
            actions: [
                { id: 'healthSummary', title: 'Health Summary', icon: '📊', color: '#8b5cf6', onPress: () => navigation.navigate('HealthSummary') },
                { id: 'trends', title: 'Health Trends', icon: '📈', color: '#7c3aed', onPress: () => navigation.navigate('TrendAnalysis') },
                { id: 'diseaseTrackers', title: 'Disease Trackers', icon: '🏥', color: '#6d28d9', onPress: () => navigation.navigate('DiseaseTrackers') },
                { id: 'symptoms', title: 'Symptom Journal', icon: '📝', color: '#5b21b6', onPress: () => navigation.navigate('SymptomJournal') },
                { id: 'lifestyle', title: 'Lifestyle Log', icon: '🏃', color: '#4c1d95', onPress: () => navigation.navigate('LifestyleTracking') },
            ],
        },
        {
            title: 'Medications',
            actions: [
                { id: 'medications', title: 'My Medications', icon: '💊', color: '#ec4899', onPress: () => navigation.navigate('MedicationAdherence') },
                { id: 'reminders', title: 'Reminders', icon: '🔔', color: '#db2777', onPress: () => navigation.navigate('Reminders') },
            ],
        },
        {
            title: 'Consent & Privacy',
            actions: [
                { id: 'consent', title: 'Manage Consent', icon: '🔒', color: '#f59e0b', onPress: () => navigation.navigate('ConsentManagement') },
                { id: 'consentInbox', title: 'Consent Inbox', icon: '📬', color: '#d97706', onPress: () => navigation.navigate('ConsentInbox') },
                { id: 'consentTemplates', title: 'Templates', icon: '📝', color: '#b45309', onPress: () => navigation.navigate('ConsentTemplates') },
                { id: 'auditTrail', title: 'Audit Trail', icon: '📋', color: '#92400e', onPress: () => navigation.navigate('ConsentAudit') },
            ],
        },
        {
            title: 'Family & Insurance',
            actions: [
                { id: 'family', title: 'Family Health', icon: '👨‍👩‍👧‍👦', color: '#10b981', onPress: () => navigation.navigate('FamilyHealthDashboard') },
                { id: 'familyManagement', title: 'Manage Family', icon: '👨‍👩‍👧‍👦', color: '#059669', onPress: () => navigation.navigate('FamilyManagement') },
                { id: 'insurance', title: 'Insurance', icon: '💰', color: '#047857', onPress: () => navigation.navigate('InsurancePolicies') },
            ],
        },
        {
            title: 'Smart Features',
            actions: [
                { id: 'aiAssistant', title: 'AI Assistant', icon: '🤖', color: '#6366f1', onPress: () => navigation.navigate('AIAssistant') },
                { id: 'wearables', title: 'Wearables', icon: '⌚', color: '#4f46e5', onPress: () => navigation.navigate('Wearables') },
                { id: 'predictions', title: 'Health Insights', icon: '🔮', color: '#4338ca', onPress: () => navigation.navigate('PredictiveInsights') },
                { id: 'autoSync', title: 'Auto-Sync', icon: '🔄', color: '#3730a3', onPress: () => navigation.navigate('AutoSync') },
            ],
        },
        {
            title: 'Premium Services',
            actions: [
                { id: 'premium', title: 'Premium', icon: '⭐', color: '#f97316', onPress: () => navigation.navigate('PremiumFeatures') },
                { id: 'storage', title: 'Cloud Storage', icon: '☁️', color: '#ea580c', onPress: () => navigation.navigate('CloudStorage') },
                { id: 'partners', title: 'Partner Services', icon: '🏥', color: '#c2410c', onPress: () => navigation.navigate('PartnerServices') },
            ],
        },
        {
            title: 'Settings & More',
            actions: [
                { id: 'notifications', title: 'Notifications', icon: '🔔', color: '#64748b', onPress: () => navigation.navigate('NotificationInbox') },
                { id: 'dataExport', title: 'Export Data', icon: '📤', color: '#475569', onPress: () => navigation.navigate('DataExport') },
                { id: 'security', title: 'Security', icon: '🔒', color: '#334155', onPress: () => navigation.navigate('SecuritySettings') },
                { id: 'language', title: 'Language', icon: '🌍', color: '#1e293b', onPress: () => navigation.navigate('LanguageSettings') },
                { id: 'accessibility', title: 'Accessibility', icon: '♿', color: '#0f172a', onPress: () => navigation.navigate('AccessibilitySettings') },
            ],
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.brandIcon}>/..</Text>
                    <Text style={styles.headerTitle}>Patient</Text>
                </View>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Text style={styles.profileIcon}>⚙️</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <RoleSwitcher
                    currentRole={role}
                    availableRoles={availableRoles}
                    onRoleChange={handleRoleChange}
                />

                <View style={styles.abhaCard}>
                    <View style={styles.abhaHeader}>
                        <Text style={styles.abhaLabel}>ABHA Number</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewCardButton}>View Card →</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.abhaNumber}>12-3456-7890-1234</Text>
                    <Text style={styles.abhaAddress}>username@abdm</Text>
                </View>

                {categories.map((category, index) => (
                    <View key={index} style={styles.categorySection}>
                        <View style={styles.categoryHeader}>
                            <Text style={styles.categoryTitle}>{category.title}</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAllText}>see all</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.actionsScroll}
                            contentContainerStyle={styles.actionsScrollContent}
                        >
                            {category.actions.map((action) => (
                                <TouchableOpacity
                                    key={action.id}
                                    style={[styles.actionCard, { backgroundColor: action.color }]}
                                    onPress={action.onPress}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.actionIcon}>{action.icon}</Text>
                                    <Text style={styles.actionTitle}>{action.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    brandIcon: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileIcon: {
        fontSize: 20,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 24,
        paddingBottom: 40,
    },
    abhaCard: {
        backgroundColor: '#000',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    abhaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    abhaLabel: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.8,
    },
    viewCardButton: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    abhaNumber: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
        letterSpacing: 1,
    },
    abhaAddress: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    categorySection: {
        marginBottom: 28,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    seeAllText: {
        fontSize: 14,
        color: '#3b82f6',
        fontWeight: '600',
    },
    actionsScroll: {
        marginHorizontal: -4,
    },
    actionsScrollContent: {
        paddingHorizontal: 4,
        gap: 12,
    },
    actionCard: {
        width: 140,
        height: 140,
        borderRadius: 20,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
});
