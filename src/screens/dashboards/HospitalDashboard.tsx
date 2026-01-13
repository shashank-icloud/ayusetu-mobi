import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'HospitalDashboard'>;

export default function HospitalDashboard({ navigation }: Props) {
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
                    <Text style={styles.greeting}>Welcome,</Text>
                    <Text style={styles.userName}>City Hospital</Text>
                </View>
                <TouchableOpacity style={styles.profileButton}>
                    <Text style={styles.profileIcon}>🏥</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Stats Overview */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { borderColor: '#2196F3' }]}>
                        <Text style={styles.statNumber}>45</Text>
                        <Text style={styles.statLabel}>Total Patients</Text>
                    </View>
                    <View style={[styles.statCard, { borderColor: '#4CAF50' }]}>
                        <Text style={styles.statNumber}>28</Text>
                        <Text style={styles.statLabel}>Available Beds</Text>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { borderColor: '#FF9800' }]}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Active Doctors</Text>
                    </View>
                    <View style={[styles.statCard, { borderColor: '#9C27B0' }]}>
                        <Text style={styles.statNumber}>18</Text>
                        <Text style={styles.statLabel}>Appointments</Text>
                    </View>
                </View>

                {/* Bed Availability */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bed Availability</Text>
                    <View style={styles.bedCard}>
                        <View style={styles.bedInfo}>
                            <Text style={styles.bedType}>General Ward</Text>
                            <View style={styles.bedStats}>
                                <Text style={styles.bedAvailable}>Available: 15</Text>
                                <Text style={styles.bedOccupied}>Occupied: 35</Text>
                            </View>
                        </View>
                        <View style={styles.bedProgress}>
                            <View style={[styles.bedProgressBar, { width: '70%' }]} />
                        </View>
                    </View>

                    <View style={styles.bedCard}>
                        <View style={styles.bedInfo}>
                            <Text style={styles.bedType}>ICU</Text>
                            <View style={styles.bedStats}>
                                <Text style={styles.bedAvailable}>Available: 3</Text>
                                <Text style={styles.bedOccupied}>Occupied: 7</Text>
                            </View>
                        </View>
                        <View style={styles.bedProgress}>
                            <View style={[styles.bedProgressBar, { width: '70%', backgroundColor: '#FF9800' }]} />
                        </View>
                    </View>

                    <View style={styles.bedCard}>
                        <View style={styles.bedInfo}>
                            <Text style={styles.bedType}>Emergency</Text>
                            <View style={styles.bedStats}>
                                <Text style={styles.bedAvailable}>Available: 10</Text>
                                <Text style={styles.bedOccupied}>Occupied: 5</Text>
                            </View>
                        </View>
                        <View style={styles.bedProgress}>
                            <View style={[styles.bedProgressBar, { width: '33%', backgroundColor: '#4CAF50' }]} />
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActionsGrid}>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>�</Text>
                        <Text style={styles.actionTitle}>Register Care Context</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>👨‍⚕️</Text>
                        <Text style={styles.actionTitle}>Assign Doctors</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>�</Text>
                        <Text style={styles.actionTitle}>Discharge Summary</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>🏥</Text>
                        <Text style={styles.actionTitle}>OPD/IPD Flow</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>💰</Text>
                        <Text style={styles.actionTitle}>Billing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>�</Text>
                        <Text style={styles.actionTitle}>Staff Access</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>🔐</Text>
                        <Text style={styles.actionTitle}>Consent Management</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>📊</Text>
                        <Text style={styles.actionTitle}>Analytics</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Admissions */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Admissions</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See All →</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.admissionCard}>
                        <View style={styles.admissionInfo}>
                            <Text style={styles.patientName}>John Smith</Text>
                            <Text style={styles.admissionDetails}>General Ward • Bed 205</Text>
                            <Text style={styles.admissionTime}>Admitted: 2 hours ago</Text>
                        </View>
                        <View style={styles.criticalBadge}>
                            <Text style={styles.criticalText}>Stable</Text>
                        </View>
                    </View>

                    <View style={styles.admissionCard}>
                        <View style={styles.admissionInfo}>
                            <Text style={styles.patientName}>Sarah Johnson</Text>
                            <Text style={styles.admissionDetails}>ICU • Bed 12</Text>
                            <Text style={styles.admissionTime}>Admitted: 5 hours ago</Text>
                        </View>
                        <View style={[styles.criticalBadge, { backgroundColor: '#FFEBEE', borderColor: '#F44336' }]}>
                            <Text style={[styles.criticalText, { color: '#F44336' }]}>Critical</Text>
                        </View>
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
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
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
    seeAll: {
        fontSize: 14,
        color: '#2196F3',
        fontWeight: '600',
    },
    bedCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        padding: 16,
        marginBottom: 12,
    },
    bedInfo: {
        marginBottom: 12,
    },
    bedType: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    bedStats: {
        flexDirection: 'row',
        gap: 16,
    },
    bedAvailable: {
        fontSize: 13,
        color: '#4CAF50',
        fontWeight: '600',
    },
    bedOccupied: {
        fontSize: 13,
        color: '#666',
    },
    bedProgress: {
        height: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        overflow: 'hidden',
    },
    bedProgressBar: {
        height: '100%',
        backgroundColor: '#2196F3',
        borderRadius: 4,
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
    admissionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    admissionInfo: {
        flex: 1,
    },
    patientName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    admissionDetails: {
        fontSize: 13,
        color: '#2196F3',
        marginBottom: 4,
        fontWeight: '600',
    },
    admissionTime: {
        fontSize: 12,
        color: '#666',
    },
    criticalBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    criticalText: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: '700',
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
