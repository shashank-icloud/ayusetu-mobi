import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'LabDashboard'>;

export default function LabDashboard({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />

            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome,</Text>
                    <Text style={styles.userName}>DiagnoLab Center</Text>
                </View>
                <TouchableOpacity style={styles.profileButton}>
                    <Text style={styles.profileIcon}>🏢</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { borderColor: '#4CAF50' }]}>
                        <Text style={styles.statNumber}>16</Text>
                        <Text style={styles.statLabel}>Pending Tests</Text>
                    </View>
                    <View style={[styles.statCard, { borderColor: '#2196F3' }]}>
                        <Text style={styles.statNumber}>8</Text>
                        <Text style={styles.statLabel}>Ready Reports</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Today's Bookings</Text>
                <TouchableOpacity style={styles.bookingCard}>
                    <Text style={styles.bookingIcon}>🧪</Text>
                    <View style={styles.bookingInfo}>
                        <Text style={styles.patientName}>Sarah Johnson</Text>
                        <Text style={styles.testDetails}>Blood Test • 10:00 AM</Text>
                    </View>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Pending</Text>
                    </View>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActionsGrid}>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>�</Text>
                        <Text style={styles.actionTitle}>Test Orders</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>🧪</Text>
                        <Text style={styles.actionTitle}>Pending Samples</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>📊</Text>
                        <Text style={styles.actionTitle}>Upload Reports</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>🔔</Text>
                        <Text style={styles.actionTitle}>Notify Patient</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>👤</Text>
                        <Text style={styles.actionTitle}>Patient Info</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>📋</Text>
                        <Text style={styles.actionTitle}>Report History</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16, backgroundColor: '#fff' },
    greeting: { fontSize: 16, color: '#666' },
    userName: { fontSize: 24, fontWeight: '700', color: '#000', marginTop: 4 },
    profileButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#111' },
    profileIcon: { fontSize: 24 },
    content: { flex: 1 },
    contentContainer: { padding: 24, paddingBottom: 40 },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, borderWidth: 2, padding: 20, marginHorizontal: 6, alignItems: 'center' },
    statNumber: { fontSize: 32, fontWeight: '700', color: '#000', marginBottom: 8 },
    statLabel: { fontSize: 13, color: '#666', textAlign: 'center' },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 16 },
    bookingCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, borderColor: '#e0e0e0', padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    bookingIcon: { fontSize: 28, marginRight: 12 },
    bookingInfo: { flex: 1 },
    patientName: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 4 },
    testDetails: { fontSize: 13, color: '#666' },
    statusBadge: { backgroundColor: '#FFF9C4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#FDD835' },
    statusText: { fontSize: 12, color: '#000', fontWeight: '700' },
    quickActionsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    actionCard: { width: '48%', backgroundColor: '#fff', borderRadius: 16, borderWidth: 2, borderColor: '#111', padding: 20, alignItems: 'center' },
    actionIcon: { fontSize: 36, marginBottom: 8 },
    actionTitle: { fontSize: 14, fontWeight: '600', color: '#000', textAlign: 'center' },
    cornerTopLeft: { position: 'absolute', top: 20, left: 20, width: 30, height: 80, borderLeftWidth: 2, borderTopWidth: 2, borderColor: '#000', zIndex: 10 },
    cornerTopRight: { position: 'absolute', top: 20, right: 20, width: 30, height: 80, borderRightWidth: 2, borderTopWidth: 2, borderColor: '#000', zIndex: 10 },
    cornerBottomLeft: { position: 'absolute', bottom: 20, left: 20, width: 30, height: 80, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: '#000', zIndex: 10 },
    cornerBottomRight: { position: 'absolute', bottom: 20, right: 20, width: 30, height: 80, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#000', zIndex: 10 },
});
