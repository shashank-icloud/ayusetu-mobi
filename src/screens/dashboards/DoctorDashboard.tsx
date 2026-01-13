import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'DoctorDashboard'>;

export default function DoctorDashboard({ navigation }: Props) {
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
                    <Text style={styles.greeting}>Good Morning,</Text>
                    <Text style={styles.userName}>Dr. Smith</Text>
                </View>
                <TouchableOpacity style={styles.profileButton}>
                    <Text style={styles.profileIcon}>👨‍⚕️</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Stats Cards */}
                <View style={styles.statsRow}>
                    <View style={[styles.statCard, { borderColor: '#2196F3' }]}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Today's Appointments</Text>
                    </View>
                    <View style={[styles.statCard, { borderColor: '#4CAF50' }]}>
                        <Text style={styles.statNumber}>5</Text>
                        <Text style={styles.statLabel}>Pending Reviews</Text>
                    </View>
                </View>

                {/* Today's Schedule */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Today's Schedule</Text>
                        <TouchableOpacity>
                            <Text style={styles.manageButton}>Manage →</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.appointmentCard}>
                        <View style={styles.timeSlot}>
                            <Text style={styles.time}>10:00</Text>
                            <Text style={styles.ampm}>AM</Text>
                        </View>
                        <View style={styles.appointmentDetails}>
                            <Text style={styles.patientName}>John Doe</Text>
                            <Text style={styles.appointmentType}>Video Consultation</Text>
                            <Text style={styles.concern}>Concern: Fever & Cough</Text>
                        </View>
                        <TouchableOpacity style={styles.startButton}>
                            <Text style={styles.startButtonText}>Start</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.appointmentCard}>
                        <View style={styles.timeSlot}>
                            <Text style={styles.time}>11:30</Text>
                            <Text style={styles.ampm}>AM</Text>
                        </View>
                        <View style={styles.appointmentDetails}>
                            <Text style={styles.patientName}>Sarah Johnson</Text>
                            <Text style={styles.appointmentType}>In-Person Visit</Text>
                            <Text style={styles.concern}>Concern: Regular Checkup</Text>
                        </View>
                        <View style={styles.upcomingBadge}>
                            <Text style={styles.upcomingText}>Upcoming</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Consent Requests */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Consent Requests</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>3 Pending</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.consentCard}>
                        <Text style={styles.consentIcon}>🔐</Text>
                        <View style={styles.consentInfo}>
                            <Text style={styles.consentPatient}>Emma Wilson</Text>
                            <Text style={styles.consentDetails}>Health records access • 2 hours ago</Text>
                        </View>
                        <TouchableOpacity style={styles.approveButton}>
                            <Text style={styles.approveButtonText}>Review</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActionsGrid}>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>📝</Text>
                        <Text style={styles.actionTitle}>Create Prescription</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>👥</Text>
                        <Text style={styles.actionTitle}>View Patient Records</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>🧪</Text>
                        <Text style={styles.actionTitle}>Order Lab Tests</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>�</Text>
                        <Text style={styles.actionTitle}>Teleconsultation</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>📋</Text>
                        <Text style={styles.actionTitle}>Clinical Notes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>✍️</Text>
                        <Text style={styles.actionTitle}>Digital Signature</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>🔄</Text>
                        <Text style={styles.actionTitle}>Refer Patient</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>📊</Text>
                        <Text style={styles.actionTitle}>Pending Reports</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Consultations */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Consultations</Text>
                    <TouchableOpacity style={styles.consultationCard}>
                        <View style={styles.consultationInfo}>
                            <Text style={styles.consultationPatient}>Michael Brown</Text>
                            <Text style={styles.consultationDate}>Jan 11, 2026 • 3:00 PM</Text>
                            <Text style={styles.consultationDiagnosis}>Diagnosis: Seasonal Flu</Text>
                        </View>
                        <Text style={styles.recordArrow}>→</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.consultationCard}>
                        <View style={styles.consultationInfo}>
                            <Text style={styles.consultationPatient}>Emily Davis</Text>
                            <Text style={styles.consultationDate}>Jan 11, 2026 • 2:00 PM</Text>
                            <Text style={styles.consultationDiagnosis}>Diagnosis: Hypertension Follow-up</Text>
                        </View>
                        <Text style={styles.recordArrow}>→</Text>
                    </TouchableOpacity>
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
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 2,
        padding: 20,
        marginHorizontal: 6,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 32,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 13,
        color: '#666',
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    manageButton: {
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
        alignItems: 'center',
        marginBottom: 12,
    },
    timeSlot: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        marginRight: 16,
        minWidth: 60,
    },
    time: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    ampm: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    appointmentDetails: {
        flex: 1,
    },
    patientName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    appointmentType: {
        fontSize: 13,
        color: '#2196F3',
        marginBottom: 4,
        fontWeight: '600',
    },
    concern: {
        fontSize: 12,
        color: '#666',
    },
    startButton: {
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    startButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    upcomingBadge: {
        backgroundColor: '#FFF9C4',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FDD835',
    },
    upcomingText: {
        fontSize: 12,
        color: '#000',
        fontWeight: '600',
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
        borderColor: '#111',
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
    consultationCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    consultationInfo: {
        flex: 1,
    },
    consultationPatient: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    consultationDate: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    consultationDiagnosis: {
        fontSize: 13,
        color: '#4CAF50',
        fontWeight: '600',
    },
    recordArrow: {
        fontSize: 20,
        color: '#000',
    },
    badge: {
        backgroundColor: '#FF9800',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
    consentCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    consentIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    consentInfo: {
        flex: 1,
    },
    consentPatient: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    consentDetails: {
        fontSize: 13,
        color: '#666',
    },
    approveButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    approveButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
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
