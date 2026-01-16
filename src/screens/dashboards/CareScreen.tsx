import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../../navigation/AppNavigator';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = BottomTabScreenProps<TabParamList, 'Care'>;

export default function CareScreen({ navigation }: Props) {
    const rootNavigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Image
                        source={require('../../../assets/images/Images/ayusetu-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.headerTitle}>Care</Text>
                </View>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addIcon}>+</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Quick Actions */}
                <View style={styles.quickActionsGrid}>
                    <TouchableOpacity
                        style={[styles.quickActionCard, { backgroundColor: '#06b6d4' }]}
                        onPress={() => rootNavigation.navigate('BookAppointment')}
                    >
                        <Text style={styles.quickActionIcon}>📅</Text>
                        <Text style={styles.quickActionText}>Book Appointment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.quickActionCard, { backgroundColor: '#0e7490' }]}
                        onPress={() => rootNavigation.navigate('Telemedicine')}
                    >
                        <Text style={styles.quickActionIcon}>👨‍⚕️</Text>
                        <Text style={styles.quickActionText}>Telemedicine</Text>
                    </TouchableOpacity>
                </View>

                {/* Upcoming Appointments */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
                        <TouchableOpacity onPress={() => rootNavigation.navigate('Appointments')}>
                            <Text style={styles.seeAllText}>See all →</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.appointmentCard}>
                        <View style={styles.appointmentLeft}>
                            <View style={[styles.doctorAvatar, { backgroundColor: '#dbeafe' }]}>
                                <Text style={styles.doctorAvatarText}>👨‍⚕️</Text>
                            </View>
                            <View style={styles.appointmentInfo}>
                                <Text style={styles.doctorName}>Dr. Sarah Johnson</Text>
                                <Text style={styles.specialty}>Cardiologist</Text>
                                <Text style={styles.dateTime}>Tomorrow, 10:00 AM</Text>
                            </View>
                        </View>
                        <View style={styles.joinButton}>
                            <Text style={styles.joinButtonText}>Join</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.appointmentCard}>
                        <View style={styles.appointmentLeft}>
                            <View style={[styles.doctorAvatar, { backgroundColor: '#fef3c7' }]}>
                                <Text style={styles.doctorAvatarText}>👩‍⚕️</Text>
                            </View>
                            <View style={styles.appointmentInfo}>
                                <Text style={styles.doctorName}>Dr. Michael Chen</Text>
                                <Text style={styles.specialty}>General Physician</Text>
                                <Text style={styles.dateTime}>Jan 20, 2:30 PM</Text>
                            </View>
                        </View>
                        <View style={[styles.joinButton, { backgroundColor: '#f3f4f6' }]}>
                            <Text style={[styles.joinButtonText, { color: '#000' }]}>View</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Care Plans */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Active Care Plans</Text>
                        <TouchableOpacity onPress={() => rootNavigation.navigate('CarePlans')}>
                            <Text style={styles.seeAllText}>See all →</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.carePlanCard}>
                        <View style={styles.carePlanHeader}>
                            <Text style={styles.carePlanIcon}>💊</Text>
                            <View style={styles.carePlanInfo}>
                                <Text style={styles.carePlanTitle}>Diabetes Management</Text>
                                <Text style={styles.carePlanDoctor}>By Dr. Sarah Johnson</Text>
                            </View>
                        </View>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '65%' }]} />
                        </View>
                        <Text style={styles.progressText}>65% Complete</Text>
                    </TouchableOpacity>
                </View>

                {/* Medications */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Today's Medications</Text>
                        <TouchableOpacity onPress={() => rootNavigation.navigate('MedicationAdherence')}>
                            <Text style={styles.seeAllText}>See all →</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.medicationCard}>
                        <View style={styles.medicationLeft}>
                            <View style={[styles.medicationIcon, { backgroundColor: '#fce7f3' }]}>
                                <Text style={styles.medicationEmoji}>💊</Text>
                            </View>
                            <View>
                                <Text style={styles.medicationName}>Metformin 500mg</Text>
                                <Text style={styles.medicationTime}>8:00 AM</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.checkButton}>
                            <Text style={styles.checkIcon}>✓</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.medicationCard}>
                        <View style={styles.medicationLeft}>
                            <View style={[styles.medicationIcon, { backgroundColor: '#dbeafe' }]}>
                                <Text style={styles.medicationEmoji}>💊</Text>
                            </View>
                            <View>
                                <Text style={styles.medicationName}>Aspirin 75mg</Text>
                                <Text style={styles.medicationTime}>2:00 PM</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={[styles.checkButton, { backgroundColor: '#f3f4f6' }]}>
                            <Text style={[styles.checkIcon, { color: '#9ca3af' }]}>○</Text>
                        </TouchableOpacity>
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
    logo: {
        width: 40,
        height: 40,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIcon: {
        fontSize: 24,
        color: '#fff',
        fontWeight: '700',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 24,
        paddingBottom: 100,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 28,
    },
    quickActionCard: {
        flex: 1,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
    },
    quickActionIcon: {
        fontSize: 40,
        marginBottom: 8,
    },
    quickActionText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
    section: {
        marginBottom: 28,
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
    },
    seeAllText: {
        fontSize: 14,
        color: '#3b82f6',
        fontWeight: '600',
    },
    appointmentCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    appointmentLeft: {
        flexDirection: 'row',
        flex: 1,
    },
    doctorAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    doctorAvatarText: {
        fontSize: 28,
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
        color: '#3b82f6',
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
    carePlanCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    carePlanHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    carePlanIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    carePlanInfo: {
        flex: 1,
    },
    carePlanTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    carePlanDoctor: {
        fontSize: 13,
        color: '#666',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#f3f4f6',
        borderRadius: 4,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#22c55e',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    medicationCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    medicationLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    medicationIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    medicationEmoji: {
        fontSize: 24,
    },
    medicationName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    medicationTime: {
        fontSize: 13,
        color: '#666',
    },
    checkButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#22c55e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkIcon: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '700',
    },
});
