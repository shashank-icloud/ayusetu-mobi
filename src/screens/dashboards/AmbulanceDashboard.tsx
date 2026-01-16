import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AmbulanceDashboard'>;

export default function AmbulanceDashboard({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />

            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome,</Text>
                    <Text style={styles.userName}>QuickRescue Ambulance</Text>
                </View>
                <TouchableOpacity style={styles.profileButton}>
                    <Text style={styles.profileIcon}>🚑</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { borderColor: '#4CAF50' }]}>
                        <Text style={styles.statNumber}>5</Text>
                        <Text style={styles.statLabel}>Available Units</Text>
                    </View>
                    <View style={[styles.statCard, { borderColor: '#F44336' }]}>
                        <Text style={styles.statNumber}>2</Text>
                        <Text style={styles.statLabel}>Active Calls</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Emergency Requests</Text>
                <TouchableOpacity style={styles.emergencyCard}>
                    <Text style={styles.emergencyIcon}>🚨</Text>
                    <View style={styles.emergencyInfo}>
                        <Text style={styles.locationText}>MG Road, Sector 15</Text>
                        <Text style={styles.timeText}>5 mins ago</Text>
                    </View>
                    <TouchableOpacity style={styles.acceptButton}>
                        <Text style={styles.acceptText}>Accept</Text>
                    </TouchableOpacity>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActionsGrid}>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>�</Text>
                        <Text style={styles.actionTitle}>Emergency Requests</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>📍</Text>
                        <Text style={styles.actionTitle}>Pickup Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>🏥</Text>
                        <Text style={styles.actionTitle}>Drop Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>�</Text>
                        <Text style={styles.actionTitle}>Patient Contact</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>🔄</Text>
                        <Text style={styles.actionTitle}>Status Updates</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Text style={styles.actionIcon}>🗺️</Text>
                        <Text style={styles.actionTitle}>Navigation</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16, backgroundColor: '#fff' },
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
    emergencyCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, borderColor: '#F44336', padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    emergencyIcon: { fontSize: 28, marginRight: 12 },
    emergencyInfo: { flex: 1 },
    locationText: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 4 },
    timeText: { fontSize: 13, color: '#666' },
    acceptButton: { backgroundColor: '#F44336', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
    acceptText: { color: '#fff', fontWeight: '600', fontSize: 14 },
    quickActionsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    actionCard: { width: '48%', backgroundColor: '#fff', borderRadius: 16, borderWidth: 2, borderColor: '#111', padding: 20, alignItems: 'center' },
    actionIcon: { fontSize: 36, marginBottom: 8 },
    actionTitle: { fontSize: 14, fontWeight: '600', color: '#000', textAlign: 'center' },
    cornerTopLeft: { position: 'absolute', top: 20, left: 20, width: 30, height: 80, borderLeftWidth: 2, borderTopWidth: 2, borderColor: '#000', zIndex: 10 },
    cornerTopRight: { position: 'absolute', top: 20, right: 20, width: 30, height: 80, borderRightWidth: 2, borderTopWidth: 2, borderColor: '#000', zIndex: 10 },
    cornerBottomLeft: { position: 'absolute', bottom: 20, left: 20, width: 30, height: 80, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: '#000', zIndex: 10 },
    cornerBottomRight: { position: 'absolute', bottom: 20, right: 20, width: 30, height: 80, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#000', zIndex: 10 },
});
