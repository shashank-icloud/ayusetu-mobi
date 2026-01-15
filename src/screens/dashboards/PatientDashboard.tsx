import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
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

export default function PatientDashboard({ navigation }: Props) {
    const [role, setRole] = useState<string>('patient');

    // Example: User with Patient + Doctor roles
    const availableRoles = [
        { id: 'patient', name: 'Patient', icon: '👤' },
        { id: 'doctor', name: 'Doctor', icon: '👨‍⚕️' },
    ];

    const handleRoleChange = (newRole: string) => {
        setRole(newRole);
        // Navigate to the appropriate dashboard based on role
        if (newRole === 'doctor') {
            navigation.navigate('DoctorDashboard');
        }
    };

    const quickActions: QuickAction[] = [
        {
            id: 'emergency',
            title: 'Emergency',
            icon: '🚨',
            color: '#F44336',
            onPress: () => navigation.navigate('SOS'),
        },
        {
            id: 'appointments',
            title: 'Book Appointment',
            icon: '📅',
            color: '#2196F3',
            onPress: () => navigation.navigate('BookAppointment'),
        },
        {
            id: 'records',
            title: 'Health Records',
            icon: '📄',
            color: '#4CAF50',
            onPress: () => navigation.navigate('HealthRecords'),
        },
        {
            id: 'insurance',
            title: 'Insurance',
            icon: '💰',
            color: '#10b981',
            onPress: () => navigation.navigate('InsurancePolicies'),
        },
        {
            id: 'family',
            title: 'Family Health',
            icon: '👨‍👩‍👧‍👦',
            color: '#e91e63',
            onPress: () => navigation.navigate('FamilyHealthDashboard'),
        },
        {
            id: 'consent',
            title: 'Manage Consent',
            icon: '🔒',
            color: '#FF9800',
            onPress: () => navigation.navigate('ConsentManagement'),
        },
        {
            id: 'consentInbox',
            title: 'Consent Inbox',
            icon: '📬',
            color: '#9C27B0',
            onPress: () => navigation.navigate('ConsentInbox'),
        },
        {
            id: 'consentTemplates',
            title: 'Consent Templates',
            icon: '📝',
            color: '#673AB7',
            onPress: () => navigation.navigate('ConsentTemplates'),
        },
        {
            id: 'emergencyAccess',
            title: 'Emergency Access',
            icon: '🚑',
            color: '#F44336',
            onPress: () => navigation.navigate('EmergencyAccess'),
        },
        {
            id: 'auditTrail',
            title: 'Audit Trail',
            icon: '📋',
            color: '#607D8B',
            onPress: () => navigation.navigate('ConsentAudit'),
        },
        {
            id: 'autoSync',
            title: 'Auto-Sync',
            icon: '🔄',
            color: '#3F51B5',
            onPress: () => navigation.navigate('AutoSync'),
        },
        {
            id: 'upload',
            title: 'Upload Records',
            icon: '📤',
            color: '#00BCD4',
            onPress: () => navigation.navigate('ManualUpload'),
        },
        {
            id: 'organize',
            title: 'Organize Records',
            icon: '📁',
            color: '#009688',
            onPress: () => navigation.navigate('RecordManagement'),
        },
        {
            id: 'medicines',
            title: 'Medicines',
            icon: '💊',
            color: '#9C27B0',
            onPress: () => console.log('Medicine Reminders'),
        },
        {
            id: 'timeline',
            title: 'Health Timeline',
            icon: '📊',
            color: '#673AB7',
            onPress: () => navigation.navigate('HealthRecords', { initialView: 'timeline' }),
        },
        {
            id: 'download',
            title: 'Download Records',
            icon: '📥',
            color: '#607D8B',
            onPress: () => console.log('Download Health Records'),
        },
        {
            id: 'labs',
            title: 'Lab Tests',
            icon: '🧪',
            color: '#4CAF50',
            onPress: () => console.log('View Lab Results'),
        },
        {
            id: 'family',
            title: 'Family',
            icon: '👨‍👩‍👧‍👦',
            color: '#E91E63',
            onPress: () => navigation.navigate('FamilyManagement'),
        },
        {
            id: 'healthSummary',
            title: 'Health Summary',
            icon: '📊',
            color: '#0ea5e9',
            onPress: () => navigation.navigate('HealthSummary'),
        },
        {
            id: 'trends',
            title: 'Health Trends',
            icon: '📈',
            color: '#10b981',
            onPress: () => navigation.navigate('TrendAnalysis'),
        },
        {
            id: 'diseaseTrackers',
            title: 'Disease Trackers',
            icon: '🏥',
            color: '#f59e0b',
            onPress: () => navigation.navigate('DiseaseTrackers'),
        },
        {
            id: 'medicationAdherence',
            title: 'Medications',
            icon: '💊',
            color: '#8b5cf6',
            onPress: () => navigation.navigate('MedicationAdherence'),
        },
        {
            id: 'lifestyle',
            title: 'Lifestyle Log',
            icon: '🏃',
            color: '#06b6d4',
            onPress: () => navigation.navigate('LifestyleTracking'),
        },
        {
            id: 'symptoms',
            title: 'Symptom Journal',
            icon: '📝',
            color: '#ec4899',
            onPress: () => navigation.navigate('SymptomJournal'),
        },
        {
            id: 'myAppointments',
            title: 'My Appointments',
            icon: '🗓️',
            color: '#3b82f6',
            onPress: () => navigation.navigate('Appointments'),
        },
        {
            id: 'carePlans',
            title: 'Care Plans',
            icon: '📋',
            color: '#14b8a6',
            onPress: () => navigation.navigate('CarePlans'),
        },
        {
            id: 'reminders',
            title: 'Reminders',
            icon: '🔔',
            color: '#a855f7',
            onPress: () => navigation.navigate('Reminders'),
        },
        {
            id: 'emergencyCard',
            title: 'Emergency Card',
            icon: '🆘',
            color: '#ef4444',
            onPress: () => navigation.navigate('EmergencyCard'),
        },
        {
            id: 'security',
            title: 'Security',
            icon: '🔒',
            color: '#7c3aed',
            onPress: () => navigation.navigate('SecuritySettings'),
        },
        {
            id: 'compliance',
            title: 'Compliance',
            icon: '📊',
            color: '#0891b2',
            onPress: () => navigation.navigate('ComplianceDashboard'),
        },
        {
            id: 'language',
            title: 'Language',
            icon: '🌍',
            color: '#06b6d4',
            onPress: () => navigation.navigate('LanguageSettings'),
        },
        {
            id: 'accessibility',
            title: 'Accessibility',
            icon: '♿',
            color: '#8b5cf6',
            onPress: () => navigation.navigate('AccessibilitySettings'),
        },
        {
            id: 'offline',
            title: 'Offline Mode',
            icon: '📡',
            color: '#10b981',
            onPress: () => navigation.navigate('OfflineMode'),
        },
        {
            id: 'familyHealth',
            title: 'Family Health',
            icon: '👨‍👩‍👧‍👦',
            color: '#e91e63',
            onPress: () => navigation.navigate('FamilyHealthDashboard'),
        },
        {
            id: 'dataExport',
            title: 'Export Data',
            icon: '📤',
            color: '#00bcd4',
            onPress: () => navigation.navigate('DataExport'),
        },
        {
            id: 'notifications',
            title: 'Notifications',
            icon: '🔔',
            color: '#ff9800',
            onPress: () => navigation.navigate('NotificationInbox'),
        },
        {
            id: 'premium',
            title: 'Premium',
            icon: '⭐',
            color: '#9c27b0',
            onPress: () => navigation.navigate('PremiumFeatures'),
        },
        {
            id: 'storage',
            title: 'Cloud Storage',
            icon: '☁️',
            color: '#2196f3',
            onPress: () => navigation.navigate('CloudStorage'),
        },
        {
            id: 'partners',
            title: 'Partner Services',
            icon: '🏥',
            color: '#4caf50',
            onPress: () => navigation.navigate('PartnerServices'),
        },
        {
            id: 'aiAssistant',
            title: 'AI Assistant',
            icon: '🤖',
            color: '#673ab7',
            onPress: () => navigation.navigate('AIAssistant'),
        },
        {
            id: 'wearables',
            title: 'Wearables',
            icon: '⌚',
            color: '#00bcd4',
            onPress: () => navigation.navigate('Wearables'),
        },
        {
            id: 'predictions',
            title: 'Health Insights',
            icon: '🔮',
            color: '#ff5722',
            onPress: () => navigation.navigate('PredictiveInsights'),
        },
        {
            id: 'telemedicine',
            title: 'Telemedicine',
            icon: '👨‍⚕️',
            color: '#009688',
            onPress: () => navigation.navigate('Telemedicine'),
        },
        {
            id: 'profile',
            title: 'My Profile',
            icon: '⚙️',
            color: '#795548',
            onPress: () => navigation.navigate('Profile'),
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Corner decorations */}
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello,</Text>
                    <Text style={styles.userName}>Patient Name</Text>
                </View>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Text style={styles.profileIcon}>👤</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Role Switcher */}
                <RoleSwitcher
                    currentRole={role}
                    availableRoles={availableRoles}
                    onRoleChange={handleRoleChange}
                />

                {/* ABHA Card */}
                <View style={styles.abhaCard}>
                    <View style={styles.abhaHeader}>
                        <Text style={styles.abhaLabel}>ABHA Number</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewButton}>View Card →</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.abhaNumber}>12-3456-7890-1234</Text>
                    <Text style={styles.abhaAddress}>username@abdm</Text>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActionsGrid}>
                    {quickActions.map((action) => (
                        <TouchableOpacity
                            key={action.id}
                            style={[styles.actionCard, { borderColor: action.color }]}
                            onPress={action.onPress}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.actionIcon}>{action.icon}</Text>
                            <Text style={styles.actionTitle}>{action.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Upcoming Appointments */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See All →</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.appointmentCard}>
                        <View style={styles.appointmentLeft}>
                            <View style={styles.doctorAvatar}>
                                <Text style={styles.doctorAvatarText}>Dr</Text>
                            </View>
                            <View style={styles.appointmentInfo}>
                                <Text style={styles.doctorName}>Dr. Sarah Johnson</Text>
                                <Text style={styles.specialty}>Cardiologist</Text>
                                <Text style={styles.dateTime}>Tomorrow, 10:00 AM</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.joinButton}>
                            <Text style={styles.joinButtonText}>Join</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recent Records */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Records</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See All →</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.recordCard}>
                        <Text style={styles.recordIcon}>📄</Text>
                        <View style={styles.recordInfo}>
                            <Text style={styles.recordTitle}>Blood Test Report</Text>
                            <Text style={styles.recordDate}>Jan 10, 2026</Text>
                        </View>
                        <Text style={styles.recordArrow}>→</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.recordCard}>
                        <Text style={styles.recordIcon}>💊</Text>
                        <View style={styles.recordInfo}>
                            <Text style={styles.recordTitle}>Prescription</Text>
                            <Text style={styles.recordDate}>Jan 8, 2026</Text>
                        </View>
                        <Text style={styles.recordArrow}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* Health Tips */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Health Tips</Text>
                    <View style={styles.tipCard}>
                        <Text style={styles.tipIcon}>💡</Text>
                        <Text style={styles.tipText}>
                            Drink at least 8 glasses of water daily to stay hydrated and healthy.
                        </Text>
                    </View>
                </View>
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
        paddingTop: 20,
        paddingBottom: 16,
        backgroundColor: '#fff',
    },
    greeting: {
        fontSize: 16,
        color: '#666',
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginTop: 4,
    },
    profileButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#111',
    },
    profileIcon: {
        fontSize: 24,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 24,
        paddingBottom: 40,
    },
    roleSwitcher: {
        marginBottom: 24,
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
    viewButton: {
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    actionCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 2,
        padding: 20,
        alignItems: 'center',
        marginBottom: 16,
    },
    actionIcon: {
        fontSize: 36,
        marginBottom: 8,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    seeAll: {
        fontSize: 14,
        color: '#2196F3',
        fontWeight: '600',
    },
    appointmentCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#111',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    appointmentLeft: {
        flexDirection: 'row',
        flex: 1,
    },
    doctorAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#111',
    },
    doctorAvatarText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    appointmentInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    doctorName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    specialty: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    dateTime: {
        fontSize: 13,
        color: '#2196F3',
        fontWeight: '600',
    },
    joinButton: {
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    joinButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    recordCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    recordIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    recordInfo: {
        flex: 1,
    },
    recordTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    recordDate: {
        fontSize: 13,
        color: '#666',
    },
    recordArrow: {
        fontSize: 20,
        color: '#000',
    },
    tipCard: {
        backgroundColor: '#FFF9C4',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderWidth: 2,
        borderColor: '#FDD835',
    },
    tipIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: '#000',
        lineHeight: 20,
    },
    cornerTopLeft: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 30,
        height: 80,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderColor: '#000',
        zIndex: 10,
    },
    cornerTopRight: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 30,
        height: 80,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderColor: '#000',
        zIndex: 10,
    },
    cornerBottomLeft: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 30,
        height: 80,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#000',
        zIndex: 10,
    },
    cornerBottomRight: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 30,
        height: 80,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#000',
        zIndex: 10,
    },
});
